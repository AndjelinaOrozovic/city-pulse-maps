import React from "react";
import { Marker } from "react-native-maps";

const MarkerComponent = ({ marker, isSelected, title, onPress }) => {
  return (
    <Marker
      title={title}
      coordinate={{
        latitude: marker.latitude,
        longitude: marker.longitude,
      }}
      onPress={onPress}
      image={isSelected ? require("../../assets/marker.png") : null}
    ></Marker>
  );
};

export default MarkerComponent;
