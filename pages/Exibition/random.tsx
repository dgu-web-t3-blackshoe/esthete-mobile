//3-1
import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ImageBackground,
  View,
  ActivityIndicator as Spinner,
} from "react-native";


//navigation
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

//api
import axios from "axios";
import { SERVER_IP } from "../../components/utils";

type RootStackParamList = {
  Gallery: {
    user_id: string;
  };
  Room: {
    exhibition_id: string;
    exhibition_title: string;
    room_id: string;
    room_thumbnail: string;
    room_title: string;
    room_description: string;
    nickname: string;
  };
  MyGallery: undefined;
};

const numColumns = 2;
const size = (Dimensions.get("window").width - 56) / numColumns;

const Random: React.FC = ({
  exhibition_id,
  title,
  description,
  thumbnail,
  profile_img,
  nickname,
  user_id,
}: any) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [exhibitionData, setExhibitionData] = useState<any>(null);

  useEffect(() => {
    setExhibitionData({
      exhibition_id,
      title,
      description,
      thumbnail,
      profile_img,
      nickname,
      user_id,
    });
  }, []);

  useEffect(() => {
    if (exhibitionData !== null) {
      getRooms();
    }
  }, [exhibitionData]);


  const [roomData, setRoomData] = useState<any>(null);
  const getRooms = async () => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/exhibitions/${exhibitionData.exhibition_id}/rooms`
      );
      setRoomData(response.data.rooms);
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({ item }: any): React.JSX.Element => {
    return (
      <View
        style={{
          width: size,
          height: size,
          aspectRatio: 1,
          marginBottom: 16,
        }}
        // onPress={() => {
        //   navigation.push("Room", {
        //     exhibition_id: exhibitionData.exhibition_id,
        //     exhibition_title: exhibitionData.title,
        //     room_id: item.room_id,
        //     room_thumbnail: item.thumbnail,
        //     room_title: item.title,
        //     room_description: item.description,
        //     nickname: exhibitionData.nickname,
        //   });
        // }}
      >
        <ImageBackground
          source={{ uri: item.thumbnail }}
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
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {exhibitionData ? (
        <View
          style={{ flex: 1, backgroundColor: "black" }}
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          // }
        >
          <ImageBackground
            source={{ uri: exhibitionData.thumbnail }}
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
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ gap: 20 }}>
                  <Text
                    style={{ fontSize: 30, fontWeight: "600", color: "white" }}
                  >
                    {exhibitionData.title}
                  </Text>
                  <Text style={{ fontSize: 18, width: 200, color: "white" }}>
                    {exhibitionData.description}
                  </Text>
                </View>
              </View>
              {/* 맨위 제목이랑 pdf다운로드 버튼 포함 수평 뷰 끝 */}

              {/* 이미지 백그라운드 내 아래쪽 프로필 시작 */}
              <View
                style={{
                  width: "100%",
                  alignItems: "flex-end",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    gap: 10,
                  }}
                >
                  {exhibitionData.profile_img === "" ? (
                    <Image
                      source={require("../../assets/default_profile.png")}
                      style={{ width: 50, height: 50, borderRadius: 50 }}
                    />
                  ) : (
                    <Image
                      source={{ uri: exhibitionData.profile_img }}
                      style={{ width: 50, height: 50, borderRadius: 50 }}
                    />
                  )}

                  <Text
                    style={{ fontSize: 22, fontWeight: "500", color: "white" }}
                  >
                    {exhibitionData.nickname}
                  </Text>
                </View>
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
            {roomData ? (
              <FlatList
                data={roomData}
                renderItem={renderItem}
                keyExtractor={(item) => item.room_id}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={{ gap: 16 }}
                style={{ marginBottom: 30 }}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "black",
                }}
              >
                <Spinner size="large" color="white" />
              </View>
            )}
          </View>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "black",
          }}
        >
          <Spinner size="large" color="white" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Random;
