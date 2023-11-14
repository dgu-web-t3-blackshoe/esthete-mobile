import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  bigFont: {
    fontSize: 20,
    fontWeight: "500",
  },

  rowSpaceBetweenContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    alignItems: "center",
  },

  backgroundWhite: {
    backgroundColor: "white",
  },

  backgroundBlackBox: {
    backgroundColor: "black",
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
});
