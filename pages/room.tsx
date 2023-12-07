//3-2
import React, { useState } from "react";

//요소
import {
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  View,
  ActivityIndicator as Spinner,
} from "react-native";
import { NavBar, SvgType } from "../components/navbar";

//페이지 이동 타입
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import { SERVER_IP } from "../components/utils";

type RootStackParamList = {
  Photo: {
    photo_id: string;
    user_id: string;
    nickname: string;
  };
  Error: undefined;
};

//화면 넓이 계산 (이미지 넓이에 사용)
const size = Dimensions.get("window").width - 45;

const Room: React.FC = ({ route }: any) => {
  //화면 이동(사진 조회)-------------------------------------------------------------
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useFocusEffect(
    React.useCallback(() => {
      getPhotos();
    }, [])
  );

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

  const [evenPhotos, setEvenPhotos] = useState<any>(null);
  const [oddPhotos, setOddPhotos] = useState<any>(null);

  const getPhotos = async () => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/exhibitions/${route.params.exhibition_id}/rooms/${route.params.room_id}`
      );
      console.log(response.data);
      setEvenPhotos(
        response.data.room_photos.filter(
          (_: any, index: number) => index % 2 === 0
        )
      );
      setOddPhotos(
        response.data.room_photos.filter(
          (_: any, index: number) => index % 2 !== 0
        )
      );
    } catch (e) {
      navigation.replace("Error");
      console.log(e);
    }
  };

  //전시회 개별 전시실 조회 API----------------------------------------------
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {evenPhotos ? (
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
                source={{ uri: route.params.room_thumbnail }}
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
                <Text
                  style={{ fontSize: 16, color: "white", fontWeight: "500" }}
                >
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
              {evenPhotos &&
                evenPhotos?.map((e: any, i: any) => {
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
                        navigation.navigate("Photo", {
                          photo_id: e.photo_id,
                          user_id: e.user_id,
                          nickname: route.params.nickname,
                        });
                      }}
                    >
                      <Image
                        source={{ uri: e.photo }}
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
              {oddPhotos &&
                oddPhotos?.map((e: any, i: any) => {
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
                        navigation.navigate("Photo", {
                          photo_id: e.photo_id,
                          user_id: e.user_id,
                          nickname: route.params.nickname,
                        });
                      }}
                    >
                      <Image
                        source={{ uri: e.photo }}
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

      <NavBar type={SvgType.Any} />
    </SafeAreaView>
  );
};
export default Room;
