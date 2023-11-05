import React from "react";
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
} from "react-native";
import GlobalStyles from "../../assets/styles";

import { ProfilePhoto } from "../../assets/svg";
import { NavBar, SvgType } from "../../components/navbar";

const Exhibition: React.FC = ({ route }: any) => {
  console.log(route.params.exhibition_title);

  //전시회 룸 목록 조회
  //URL: exhibitions/{exhibition_id}/rooms
  //응답:
  // {
  //   rooms: [
  //     {
  //       room_id: "",
  //       title: "",
  //       description: "",
  //       thumnail: "",
  //     },
  //     {
  //       room_id: "",
  //       title: "",
  //       description: "",
  //       thumnail: "",
  //     },
  //   ],
  // };

  const RoomDummy = {
    rooms: [
      {
        room_id: "",
        title: "",
        description: "",
        thumnail: "",
      },
      {
        room_id: "",
        title: "",
        description: "",
        thumnail: "",
      },
    ],
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <ImageBackground
          source={route.params.exhibition_thumbnail}
          style={{ width: "100%", height: 350 }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              paddingHorizontal: 20,
              paddingVertical: 20,
              justifyContent: "space-between",
            }}
          >
            {/* 맨위 제목이랑 pdf다운로드 버튼 포함 수평 뷰 시작 */}
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ gap: 20 }}>
                <Text style={{ fontSize: 30, fontWeight: "600" }}>
                  {route.params.exhibition_title}
                </Text>
                <Text style={{ fontSize: 18, width: 200 }}>
                  {route.params.exhibition_discription}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 12,
                  height: 30,
                  backgroundColor: "black",
                }}
              >
                <Text style={{ fontSize: 14, color: "white" }}>
                  Download Pdf
                </Text>
              </TouchableOpacity>
            </View>
            {/* 맨위 제목이랑 pdf다운로드 버튼 포함 수평 뷰 끝 */}

            {/* 이미지 백그라운드 내 아래쪽 프로필 시작 */}
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                gap: 10,
              }}
            >
              <Image
                source={route.params.profile_img}
                style={{ width: 50, height: 50, borderRadius: 50 }}
              />

              <Text style={{ fontSize: 22, fontWeight: "500" }}>
                {route.params.nickname}
              </Text>
            </View>
            {/* 이미지 백그라운드 내 아래쪽 프로필 끝 */}
          </View>
        </ImageBackground>
      </ScrollView>
      <NavBar type={SvgType.Exibition} />
    </SafeAreaView>
  );
};

export default Exhibition;
