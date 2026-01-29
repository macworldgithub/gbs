import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import MapboxGL from "@rnmapbox/maps";
import * as turf from "@turf/turf";

MapboxGL.setAccessToken(
  "pk.eyJ1IjoibGVvbi1nYnMiLCJhIjoiY21jc3Eyam1kMTNhdDJqcTJwbzdtMWF2bSJ9.K3Jn-X37-Uy-J9hYU7XbQw",
);

const MapboxSquareSelector = ({ setCoordinates }) => {
  const [center, setCenter] = useState(null); // ← null = no selection yet
  const [radiusKm, setRadiusKm] = useState("10");
  const [searchQuery, setSearchQuery] = useState("");
  const [squareCoords, setSquareCoords] = useState([]);

  const mapRef = useRef(null);
  const cameraRef = useRef(null);

  // Initial map view (only affects visual starting position - no state change)
  const INITIAL_CENTER = [151.2093, -33.8688]; // Sydney
  const INITIAL_ZOOM = 11;

  const generateSquare = (centerPoint, radiusStr) => {
    if (!centerPoint || centerPoint.length !== 2) return;
    const radius = parseFloat(radiusStr);
    if (isNaN(radius) || radius <= 0) return;

    try {
      const point = turf.point(centerPoint);
      const buffered = turf.buffer(point, radius / Math.sqrt(2), {
        units: "kilometers",
        steps: 4,
      });

      const bbox = turf.bbox(buffered);
      const side = Math.max(bbox[2] - bbox[0], bbox[3] - bbox[1]);

      const centerX = (bbox[0] + bbox[2]) / 2;
      const centerY = (bbox[1] + bbox[3]) / 2;

      const squareBbox = [
        centerX - side / 2,
        centerY - side / 2,
        centerX + side / 2,
        centerY + side / 2,
      ];

      const finalSquare = turf.bboxPolygon(squareBbox);
      const ring = finalSquare.geometry.coordinates[0];
      const closedRing = [...ring, ring[0]];

      setSquareCoords(closedRing);
      setCoordinates([[closedRing]]);
    } catch (err) {
      console.error("Square error:", err);
    }
  };

  // Only generate/update square when center is actually set by user
  useEffect(() => {
    if (center) {
      generateSquare(center, radiusKm);
    } else {
      // Clear when no center selected
      setSquareCoords([]);
      setCoordinates([]);
    }
  }, [center, radiusKm]);

  const handleMapPress = (e) => {
    const coords = e?.geometry?.coordinates;
    if (Array.isArray(coords) && coords.length === 2) {
      setCenter(coords);
      cameraRef.current?.setCamera({
        centerCoordinate: coords,
        zoomLevel: 13, // zoom in a bit when user selects
        animationDuration: 800,
      });
    }
  };

  const MAPBOX_ACCESS_TOKEN =
    "pk.eyJ1IjoibGVvbi1nYnMiLCJhIjoiY21jc3Eyam1kMTNhdDJqcTJwbzdtMWF2bSJ9.K3Jn-X37-Uy-J9hYU7XbQw";

  const searchLocation = async () => {
    const query = searchQuery.trim();
    if (!query) {
      Alert.alert("Empty", "Please enter a location");
      return;
    }

    if (query.length < 3) {
      Alert.alert("Too short", "Please type at least 3 characters");
      return;
    }

    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=5&types=place,locality,neighborhood,address,poi`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.features?.length > 0) {
        const feature = data.features[0];
        const [lng, lat] = feature.center;
        const newCenter = [lng, lat];

        setCenter(newCenter);

        cameraRef.current?.setCamera({
          centerCoordinate: newCenter,
          zoomLevel: 13,
          animationDuration: 1200,
        });
      } else {
        Alert.alert("Not Found", `No results found for "${query}"`);
      }
    } catch (err) {
      console.error("Search error:", err);
      Alert.alert(
        "Search Failed",
        "Could not reach Mapbox. Check your internet or try again later.",
      );
    }
  };

  const reset = () => {
    setCenter(null); // ← this removes square + marker
    setSquareCoords([]);
    setCoordinates([]);
    setSearchQuery("");

    // Optional: smoothly go back to Sydney view on reset
    cameraRef.current?.setCamera({
      centerCoordinate: INITIAL_CENTER,
      zoomLevel: INITIAL_ZOOM,
      animationDuration: 1000,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <MapboxGL.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Street}
        onPress={handleMapPress}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={INITIAL_ZOOM}
          centerCoordinate={INITIAL_CENTER}
        />

        {squareCoords.length > 0 && (
          <MapboxGL.ShapeSource
            id="squareSource"
            shape={{
              type: "Feature",
              geometry: { type: "Polygon", coordinates: [squareCoords] },
            }}
          >
            <MapboxGL.FillLayer
              id="fill"
              style={{ fillColor: "rgba(59,178,208,0.3)" }}
            />
            <MapboxGL.LineLayer
              id="line"
              style={{ lineColor: "#3bb2d0", lineWidth: 3 }}
            />
          </MapboxGL.ShapeSource>
        )}

        {center && (
          <MapboxGL.PointAnnotation id="center" coordinate={center}>
            <View style={styles.centerMarker} />
          </MapboxGL.PointAnnotation>
        )}
      </MapboxGL.MapView>

      <View style={styles.overlay}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search location (e.g. Sydney, Melbourne, Karachi)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchLocation}
            placeholderTextColor="#666"
            autoCapitalize="none"
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={searchLocation}
          >
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.controlContainer}>
          <Text style={styles.label}>Distance (km):</Text>
          <TextInput
            style={styles.radiusInput}
            keyboardType="numeric"
            value={radiusKm}
            onChangeText={(val) => {
              if (/^\d*\.?\d*$/.test(val)) setRadiusKm(val);
            }}
            placeholder="10"
          />
          <TouchableOpacity style={styles.resetButton} onPress={reset}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {center && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Area: {parseFloat(radiusKm || "0").toFixed(1)} km²
            </Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  overlay: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  searchInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#3bb2d0",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  controlContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    elevation: 4,
  },
  label: { fontSize: 14, fontWeight: "600", marginRight: 10, color: "#444" },
  radiusInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    width: 80,
    textAlign: "center",
    marginRight: 12,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonText: { color: "white", fontWeight: "600", fontSize: 14 },
  infoBox: {
    backgroundColor: "rgba(0,0,0,0.75)",
    alignSelf: "flex-start",
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  infoText: { color: "white", fontWeight: "600", fontSize: 14 },
  centerMarker: {
    width: 32,
    height: 32,
    backgroundColor: "#3bb2d0",
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "white",
  },
});

export default MapboxSquareSelector;
