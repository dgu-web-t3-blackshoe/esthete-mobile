import React, { useState, useRef, useEffect } from "react";
import { CubeNavigationHorizontal } from "react-native-3dcube-navigation";
import Gallery from "./gallery";

//요소
import { Text, View } from "react-native";
const Box: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <CubeNavigationHorizontal>
        <Gallery/>
        <Gallery/>
        <Gallery/>
        <Gallery/>
        <Gallery/>
        
      </CubeNavigationHorizontal>
    </View>
  );
};

export default Box;
