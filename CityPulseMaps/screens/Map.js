import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import MapView, { Circle, Heatmap, Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as state from "../constants/categories";
import { fetchAirQualityData, getPoints } from "../util/location";
import MarkerComponent from "../components/UI/MarkerComponent";
import MapControls from "../components/Places/MapControls";
import CategoriesScrollView from "../components/UI/CategoriesScrollView";
import { calculateDistance } from "../util/helperFunctions";
import { Colors } from "../constants/colors";
import { initialRegion, initialZoomLevel } from "../constants/initialValues";
import { MaterialIcons } from "@expo/vector-icons";
import AQIMarkerComponent from "../components/UI/AQIMarkerComponent";

function Map({ navigation, route }) {
  const locatedUser = route.params?.locateCurrentUser;
  const [radius, setRadius] = useState(1000);
  const [placeType, setPlaceType] = useState("cafe");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapPoints, setMapPoints] = useState([]);
  const [loadingHeatMaps, setLoadingHeatMaps] = useState(false);
  const [loadingAirQuality, setLoadingAirQuality] = useState(false);
  const [showMarkers, setShowMarkers] = useState(false);
  const [showMarkerToggle, setShowMarkerToggle] = useState(false);
  const [showHeatMap, setShowHeatMap] = useState(true);
  const [showRadius, setShowRadius] = useState(true);
  const [showSelectedMarker, setShowSelectedMarker] = useState(true);
  const [showAirQuality, setShowAirQuality] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [mode, setMode] = useState("walking");
  const [airQualityPoints, setAirQualityPoints] = useState([]);
  const [region, setRegion] = useState(initialRegion);
  const [zoomLevel, setZoomLevel] = useState(initialZoomLevel);
  const lastFetchLocationRef = useRef(null);
  const locationSubscriptionRef = useRef(null);

  useEffect(() => {
    if (!locatedUser) {
      Alert.alert("Please pick location on map to continue!");
    }
  }, []);

  useLayoutEffect(() => {
    if (!selectedLocation) {
      navigation.setOptions({ headerRight: () => null });
      return;
    }
    navigation.setOptions({
      headerRight: () => (
        <MaterialIcons
          name="delete-outline"
          size={24}
          color={Colors.white}
          onPress={clearMap}
        />
      ),
    });
  }, [navigation, selectedLocation, mapPoints]);

  function clearMap() {
    setShowHeatMap(false);
    setShowMarkers(false);
    setShowRadius(false);
    setShowSelectedMarker(false);
    setShowMarkerToggle(false);
    setSelectedLocation(null);
    setShowAirQuality(false);
    navigation.setOptions({ headerRight: () => null });

    if (locationSubscriptionRef.current) {
      locationSubscriptionRef.current.remove();
    }
  }

  const fetchAndUpdatePoints = (latitude, longitude, newPlaceType, radius) => {
    const type = newPlaceType || placeType;
    setShowHeatMap(!showMarkers);
    setShowRadius(true);
    setShowSelectedMarker(true);
    setSelectedMarkerId(null);
    setLoadingHeatMaps(true);
    getPoints(latitude, longitude, type, radius)
      .then((newPoints) => {
        setMapPoints(newPoints);
        setLoadingHeatMaps(false);
        setShowMarkerToggle(true);
        if (newPoints.length === 0) {
          setShowMarkers(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching results:", error);
        Alert.alert("Error", "Unable to fetch results.");
        setLoadingHeatMaps(false);
      });
  };

  const loadAirQualityData = async (latitude, longitude) => {
    setLoadingAirQuality(true);
    const points = await fetchAirQualityData(
      latitude.toFixed(2),
      longitude.toFixed(2),
      radius,
    );
    if (points.length > 0) {
      setShowMarkerToggle(true);
    }
    setAirQualityPoints(points);
    setLoadingAirQuality(false);
  };

  useEffect(() => {
    if (locatedUser) {
      Location.getCurrentPositionAsync({})
        .then((location) => {
          setSelectedLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });

          setMapPoints([]);
          if (placeType !== "airQuality") {
            setShowAirQuality(false);
            fetchAndUpdatePoints(
              location.coords.latitude,
              location.coords.longitude,
              placeType,
              radius,
            );
          } else {
            setShowAirQuality(true);
            loadAirQualityData(
              location.coords.latitude,
              location.coords.longitude,
            );
          }
        })
        .catch((error) => console.error("Error locating user:", error));
    }
  }, [locatedUser]);

  useEffect(() => {
    const startWatchingLocation = async () => {
      locationSubscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000, // Update every second
          distanceInterval: 1, // Update every meter
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          setSelectedLocation({
            latitude,
            longitude,
          });
          const distanceThreshold = mode === "walking" ? 100 : 500;
          if (
            !lastFetchLocationRef.current ||
            calculateDistance(
              lastFetchLocationRef.current.latitude,
              lastFetchLocationRef.current.longitude,
              latitude,
              longitude,
            ) >= distanceThreshold
          ) {
            if (placeType !== "airQuality") {
              setShowAirQuality(false);
              fetchAndUpdatePoints(latitude, longitude, placeType, radius);
              lastFetchLocationRef.current = { latitude, longitude };
            } else {
              setShowAirQuality(true);
              loadAirQualityData(latitude, longitude);
            }
          }
        },
      );
    };

    if (locatedUser) {
      startWatchingLocation();
    }

    return () => {
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
      }
    };
  }, [mode]);

  useEffect(() => {
    if (selectedLocation) {
      if (placeType !== "airQuality") {
        setShowAirQuality(false);
        setMapPoints([]);
        fetchAndUpdatePoints(
          selectedLocation.latitude,
          selectedLocation.longitude,
          placeType,
          radius,
        );
        setRegion({
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          latitudeDelta: zoomLevel.latitudeDelta,
          longitudeDelta: zoomLevel.longitudeDelta,
        });
      } else {
        setShowAirQuality(true);
        loadAirQualityData(
          selectedLocation.latitude,
          selectedLocation.longitude,
        );
      }
    }
  }, [placeType]);

  const selectLocationHandler = (event) => {
    if (!locatedUser) {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      setSelectedLocation({ latitude, longitude });
      setRegion({
        ...region,
        latitude,
        longitude,
        latitudeDelta: zoomLevel.latitudeDelta,
        longitudeDelta: zoomLevel.longitudeDelta,
      });
      setShowSelectedMarker(true);
      setShowRadius(true);
      setMapPoints([]);
      if (placeType !== "airQuality") {
        setShowAirQuality(false);
        fetchAndUpdatePoints(latitude, longitude, placeType, radius);
      } else {
        setShowAirQuality(true);
        loadAirQualityData(latitude, longitude);
      }
    }
  };

  const onRegionChange = (newRegion) => {
    if (newRegion !== region) {
      setZoomLevel({
        latitudeDelta: newRegion.latitudeDelta,
        longitudeDelta: newRegion.longitudeDelta,
      });
    }
  };

  function onToggleMode() {
    setMode((prevMode) => {
      return prevMode === "walking" ? "driving" : "walking";
    });

    if (mode === "walking") {
      Alert.alert("Results will be fetched every 500 meters!");
    } else {
      Alert.alert("Results will be fetched every 100 meters!");
    }
  }

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={region}
        region={region}
        onPress={selectLocationHandler}
        onRegionChange={onRegionChange}
      >
        {airQualityPoints.length > 0 && showAirQuality && (
          <Heatmap
            points={airQualityPoints}
            opacity={1}
            radius={50}
            gradient={{
              colors: [
                Colors.greenHeat,
                Colors.yellowHeat,
                Colors.redHeat,
                Colors.purpleHeat,
                Colors.maroonHeat,
              ],
              startPoints:
                Platform.OS === "ios"
                  ? [0.01, 0.04, 0.1, 0.45, 0.5]
                  : [0.1, 0.25, 0.5, 0.75, 1],
              colorMapSize: 2000,
            }}
          />
        )}
        {mapPoints.length > 0 && showHeatMap && (
          <Heatmap points={mapPoints} radius={40} opacity={1} />
        )}

        {selectedLocation && showSelectedMarker && (
          <Marker
            title="Selected Location"
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            pinColor={Colors.green}
          />
        )}
        {showMarkers &&
          selectedLocation &&
          mapPoints.map((marker, index) => (
            <MarkerComponent
              title={marker.name}
              key={`${marker.key}-${index}`}
              marker={marker}
              isSelected={selectedMarkerId === marker.key}
              onPress={() => setSelectedMarkerId(marker.key)}
            />
          ))}
        {showMarkers &&
          selectedLocation &&
          placeType === "airQuality" &&
          airQualityPoints.map((marker, index) => (
            <AQIMarkerComponent
              title={`${marker.weight} AQI`}
              key={`${marker.key}-${index}`}
              marker={marker}
              isSelected={selectedMarkerId === marker.key}
              onPress={() => setSelectedMarkerId(marker.key)}
            />
          ))}
        {selectedLocation && showRadius && (
          <Circle
            center={selectedLocation}
            radius={radius}
            fillColor="rgba(200, 300, 200, 0.5)"
            strokeColor="rgba(0,0,0,0.5)"
            strokeWidth={1}
          />
        )}
      </MapView>
      {(loadingHeatMaps || loadingAirQuality) && (
        <View style={styles.loaderStyle}>
          <ActivityIndicator size="large" color={Colors.loaderColor} />
        </View>
      )}
      <MapControls
        mapPoints={mapPoints}
        airQualityPoints={airQualityPoints}
        radius={radius}
        onRadiusChange={setRadius}
        showMarkerToggle={showMarkerToggle}
        onSlidingComplete={(value) => {
          if (selectedLocation && placeType) {
            if (placeType !== "airQuality") {
              setShowAirQuality(false);
              fetchAndUpdatePoints(
                selectedLocation.latitude,
                selectedLocation.longitude,
                placeType,
                value,
              );
            } else {
              setShowAirQuality(true);
              loadAirQualityData(
                selectedLocation.latitude,
                selectedLocation.longitude,
              );
            }
          }
        }}
        showMarkers={showMarkers}
        onToggleShowMarkers={() => {
          setShowMarkers(!showMarkers);
          setShowHeatMap(!!showMarkers);
        }}
        mode={mode}
        onToggleMode={onToggleMode}
        locatedUser={locatedUser}
      />
      <CategoriesScrollView
        categories={state.categories}
        onCategoryPress={(newPlaceType) => {
          if (newPlaceType !== "airQuality") {
            setPlaceType(newPlaceType);
            if (selectedLocation) {
              setShowRadius(true);
              setShowSelectedMarker(true);
              fetchAndUpdatePoints(
                selectedLocation.latitude,
                selectedLocation.longitude,
                newPlaceType,
                radius,
              );
            }
          } else {
            setPlaceType(newPlaceType);
            setShowHeatMap(false);
            setMapPoints([]);
            setShowMarkers(false);
          }
        }}
        selectedCategory={placeType}
      />
    </View>
  );
}

export default Map;

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  chipsScrollView: {
    position: "absolute",
    top: Platform.OS === "ios" ? 90 : 80,
    paddingHorizontal: 10,
    marginTop: -60,
  },
  loaderStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
});
