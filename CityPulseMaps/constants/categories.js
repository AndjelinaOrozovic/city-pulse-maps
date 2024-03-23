import { Fontisto, Ionicons, MaterialIcons } from "@expo/vector-icons";

export const categories = [
  {
    name: "Air Quality",
    icon: <Ionicons name="leaf" style={{ marginRight: 5 }} size={18} />,
    placeType: "airQuality",
  },
  {
    name: "Cafes",
    icon: <Ionicons name="cafe" style={{ marginRight: 5 }} size={18} />,
    placeType: "cafe",
  },
  {
    name: "Restaurants",
    icon: <Ionicons name="restaurant" style={{ marginRight: 5 }} size={18} />,
    placeType: "restaurant",
  },
  {
    name: "Parks and landmarks",
    icon: <MaterialIcons name="park" style={{ marginRight: 5 }} size={18} />,
    placeType: "park",
  },
  {
    name: "Pharmacies",
    icon: (
      <MaterialIcons
        name="local-pharmacy"
        style={{ marginRight: 5 }}
        size={18}
      />
    ),
    placeType: "pharmacy",
  },
  {
    name: "Fitness centers",
    icon: (
      <MaterialIcons
        name="fitness-center"
        style={{ marginRight: 5 }}
        size={18}
      />
    ),
    placeType: "gym",
  },
  {
    name: "Hotels and accommodations",
    icon: <Fontisto name="hotel" style={{ marginRight: 5 }} size={15} />,
    placeType: "lodging",
  },
];
