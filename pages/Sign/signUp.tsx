import React, { useState, useRef, useEffect } from "react";

//요소
import {
  Alert,
  Image,
  Text,
  KeyboardAvoidingView,
  View,
  Platform,
  Animated,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import { BigBigLogo } from "../../assets/svg";

import GlobalStyles from "../../assets/styles";

//nav
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const Sign: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start(() => {});
  };

  useEffect(() => {
    startAnimation();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <ExpoStatusBar style="dark" />
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          height: 370,
        }}
      >
        <BigBigLogo />
        <Animated.View style={{ opacity: fadeAnim, marginTop: 15 }}>
          <Text style={{ color: "white", letterSpacing: 2 }}>
            먼저 로그인 해주세요.
          </Text>
        </Animated.View>
      </View>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: "#FFEB00" }}
        >
          <Image
            source={require("../../assets/social_kakao.png")}
            style={styles.buttonIcon}
          />
          <Text style={styles.butotnText}>카카오로 로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: "#45C530" }}
        >
          <Image
            source={require("../../assets/social_naver.png")}
            style={styles.buttonIcon}
          />
          <Text style={styles.butotnText}>네이버로 로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: "#EFF0F1" }}
        >
          <Image
            source={require("../../assets/social_google.png")}
            style={styles.buttonIcon}
          />
          <Text style={styles.butotnText}>구글로 로그인</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Sign;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    width: 285,
    paddingVertical: 13,
    alignItems: "center",
    marginBottom: 24,
    marginTop: 3,
  },
  buttonIcon: {
    width: 40,
    height: 40,
    position: "absolute",
    left: 22,
  },
  butotnText: {
    fontSize: 20,
    marginLeft: 25,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
