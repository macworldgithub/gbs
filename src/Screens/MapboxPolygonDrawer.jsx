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
  const [center, setCenter] = useState(null);
  const [radiusKm, setRadiusKm] = useState("10");
  const [searchQuery, setSearchQuery] = useState("");
  const [squareCoords, setSquareCoords] = useState([]);

  const mapRef = useRef(null);
  const cameraRef = useRef(null);

  const INITIAL_CENTER = [151.2093, -33.8688]; // Sydney (as in your latest code)
  const INITIAL_ZOOM = 11;

  const MAPBOX_ACCESS_TOKEN =
    "pk.eyJ1IjoibGVvbi1nYnMiLCJhIjoiY21jc3Eyam1kMTNhdDJqcTJwbzdtMWF2bSJ9.K3Jn-X37-Uy-J9hYU7XbQw";

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

      if (cameraRef.current) {
        cameraRef.current.fitBounds(
          [squareBbox[0], squareBbox[1]],
          [squareBbox[2], squareBbox[3]],
          60,
          800,
        );
      }
    } catch (err) {
      console.error("Square generation error:", err);
    }
  };

  useEffect(() => {
    if (!center) {
      setSquareCoords([]);
      setCoordinates([]);
      return;
    }
    generateSquare(center, radiusKm);
  }, [center, radiusKm]);

  const handleMapPress = (e) => {
    const coords = e?.geometry?.coordinates;
    if (Array.isArray(coords) && coords.length === 2) {
      setCenter(coords);
    }
  };

  const searchLocation = async () => {
    const query = searchQuery.trim();
    if (!query) return Alert.alert("Empty", "Please enter a location");
    if (query.length < 3)
      return Alert.alert("Too short", "At least 3 characters");

    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=5&types=place,locality,neighborhood,address,poi`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      if (data.features?.length > 0) {
        const [lng, lat] = data.features[0].center;
        const newCenter = [lng, lat];
        setCenter(newCenter);

        cameraRef.current?.setCamera({
          centerCoordinate: newCenter,
          zoomLevel: 13,
          animationDuration: 1200,
        });
      } else {
        Alert.alert("Not Found", `No results for "${query}"`);
      }
    } catch (err) {
      console.error("Search error:", err);
      Alert.alert("Search Failed", "Could not reach Mapbox. Check connection.");
    }
  };

  const zoomIn = () => {
    if (!mapRef.current || !cameraRef.current) return;

    mapRef.current
      .getZoom()
      .then((currentZoom) => {
        const nextZoom = Math.min(currentZoom + 1.8, 20);
        cameraRef.current.setCamera({
          zoomLevel: nextZoom,
          animationDuration: 400,
        });
      })
      .catch((err) => {
        console.warn("getZoom failed (zoom in)", err);
        cameraRef.current.setCamera({
          zoomLevel: 15,
          animationDuration: 400,
        });
      });
  };

  const zoomOut = () => {
    if (!mapRef.current || !cameraRef.current) return;

    mapRef.current
      .getZoom()
      .then((currentZoom) => {
        const nextZoom = Math.max(currentZoom - 1.8, 2);
        cameraRef.current.setCamera({
          zoomLevel: nextZoom,
          animationDuration: 400,
        });
      })
      .catch((err) => {
        console.warn("getZoom failed (zoom out)", err);
        cameraRef.current.setCamera({
          zoomLevel: 8,
          animationDuration: 400,
        });
      });
  };

  const handleClear = () => {
    setRadiusKm("0");
    setSquareCoords([]);
    setCoordinates([]);

    if (center) {
      generateSquare(center, "10");
    }
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
          animationMode="flyTo"
          animationDuration={0}
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
              style={{ fillColor: "rgba(59, 178, 208, 0.28)" }}
            />
            <MapboxGL.LineLayer
              id="line"
              style={{ lineColor: "#3bb2d0", lineWidth: 3.2 }}
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
            placeholder="Search location (e.g. Melbourne, Sydney)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchLocation}
            placeholderTextColor="#888"
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

        <View style={styles.controlRow}>
          <View style={styles.radiusGroup}>
            <Text style={styles.label}>Distance (km):</Text>
            <TextInput
              style={styles.radiusInput}
              keyboardType="numeric"
              value={radiusKm}
              onChangeText={(val) => {
                if (/^\d*\.?\d*$/.test(val) || val === "") setRadiusKm(val);
              }}
              placeholder="10"
            />
          </View>

          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {center && radiusKm && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Area ≈ {parseFloat(radiusKm).toFixed(1)} km radius
            </Text>
          </View>
        )}

        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
            <Text style={styles.zoomText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
            <Text style={styles.zoomText}>−</Text>
          </TouchableOpacity>
        </View>
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
    borderRadius: 10,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 5,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#222",
  },
  searchButton: {
    backgroundColor: "#3bb2d0",
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    elevation: 3,
    flexWrap: "wrap",
  },
  radiusGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginRight: 8,
    color: "#333",
  },
  radiusInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 80,
    textAlign: "center",
    fontSize: 16,
  },

  clearButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 8,
    marginRight: 12,
  },

  zoomControls: {
    flexDirection: "row",
    position: "absolute",
    left: -16,
    bottom: -100, // adjust position as needed
  },
  zoomButton: {
    backgroundColor: "white",
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  zoomText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },

  infoBox: {
    backgroundColor: "rgba(0,0,0,0.65)",
    alignSelf: "flex-start",
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  infoText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },

  centerMarker: {
    width: 36,
    height: 36,
    backgroundColor: "#3bb2d0",
    borderRadius: 18,
    borderWidth: 5,
    borderColor: "white",
    opacity: 0.92,
  },
});

export default MapboxSquareSelector;
