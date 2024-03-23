import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../../constants/colors";

const CategoriesScrollView = ({
  categories,
  onCategoryPress,
  selectedCategory,
}) => {
  return (
    <ScrollView
      horizontal
      scrollEventThrottle={1}
      showsHorizontalScrollIndicator={false}
      height={50}
      style={styles.chipsScrollView}
      contentInset={{
        top: 0,
        left: 0,
        bottom: 0,
        right: 20,
      }}
      contentContainerStyle={{
        paddingRight: Platform.OS === "android" ? 20 : 0,
      }}
    >
      {categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.chipsItem,
            {
              backgroundColor:
                selectedCategory === category.placeType
                  ? Colors.lightblue
                  : Colors.white,
            },
          ]}
          onPress={() => onCategoryPress(category.placeType)}
        >
          {category.icon}
          <Text>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chipsScrollView: {
    position: "absolute",
    top: Platform.OS === "ios" ? 90 : 80,
    paddingHorizontal: 10,
    marginTop: -60,
  },
  chipsItem: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    height: 35,
    shadowColor: Colors.switchThumbFalse,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
});

export default CategoriesScrollView;
