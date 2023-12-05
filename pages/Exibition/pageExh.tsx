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
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

import { NavBar, SvgType } from "../../components/navbar";
import {
  GenreArray,
  getGenreKeyByValue,
  getGenreValueByKey,
} from "../../components/constants";
import GlobalStyles from "../../assets/styles";

const PageExhibition: React.FC = () => {
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const animationStyle: any = React.useCallback(
    (value: number) => {
      "worklet";
      const zIndex = interpolate(value, [-1, 0, 1], [-1000, 0, -1000]);

      const rotateY = `${interpolate(
        value,
        [-1, 0, 1],
        [-90, 0, 90],
        Extrapolate.CLAMP
      )}deg`;

      const perspective = 850;

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

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        loop
        width={width}
        height={height}
        style={{ backgroundColor: "white" }}
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
        ]}
        scrollAnimationDuration={1000}
        customAnimation={animationStyle}
        onSnapToItem={(index) => console.log("current index:", index)}
        renderItem={({ item, index }) => (
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              justifyContent: "center",
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 30 }}>
              {item.nickname}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default PageExhibition;
