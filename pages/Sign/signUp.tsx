import React, { useState, useRef, useEffect } from "react";

//요소
import {
  Image,
  Text,
  View,
  Animated,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import { BigBigLogo } from "../../assets/svg";

//nav
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  SocialLogin: {
    what: string;
    auto: boolean;
  };
};

const Sign: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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

  const [auto, setAuto] = useState<boolean>(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <ExpoStatusBar style="dark" />
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          height: 345,
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
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            width: 285,
            marginBottom: 25,
            paddingLeft: 10,
          }}
          onPress={() => {
            setAuto(!auto);
          }}
        >
          <View
            style={{
              width: 13,
              height: 13,
              backgroundColor: auto ? "#FFA800" : "white",
              borderWidth: 1,
              borderColor: "white",
            }}
          />
          <Text style={{ color: "white", fontSize: 16 }}>자동 로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: "#FFEB00" }}
          onPress={() =>
            navigation.navigate("SocialLogin", {
              what: "kakao",
              auto: auto,
            })
          }
        >
          <Image
            source={require("../../assets/social_kakao.png")}
            style={styles.buttonIcon}
          />
          <Text style={styles.butotnText}>카카오로 로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: "#45C530" }}
          onPress={() =>
            navigation.navigate("SocialLogin", {
              what: "naver",
              auto: auto,
            })
          }
        >
          <Image
            source={require("../../assets/social_naver.png")}
            style={styles.buttonIcon}
          />
          <Text style={styles.butotnText}>네이버로 로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: "#EFF0F1" }}
          onPress={() =>
            navigation.navigate("SocialLogin", {
              what: "google",
              auto: auto,
            })
          }
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
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: "center",
    width: 285,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 23,
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
