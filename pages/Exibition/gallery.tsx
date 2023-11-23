//1-1 1-2 1-3
import React, { useState, useRef, useEffect } from "react";

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
  ImageBackground,
  ScrollView,
  View,
  TextInput,
  Animated,
  PanResponder,
} from "react-native";

//libs
import Icon from "react-native-vector-icons/Ionicons";
import { Modalize } from "react-native-modalize";
import { NavBar, SvgType } from "../../components/navbar";

//assets
import { ProfilePhoto } from "../../assets/svg";
import GlobalStyles from "../../assets/styles";

//사진 랜더링 시 필요한 width 계산
const numColumns = 3;
const size = (Dimensions.get("window").width - 40) / numColumns;

//페이지 이동 타입
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Photo: {
    photo_id: string;
  };
  Exhibition: {
    exhibition_id: string;
    exhibition_title: string;
    exhibition_discription: string;
    exhibition_thumbnail: string;
    user_id: string;
    profile_img: string;
    nickname: string;
  };
};

//FunctionComponents
const Gallery: React.FC = ({ route }: any) => {
  //라우트.파람스가 있는지 봐서 데이터 확인

  //화면 이동(사진 조회)
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  //좌우 제스처
  // const pan = useRef(new Animated.ValueXY()).current;

  // const panResponder = useRef(
  //   PanResponder.create({
  //     onMoveShouldSetPanResponder: (evt, gestureState) => {
  //       const isHorizontalSwipe =
  //         Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
  //       console.log("Swipe Detected:", isHorizontalSwipe);
  //       return isHorizontalSwipe;
  //     },
  //     onPanResponderRelease: (evt, gestureState) => {
  //       if (gestureState.dx > 0) {
  //         console.log("Right Swipe");
  //         // 오른쪽 스와이프 시 실행할 함수
  //       } else {
  //         console.log("Left Swipe");
  //         // 왼쪽 스와이프 시 실행할 함수
  //       }
  //     },
  //   })
  // ).current;

  //좌우 제스처 2
  const rotate = useRef(new Animated.Value(0)).current; // 회전 상태
  const rotateInterpolate = rotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-360deg", "360deg"],
  });
  console.log("render");

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderMove: (evt, gestureState) => {
        // 스와이프에 따라 회전값 조정
        rotate.setValue(gestureState.dx / 1000);
        // 회전 속도 조정
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          Animated.spring(rotate, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  //방명록 모달
  const GuestBookModal = useRef<Modalize>(null);
  const openModal = () => GuestBookModal.current?.open();
  const closeModal = () => GuestBookModal.current?.close();

  //추천 전시회 기본 정보 조회
  //URL
  //exhibitions/recommended
  //더미:
  const RecommendedData = {
    exhibition_id: "",
    title: "",
    discription: "",
    thumbnail: "",
    user_id: "",
  };

  //전시회 업로더 프로필 조회
  //URL: users/{gallery_user_id}/profile (get)
  //gallery_user_id: RecommendedData.user_id
  //응답:
  // {
  //   "user_id" : "",
  //   "profile_img" : "",
  //   "nickname" : "",
  //   "biography" : "",
  //   "genres" : [],
  //   "equipments" : []
  //   }
  //더미:
  const userDataDummy = {
    user_id: "",
    profile_img: require("../../assets/profiledummy.jpg"),
    nickname: "Jekoo",
    biography:
      "나는 자랑스러운 태극기 앞에 자유롭고 정의로운 대한민국의 무궁한 영광을 위하여 충성을 다할 것을 굳게 맹세합니다.",
    genres: ["장르1", "장르2", "장르3"],
    equipments: ["무한의 대검", "도란의 검"],
  };

  // 업로더 현재 전시회 정보 조회
  //URL: users/{gallery_user_id}/exhibition/current (get)
  //gallery_user_id는 RecommendedData.user_id
  //응답:
  // {
  //   "exhibition_id" : "",
  //   "exhibition_title" : "",
  //   "exhibition_discription" : "",
  //   "exhibition_thumbnail" : ""
  //   }
  const currentExibitionDummy = {
    exhibition_id: "asdf",
    exhibition_title: "Memory",
    exhibition_discription: "2023-10 ~ 2023-11 Memories",
    exhibition_thumbnail: require("../../assets/currentExibition.jpg"),
  };

  // 전시회 사진 받아오기
  //URL:  users/{gallery_user_id}/photos (get)
  //gallery_user_id는 RecommendedData.user_id
  //응답:
  // {
  //   "content": [
  //   {
  //   "photo_id" : "",
  //   "title" : "",
  //   "photo" : "",
  //   "user_id" : "",
  //   "nickname" : "",
  //   "created_at" : ""
  //   },
  //   {
  //   "photo_id" : "",
  //   "title" : "",
  //   "photo" : "",
  //   "user_id" : "",
  //   "nickname" : "",
  //   "created_at" : ""
  //   }
  //   ]
  //   }
  //더미:
  const photoListDummy = {
    content: [
      {
        photo_id: "1",
        title: "Love",
        photo: require("../../assets/photodummy1.jpg"),
        user_id: "",
        nickname: "",
        created_at: "",
      },
      {
        photo_id: "2",
        title: "",
        photo: require("../../assets/photodummy2.jpg"),
        user_id: "",
        nickname: "",
        created_at: "",
      },
      {
        photo_id: "3",
        title: "",
        photo: require("../../assets/photodummy3.jpg"),
        user_id: "",
        nickname: "",
        created_at: "",
      },
      {
        photo_id: "4",
        title: "",
        photo: require("../../assets/photodummy4.jpg"),
        user_id: "",
        nickname: "",
        created_at: "",
      },
      {
        photo_id: "5",
        title: "",
        photo: require("../../assets/photodummy5.jpg"),
        user_id: "",
        nickname: "",
        created_at: "",
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
        }}
        onPress={() => {
          navigation.navigate("Photo", {
            photo_id: item.photo_id,
          });
        }}
      >
        <ImageBackground
          // source={{ uri: item.story }}
          source={item.photo}
          style={{ width: "100%", height: "100%" }}
        >
          {/* <View
            style={{
              flex: 1,
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          /> */}
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  //구독 완료 전송 함수
  const submitSupport = () => {
    Alert.alert(
      "완료",
      "구독을 완료하였습니다.",
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
  };

  //Guest Book Modal Header-----------------------------------------------
  const GuestBooKModalHeader = (): React.JSX.Element => {
    return (
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            paddingHorizontal: 20,
            paddingVertical: 15,
            fontSize: 20,
            fontWeight: "500",
          }}
        >
          Guest Book
        </Text>
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 20,
          }}
        >
          <TextInput
            style={{
              paddingLeft: 20,
              width: 260,
              backgroundColor: "white",
              borderWidth: 0.8,
            }}
            placeholder="방명록을 입력하세요."
          />
          <TouchableOpacity
            style={{
              width: size * numColumns - 260,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "black",
            }}
          >
            <Text style={{ color: "white", fontWeight: "500" }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  //Guest Book Modal Header 끝-----------------------------------------------

  //방명록 조회
  //URL:
  //users/{gallery_user_id}/guest-books
  //gallery_user_id는 RecommendedData.user_id
  //더미:
  const GuestBookDummy = {
    content: [
      {
        guest_book_id: "1",
        photographer_id: "1",
        user_id: "",
        nickname: "Rio",
        content: "오하요~~",
        created_at: "2024-01-01",
        profile_img: require("../../assets/photodummy1.jpg"),
      },
      {
        guest_book_id: "2",
        photographer_id: "2",
        user_id: "",
        nickname: "HK",
        content: "안녕",
        created_at: "2023-10-11",
        profile_img: require("../../assets/photodummy2.jpg"),
      },
      {
        guest_book_id: "3",
        photographer_id: "3",
        user_id: "",
        nickname: "Lina",
        content: "좋은 사진 감사해요!",
        created_at: "2023-10-10",
        profile_img: require("../../assets/photodummy3.jpg"),
      },
      {
        guest_book_id: "4",
        photographer_id: "4",
        user_id: "",
        nickname: "Jun",
        content: "멋진 경험이었습니다!",
        created_at: "2023-10-09",
        profile_img: require("../../assets/photodummy4.jpg"),
      },
      {
        guest_book_id: "5",
        photographer_id: "5",
        user_id: "",
        nickname: "Chris",
        content: "다음에 또 올게요.",
        created_at: "2023-10-08",
        profile_img: require("../../assets/photodummy5.jpg"),
      },
      {
        guest_book_id: "6",
        photographer_id: "1",
        user_id: "",
        nickname: "Alex",
        content: "정말 기억에 남는 시간이었어요.",
        created_at: "2023-10-07",
        profile_img: require("../../assets/photodummy6.jpg"),
      },
      {
        guest_book_id: "7",
        photographer_id: "2",
        user_id: "",
        nickname: "Sam",
        content: "훌륭한 서비스에 감동받았습니다.",
        created_at: "2023-10-06",
        profile_img: require("../../assets/photodummy2.jpg"),
      },
    ],
  };

  return (
    // (API연결시 랜더링 전 data 있는지 체크 후 랜더링 로직 추가)
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          {
            flex: 1,
          },
          {
            transform: [{ perspective: 1000 }, { rotateY: rotateInterpolate }],
          },
        ]}
      >
        {/* 1-1 맨 위 A's Gallery, Support Button 시작*/}
        <View
          style={{
            ...GlobalStyles.rowSpaceBetweenContainer,
            backgroundColor: "white",
            paddingHorizontal: 20,
          }}
        >
          <Text style={GlobalStyles.bigFont}>
            {userDataDummy.nickname}'s Gallery
          </Text>
          <TouchableOpacity
            onPress={submitSupport}
            style={GlobalStyles.backgroundBlackBox}
          >
            <Text
              style={{
                fontSize: 17,
                color: "white",
              }}
            >
              Support
            </Text>
          </TouchableOpacity>
        </View>
        {/* 1-1 맨 위 A's Gallery, Support Button 끝*/}

        <ScrollView
          {...panResponder.panHandlers}
          style={{ ...GlobalStyles.container, backgroundColor: "black" }}
        >
          {/* 1-1 프로필 사진, Biography, 방명록 아이콘 시작*/}
          <View
            style={{
              ...GlobalStyles.rowSpaceBetweenContainer,
              alignItems: "flex-start",
              marginTop: 15,
            }}
          >
            <View style={{ backgroundColor: "#E3E3E3" }}>
              <ProfilePhoto />
            </View>

            {/* <Image source={{ uri: userDataDummy.profile_img }} /> */}
            <Text style={{ width: 130, color: "white" }}>
              {userDataDummy.biography}
            </Text>

            <TouchableOpacity onPress={openModal}>
              <Icon name="reader-outline" size={27} color={"white"} />
            </TouchableOpacity>
          </View>
          {/* 1-1 프로필 사진, Biography, 방명록 아이콘 끝*/}

          {/* 현재 전시회 부분 시작 */}
          <Text style={{ color: "white", marginBottom: 10 }}>
            {userDataDummy.genres.map((e, i) => {
              return e + "  ";
            })}
          </Text>
          <Text style={{ color: "white", marginBottom: 10 }}>
            {userDataDummy.equipments.map((e, i) => {
              return e + "  ";
            })}
          </Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "500",
              color: "white",
              marginBottom: 10,
            }}
          >
            Current Exibition
          </Text>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => {
              navigation.navigate("Exhibition", {
                ...currentExibitionDummy,
                user_id: userDataDummy.user_id,
                profile_img: userDataDummy.profile_img,
                nickname: userDataDummy.nickname,
              });
            }}
          >
            <ImageBackground
              source={currentExibitionDummy.exhibition_thumbnail}
              style={{ width: 120, height: 120 }}
            >
              {/* <View
              style={{
                flex: 1,
                ...StyleSheet.absoluteFillObject,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            /> */}
            </ImageBackground>
            <View style={{ width: 120, marginLeft: 15 }}>
              <Text style={{ fontWeight: "500", color: "white" }}>
                {currentExibitionDummy.exhibition_title}
              </Text>
              <Text style={{ color: "white" }}>
                {currentExibitionDummy.exhibition_discription}
              </Text>
            </View>
          </TouchableOpacity>
          {/* 현재 전시회 부분 끝 */}

          {/* 사진 나열 시작 */}
          <Text
            style={{
              fontSize: 17,
              fontWeight: "500",
              marginVertical: 10,
              color: "white",
            }}
          >
            Photographs
          </Text>
          <FlatList
            data={photoListDummy.content}
            renderItem={renderItem}
            keyExtractor={(item) => item.photo_id}
            numColumns={3}
            scrollEnabled={false}
            // columnWrapperStyle={{ marginBottom: 5 }}
            style={{ marginBottom: 30 }}
            // onEndReached={loadMoreData}
          />
        </ScrollView>
      </Animated.View>
      <NavBar type={SvgType.Exibition} />
      <Modalize
        ref={GuestBookModal}
        avoidKeyboardLikeIOS={true}
        // adjustToContentHeight={true}
        keyboardAvoidingBehavior="height"
        modalHeight={600}
        modalStyle={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
        HeaderComponent={GuestBooKModalHeader()}
      >
        <View style={{ paddingHorizontal: 20 }}>
          {GuestBookDummy.content.map((e, i) => {
            return (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  borderBottomWidth: 0.8,
                  alignItems: "center",
                  paddingVertical: 10,
                  gap: 20,
                }}
              >
                <Image
                  source={e.profile_img}
                  style={{ width: 50, height: 50, borderRadius: 50 }}
                />
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-end",
                      gap: 10,
                    }}
                  >
                    <Text style={{ fontWeight: "500" }}>{e.nickname}</Text>
                    <Text style={{ fontSize: 12 }}>{e.created_at}</Text>
                  </View>
                  <Text style={{ fontSize: 17 }}>{e.content}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </Modalize>
    </SafeAreaView>
  );
};

export default Gallery;

const styles = StyleSheet.create({});
