import React, {  useEffect, useRef } from "react";

//요소
import { Alert, Animated, TouchableOpacity } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import { BigLogo } from "../assets/svg";

//라이브러리
import * as Location from "expo-location";

//Redux
import { useDispatch } from "react-redux";
import { setLocation } from "../storage/actions";

//네비게이션
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Gallery: undefined;
  Box: undefined;
  Exhibition: undefined;
  PageExhibition: undefined;
};

// 앱이 시작하면 현재 위치를 전역 상태로 관리할 생각
const InitialPage: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      getLocation();
    });
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      return;
    }

    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      dispatch(
        setLocation({
          lat: currentLocation.coords.latitude,
          lon: currentLocation.coords.longitude,
        })
      );
      navigation.navigate("PageExhibition");
    } catch (error) {
      setTimeout(startAnimation, 2000);
    }
  };
  useEffect(() => {
    startAnimation();
  }, []);

  return (
    <TouchableOpacity
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
      onPress={() => navigation.navigate("PageExhibition")}
    >
      <ExpoStatusBar style="light" />
      <Animated.View style={{ opacity: fadeAnim }}>
        <BigLogo />
      </Animated.View>
    </TouchableOpacity>
  );
};
export default InitialPage;
