import 'dotenv/config';

export default {
  expo: {
    name: "TouristApp",
    slug: "TouristApp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "touristapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      supportsTablet: true,
    },

    

    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },

    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins: [
      "expo-localization",
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },

    // Environment variables injected here
    extra: {
        openWeatherKey: process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY,
        openWeatherUrl: process.env.EXPO_PUBLIC_OPENWEATHER_API_URL,
        weatherFetchTimeout: process.env.EXPO_PUBLIC_WEATHER_FETCH_TIMEOUT,

        mapboxAccessToken: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN,
        mapboxApiUrl: process.env.EXPO_PUBLIC_MAPBOX_API_URL,

        defaultCountryCode: process.env.EXPO_PUBLIC_DEFAULT_COUNTRY_CODE,
        defaultLatitude: process.env.EXPO_PUBLIC_DEFAULT_LATITUDE,
        defaultLongitude: process.env.EXPO_PUBLIC_DEFAULT_LONGITUDE,

        mapFetchTimeout: process.env.EXPO_PUBLIC_MAP_FETCH_TIMEOUT,
        fetchTimeout: process.env.EXPO_PUBLIC_FETCH_TIMEOUT,
        awsRiskBaseUrl: process.env.EXPO_PUBLIC_AWS_RISK_BASE_URL,
        policeStationLocationUrl:
          process.env.EXPO_PUBLIC_POLICE_STATION_LOCATION_URL,
        policeStationBoundaryUrl:
          process.env.EXPO_PUBLIC_POLICE_STATION_BOUNDARY_URL,
    },
  },
};
