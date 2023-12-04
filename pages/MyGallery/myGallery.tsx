//6-1 6-2 6-3
import React, { useState, useEffect } from "react";

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
  RefreshControl,
  ActivityIndicator as Spinner,
} from "react-native";
import { NavBar, SvgType } from "../../components/navbar";
import GlobalStyles from "../../assets/styles";
import { useFocusEffect } from "@react-navigation/native";

//Redux
import { useSelector } from "react-redux";
import { State } from "../../storage/reducers";

//페이지 이동 타입
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

//api
import { SERVER_IP } from "../../components/utils";
import axios from "axios";

type RootStackParamList = {
  Gallery: {
    user_id: string;
    profile_img: string;
    nickname: string;
  };
  Exhibition: {
    exhibition_id: string;
    exhibition_title: string;
    exhibition_discription: string;
    exhibition_thumbnail: string;
    profile_img: string;
    nickname: string;
  };
  EditProfile: {
    user_id: string;
    profile_img: string;
    nickname: string;
    biography: string;
    genres: Array<string>;
    equipments: Array<string>;
  };
  NewExhibition: {
    myPhotos: Array<object>;
  };
  Photo: {
    photo_id: string;
    nickname: string;
  };
  AllSupportingPG: undefined;
};

//넓이 계산
const size = Dimensions.get("window").width;

const MyGallery: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  //리덕스 유저 아이디 가져오기
  const userId = useSelector((state: State) => state.USER);

  useFocusEffect(
    React.useCallback(() => {
      setPhotoPage(0);
      setExhibitionPage(0);
      setGuestBookPage(0);

      getMyProfile();
      getMySupporting();
      getMyPhotos(0);
      getMyExhibitions(0);
      getMyGuestBook(0);
    }, [])
  );

  //pages
  const [photoPage, setPhotoPage] = useState<number>(0);
  const [exhibitonPage, setExhibitionPage] = useState<number>(0);
  const [guestbookPage, setGuestBookPage] = useState<number>(0);
  useEffect(() => {
    if (photoPage !== 0) {
      getMyPhotos(photoPage);
    }
  }, [photoPage]);
  useEffect(() => {
    if (exhibitonPage !== 0) {
      getMyExhibitions(exhibitonPage);
    }
  }, [exhibitonPage]);

  //전체 후원 작가 조회 API
  const [mySupporting, setMySupporting] = useState<any>(null);
  const getMySupporting = async () => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/new-works/8c3841c7-f2cf-462e-9ef1-6c6e7bc9ffa4`
      );
      setMySupporting(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  //내 프로필 조회--------------------------------------
  const [userData, setUserData] = useState<any | null>(null);

  const getMyProfile = async () => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/users/8c3841c7-f2cf-462e-9ef1-6c6e7bc9ffa4/profile`
      );
      setUserData(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  //탭 이동 시 사용할 상태
  const [selectedOption, setSelectedOption] = useState<string>("Photographs");

  //내 사진 목록 조회
  const [myPhotoData, setMyPhotoData] = useState<any>(null);

  const getMyPhotos = async (page: number) => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/users/8c3841c7-f2cf-462e-9ef1-6c6e7bc9ffa4/photos?size=10&page=${page}`
      );
      if (page !== 0) {
        setMyPhotoData([...myPhotoData, ...response.data.content]);
      } else {
        setMyPhotoData(response.data.content);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //사진 나열
  const renderItem = ({ item }: any): React.JSX.Element => {
    return (
      <TouchableOpacity
        style={{
          width: size / 3,
          height: size / 3,
          aspectRatio: 1,
        }}
        onPress={() => {
          navigation.navigate("Photo", {
            photo_id: item.photo_id,
            nickname: userData.nickname,
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

  //내 전시 목록 조회-------------------------------------------------
  const [myExhibitions, setMyExhibitions] = useState<any>(null);

  const getMyExhibitions = async (page: number) => {
    try {
      console.log("hey");
      const response = await axios.get(
        `${SERVER_IP}core/users/8c3841c7-f2cf-462e-9ef1-6c6e7bc9ffa4/exhibitions?size=5&page=${page}`
      );
      console.log("at get my Exhibition fx : ", response.data.content);
      if (page !== 0) {
        setMyExhibitions([...myExhibitions, ...response.data.content]);
      } else {
        setMyExhibitions(response.data.content);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const [myGuestBook, setMyGuestBook] = useState<any>(null);
  const getMyGuestBook = async (page: number) => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/users/8c3841c7-f2cf-462e-9ef1-6c6e7bc9ffa4/guest-books?size=10&page=${page}`
      );
      if (page !== 0) {
        setMyGuestBook([...myGuestBook, response.data]);
      } else {
        setMyGuestBook(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //새로고침 로직
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setPhotoPage(0);
    setExhibitionPage(0);
    setGuestBookPage(0);
    getMyProfile();
    getMySupporting();
    getMyPhotos(0);
    getMyExhibitions(0);
    getMyGuestBook(0);
    setSelectedOption("Photographs");
    setRefreshing(false);
  };

  //페이징 처리
  const loadMoreData = () => {
    if (selectedOption === "Photographs") {
      setPhotoPage((prev) => prev + 1);
    } else if (selectedOption === "Exhibitions") {
      setExhibitionPage((prev) => prev + 1);
    } else {
      setGuestBookPage((prev) => prev + 1);
    }
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
      {userData ? (
        <ScrollView
          style={{ flex: 1, backgroundColor: "black" }}
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
          {/* 후원중인 사진가 타이틀 시작 */}
          <View
            style={{
              ...GlobalStyles.rowSpaceBetweenContainer,
              paddingHorizontal: 20,
              alignItems: "flex-end",
              backgroundColor: "white",
            }}
          >
            <Text style={GlobalStyles.bigFont}>Supporting Photographers</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("AllSupportingPG");
              }}
            >
              <Text>See All</Text>
            </TouchableOpacity>
          </View>
          {/* 후원중인 사진가 타이틀 끝 */}

          {/* 후원중인 작가 수평 스크롤뷰 시작 */}
          <ScrollView
            horizontal
            contentContainerStyle={{
              gap: 15,
              paddingHorizontal: 20,
              paddingVertical: 7.5,
              width: "100%",
              backgroundColor: "white",
            }}
            showsHorizontalScrollIndicator={false}
          >
            {mySupporting && mySupporting?.length > 0 ? (
              [...mySupporting]
                .sort((a, b) =>
                  a.has_new === b.has_new ? 0 : a.has_new ? -1 : 1
                )
                .map((e, i) => {
                  const displayedName =
                    e.nickname.length > 6
                      ? `${e.nickname.substring(0, 6)}...`
                      : e.nickname;
                  return (
                    <TouchableOpacity
                      key={i}
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        navigation.push("Gallery", {
                          user_id: e.photographer_id,
                          profile_img: e.profile_img,
                          nickname: e.nickname,
                        });
                      }}
                    >
                      <Image
                        source={e.profile_img}
                        style={{
                          width: e.has_new ? 75 : 70,
                          height: e.has_new ? 75 : 70,
                          borderRadius: 50,
                          borderWidth: e.has_new ? 3 : 0,
                          borderColor: "#FFA800",
                        }}
                      />
                      <Text>{displayedName}</Text>
                    </TouchableOpacity>
                  );
                })
            ) : (
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "500",
                  paddingBottom: 5,
                }}
              >
                후원 중인 작가가 없습니다.
              </Text>
            )}
          </ScrollView>
          {/* 후원중인 작가 수평 스크롤뷰 끝 */}

          <View style={{ backgroundColor: "black" }}>
            {/* 프로필 타이틀, edit 버튼 뷰 시작 */}
            <View
              style={{
                ...GlobalStyles.rowSpaceBetweenContainer,
                paddingHorizontal: 20,
                marginTop: 5,
                alignItems: "flex-end",
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "500", color: "white" }}>
                My Profile
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("EditProfile", {
                    user_id: userData.user_id,
                    profile_img: userData.profile_img,
                    nickname: userData.nickname,
                    biography: userData.biography,
                    genres: userData.genres,
                    equipments: userData.equipments,
                  })
                }
              >
                <Text style={{ color: "white" }}>Edit</Text>
              </TouchableOpacity>
            </View>
            {/* 프로필 타이틀, edit 버튼 뷰 끝 */}

            {/* 프로필 사진, 작가 이름, 작가 설명 시작 */}
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                gap: 25,
                marginTop: 10,
                backgroundColor: "black",
              }}
            >
              {userData.profile_img === "" ? (
                <Image
                  source={require("../../assets/default_profile.jpg")}
                  style={{ width: 150, height: 150 }}
                />
              ) : (
                <Image
                  source={{ uri: userData.profile_img }}
                  style={{ width: 150, height: 150 }}
                />
              )}

              <View
                style={{
                  width: 140,
                  gap: 10,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ fontSize: 20, color: "white", fontWeight: "500" }}
                >
                  {userData.nickname}
                </Text>
                <Text style={{ fontSize: 16, color: "white" }}>
                  {userData.biography}
                </Text>
              </View>
            </View>
            {/* 프로필 사진, 작가 이름, 작가 설명 끝 */}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 10,
                marginVertical: 15,
              }}
            >
              {userData.genres.map((e: any, i: number) => {
                return (
                  <Text
                    style={{
                      color: "white",
                      marginHorizontal: 10,
                      fontSize: 16,
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
                paddingHorizontal: 10,
                marginBottom: 15,
              }}
            >
              {userData.equipments.map((e: string, i: number) => {
                return (
                  <Text
                    style={{
                      color: "white",
                      marginHorizontal: 10,
                      fontSize: 16,
                    }}
                    key={i}
                  >
                    {e}
                  </Text>
                );
              })}
            </ScrollView>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                marginBottom: 20,
                paddingLeft: 5,
              }}
            >
              <TouchableOpacity
                style={styles.tabBox}
                onPress={() => setSelectedOption("Photographs")}
              >
                <Text
                  style={{
                    ...styles.tapText,
                    textDecorationLine:
                      selectedOption === "Photographs" ? "underline" : "none",
                  }}
                >
                  Photographs
                </Text>
                {selectedOption === "Photographs" && myPhotoData ? (
                  <Text style={{ color: "#FFA800" }}>
                    {myPhotoData?.length}
                  </Text>
                ) : (
                  <Text>{"  "}</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tabBox}
                onPress={() => setSelectedOption("Exhibitions")}
              >
                <Text
                  style={{
                    ...styles.tapText,
                    textDecorationLine:
                      selectedOption === "Exhibitions" ? "underline" : "none",
                  }}
                >
                  Exhibitions
                </Text>
                {selectedOption === "Exhibitions" && myExhibitions ? (
                  <Text style={{ color: "#FFA800" }}>
                    {myExhibitions?.length}
                  </Text>
                ) : (
                  <Text>{"  "}</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tabBox}
                onPress={() => setSelectedOption("GuestBook")}
              >
                <Text
                  style={{
                    ...styles.tapText,
                    textDecorationLine:
                      selectedOption === "GuestBook" ? "underline" : "none",
                  }}
                >
                  GuestBook
                </Text>
                {selectedOption === "GuestBook" && myGuestBook ? (
                  <Text style={{ color: "#FFA800" }}>
                    {myGuestBook?.totalElements}
                  </Text>
                ) : (
                  <Text>{"  "}</Text>
                )}
              </TouchableOpacity>
            </View>

            {selectedOption === "Photographs" &&
            myPhotoData &&
            myPhotoData?.length > 0 ? (
              // 내 사진 확인 시작
              <FlatList
                scrollEnabled={false}
                data={myPhotoData}
                renderItem={renderItem}
                keyExtractor={(item) => item.photo_id}
                numColumns={3}
                // columnWrapperStyle={{ marginBottom: 5 }}
                style={{
                  flex: 1,
                  backgroundColor: "black",
                  marginBottom: 20,
                }}
                // onEndReached={loadMoreData}
              />
            ) : selectedOption === "Photographs" &&
              myPhotoData?.content.length === 0 ? (
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: 18,
                  color: "white",
                  marginTop: 20,
                }}
              >
                등록된 사진이 없습니다.
              </Text>
            ) : // 내 사진 확인 끝
            selectedOption === "Exhibitions" ? (
              <View style={{ paddingBottom: 20 }}>
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    paddingHorizontal: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      if (myPhotoData?.content.length === 0) {
                        Alert.alert(
                          "알림",
                          "먼저 Dark Room을 통해 사진을 등록해주세요.",
                          [
                            {
                              text: "OK",
                            },
                          ],
                          { cancelable: true }
                        );
                      } else {
                        navigation.navigate("NewExhibition", {
                          myPhotos: myPhotoData.content,
                        });
                      }
                    }}
                  >
                    <Text style={{ color: "white" }}>New Exhibition</Text>
                  </TouchableOpacity>
                </View>
                {myExhibitions && myExhibitions.length > 0 ? (
                  myExhibitions.map((e: any, i: any) => {
                    return (
                      <TouchableOpacity
                        key={i}
                        style={{
                          flexDirection: "row",
                          marginHorizontal: 20,
                          paddingVertical: 10,
                          borderBottomWidth: 0.5,
                          borderBottomColor: "white",
                          gap: 20,
                        }}
                        onPress={() => {
                          navigation.navigate("Exhibition", {
                            exhibition_id: e.exhibition_id,
                            exhibition_title: e.title,
                            exhibition_discription: e.description,
                            exhibition_thumbnail: e.thumbnail,
                            profile_img: userData.profile_img,
                            nickname: userData.nickname,
                          });
                        }}
                      >
                        <Image
                          source={{ uri: e.thumbnail }}
                          style={{ width: 80, height: 80 }}
                        />
                        <View style={{ gap: 5 }}>
                          <Text style={{ color: "white", fontSize: 20 }}>
                            {e.title}
                          </Text>
                          <Text style={{ color: "white" }}>
                            {e.description}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <Text
                    style={{
                      width: "100%",
                      textAlign: "center",
                      fontSize: 18,
                      color: "white",
                      marginTop: 20,
                    }}
                  >
                    등록된 전시회가 없습니다.
                  </Text>
                )}
              </View>
            ) : (
              <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                {myGuestBook && myGuestBook?.content?.length > 0 ? (
                  myGuestBook.content.map((e: any, i: any) => {
                    return (
                      <View
                        key={i}
                        style={{
                          flexDirection: "row",
                          borderBottomWidth: 0.5,
                          alignItems: "center",
                          paddingVertical: 10,
                          gap: 20,
                          borderBottomColor: "white",
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
                            <Text style={{ fontWeight: "500", color: "white" }}>
                              {e.nickname}
                            </Text>
                            <Text style={{ fontSize: 12, color: "white" }}>
                              {e.created_at}
                            </Text>
                          </View>
                          <Text
                            style={{
                              fontSize: 14,
                              width: 260,
                              color: "white",
                            }}
                          >
                            {e.content}
                          </Text>
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <Text
                    style={{
                      width: "100%",
                      textAlign: "center",
                      fontSize: 18,
                      color: "white",
                      marginTop: 20,
                    }}
                  >
                    등록된 방명록이 없습니다.
                  </Text>
                )}
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

      <NavBar type={SvgType.MyGallery} />
    </SafeAreaView>
  );
};

export default MyGallery;

const styles = StyleSheet.create({
  tabBox: {
    width: size / 3,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 5,
  },
  tapText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
});
