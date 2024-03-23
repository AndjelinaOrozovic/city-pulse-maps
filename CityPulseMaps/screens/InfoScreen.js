import React from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors";

function InfoScreen() {
  const handleEmailPress = () => {
    Linking.openURL("mailto:heatmaps.support@gmail.com");
  };

  const legendColors = [
    { color: Colors.lightGreenInfo, description: "Good (0-50)" },
    { color: Colors.yellowInfo, description: "Moderate (51-100)" },
    {
      color: Colors.orangeInfo,
      description: "Unhealthy for Sensitive Groups (101-150)",
    },
    { color: Colors.redInfo, description: "Unhealthy (151-200)" },
    { color: Colors.purpleInfo, description: "Very Unhealthy (201-300)" },
    { color: Colors.maroonInfo, description: "Hazardous (301-500)" },
  ];

  return (
    <ScrollView>
      <Text style={styles.header}>How to Use the App</Text>
      <View style={styles.section}>
        <Text style={styles.subHeader}>Heatmap</Text>
        <Text style={styles.description}>
          The heatmap is an intuitive guide to assess the density and
          distribution of your chosen categories across the city. A denser color
          indicates a higher concentration of locations, such as cafes or
          restaurants etc., helping you make informed decisions about where to
          go.
        </Text>
        <View tyle={styles.description}>
          <Text style={styles.description}>Options:</Text>
          <Text style={styles.bulletPoint}>
            • Change categories (cafes, restaurants, parks, hotels, etc.)
          </Text>
          <Text style={styles.bulletPoint}>• Adjust search radius</Text>
          <Text style={styles.bulletPoint}>• View location markers</Text>
          <Text style={styles.bulletPoint}>
            • Get directions to a specific location
          </Text>
          <Text style={styles.bulletPoint}>
            • Set distance threshold for data fetching (100m for walking, 500m
            for driving) - only for locate user
          </Text>
          <Text style={styles.bulletPoint}>
            • Clear map - clear all data from map
          </Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.subHeader}>Air Quality Index (AQI) Heatmap</Text>
        <Text style={styles.description}>
          This tool provides real-time information about the air quality in your
          vicinity, using data from local measurement stations. Here's what the
          colors represent:
        </Text>
      </View>
      <View style={styles.colorContainer}>
        {legendColors.map((item, index) => (
          <View key={index} style={styles.row}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Text style={styles.text}>{item.description}</Text>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.subHeader}>Privacy and Data Usage:</Text>
        <Text style={styles.description}>
          We value your privacy. The app does not store personal data without
          consent and ensures that all location data is used solely to provide
          service-related information.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subHeader}>Feedback and Support:</Text>
        <Text style={styles.description}>
          Your feedback is crucial for us to improve. If you have suggestions,
          or if you encounter any issues, please contact us at{" "}
          <Text style={styles.link} onPress={handleEmailPress}>
            heatmaps.support@gmail.com
          </Text>
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subHeader}>Version:</Text>
        <Text style={styles.description}>1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  subHeader: {
    color: Colors.lilac,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    color: Colors.white,
    fontSize: 16,
    lineHeight: 24,
  },
  bulletPoint: {
    fontSize: 16,
    color: Colors.white,
    marginLeft: 16,
  },
  colorContainer: {
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: Colors.white,
  },
  link: {
    color: Colors.lilac,
    textDecorationLine: "underline",
  },
});

export default InfoScreen;
