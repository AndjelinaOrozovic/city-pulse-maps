import React from "react";
import { Platform, StyleSheet, Switch, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { Colors } from "../../constants/colors";

const MapControls = ({
  mapPoints,
  airQualityPoints,
  radius,
  onRadiusChange,
  onSlidingComplete,
  showMarkers,
  showMarkerToggle,
  onToggleShowMarkers,
  mode,
  onToggleMode,
  locatedUser,
}) => {
  const isMarkersSwitchVisible =
    (mapPoints?.length > 0 || airQualityPoints?.length > 0) && showMarkerToggle;

  const showModeSwitch = locatedUser;

  return (
    <View style={styles.controlsContainer}>
      <View
        style={[
          styles.toggleContainer,
          !(isMarkersSwitchVisible && showModeSwitch) &&
            styles.centeredContainer,
        ]}
      >
        {isMarkersSwitchVisible && (
          <View style={styles.switchContainer}>
            <Text style={styles.toggleText}>Show Markers</Text>
            <Switch
              trackColor={{
                false: Colors.switchTrackFalse,
                true: Colors.switchTrackTrue,
              }}
              thumbColor={
                showMarkers ? Colors.switchThumbTrue : Colors.switchThumbFalse
              }
              ios_backgroundColor={Colors.iosBackground}
              onValueChange={onToggleShowMarkers}
              value={showMarkers}
            />
          </View>
        )}
        {showModeSwitch && (
          <View style={styles.switchContainer}>
            <Text style={styles.toggleText}>Driving</Text>
            <Switch
              trackColor={{
                false: Colors.switchTrackFalse,
                true: Colors.switchTrackTrue,
              }}
              thumbColor={
                mode === "walking"
                  ? Colors.switchThumbFalse
                  : Colors.switchThumbTrue
              }
              ios_backgroundColor={Colors.iosBackground}
              onValueChange={onToggleMode}
              value={mode === "driving"}
            />
          </View>
        )}
      </View>
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Radius: {radius} meters</Text>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={100}
          maximumValue={5000}
          minimumTrackTintColor={Colors.white}
          maximumTrackTintColor={Colors.black}
          step={100}
          value={radius}
          onValueChange={onRadiusChange}
          onSlidingComplete={onSlidingComplete}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    padding: 10,
  },
  sliderContainer: {
    marginTop: 8,
    paddingHorizontal: 10,
    width: "100%",
    alignItems: "stretch",
    justifyContent: "center",
  },
  sliderLabel: {
    color: Colors.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: Platform.OS === "ios" ? 4 : 3,
  },
  centeredContainer: {
    justifyContent: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 1,
  },
  toggleText: {
    marginRight: 6,
    color: Colors.white,
    fontWeight: "bold",
  },
});

export default MapControls;
