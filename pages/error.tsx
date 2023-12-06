import React from "react";

//요소
import { Text, TouchableOpacity, View, SafeAreaView } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

//페이지 이동 타입
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { NavBar, SvgType } from "../components/navbar";

type RootStackParamList = {
  InitialPage: undefined;
};

const Error: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ExpoStatusBar style="dark" />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "500" }}>
          네트워크 오류가 발생 했습니다.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "black",
            borderRadius: 50,
            paddingHorizontal: 20,
            paddingVertical: 10,
            marginTop: 40,
          }}
          onPress={() => navigation.replace("InitialPage")}
        >
          <Text style={{ color: "white", fontSize: 18 }}>앱 재시작</Text>
        </TouchableOpacity>
      </View>
      <NavBar type={SvgType.Any} />
    </SafeAreaView>
  );
};

export default Error;
