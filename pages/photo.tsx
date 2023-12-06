import React, { useState, useEffect } from "react";

//요소
import {
  Image,
  Text,
  SafeAreaView,
  Dimensions,
  ScrollView,
  View,
  ActivityIndicator as Spinner,
} from "react-native";
import GlobalStyles from "../assets/styles";
import { NavBar, SvgType } from "../components/navbar";

//라이브러리
import Swiper from "react-native-swiper";
import MapView, { Marker } from "react-native-maps";

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

  return (
    // (API연결시 랜더링 전 data 있는지 체크 후 랜더링 로직 추가)
    <SafeAreaView style={{ flex: 1 }}>
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
                  setImageHeight((imageWidth * originalHeight) / originalWidth);
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
                  <Text style={{ fontSize: 16 }}>{route.params.nickname}</Text>
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
                <Text style={{ fontSize: 16, fontWeight: "500" }}>Genres</Text>
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
      <NavBar type={SvgType.Exibition} />
    </SafeAreaView>
  );
};

export default Photo;
