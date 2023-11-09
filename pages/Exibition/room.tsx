//3-2
import React, { useState, useRef, useMemo } from "react";

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

//페이지 이동 타입
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Photo: {
    photo_id: string;
  };
};

//화면 넓이 계산 (이미지 넓이에 사용)
const size = Dimensions.get("window").width - 45;

const Room: React.FC = ({ route }: any) => {
  //화면 이동(사진 조회)-------------------------------------------------------------
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  //이미지 높이 계산----------------------------------------------------------
  const [imageHeights, setImageHeights] = useState<Map<string, number>>(
    new Map()
  );

  const handleImageLoaded = (event: any, photo_id: string) => {
    const { width, height } = event.nativeEvent.source;
    const aspectRatio = height / width;
    const calculatedHeight = (size * aspectRatio) / 2;

    setImageHeights((prevHeights) => {
      const newHeights = new Map(prevHeights);
      newHeights.set(photo_id, calculatedHeight);
      return newHeights;
    });
  };

  //전시회 개별 전시실 조회 API----------------------------------------------
  //URL:
  //exhibitions/{exhibition_id}/rooms/{room_id}?size={}&page={}
  //exhibition_id : route.params.exhibition_id
  //room_id : route.params.room_id
  //응답:
  const PhotoDummy = {
    content: [
      {
        photo_id: "1",
        title: "",
        photo: require("../../assets/photodummy1.jpg"),
        user_id: "",
        nickname: "",
      },
      {
        photo_id: "2",
        title: "",
        photo: require("../../assets/photodummy2.jpg"),
        user_id: "",
        nickname: "",
      },
      {
        photo_id: "3",
        title: "",
        photo: require("../../assets/photodummy3.jpg"),
        user_id: "",
        nickname: "",
      },
      {
        photo_id: "4",
        title: "",
        photo: require("../../assets/photodummy4.jpg"),
        user_id: "",
        nickname: "",
      },
      {
        photo_id: "5",
        title: "",
        photo: require("../../assets/photodummy5.jpg"),
        user_id: "",
        nickname: "",
      },
      {
        photo_id: "6",
        title: "",
        photo: require("../../assets/photodummy6.jpg"),
        user_id: "",
        nickname: "",
      },
    ],
  };

  const evenPhotos = PhotoDummy.content.filter((_, index) => index % 2 === 0);
  const oddPhotos = PhotoDummy.content.filter((_, index) => index % 2 !== 0);

  //전시회 개별 전시실 조회 API----------------------------------------------
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={{ flex: 1 }} stickyHeaderIndices={[1]}>
        {/* 맨위 타이틀 시작 */}
        <Text
          style={{
            width: "100%",
            fontSize: 22,
            fontWeight: "500",
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}
        >
          {route.params.exhibition_title}
        </Text>
        {/* 맨위 타이틀 끝 */}
        {/* 방 썸네일 방 제목 방 설명  시작 */}
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 15,
              backgroundColor: "black",
              paddingHorizontal: 20,
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
              <Text style={{ fontSize: 16, color: "white", fontWeight: "500" }}>
                {route.params.room_title}
              </Text>
              <Text style={{ color: "white" }}>
                {route.params.room_description}
              </Text>
            </View>
          </View>
        </>
        {/* 방 썸네일 방 제목 방 설명  끝 */}
        {/* 이미지 랜더링 시작 */}
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            paddingVertical: 20,
            gap: 15,
          }}
        >
          <View>
            {evenPhotos.map((e, i) => {
              return (
                <TouchableOpacity
                  style={{
                    width: size / 2,
                    height: imageHeights.get(e.photo_id),
                    borderRadius: 50,
                    marginBottom: 10,
                  }}
                  key={i}
                  onPress={() => {
                    navigation.navigate("Photo", { photo_id: e.photo_id });
                  }}
                >
                  <Image
                    source={e.photo}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    onLoad={(event) => handleImageLoaded(event, e.photo_id)}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
          <View>
            {oddPhotos.map((e, i) => {
              return (
                <TouchableOpacity
                  style={{
                    width: size / 2,
                    height: imageHeights.get(e.photo_id),
                    borderRadius: 50,
                    marginBottom: 10,
                  }}
                  key={i}
                  onPress={() => {
                    navigation.navigate("Photo", { photo_id: e.photo_id });
                  }}
                >
                  <Image
                    source={e.photo}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    onLoad={(event) => handleImageLoaded(event, e.photo_id)}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        {/* 이미지 랜더링 끝 */}
      </ScrollView>
      <NavBar type={SvgType.Exibition} />
    </SafeAreaView>
  );
};
export default Room;
