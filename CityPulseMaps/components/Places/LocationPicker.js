import { Alert, StyleSheet, View } from "react-native";
import { PermissionStatus, useForegroundPermissions } from "expo-location";

import OutlinedButton from "../UI/OutlinedButton";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useLayoutEffect } from "react";
import { Colors } from "../../constants/colors";

function LocationPicker() {
  const navigation = useNavigation();

  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          name="information-circle-outline"
          size={24}
          color={Colors.white}
          onPress={navigateToAboutHandler}
          style={{ marginRight: 10 }}
        />
      ),
    });
  }, [navigation]);

  async function verifyPermissions() {
    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant location permissions to use this app.",
      );
      return false;
    }

    return true;
  }

  async function getLocationHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    navigation.navigate("Map", {
      locateCurrentUser: true,
    });
  }

  function pickOnMapHandler() {
    navigation.navigate("Map", { locateCurrentUser: false });
  }

  function navigateToAboutHandler() {
    navigation.navigate("InfoScreen");
  }

  return (
    <View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
}

export default LocationPicker;

const styles = StyleSheet.create({
  actions: {
    flex: 1,
    marginTop: "20%",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});
