//3-2
import React, { useState, useRef } from "react";

//요소
import {
  Image,
  Alert,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  ImageBackground,
  View,
  Animated,
} from "react-native";
import { NavBar, SvgType } from "../../components/navbar";

const Room: React.FC = ({ route }: any) => {
  //스크롤 위치에 따라 스타일 조절하기 위한 상태

  console.log(route.params);
  //전시회 개별 전시실 조회 API----------------------------------------------
  //URL:
  //exhibitions/{exhibition_id}/rooms/{room_id}?size={}&page={}
  //exhibition_id : route.params.exhibition_id
  //room_id : route.params.room_id
  //응답:
  const RoomDummy = {
    content: [
      {
        photo_id: "",
        title: "",
        photo: "",
        user_id: "",
        nickname: "",
      },
      {
        photo_id: "",
        title: "",
        photo: "",
        user_id: "",
        nickname: "",
      },
    ],
  };
  //전시회 개별 전시실 조회 API----------------------------------------------
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* 맨위 타이틀 시작 */}
      <Text
        style={{
          width: "100%",
          paddingHorizontal: 20,
          fontSize: 22,
          fontWeight: "500",
          marginVertical: 15,
        }}
      >
        {route.params.exhibition_title}
      </Text>

      {/* 맨위 타이틀 끝 */}
      <ScrollView style={{ flex: 1 }}>
        {/* 방 썸네일 방 제목 방 설명  시작 */}
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Image
            source={route.params.room_thumbnail}
            style={{ width: 100, height: 100 }}
          />
          <View
            style={{
              width: 220,
              height: 100,
              justifyContent: "center",
              paddingHorizontal: 5,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              {route.params.room_title}
            </Text>
            <Text>{route.params.room_description}</Text>
          </View>
        </View>
        {/* 방 썸네일 방 제목 방 설명  끝 */}
        <View>
          <Text style={{ fontSize: 30 }}>11111</Text>
        </View>
        <View>
          <Text style={{ fontSize: 30 }}>11111</Text>
        </View>
        <View>
          <Text style={{ fontSize: 30 }}>11111</Text>
        </View>
        <View>
          <Text style={{ fontSize: 30 }}>11111</Text>
        </View>
        <View>
          <Text style={{ fontSize: 30 }}>11111</Text>
        </View>
        <View>
          <Text style={{ fontSize: 30 }}>11111</Text>
        </View>
        <View>
          <Text style={{ fontSize: 30 }}>11111</Text>
        </View>
        <View>
          <Text style={{ fontSize: 30 }}>11111</Text>
        </View>
        <View>
          <Text style={{ fontSize: 30 }}>11111</Text>
        </View>
        <View>
          <Text style={{ fontSize: 30 }}>11111</Text>
        </View>
        <View>
          <Text style={{ fontSize: 30 }}>11111</Text>
        </View>
        <View>
          <Text style={{ fontSize: 30 }}>11111</Text>
        </View>
        <View>
          <Text style={{ fontSize: 30 }}>11111</Text>
        </View>
        <View>
          <Text style={{ fontSize: 30 }}>11111</Text>
        </View>
        <View>
          <Text style={{ fontSize: 30 }}>11111</Text>
        </View>
        <View>
          <Text style={{ fontSize: 30 }}>11111</Text>
        </View>
        <View>
          <Text style={{ fontSize: 30 }}>11111</Text>
        </View>
        <View>
          <Text style={{ fontSize: 30 }}>11111</Text>
        </View>
        <View>
          <Text style={{ fontSize: 30 }}>11111</Text>
        </View>
        <View>
          <Text style={{ fontSize: 30 }}>11111</Text>
        </View>
      </ScrollView>
      <NavBar type={SvgType.Exibition} />
    </SafeAreaView>
  );
};
export default Room;
