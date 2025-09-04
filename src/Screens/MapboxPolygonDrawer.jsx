import React, { useState } from "react";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames";

MapboxGL.setAccessToken("YOUR_MAPBOX_TOKEN");

export default function MapboxPolygonDrawer({ coordinates, onChange }) {
  const [polygon, setPolygon] = useState(coordinates?.[0] || []);

  const handleAddPoint = (lng, lat) => {
    const updated = [...polygon, [lng, lat]];
    setPolygon(updated);
    onChange([updated]); // Wrap in MultiPolygon format
  };

  return (
    <View style={tw`w-full h-80 border rounded-lg overflow-hidden`}>
      <MapboxGL.MapView
        style={{ flex: 1 }}
        onPress={(e) => {
          const { geometry } = e;
          if (geometry && geometry.coordinates) {
            const [lng, lat] = geometry.coordinates;
            handleAddPoint(lng, lat);
          }
        }}
      >
        <MapboxGL.Camera zoomLevel={12} centerCoordinate={[67.0011, 24.8607]} />

        {polygon.length > 2 && (
          <MapboxGL.ShapeSource
            id="polygon"
            shape={{
              type: "Feature",
              geometry: { type: "Polygon", coordinates: [polygon] },
            }}
          >
            <MapboxGL.FillLayer
              id="polygonFill"
              style={{ fillColor: "rgba(59,178,208,0.3)" }}
            />
            <MapboxGL.LineLayer
              id="polygonStroke"
              style={{ lineColor: "#3bb2d0", lineWidth: 2 }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>

      <View style={tw`absolute bottom-2 left-2 flex-row`}>
        <TouchableOpacity
          onPress={() => {
            setPolygon([]);
            onChange([]);
          }}
          style={tw`bg-red-500 px-3 py-1 rounded mr-2`}
        >
          <Text style={tw`text-white`}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
