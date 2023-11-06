import React from "react";

//요소
import {
  Image,
  Alert,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { NavBar, SvgType } from "../../components/navbar";
import GlobalStyles from "../../assets/styles";

const DarkRoom: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* 맨 위 Dark Room 글자랑 Publish 버튼 뷰 시작 */}
      <View
        style={{
          ...GlobalStyles.rowSpaceBetweenContainer,
          backgroundColor: "white",
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "500",
          }}
        >
          Dark Room
        </Text>
        <TouchableOpacity style={GlobalStyles.backgroundBlackBox}>
          <Text
            style={{
              fontSize: 17,
              color: "white",
            }}
          >
            Support
          </Text>
        </TouchableOpacity>
      </View>
      {/* 맨 위 Dark Room 글자랑 Publish 버튼 뷰 끝 */}

      {/* 아래쪽 전부 시작 */}
      <ScrollView style={{ flex: 1, backgroundColor: "black" }}></ScrollView>
      {/* 아래쪽 전부 끝 */}

      <NavBar type={SvgType.DarkRoom} />
    </SafeAreaView>
  );
};
export default DarkRoom;
