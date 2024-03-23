import { ImageBackground, ScrollView, StyleSheet } from "react-native";
import LocationPicker from "../components/Places/LocationPicker";

function StartScreen() {
  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <ScrollView style={styles.form}>
        <LocationPicker />
      </ScrollView>
    </ImageBackground>
  );
}

export default StartScreen;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  background: {
    flex: 1,
  },
});
