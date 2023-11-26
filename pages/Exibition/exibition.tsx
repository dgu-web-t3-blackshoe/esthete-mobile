//3-1
import React from "react";
import {
  Image,
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

import { NavBar, SvgType } from "../../components/navbar";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Gallery: undefined;
  Room: {
    exhibition_id: string;
    exhibition_title: string;
    room_id: string;
    room_thumbnail: string;
    room_title: string;
    room_description: string;
  };
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
        title: "영국",
        description:
          "2022-07, London",
        thumnail: require("../../assets/dummy/1.jpg"),
      },
      {
        room_id: "2",
        title: "프랑스",
        description:
          "2022-07, Paris",
          thumnail: require("../../assets/dummy/2.jpg"),
        },
      {
        room_id: "3",
        title: "독일",
        description: "2022-08, Berlin",
        thumnail: require("../../assets/dummy/3.jpg"),
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
        onPress={() => {
          navigation.navigate("Room", {
            exhibition_id: route.params.exhibition_id,
            exhibition_title: route.params.exhibition_title,
            room_id: item.room_id,
            room_thumbnail: item.thumnail,
            room_title: item.title,
            room_description: item.description,
          });
        }}
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
            <View
              style={{
                width: "100%",
                alignItems: "flex-end",
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  gap: 10,
                }}
                onPress={() => navigation.navigate("Gallery")}
              >
                <Image
                  source={route.params.profile_img}
                  style={{ width: 50, height: 50, borderRadius: 50 }}
                />

                <Text
                  style={{ fontSize: 22, fontWeight: "500", color: "white" }}
                >
                  {route.params.nickname}
                </Text>
              </TouchableOpacity>
            </View>
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
