//6-1 6-2 6-3
import React, { useState, useEffect } from "react";

//요소
import {
  Image,
  Modal,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ImageBackground,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  View,
  RefreshControl,
  ActivityIndicator as Spinner,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import { NavBar, SvgType } from "../../components/navbar";
import GlobalStyles from "../../assets/styles";
import Icon from "react-native-vector-icons/Ionicons";

//Redux
import { useSelector } from "react-redux";
import { State } from "../../storage/reducers";

//페이지 이동 타입
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

//api
import { SERVER_IP } from "../../components/utils";
import axios from "axios";

type RootStackParamList = {
  Gallery: {
    user_id: string;
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
    user_id: string;
    nickname: string;
  };
  AllSupportingPG: undefined;
  Error: undefined;
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
  const [last, setLast] = useState<Array<boolean>>([false, false, false]);
  const [photoPage, setPhotoPage] = useState<number>(0);
  const [exhibitonPage, setExhibitionPage] = useState<number>(0);
  const [guestbookPage, setGuestBookPage] = useState<number>(0);

  useEffect(() => {
    if (photoPage === 0) {
      return;
    }
    if (photoPage !== 0 && !last[0]) {
      getMyPhotos(photoPage);
    }
  }, [photoPage]);

  useEffect(() => {
    if (exhibitonPage !== 0 && !last[1]) {
      getMyExhibitions(exhibitonPage);
    }
  }, [exhibitonPage]);

  useEffect(() => {
    if (guestbookPage !== 0 && !last[2]) {
      getMyGuestBook(guestbookPage);
    }
  }, [guestbookPage]);

  //전체 후원 작가 조회 API
  const [mySupporting, setMySupporting] = useState<any>(null);
  const getMySupporting = async () => {
    try {
      const response = await axios.get(`${SERVER_IP}core/new-works/${userId}`);
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
        `${SERVER_IP}core/users/${userId}/profile`
      );
      setUserData(response.data);
    } catch (e) {
      navigation.replace("Error");
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
        `${SERVER_IP}core/users/${userId}/photos?size=10&page=${page}`
      );
      setLast((prevLast) => {
        const newLast = [...prevLast];
        newLast[0] = response.data.last;
        return newLast;
      });
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
            user_id: userId,
            nickname: userData.nickname,
          });
        }}
      >
        {item.photo_url !== "" && (
          <ImageBackground
            source={{ uri: item.photo_url }}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </TouchableOpacity>
    );
  };

  //내 전시 목록 조회-------------------------------------------------
  const [myExhibitions, setMyExhibitions] = useState<any>(null);

  const getMyExhibitions = async (page: number) => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/users/${userId}/exhibitions?size=5&page=${page}`
      );
      setLast((prevLast) => {
        const newLast = [...prevLast];
        newLast[1] = response.data.last;
        return newLast;
      });
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
        `${SERVER_IP}core/users/${userId}/guest-books?size=10&page=${page}`
      );
      setLast((prevLast) => {
        const newLast = [...prevLast];
        newLast[2] = response.data.last;
        return newLast;
      });
      if (page !== 0) {
        setMyGuestBook([...myGuestBook, response.data.content]);
      } else {
        setMyGuestBook(response.data.content);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //방명록 신고
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [reportId, setReportId] = useState<any>(null);
  const [report, setReport] = useState<string>("");
  const reportGuestBook = async () => {
    if (reportId) {
      try {
        await axios.post(`${SERVER_IP}core/abusing-reports/guest-books`, {
          guest_book_id: reportId,
          reason: report,
          user_id: userId,
        });

        Alert.alert(
          "완료",
          "방명록을 신고했습니다.",
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
        setIsModalVisible(false);
        setReport("");
        setReportId(null);
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
    const paddingToBottom = 0;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ExpoStatusBar style="dark" />
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
          scrollEventThrottle={100}
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
                navigation.push("AllSupportingPG");
              }}
            >
              <Text style={{ fontWeight: "500", fontSize: 16 }}>See All</Text>
            </TouchableOpacity>
          </View>
          {/* 후원중인 사진가 타이틀 끝 */}

          {/* 후원중인 작가 수평 스크롤뷰 시작 */}

          {mySupporting && mySupporting?.length > 0 ? (
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
              {[...mySupporting]
                .sort((a, b) =>
                  a.has_new_exhibition === b.has_new_exhibition
                    ? 0
                    : a.has_new_exhibition
                    ? -1
                    : 1
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
                        navigation.navigate("Gallery", {
                          user_id: e.photographer_id,
                        });
                      }}
                    >
                      <Image
                        source={e.profile_img}
                        style={{
                          width: e.has_new_exhibition ? 75 : 70,
                          height: e.has_new_exhibition ? 75 : 70,
                          borderRadius: 50,
                          borderWidth: e.has_new_exhibition ? 3 : 0,
                          borderColor: "#FFA800",
                        }}
                      />
                      <Text>{displayedName}</Text>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
          ) : null}
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
                  source={require("../../assets/default_profile.png")}
                  style={{ width: 150, height: 150 }}
                  resizeMode="contain"
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
                    {myGuestBook?.length}
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
                style={{
                  flex: 1,
                  backgroundColor: "black",
                  marginBottom: 20,
                }}
              />
            ) : selectedOption === "Photographs" &&
              myPhotoData?.length === 0 ? (
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
                      if (myPhotoData?.length === 0) {
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
                          navigation.push("Exhibition", {
                            exhibition_id: e.exhibition_id,
                            title: e.title,
                            description: e.description,
                            thumbnail: e.thumbnail,
                            profile_img: userData.profile_img,
                            nickname: userData.nickname,
                            user_id: userId,
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
                {myGuestBook && myGuestBook.length > 0 ? (
                  myGuestBook.map((e: any, i: any) => {
                    return (
                      <View
                        key={i}
                        style={{
                          flexDirection: "row",
                          borderBottomWidth: 0.5,
                          paddingVertical: 10,
                          gap: 20,
                          borderBottomColor: "white",
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                          }}
                        >
                          {e.profile_img_url === "" ? (
                            <Image
                              source={require("../../assets/default_profile.png")}
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 50,
                              }}
                            />
                          ) : (
                            <Image
                              source={{ uri: e.profile_img_url }}
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 50,
                              }}
                            />
                          )}

                          <View style={{ marginLeft: 20 }}>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "flex-end",
                                gap: 10,
                              }}
                            >
                              <Text
                                style={{ fontWeight: "500", color: "white" }}
                              >
                                {e.nickname}
                              </Text>
                              <Text style={{ fontSize: 12, color: "white" }}>
                                {e.created_at.split("T")[0]}
                              </Text>
                            </View>
                            <Text
                              style={{
                                fontSize: 14,
                                paddingRight: 60,

                                color: "white",
                              }}
                            >
                              {e.content}
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          style={{
                            paddingHorizontal: 10,
                          }}
                          onPress={() => {
                            Alert.alert(
                              "알림",
                              "방명록을 신고하시겠습니까??",
                              [
                                {
                                  text: "취소",
                                  onPress: () => null,
                                  style: "cancel",
                                },
                                {
                                  text: "확인",
                                  onPress: () => {
                                    setReportId(e.guestbook_id);
                                    setIsModalVisible(true);
                                  },
                                },
                              ],
                              { cancelable: false }
                            );
                          }}
                        >
                          <Icon
                            name="notifications-sharp"
                            size={23}
                            color={"white"}
                          />
                        </TouchableOpacity>
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
              // borderBottomLeftRadius: 10,
              // borderBottomRightRadius: 10,
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
                setReportId(null);
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
                  reportGuestBook();
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

      <NavBar type={SvgType.MyGallery} />
    </KeyboardAvoidingView>
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
