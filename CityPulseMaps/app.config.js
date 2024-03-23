import 'dotenv/config';

export default {
    expo: {
        name: "CityPulse Maps",
        slug: "HeatMaps",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "light",
        splash: {
            image: "./assets/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        assetBundlePatterns: [
            "**/*"
        ],
        ios: {
            buildNumber: "1.0.0",
            supportsTablet: true
        },
        android: {
            versionCode: 1,
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            permissions: [
                "ACCESS_FINE_LOCATION",
                "ACCESS_COARSE_LOCATION"
            ],
            package: "com.djina.HeatMaps",
            config: {
                googleMaps: {
                    apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY
                }
            }
        },
        androidStatusBar: {
              backgroundColor: "#483D8B",
              translucent: false
        },
        web: {
            favicon: "./assets/favicon.png"
        },
        extra: {
            eas: {
                projectId: "42db26a4-3880-4457-b777-e9a6aa0f100c"
            },
            googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY
        }
  }
};