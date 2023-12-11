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
  ScrollView,
  ImageBackground,
  View,
  Alert,
  RefreshControl,
  ActivityIndicator as Spinner,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

//Redux
import { useSelector } from "react-redux";
import { State } from "../storage/reducers";

//navigation
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as FileSystem from "expo-file-system";

import { useFocusEffect } from "@react-navigation/native";

//api
import axios from "axios";
import { SERVER_IP } from "../components/utils";

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
  Error: undefined;
};

const numColumns = 2;
const size = (Dimensions.get("window").width - 56) / numColumns;

const Exhibition: React.FC = ({ route }: any) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [exhibitionData, setExhibitionData] = useState<any>(null);

  //리덕스 유저 아이디 가져오기`
  const userId = useSelector((state: State) => state.USER);
  useEffect(() => {
    setExhibitionData(route.params);
  }, []);

  useEffect(() => {
    if (exhibitionData !== null) {
      getRooms();
      postView();
    }
  }, [exhibitionData]);

  //전시회 조회 등록

  const postView = async () => {
    try {
      await axios.post(
        `${SERVER_IP}core/exhibitions/${exhibitionData.exhibition_id}/users/${userId}`
      );
    } catch (e) {
      navigation.replace("Error");
      console.log(e);
    }
  };

  const getRandom = async () => {
    try {
      const response = await axios.get(`${SERVER_IP}core/exhibitions/random`);
      setExhibitionData(response.data);
    } catch (e) {
      navigation.replace("Error");
      console.log(e);
    }
  };

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

  const deleteExhibition = async () => {
    try {
      await axios.delete(
        `${SERVER_IP}core/exhibitions/${exhibitionData.exhibition_id}`
      );
      Alert.alert(
        "완료",
        "전시회를 삭제하였습니다.",
        [
          {
            text: "취소",
          },
          {
            text: "확인",
          },
        ],
        { cancelable: true }
      );

      navigation.navigate("MyGallery");
    } catch (e) {
      console.log(e);
    }
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
          navigation.push("Room", {
            exhibition_id: exhibitionData.exhibition_id,
            exhibition_title: exhibitionData.title,
            room_id: item.room_id,
            room_thumbnail: item.thumbnail,
            room_title: item.title,
            room_description: item.description,
            nickname: exhibitionData.nickname,
          });
        }}
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
      </TouchableOpacity>
    );
  };

  const makePdf = async () => {
    try {
      // const fileUri = FileSystem.documentDirectory + "myExhibition.pdf";
      // const downloadResumable = FileSystem.createDownloadResumable(
      //   `https://api.esthete.roberniro-projects.xyz/core/exhibitions/${exhibitionData.exhibition_id}/pdf`,
      //   fileUri
      // );

      // const { uri } = await downloadResumable.downloadAsync();
      // console.log("File has been downloaded to:", uri);

      // Alert.alert(
      //   "완료",
      //   "PDF를 다운로드 했습니다. 파일 경로: " + uri,
      //   [{ text: "OK" }],
      //   { cancelable: true }
      // );
    } catch (e) {
      console.log("Download Error:", e);
    }
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setRoomData(null);
    getRandom();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ExpoStatusBar style="dark" />

      {exhibitionData ? (
        <ScrollView
          style={{ flex: 1, backgroundColor: "black" }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
                {exhibitionData && userId === exhibitionData.user_id ? (
                  <>
                    <TouchableOpacity
                      style={{
                        marginRight: 5,
                        alignItems: "center",
                      }}
                      onPress={() => {
                        Alert.alert(
                          "확인",
                          "전시회를 삭제하시겠습니까?",
                          [
                            {
                              text: "취소",
                              onPress: () => null,
                              style: "cancel",
                            },
                            {
                              text: "확인",
                              onPress: () => deleteExhibition(),
                            },
                          ],
                          { cancelable: false }
                        );
                      }}
                    >
                      <Icon name="trash-outline" size={25} color={"#fff"} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 12,
                        height: 30,
                        backgroundColor: "black",
                      }}
                      onPress={makePdf}
                    >
                      <Text style={{ fontSize: 14, color: "white" }}>
                        Download Pdf
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : null}
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
                  onPress={() => {
                    if (userId === exhibitionData.user_id) {
                      navigation.push("MyGallery");
                    } else {
                      navigation.push("Gallery", {
                        user_id: exhibitionData.user_id,
                      });
                    }
                  }}
                >
                  {exhibitionData.profile_img === "" ? (
                    <Image
                      source={require("../assets/default_profile.png")}
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
        </ScrollView>
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

export default Exhibition;
