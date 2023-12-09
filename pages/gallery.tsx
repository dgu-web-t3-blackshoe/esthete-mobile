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
  Keyboard,
  TextInput,
  ActivityIndicator as Spinner,
  RefreshControl,
} from "react-native";
import GlobalStyles from "../assets/styles";

//libs
import Icon from "react-native-vector-icons/Ionicons";
import { Modalize } from "react-native-modalize";
import { NavBar, SvgType } from "../components/navbar";

//사진 랜더링 시 필요한 width 계산
const numColumns = 3;
const size = (Dimensions.get("window").width - 40) / numColumns;

//Redux
import { useSelector } from "react-redux";
import { State } from "../storage/reducers";

//페이지 이동 타입
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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
  Error: undefined;
};

const Gallery: React.FC = ({ route }: any) => {
  //화면 이동(사진 조회)
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  //리덕스 유저 아이디 가져오기
  const userId = useSelector((state: State) => state.USER);

  useFocusEffect(
    React.useCallback(() => {
      getUserData();
      getCurrentExhibition();
      if (userId !== route.params.user_id) {
        checkSupport();
      }
    }, [])
  );

  //유저 데이터 가져오기
  const [userData, setUserData] = useState<any>(null);
  const getUserData = async () => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/users/${route.params.user_id}/profile`
      );
      setUserData(response.data);
    } catch (e) {
      navigation.replace("Error");
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

  const [last, setLast] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  useEffect(() => {
    if (!last) {
      getPhotos(page);
    }
  }, [page]);

  //사진 가져오기
  const [photos, setPhotos] = useState<any>(null);

  const getPhotos = async (page: number) => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/users/${route.params.user_id}/photos?size=10&page=${page}`
      );
      setLast(response.data.last);
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

  //갤러리 사진 나열
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
            value={guestBookInput}
            onChangeText={(text) => setGuestBookInput(text)}
            onSubmitEditing={() => {
              Alert.alert(
                "알림",
                "방명록을 등록하시겠습니까?",
                [
                  {
                    text: "취소",
                  },
                  {
                    text: "OK",
                    onPress: () => submitGeustBook(),
                  },
                ],
                { cancelable: true }
              );
            }}
          />
          <TouchableOpacity
            style={{
              width: size * numColumns - 260,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "black",
            }}
            onPress={() => {
              Alert.alert(
                "알림",
                "방명록을 등록하시겠습니까?",
                [
                  {
                    text: "OK",
                    onPress: () => submitGeustBook(),
                  },
                ],
                { cancelable: true }
              );
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
  const [guestBookInput, setGuestBookInput] = useState<string>("");
  const [guestBook, setGuestBook] = useState<any>(null);
  const getGuestBook = async (page: number) => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/users/${route.params.user_id}/guest-books?size=20&page${page}`
      );
      setGlast(response.data.last);
      setGuestBook(response.data.content);
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

  //방명록 등록
  const submitGeustBook = async () => {
    try {
      await axios.post(
        `${SERVER_IP}core/users/${route.params.user_id}/guest-books`,
        {
          content: guestBookInput,
          user_id: userId,
        }
      );
      getGuestBook(0);
      setGuestBookInput("");
      Keyboard.dismiss();
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

  const renderGuestBook = ({ item }: any): React.JSX.Element => {
    return (
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 0.8,
          paddingVertical: 10,
          gap: 20,
          paddingHorizontal: 20,
        }}
      >
        {item.profile_img_url === "" ? (
          <Image
            source={require("../assets/default_profile.png")}
            style={{
              width: 40,
              height: 40,
              borderRadius: 50,
            }}
          />
        ) : (
          <Image
            source={{ uri: item.profile_img_url }}
            style={{ width: 40, height: 40, borderRadius: 50 }}
          />
        )}

        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              gap: 10,
            }}
          >
            <Text style={{ fontWeight: "500" }}>{item.nickname}</Text>
            <Text style={{ fontSize: 12 }}>
              {item.created_at.split("T")[0]}
            </Text>
          </View>
          <Text style={{ fontSize: 17, paddingRight: 60 }}>{item.content}</Text>
        </View>
      </View>
    );
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
    const paddingToBottom = 0;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  //방명록 페이징 처리
  const [glast, setGlast] = useState<boolean>(false);
  const [gpage, setGpage] = useState<number>(0);
  useEffect(() => {
    if (!glast) {
      getGuestBook(gpage);
    }
  }, [gpage]);
  const loadMoreGuestBook = () => {
    setGpage((prev) => prev + 1);
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
                    navigation.push("Exhibition", {
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
      <NavBar type={SvgType.Any} />
      <Modalize
        onOverlayPress={closeModal}
        ref={GuestBookModal}
        avoidKeyboardLikeIOS={true}
        keyboardAvoidingBehavior="height"
        modalHeight={550}
        modalStyle={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
        handleStyle={{ backgroundColor: "black", marginTop: 20 }}
        HeaderComponent={GuestBooKModalHeader()}
        flatListProps={
          guestBook?.length > 0
            ? {
                data: guestBook,
                renderItem: renderGuestBook,
                keyExtractor: (item) => item.guestbook_id,
                onEndReached: () => loadMoreGuestBook,
              }
            : undefined
        }
      ></Modalize>
    </SafeAreaView>
  );
};

export default Gallery;

const styles = StyleSheet.create({});
