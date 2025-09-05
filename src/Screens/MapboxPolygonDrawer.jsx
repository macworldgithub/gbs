import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import * as turf from "@turf/turf";
MapboxGL.setAccessToken(
  "pk.eyJ1IjoibGVvbi1nYnMiLCJhIjoiY21jc3Eyam1kMTNhdDJqcTJwbzdtMWF2bSJ9.K3Jn-X37-Uy-J9hYU7XbQw"
);

const MapboxPolygonDrawer = ({ coordinates, setCoordinates }) => {
  const [polygon, setPolygon] = useState(coordinates?.[0]?.[0] || []);
  const [completed, setCompleted] = useState(false);

  const handleMapPress = (e) => {
    if (completed) return; // polygon closed
    const coords = e.geometry.coordinates;
    setPolygon((prev) => [...prev, coords]);
  };

const closePolygon = () => {
  if (polygon.length < 3) {
    Alert.alert("Error", "Polygon needs at least 3 points");
    return;
  }
  setCompleted(true);

  // close ring
  const closed = [...polygon, polygon[0]];

  // Create turf polygon
  const turfPolygon = turf.polygon([closed]);

  // ✅ Fix invalid polygon automatically
  const fixed = turf.cleanCoords(turfPolygon);

  if (!turf.booleanValid(fixed)) {
    Alert.alert("Invalid Shape", "Polygon edges are crossing. Please draw again.");
    setPolygon([]);
    setCompleted(false);
    return;
  }

  setPolygon(closed);

  // ✅ Wrap correctly
  const multiPolygonCoords = [[closed]];
  setCoordinates(multiPolygonCoords);
};


  const resetPolygon = () => {
    setPolygon([]);
    setCompleted(false);
    setCoordinates([]);
  };

  return (
    <View style={{ flex: 1, height: 300 }}>
      <MapboxGL.MapView
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Street}
        onPress={handleMapPress}
      >
        <MapboxGL.Camera
          zoomLevel={10}
          centerCoordinate={[67.0011, 24.8607]} // Karachi default
        />

        {/* Render polygon */}
        {polygon.length > 2 && (
          <MapboxGL.ShapeSource
            id="polygon"
            shape={{
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [polygon],
              },
            }}
          >
            <MapboxGL.FillLayer
              id="polygonFill"
              style={{ fillColor: "rgba(59,178,208,0.3)" }}
            />
            <MapboxGL.LineLayer
              id="polygonLine"
              style={{ lineColor: "#3bb2d0", lineWidth: 2 }}
            />
          </MapboxGL.ShapeSource>
        )}

        {/* Render points */}
        {polygon.map((coord, i) => (
          <MapboxGL.PointAnnotation
            key={`point-${i}`}
            id={`point-${i}`}
            coordinate={coord}
          />
        ))}
      </MapboxGL.MapView>

      {/* Controls */}
      <View style={styles.controls}>
        {!completed ? (
          <TouchableOpacity style={styles.btn} onPress={closePolygon}>
            <Text style={styles.btnText}>Close Polygon</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btn} onPress={resetPolygon}>
            <Text style={styles.btnText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MapboxPolygonDrawer;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    elevation: 4,
  },
  btn: {
    backgroundColor: "#3bb2d0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
});
