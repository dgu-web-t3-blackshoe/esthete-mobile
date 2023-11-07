//3-2
import React from "react";

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

const Room: React.FC = ({ route }: any) => {
  // 스크롤 위치를 추적하기 위한 상태
  const scrollY = new Animated.Value(0);

  // 헤더가 사라지는 스크롤 위치의 임계값
  const HEADER_THRESHOLD = 100;

  console.log(route.params);
  //전시회 개별 전시실 조회 API----------------------------------------------
  //URL:
  //exhibitions/{exhibition_id}/rooms/{room_id}?size={}&page={}
  //exhibition_id : route.params.exhibition_id
  //room_id : route.params.room_id
  //응답:
  const RoomDummy = {
    content: [
      {
        photo_id: "",
        title: "",
        photo: "",
        user_id: "",
        nickname: "",
      },
      {
        photo_id: "",
        title: "",
        photo: "",
        user_id: "",
        nickname: "",
      },
    ],
  };
  //전시회 개별 전시실 조회 API----------------------------------------------

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Animated.View
        style={{
          height: scrollY.interpolate({
            inputRange: [0, HEADER_THRESHOLD],
            outputRange: [1, 0],
            extrapolate: "clamp",
          }),
          overflow: "hidden",
        }}
      >
        {/* 맨위 타이틀 */}
        <Text
          style={{
            width: "100%",
            paddingHorizontal: 20,
            fontSize: 22,
            fontWeight: "500",
            marginVertical: 15,
          }}
        >
          {route.params.exhibition_title}
        </Text>
      </Animated.View>

      {/* Sticky Header */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: scrollY.interpolate({
            inputRange: [0, HEADER_THRESHOLD],
            outputRange: [0, 1],
            extrapolate: "clamp",
          }),
        }}
      >
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: scrollY.interpolate({
              inputRange: [0, HEADER_THRESHOLD],
              outputRange: [0, 1],
              extrapolate: "clamp",
            }),
          }}
        >
          {/* 여기에 방 썸네일, 방 제목, 방 설명을 넣습니다. */}
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={{ flex: 1 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16} // 스크롤 이벤트가 호출되는 빈도
      >
        {/* 여기에 스크롤 가능한 내용을 넣습니다. */}
      </Animated.ScrollView>

      <NavBar type={SvgType.Exibition} />
    </SafeAreaView>
  );
};

export default Room;
