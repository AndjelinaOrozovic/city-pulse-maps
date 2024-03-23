import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Colors } from "./constants/colors";
import Map from "./screens/Map";
import StartScreen from "./screens/StartScreen";
import InfoScreen from "./screens/InfoScreen";
import { enableScreens } from 'react-native-screens';

enableScreens();

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
    <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: Colors.headerColor },
            headerTintColor: Colors.gray700,
            contentStyle: { backgroundColor: Colors.gray700 },
          }}
        >
          <Stack.Screen
            name="StartScreen"
            component={StartScreen}
            options={{
              title: "Explore map",
            }}
          />
          <Stack.Screen name="Map" component={Map} />
          <Stack.Screen
            name="InfoScreen"
            component={InfoScreen}
            options={{
              title: "About application",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
