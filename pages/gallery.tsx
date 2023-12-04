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
  ActivityIndicator as Spinner,
  RefreshControl,
  PanResponder,
  Animated,
} from "react-native";

//libs
import Icon from "react-native-vector-icons/Ionicons";
import { Modalize } from "react-native-modalize";
import { NavBar, SvgType } from "../components/navbar";

//assets
import { ProfilePhoto } from "../assets/svg";
import GlobalStyles from "../assets/styles";

//사진 랜더링 시 필요한 width 계산
const numColumns = 3;
const size = (Dimensions.get("window").width - 40) / numColumns;

//Redux
import { useSelector } from "react-redux";
import { State } from "../storage/reducers";

//페이지 이동 타입
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

//api
import axios from "axios";
import { SERVER_IP } from "../components/utils";

type RootStackParamList = {
  Photo: {
    photo_id: string;
  };
  Exhibition: {
    exhibition_id: string;
    title: string;
    description: string;
    thumbnail: string;
    profile_img: string;
    nickname: string;
    user_id: string;
  };
  DarkRoom: undefined;
};

const Gallery: React.FC = ({ route }: any) => {
  //화면 이동(사진 조회)
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  //리덕스 유저 아이디 가져오기
  const userId = useSelector((state: State) => state.USER);
  console.log("at gallery: ", route.params);

  useEffect(() => {
    getUserData();
    getCurrentExhibition();
    getGuestBook(0);
    if (userId !== route.params.user_id) {
      checkSupport();
    }
  }, []);

  //유저 데이터 가져오기
  const [userData, setUserData] = useState<any>(null);
  const getUserData = async () => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/users/${route.params.user_id}/profile`
      );
      setUserData(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  //현재 전시회 가져오기
  const [currentExhibition, setCurrentExhibition] = useState<any>(null);
  const getCurrentExhibition = async () => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/users/${route.params.user_id}/exhibitions/current`
      );
      setCurrentExhibition(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  //페이징
  const [page, setPage] = useState<number>(0);
  useEffect(() => {
    getPhotos(page);
  }, [page]);

  //사진 가져오기
  const [photos, setPhotos] = useState<any>(null);

  const getPhotos = async (page: number) => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/users/${route.params.user_id}/photos?size=10&page=${page}`
      );
      console.log("at photo : ", response.data.content);
      if (page === 0) {
        setPhotos(response.data.content);
      } else {
        setPhotos([...photos, ...response.data.content]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //방명록 모달
  const GuestBookModal = useRef<Modalize>(null);
  const openModal = () => GuestBookModal.current?.open();
  const closeModal = () => GuestBookModal.current?.close();

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
          source={{ uri: item.photo_url }}
          style={{ width: "100%", height: "100%" }}
        />
      </TouchableOpacity>
    );
  };

  //구독 완료 함수
  const submitSupport = async () => {
    try {
      if (isSupporting) {
        Alert.alert(
          "알림",
          "구독을 삭제하시겠습니까?",
          [
            {
              text: "cancel",
            },
            {
              text: "OK",
              onPress: () => deleteSupport(),
            },
          ],
          { cancelable: true }
        );
      } else {
        await axios.post(`${SERVER_IP}core/users/${userId}/supports`, {
          photographer_id: route.params.user_id,
        });
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
        checkSupport();
      }
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

  //구독 삭제 함수
  const deleteSupport = async () => {
    try {
      await axios.delete(
        `${SERVER_IP}core/users/${userId}/supports/${route.params.user_id}`
      );
      Alert.alert(
        "완료",
        "구독을 삭제하였습니다.",
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
      checkSupport();
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

  //구독 여부 확인
  const [isSupporting, setIsSupporting] = useState<boolean>(false);

  const checkSupport = async () => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/users/${userId}/supports/${route.params.user_id}`
      );
      setIsSupporting(response.data.supported);
    } catch (e) {
      console.log(e);
    }
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
  const [guestBookPage, setGuestBookPage] = useState<number>(0);
  const [guestBook, setGuestBook] = useState<any>(null);
  const getGuestBook = async (page: number) => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/users/${route.params.user_id}/guest-books?size=10&page${page}`
      );
      setGuestBook(response.data.content);
      console.log("at getGuestBook fx : ", response.data);
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
        profile_img: require("../assets/photodummy1.jpg"),
      },
      {
        guest_book_id: "2",
        photographer_id: "2",
        user_id: "",
        nickname: "HK",
        content: "안녕",
        created_at: "2023-10-11",
        profile_img: require("../assets/photodummy2.jpg"),
      },
      {
        guest_book_id: "3",
        photographer_id: "3",
        user_id: "",
        nickname: "Lina",
        content: "좋은 사진 감사해요!",
        created_at: "2023-10-10",
        profile_img: require("../assets/photodummy3.jpg"),
      },
      {
        guest_book_id: "4",
        photographer_id: "4",
        user_id: "",
        nickname: "Jun",
        content: "멋진 경험이었습니다!",
        created_at: "2023-10-09",
        profile_img: require("../assets/photodummy4.jpg"),
      },
      {
        guest_book_id: "5",
        photographer_id: "5",
        user_id: "",
        nickname: "Chris",
        content: "다음에 또 올게요.",
        created_at: "2023-10-08",
        profile_img: require("../assets/photodummy5.jpg"),
      },
      {
        guest_book_id: "6",
        photographer_id: "1",
        user_id: "",
        nickname: "Alex",
        content: "정말 기억에 남는 시간이었어요.",
        created_at: "2023-10-07",
        profile_img: require("../assets/photodummy6.jpg"),
      },
      {
        guest_book_id: "7",
        photographer_id: "2",
        user_id: "",
        nickname: "Sam",
        content: "훌륭한 서비스에 감동받았습니다.",
        created_at: "2023-10-06",
        profile_img: require("../assets/photodummy2.jpg"),
      },
    ],
  };

  //새로고침 로직
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setUserData(null);
    setCurrentExhibition(null);
    getUserData();
    getCurrentExhibition();
    setPage(0);
    setRefreshing(false);
  };

  //페이징 처리
  const loadMoreData = () => {
    setPage((prev) => prev + 1);
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* 1-1 맨 위 A's Gallery, Support Button 시작*/}
      {userData ? (
        <>
          <View
            style={{
              ...GlobalStyles.rowSpaceBetweenContainer,
              backgroundColor: "white",
              paddingHorizontal: 20,
            }}
          >
            <Text style={GlobalStyles.bigFont}>
              {userData.nickname}'s Gallery
            </Text>
            <TouchableOpacity
              onPress={submitSupport}
              style={{
                ...GlobalStyles.backgroundBlackBox,
                backgroundColor:
                  userId === route.params.user_id || isSupporting
                    ? "#c9c9c9"
                    : "black",
              }}
              disabled={userId === route.params.user_id}
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
            style={{ ...GlobalStyles.container, backgroundColor: "black" }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onScroll={({ nativeEvent }) => {
              if (isCloseToBottom(nativeEvent)) {
                loadMoreData();
              }
            }}
            scrollEventThrottle={400}
          >
            {/* 1-1 프로필 사진, Biography, 방명록 아이콘 시작*/}
            <View
              style={{
                ...GlobalStyles.rowSpaceBetweenContainer,
                alignItems: "flex-start",
                marginTop: 15,
              }}
            >
              {userData.profile_img === "" ? (
                <Image
                  source={require("../assets/default_profile.png")}
                  style={{ width: 160, height: 160 }}
                />
              ) : (
                <Image
                  source={{ uri: userData.profile_img }}
                  style={{ width: 160, height: 160 }}
                />
              )}

              {/* <Image source={{ uri: userDataDummy.profile_img }} /> */}
              <Text style={{ width: 130, paddingLeft: 10, color: "white" }}>
                {userData?.biography}
              </Text>

              <TouchableOpacity onPress={openModal}>
                <Icon name="reader-outline" size={27} color={"white"} />
              </TouchableOpacity>
            </View>
            {/* 1-1 프로필 사진, Biography, 방명록 아이콘 끝*/}

            {/* 현재 전시회 부분 시작 */}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                marginBottom: 15,
              }}
            >
              {userData.genres.map((e: any, i: number) => {
                return (
                  <Text
                    style={{
                      color: "white",
                      marginRight: 10,
                    }}
                    key={i}
                  >
                    {e.genre}
                  </Text>
                );
              })}
            </ScrollView>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                marginBottom: 15,
              }}
            >
              {userData.equipments.map((e: string, i: number) => {
                return (
                  <Text
                    style={{
                      color: "white",
                      marginRight: 10,
                    }}
                    key={i}
                  >
                    {e}
                  </Text>
                );
              })}
            </ScrollView>

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
            {currentExhibition ? (
              <>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    navigation.navigate("Exhibition", {
                      exhibition_id: currentExhibition.exhibition_id,
                      title: currentExhibition.title,
                      description: currentExhibition.description,
                      thumbnail: currentExhibition.thumbnail,
                      profile_img: userData.profile_img,
                      nickname: userData.nickname,
                      user_id: route.params.user_id,
                    });
                  }}
                >
                  <Image
                    source={{ uri: currentExhibition.thumbnail }}
                    style={{ width: 120, height: 120 }}
                  />
                  <View style={{ width: 120, marginLeft: 15 }}>
                    <Text style={{ fontWeight: "500", color: "white" }}>
                      {currentExhibition.title}
                    </Text>
                    <Text style={{ color: "white" }}>
                      {currentExhibition.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
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
              data={photos}
              renderItem={renderItem}
              keyExtractor={(item) => item.photo_id}
              numColumns={3}
              scrollEnabled={false}
              // columnWrapperStyle={{ marginBottom: 5 }}
              style={{ marginBottom: 30 }}
              // onEndReached={loadMoreData}
            />
          </ScrollView>
        </>
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

      {/* </Animated.View> */}
      <NavBar type={SvgType.Exibition} />
      <Modalize
        onOverlayPress={closeModal}
        ref={GuestBookModal}
        avoidKeyboardLikeIOS={true}
        // adjustToContentHeight={true}
        keyboardAvoidingBehavior="height"
        modalHeight={550}
        modalStyle={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
        handleStyle={{ backgroundColor: "black", marginTop: 20 }}
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
