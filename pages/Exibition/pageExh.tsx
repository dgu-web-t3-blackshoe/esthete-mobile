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
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import Random from "./random";
import Carousel from "react-native-reanimated-carousel";
import Animated, { Extrapolate, interpolate } from "react-native-reanimated";

import { NavBar, SvgType } from "../../components/navbar";
import {
  GenreArray,
  getGenreKeyByValue,
  getGenreValueByKey,
} from "../../components/constants";
import GlobalStyles from "../../assets/styles";

const statusbarHeight = StatusBar.currentHeight;

const PageExhibition: React.FC = () => {
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  //Cube Animation
  const animationStyle: any = React.useCallback(
    (value: number) => {
      "worklet";
      const zIndex = interpolate(value, [-1, 0, 1], [-1200, 0, -1200]);

      const rotateY = `${interpolate(
        value,
        [-1, 0, 1],
        [-90, 0, 90],
        Extrapolate.CLAMP
      )}deg`;

      const perspective = 1000;

      const transform = {
        transform: [
          { perspective },
          { rotateY },
          { translateX: value * width },
        ],
      };

      return {
        ...transform,
        zIndex,
      };
    },
    [height, width]
  );

  const [enabled, setEnabled] = useState<boolean>(true);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <ExpoStatusBar style="dark" />
      <Carousel
        width={width}
        height={height - 70 - 49}
        autoPlay
        autoPlayInterval={2000}
        data={[
          {
            description: "Ggg",
            exhibition_id: "f6a5434e-7493-495f-a8ea-132c9973990c",
            nickname: "제구",
            profile_img:
              "https://db3o78f1kbvk.cloudfront.net/test/8c3841c7-f2cf-462e-9ef1-6c6e7bc9ffa4/profile/73a2c744-bd63-4c5d-869a-bbeb7e7137be.jpeg",
            thumbnail:
              "https://db3o78f1kbvk.cloudfront.net/test/8c3841c7-f2cf-462e-9ef1-6c6e7bc9ffa4/photo/4c402a41-643e-4bd4-b00b-2076d537d7b5.jpeg",
            title: "Ggg",
            user_id: "8c3841c7-f2cf-462e-9ef1-6c6e7bc9ffa4",
          },
          {
            description: "Ggg",
            exhibition_id: "f6a5434e-7493-495f-a8ea-132c9973990c",
            nickname: "제구",
            profile_img:
              "https://db3o78f1kbvk.cloudfront.net/test/8c3841c7-f2cf-462e-9ef1-6c6e7bc9ffa4/profile/73a2c744-bd63-4c5d-869a-bbeb7e7137be.jpeg",
            thumbnail:
              "https://db3o78f1kbvk.cloudfront.net/test/8c3841c7-f2cf-462e-9ef1-6c6e7bc9ffa4/photo/4c402a41-643e-4bd4-b00b-2076d537d7b5.jpeg",
            title: "Ggg",
            user_id: "8c3841c7-f2cf-462e-9ef1-6c6e7bc9ffa4",
          },
          {
            description: "Ggg",
            exhibition_id: "f6a5434e-7493-495f-a8ea-132c9973990c",
            nickname: "제구",
            profile_img:
              "https://db3o78f1kbvk.cloudfront.net/test/8c3841c7-f2cf-462e-9ef1-6c6e7bc9ffa4/profile/73a2c744-bd63-4c5d-869a-bbeb7e7137be.jpeg",
            thumbnail:
              "https://db3o78f1kbvk.cloudfront.net/test/8c3841c7-f2cf-462e-9ef1-6c6e7bc9ffa4/photo/4c402a41-643e-4bd4-b00b-2076d537d7b5.jpeg",
            title: "Ggg",
            user_id: "8c3841c7-f2cf-462e-9ef1-6c6e7bc9ffa4",
          },
        ]}
        loop={false}
        snapEnabled={false}
        enabled={enabled}
        overscrollEnabled={false}
        scrollAnimationDuration={1000}
        onProgressChange={(index) => {
          index === 0 || (index === -0 && setEnabled(false));
          console.log(index);
        }}
        customAnimation={animationStyle}
        // onSnapToItem={(index) => console.log("current index:", index)}
        renderItem={({ item, index }) => <Random />}
      />
      <NavBar type={SvgType.Exibition} />
    </SafeAreaView>
  );
};

export default PageExhibition;
