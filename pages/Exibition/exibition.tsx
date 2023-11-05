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

import { NavBar, SvgType } from "../../components/navbar";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
type RootStackParamList = {
  Profile: undefined;
};

const numColumns = 2;
const size = (Dimensions.get("window").width - 56) / numColumns;

const Exhibition: React.FC = ({ route }: any) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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
        room_id: "1",
        title: "방1",
        description: "ABCDEFGHIJKLMNOP",
        thumnail: require("../../assets/photodummy1.jpg"),
      },
      {
        room_id: "2",
        title: "방2",
        description: "어제 원서햄이 룸 얘기한 이후로 룸이란 단어 쫌 그래서",
        thumnail: require("../../assets/photodummy2.jpg"),
      },
      {
        room_id: "3",
        title: "방3",
        description: "어제 원서햄이 룸 얘기해서 일단 방1,2,3으로 더미데이터 짬",
        thumnail: require("../../assets/photodummy2.jpg"),
      },
    ],
  };

  const renderItem = ({ item }: any): React.JSX.Element => {
    return (
      <TouchableOpacity
        style={{
          width: size,
          height: size,
          aspectRatio: 1,
          marginBottom: 16,
        }}
        // onPress={() => {
        //   navigation.navigate("Photo", {
        //     photo_id: item.photo_id,
        //   });
        // }}
      >
        <ImageBackground
          // source={{ uri: item.story }}
          source={item.thumnail}
          style={{ width: "100%", height: "100%" }}
        >
          <View
            style={{
              flex: 1,
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              padding: 15,
              alignItems: "flex-end",
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 20, color: "white", fontWeight: "600" }}>
              {item.title}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "500",
                textAlign: "right",
                width: 100,
                color: "white",
                lineHeight: 20,
              }}
            >
              {item.description}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, backgroundColor: "black" }}>
        <ImageBackground
          source={route.params.exhibition_thumbnail}
          style={{ width: "100%", height: 350 }}
        >
          <View
            style={{
              flex: 1,
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
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
                <Text
                  style={{ fontSize: 30, fontWeight: "600", color: "white" }}
                >
                  {route.params.exhibition_title}
                </Text>
                <Text style={{ fontSize: 18, width: 200, color: "white" }}>
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
            <TouchableOpacity
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                gap: 10,
              }}
              onPress={() => navigation.navigate("Profile")}
            >
              <Image
                source={route.params.profile_img}
                style={{ width: 50, height: 50, borderRadius: 50 }}
              />

              <Text style={{ fontSize: 22, fontWeight: "500", color: "white" }}>
                {route.params.nickname}
              </Text>
            </TouchableOpacity>
            {/* 이미지 백그라운드 내 아래쪽 프로필 끝 */}
          </View>
        </ImageBackground>
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "500",
              color: "white",
              marginVertical: 15,
            }}
          >
            Explore the exhibition room by room
          </Text>
          <FlatList
            data={RoomDummy.rooms}
            renderItem={renderItem}
            keyExtractor={(item) => item.room_id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: 16 }}
            style={{ marginBottom: 30 }}
            // onEndReached={loadMoreData}
          />
        </View>
      </ScrollView>
      <NavBar type={SvgType.Exibition} />
    </SafeAreaView>
  );
};

export default Exhibition;
