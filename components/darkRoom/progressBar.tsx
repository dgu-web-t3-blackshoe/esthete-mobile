import React from "react";

//요소
import { View } from "react-native";

export const ProgressBar = ({ currentStep }: any) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          backgroundColor: currentStep >= 1 ? "black" : "#c9c9c9",
          height: 5,
          flex: 1,
        }}
      />
      <View
        style={{
          backgroundColor: currentStep >= 2 ? "black" : "#c9c9c9",
          height: 5,
          flex: 1,
        }}
      />
      <View
        style={{
          backgroundColor: currentStep >= 3 ? "black" : "#c9c9c9",
          height: 5,
          flex: 1,
        }}
      />
    </View>
  );
};
