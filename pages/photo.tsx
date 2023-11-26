import React, { useState } from "react";

//요소
import {
  Image,
  Text,
  SafeAreaView,
  Dimensions,
  ScrollView,
  View,
} from "react-native";
import GlobalStyles from "../assets/styles";
import { NavBar, SvgType } from "../components/navbar";

//라이브러리
import Swiper from "react-native-swiper";
import MapView, { Marker } from "react-native-maps";

//페이지 이동 타입

const Photo: React.FC = () => {

  //스위퍼 이동 시키는거
  let swiperRef: any = null;
  const goNext = () => {
    if (swiperRef) swiperRef.scrollBy(1, true);
  };
  //<Swiper ref={(ref) => (swiperRef = ref)}>
  //onPress={goNext} 
  //이렇게 사용

  //사진 조회 API--------------------------------------------
  //URL: photos/{photo_id}
  //응답:
  //
  // {
  //   "photo_id" : "",
  //   "user_id" : "",
  //   "photo" : "",
  //   "title" : "",
  //   "dicription" : "",
  //   "longitude" : "",
  //   "latitude" : "",
  //   "state": "",
  //   "city" : "",
  //   "town" : "",
  //   "time": ",
  //   "equipments" : [],
  //   "genre_ids" : []
  //   }
  const PhotoDummy = {
    photo_id: "",
    user_id: "",
    photo: require("../assets/photodummy2.jpg"),
    title: "Memory at Seoul",
    dicription:
      "복무 신조 우리의 결의 하나 나는 국가와 국민에 충성을 다하는 대한민국 국민이다. 둘 까먹음",
    longitude: 139.698212,
    latitude: 35.664035,
    state: "Tokyo-to",
    city: "Shibuya-ku",
    town: "ebisu-3chome",
    time: "2023년 11월 1일 12시 20분",
    equipments: [],
    genre_ids: [],
  };
  //---------------------------------------------

  //userId로 유저 정보 조회 api---------------------
  //URL: users/{user_id}/basic-info
  //응답:
  // {
  //   "user_id" : "",
  //   "profile_img" : "",
  //   "name" : ""
  //   }
  const UserDummy = {
    user_id: "",
    profile_img: "",
    nickname: "Jekoo",
  };
  //------------------------------------------------

  const [imageWidth, setImageWidth] = useState<number>(
    Dimensions.get("window").width - 40
  );
  const [imageHeight, setImageHeight] = useState<number>(0);

  return (
    // (API연결시 랜더링 전 data 있는지 체크 후 랜더링 로직 추가)
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={GlobalStyles.container}>
        {/* 맨 위 제목 시작 */}
        <View
          style={{
            ...GlobalStyles.rowSpaceBetweenContainer,
            marginVertical: 8,
          }}
        >
          <Text style={{ fontSize: 19, fontWeight: "600" }}>
            {PhotoDummy.title}
          </Text>
        </View>
        {/* 맨 위 제목 끝 */}
        {/* 사진 시작 */}
        <View style={{ width: "100%", alignItems: "center" }}>
          <Image
            source={PhotoDummy.photo}
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
                <Text style={{ fontSize: 16 }}>{UserDummy.nickname}</Text>
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
                {PhotoDummy.dicription}
              </Text>
            </View>
          </View>

          {/* 슬라이드2 (위치) */}
          <View>
            <View style={GlobalStyles.rowSpaceBetweenContainer}>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>Location</Text>
              <View style={{ width: 260, borderBottomWidth: 0.8 }}>
                <Text style={{ fontSize: 14 }}>
                  {PhotoDummy.state}, {PhotoDummy.city}, {PhotoDummy.town}
                </Text>
              </View>
            </View>
            <MapView
              scrollEnabled={false}
              style={{ width: "100%", height: 180 }}
              initialRegion={{
                latitude: PhotoDummy.latitude ? PhotoDummy.latitude : 37.557067,
                longitude: PhotoDummy ? PhotoDummy.longitude : 126.971179,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: PhotoDummy ? PhotoDummy.latitude : 37.557067,
                  longitude: PhotoDummy ? PhotoDummy.longitude : 126.971179,
                }}
              />
            </MapView>
          </View>

          {/* 슬라이드3 날짜 etc */}
          <View>
            <View style={GlobalStyles.rowSpaceBetweenContainer}>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>Time</Text>
              <View style={{ width: 230, borderBottomWidth: 0.8 }}>
                <Text style={{ fontSize: 14 }}>{PhotoDummy.time} </Text>
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
                {PhotoDummy.genre_ids}
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
                {PhotoDummy.genre_ids}
              </Text>
            </View>
          </View>
        </Swiper>
        {/* 사진 정보 끝 */}
      </ScrollView>
      <NavBar type={SvgType.Exibition} />
    </SafeAreaView>
  );
};

export default Photo;
