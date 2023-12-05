import React, { useState, useRef, useEffect } from "react";

//요소
import {
  Alert,
  Image,
  Text,
  KeyboardAvoidingView,
  View,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";

import { NavBar, SvgType } from "../../components/navbar";
import {
  GenreArray,
  getGenreKeyByValue,
  getGenreValueByKey,
} from "../../components/constants";
import GlobalStyles from "../../assets/styles";

const PageExhibition: React.FC = () => {
  const width = Dimensions.get("window").width;
  return (
    <View style={{ flex: 1 }}>
      <Carousel
        loop
        width={width}
        height={width / 2}
        data={[...new Array(6).keys()]}
        scrollAnimationDuration={1000}
        style={{ flex: 1 }}
        onSnapToItem={(index) => console.log("current index:", index)}
        renderItem={({ index }) => (
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              justifyContent: "center",
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 30 }}>{index}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default PageExhibition;
