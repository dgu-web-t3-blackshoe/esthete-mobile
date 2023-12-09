import React, { useRef } from "react";

//요소
import { Alert, Animated, View } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import { BigLogo } from "../assets/svg";

//라이브러리
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Redux
import { useDispatch } from "react-redux";
import { setLocation, setUserId } from "../storage/actions";

//네비게이션
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Gallery: undefined;
  Sign: undefined;
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
      checkAuto();
    } catch (error) {
      setTimeout(startAnimation, 2000);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      startAnimation();
    }, [])
  );

  const checkAuto = async () => {
    const userId = await AsyncStorage.getItem("user_id");
    if (userId) {
      dispatch(setUserId(userId));

      //======================================================================================
      //나중에 PageExhibiton으로 변경 필요
      navigation.navigate("PageExhibition");
    } else {
      navigation.navigate("Sign");
    }
  };

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <ExpoStatusBar style="light" />
      <Animated.View style={{ opacity: fadeAnim }}>
        <BigLogo />
      </Animated.View>
    </View>
  );
};
export default InitialPage;
