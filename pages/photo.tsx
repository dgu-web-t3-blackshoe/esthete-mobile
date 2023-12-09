import React, { useState, useEffect } from "react";

//요소
import {
  Image,
  Text,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Modal,
  Alert,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  View,
  ActivityIndicator as Spinner,
} from "react-native";
import GlobalStyles from "../assets/styles";
import { NavBar, SvgType } from "../components/navbar";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/Ionicons";

//라이브러리
import Swiper from "react-native-swiper";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

//Redux
import { useSelector } from "react-redux";
import { State } from "../storage/reducers";

//api
import axios from "axios";
import { SERVER_IP } from "../components/utils";

//페이지 이동 타입
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Error: undefined;
};

const Photo: React.FC = ({ route }: any) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  //리덕스 유저 아이디 가져오기
  const userId = useSelector((state: State) => state.USER);
  //사진 조회 API--------------------------------------------
  useEffect(() => {
    getPhotoData();
  }, []);
  const [photoData, setPhotoData] = useState<any>(null);
  const getPhotoData = async () => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/photos/${route.params.photo_id}`
      );
      setPhotoData(response.data);
    } catch (e) {
      console.log(e);
      navigation.replace("Error");
    }
  };
  //------------------------------------------------

  const [imageWidth, setImageWidth] = useState<number>(
    Dimensions.get("window").width - 40
  );
  const [imageHeight, setImageHeight] = useState<number>(0);

  //사진 신고
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [report, setReport] = useState<string>("");
  const reportPhoto = async () => {
    try {
      await axios.post(`${SERVER_IP}core/abusing-reports/photos`, {
        photo_id: route.params.photo_id,
        reason: report,
        user_id: userId,
      });
      setIsModalVisible(false);
      setReport("");
      Alert.alert(
        "신고 완료",
        "사진을 신고하였습니다.",
        [
          {
            text: "cancel",
          },
          {
            text: "OK",
          },
        ],
        { cancelable: true }
      );
    } catch (e) {
      Alert.alert(
        "실패",
        "네트워크 환경을 확인하세요.",
        [
          {
            text: "cancel",
          },
          {
            text: "OK",
          },
        ],
        { cancelable: true }
      );

      console.log(e);
    }
  };

  return (
    // (API연결시 랜더링 전 data 있는지 체크 후 랜더링 로직 추가)
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ExpoStatusBar style="dark" />
        {photoData ? (
          <ScrollView style={GlobalStyles.container}>
            {/* 맨 위 제목 시작 */}
            <View
              style={{
                ...GlobalStyles.rowSpaceBetweenContainer,
                marginVertical: 8,
              }}
            >
              <Text style={{ fontSize: 19, fontWeight: "600" }}>
                {photoData?.title}
              </Text>
              {route.params.user_id !== userId && (
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "알림",
                      "사진을 신고하시겠습니까??",
                      [
                        {
                          text: "취소",
                          onPress: () => null,
                          style: "cancel",
                        },
                        {
                          text: "확인",
                          onPress: () => {
                            setIsModalVisible(true);
                          },
                        },
                      ],
                      { cancelable: false }
                    );
                  }}
                >
                  <Icon name="notifications-sharp" size={23} color={"black"} />
                </TouchableOpacity>
              )}
            </View>
            {/* 맨 위 제목 끝 */}
            {/* 사진 시작 */}
            <View style={{ width: "100%", alignItems: "center" }}>
              {photoData ? (
                <Image
                  source={{ uri: photoData.photo_url.cloudfront_url }}
                  style={{
                    width: imageWidth,
                    height: imageHeight,
                  }}
                  resizeMode="contain"
                  onLoad={(e) => {
                    const originalWidth = e.nativeEvent.source.width;
                    const originalHeight = e.nativeEvent.source.height;
                    setImageHeight(
                      (imageWidth * originalHeight) / originalWidth
                    );
                  }}
                />
              ) : null}
            </View>
            {/* 사진 끝 */}
            {/* 사진 정보 시작 */}
            <Swiper
              style={{ height: 280, marginVertical: 8 }}
              activeDotColor="black"
              dotColor="white"
              dotStyle={{
                width: 13,
                height: 13,
                borderRadius: 50,
                borderWidth: 0.8,
                borderColor: "black",
              }}
              activeDotStyle={{
                width: 13,
                height: 13,
                borderRadius: 50,
                borderColor: "black",
              }}
            >
              {/* 슬라이드1 정보 */}
              <View>
                <View style={GlobalStyles.rowSpaceBetweenContainer}>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    Photographer
                  </Text>
                  <View style={{ width: 235, borderBottomWidth: 0.8 }}>
                    <Text style={{ fontSize: 16 }}>
                      {route.params.nickname}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    Description
                  </Text>
                  <Text
                    style={{
                      borderWidth: 0.8,
                      padding: 15,
                      lineHeight: 20,
                      marginVertical: 10,
                      height: 150,
                    }}
                  >
                    {photoData ? photoData.description : null}
                  </Text>
                </View>
              </View>

              {/* 슬라이드2 (위치) */}
              <View>
                <View style={GlobalStyles.rowSpaceBetweenContainer}>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    Location
                  </Text>
                  <View style={{ width: 260, borderBottomWidth: 0.8 }}>
                    <Text style={{ fontSize: 14 }}>
                      {photoData.photo_location.state},{" "}
                      {photoData.photo_location.city},{" "}
                      {photoData.photo_location.town}
                    </Text>
                  </View>
                </View>
                <MapView
                  scrollEnabled={false}
                  style={{ width: "100%", height: 180 }}
                  initialRegion={{
                    latitude: photoData?.photo_location.latitude
                      ? photoData.photo_location.latitude
                      : 37.557067,
                    longitude: photoData?.photo_location.longitude
                      ? photoData.photo_location.longitude
                      : 126.971179,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                  provider={PROVIDER_GOOGLE}
                >
                  <Marker
                    coordinate={{
                      latitude: photoData?.photo_location.latitude
                        ? photoData?.photo_location.latitude
                        : 37.557067,
                      longitude: photoData?.photo_location.longitude
                        ? photoData?.photo_location.longitude
                        : 126.971179,
                    }}
                  />
                </MapView>
              </View>

              {/* 슬라이드3 날짜 etc */}
              <View>
                <View style={GlobalStyles.rowSpaceBetweenContainer}>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>Time</Text>
                  <View style={{ width: 230, borderBottomWidth: 0.8 }}>
                    <Text style={{ fontSize: 14 }}>{photoData.time} </Text>
                  </View>
                </View>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    Genres
                  </Text>
                  <Text
                    style={{
                      borderWidth: 0.8,
                      padding: 15,
                      lineHeight: 20,
                      marginVertical: 10,
                      height: 50,
                    }}
                  >
                    {/* {photoData.genre_ids.map((e: string, i: any) => {
                    return getGenreKeyByValue(e) + ", ";
                  })} */}
                    {photoData.genres.map((e: any, i: any) => {
                      return `${e.genre_name}, `;
                    })}
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    Equipments
                  </Text>
                  <Text
                    style={{
                      borderWidth: 0.8,
                      padding: 15,
                      lineHeight: 20,
                      marginVertical: 10,
                      height: 50,
                    }}
                  >
                    {photoData.equipments}
                  </Text>
                </View>
              </View>
            </Swiper>
            {/* 사진 정보 끝 */}
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

        {/* 신고 모달 시작 */}
        <Modal
          animationType="none"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                paddingTop: 20,
                paddingBottom: 25,
                paddingHorizontal: 10,
                gap: 15,
                width: 300,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "500" }}>신고 접수</Text>
              <TextInput
                style={{
                  borderColor: "gray",
                  borderWidth: 1,
                  paddingHorizontal: 10,
                  width: "100%",
                  height: 200,
                  backgroundColor: "white",
                }}
                multiline
                value={report}
                placeholder="신고 사유를 작성하세요."
                onChangeText={(text) => setReport(text)}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "white",
                width: 300,
                borderTopWidth: 0.5,
              }}
            >
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  borderRightWidth: 0.5,
                  width: 140,
                  paddingVertical: 10,
                }}
                onPress={() => {
                  setIsModalVisible(false);
                  setReport("");
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "500" }}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 10,
                  width: 140,
                }}
                onPress={() => {
                  if (report === "") {
                    Alert.alert(
                      "경고",
                      "입력을 완료해주세요.",
                      [
                        {
                          text: "OK",
                        },
                      ],
                      { cancelable: true }
                    );
                  } else {
                    reportPhoto();
                  }
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "500",
                    color: report === "" ? "#c9c9c9" : "black",
                  }}
                >
                  확인
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* 신고 모달 끝 */}

        <NavBar type={SvgType.Any} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Photo;
