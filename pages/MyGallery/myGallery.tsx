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
  TextInput,
  ActivityIndicator as Spinner,
} from "react-native";
import { NavBar, SvgType } from "../../components/navbar";
import GlobalStyles from "../../assets/styles";

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
    user_id: string;
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

  useEffect(() => {
    getMySupporting();
    getMyProfile();
    getMyPhotos();
    getMyExhibitions();
  }, []);

  //전체 후원 작가 조회 API
  //URL:
  //users/{user_id}/supports/new
  //user_id = userId
  const [mySupporting, setMySupporting] = useState<any>(null);
  const getMySupporting = async () => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/users/aab7e8a5-fe79-494a-9d9c-6a5b71aa2c69/guest-books`
      );
      setMySupporting(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  //DUMMY:
  const supportsDummy = [
    {
      photographer_id: "ph1",
      profile_img: require("../../assets/photodummy1.jpg"),
      nickname: "Photographer One",
      has_new: true,
      updated_at: "2023-10-01",
    },
    {
      photographer_id: "ph2",
      profile_img: require("../../assets/photodummy2.jpg"),
      nickname: "Photographer Two",
      has_new: false,
      updated_at: "2023-10-02",
    },
    {
      photographer_id: "ph3",
      profile_img: require("../../assets/photodummy3.jpg"),
      nickname: "Photographer Three",
      has_new: true,
      updated_at: "2023-10-03",
    },
    {
      photographer_id: "ph4",
      profile_img: require("../../assets/photodummy4.jpg"),
      nickname: "Photographer Four",
      has_new: false,
      updated_at: "2023-10-04",
    },
    {
      photographer_id: "ph5",
      profile_img: require("../../assets/photodummy5.jpg"),
      nickname: "Photographer Five",
      has_new: true,
      updated_at: "2023-10-05",
    },
    {
      photographer_id: "ph6",
      profile_img: require("../../assets/photodummy6.jpg"),
      nickname: "Photographer Six",
      has_new: true,
      updated_at: "2023-10-06",
    },
  ];

  //내 프로필 조회--------------------------------------
  //URL:
  //users/{user_id}/profile
  const [userData, setUserData] = useState<any | null>(null);

  const getMyProfile = async () => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/users/aab7e8a5-fe79-494a-9d9c-6a5b71aa2c69/profile`
      );
      setUserData(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  //Dummy:
  const userDummy = {
    user_id: "asdf",
    profile_img: require("../../assets/photodummy4.jpg"),
    nickname: "Jekoo",
    biography: "나랏말싸미 동국에 달아 사맛디 아니할세",
    genres: ["Portrait", "Sports"],
    equipments: ["갤럭시", "아이폰"],
  };

  //탭 이동 시 사용할 상태
  const [selectedOption, setSelectedOption] = useState<string>("Photographs");

  //내 사진 목록 조회
  //URL:
  //users/{user_id}/photos
  const [myPhotoData, setMyPhotoData] = useState<any>(null);

  const getMyPhotos = async () => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/users/aab7e8a5-fe79-494a-9d9c-6a5b71aa2c69/photos`
      );
      setMyPhotoData(response.data);
      console.log("at photos", response.data);
    } catch (e) {
      console.log(e);
    }
  };

  //응답:
  const MyPhoto = {
    content: [
      {
        photo_id: "1",
        title: "",
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
    ],
    totalElements: 4,
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
  //URL:
  //users/{user_id}/exhibitions
  const getMyExhibitions = async () => {
    console.log(
      `${SERVER_IP}core/users/aab7e8a5-fe79-494a-9d9c-6a5b71aa2c69/exhibitions`
    );

    try {
      const response = await axios.get(
        `${SERVER_IP}core/users/aab7e8a5-fe79-494a-9d9c-6a5b71aa2c69/exhibitions`
      );
      console.log("내 전시회 가져오기 응답 : ", response.data);
    } catch (e) {
      console.log(e);
    }
  };
  //DUMMY
  const ExhibitionDummy = {
    content: [
      {
        exhibition_id: "1",
        title: "전시1",
        description: "전시 설명1",
        thumnail: require("../../assets/photodummy1.jpg"),
      },
      {
        exhibition_id: "2",
        title: "전시2",
        description: "전시 설명2",
        thumnail: require("../../assets/photodummy2.jpg"),
      },
      {
        exhibition_id: "3",
        title: "전시3",
        description: "전시 설명3",
        thumnail: require("../../assets/photodummy3.jpg"),
      },
      {
        exhibition_id: "4",
        title: "전시3",
        description: "전시 설명4",
        thumnail: require("../../assets/photodummy4.jpg"),
      },
    ],
    totalElements: 4,
  };

  //내 갤러리 방명록 조회
  //URL:
  //users/{user_id}/guest-books
  const GuestBookDummy = {
    content: [
      {
        guest_book_id: "1",
        photographer_id: "1",
        user_id: "1",
        nickname: "ph1",
        content: "댓글1 댓글1 댓글1 댓글1 댓글1 댓글1 댓글1 댓글1",
        created_at: "2023-11-09",
        profile_img: require("../../assets/photodummy1.jpg"),
      },
      {
        guest_book_id: "2",
        photographer_id: "2",
        user_id: "2",
        nickname: "ph2",
        content: "댓글2 댓글2 댓글2 댓글2 댓글2 댓글2 댓글2 댓글2",
        created_at: "2023-11-09",
        profile_img: require("../../assets/photodummy2.jpg"),
      },
      {
        guest_book_id: "3",
        photographer_id: "3",
        user_id: "3",
        nickname: "ph3",
        content: "댓글3 댓글3 댓글3 댓글3 댓글3 댓글3 댓글3 댓글3 ",
        created_at: "2023-11-09",
        profile_img: require("../../assets/photodummy3.jpg"),
      },
      {
        guest_book_id: "4",
        photographer_id: "4",
        user_id: "4",
        nickname: "ph4",
        content: "댓글4 댓글4 댓글4 댓글4 댓글4 댓글4 댓글4 댓글4 ",
        created_at: "2023-11-09",
        profile_img: require("../../assets/photodummy4.jpg"),
      },
    ],
    totalElements: 4,
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {userData ? (
        <ScrollView style={{ flex: 1, backgroundColor: "black" }}>
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
            {mySupporting ? (
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
              <Text>후원 중인 작가가 없습니다.</Text>
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
              <Image
                source={{ uri: userData.profile_img }}
                style={{ width: 150, height: 150 }}
              />
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
              {userData.genres.map((e: string, i: number) => {
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
                    {myPhotoData.totalElements}
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
                {selectedOption === "Exhibitions" ? (
                  <Text style={{ color: "#FFA800" }}>
                    {ExhibitionDummy.totalElements}
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
                {selectedOption === "GuestBook" ? (
                  <Text style={{ color: "#FFA800" }}>
                    {GuestBookDummy.totalElements}
                  </Text>
                ) : (
                  <Text>{"  "}</Text>
                )}
              </TouchableOpacity>
            </View>

            {selectedOption === "Photographs" ? (
              // 내 사진 확인 시작
              <FlatList
                scrollEnabled={false}
                data={myPhotoData?.content}
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
                    onPress={() =>
                      navigation.navigate("NewExhibition", {
                        myPhotos: myPhotoData.content,
                      })
                    }
                  >
                    <Text style={{ color: "white" }}>New Exhibition</Text>
                  </TouchableOpacity>
                </View>

                {ExhibitionDummy.content.map((e, i) => {
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
                          exhibition_thumbnail: e.thumnail,
                          user_id: userId,
                          profile_img: userDummy.profile_img,
                          nickname: userDummy.nickname,
                        });
                      }}
                    >
                      <Image
                        source={e.thumnail}
                        style={{ width: 80, height: 80 }}
                      />
                      <View style={{ gap: 5 }}>
                        <Text style={{ color: "white", fontSize: 20 }}>
                          {e.title}
                        </Text>
                        <Text style={{ color: "white" }}>{e.description}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                {GuestBookDummy.content.map((e, i) => {
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
                          style={{ fontSize: 14, width: 260, color: "white" }}
                        >
                          {e.content}
                        </Text>
                      </View>
                    </View>
                  );
                })}
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
