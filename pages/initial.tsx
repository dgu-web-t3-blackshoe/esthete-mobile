import React, { useState, useEffect, useRef } from "react";

//요소
import {
  Alert,
  Animated,
  TouchableOpacity,
} from "react-native";
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
  //내 현재 위치 저장
  const dispatch = useDispatch();

  //내 현재 위치 받아오기
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      dispatch(
        setLocation({
          lat: currentLocation.coords.latitude,
          lon: currentLocation.coords.longitude,
        })
      );
      Animated.sequence([
        Animated.timing(fadeAnim1, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigation.navigate("PageExhibition");
      });
    })();
  }, []);
  const fadeAnim1 = useRef(new Animated.Value(0)).current;

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
      <Animated.View style={{ opacity: fadeAnim1 }}>
        <BigLogo />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default InitialPage;


