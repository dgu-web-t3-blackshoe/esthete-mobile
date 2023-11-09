import React, { useState } from "react";

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
} from "react-native";
import { NavBar, SvgType } from "../../components/navbar";
import GlobalStyles from "../../assets/styles";

//Redux
import { useSelector } from "react-redux";
import { State } from "../../storage/reducers";

//페이지 이동 타입
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
type RootStackParamList = {
  MyPhotographers: undefined;
  Photo: {
    photo_id: string;
  };
};

//넓이 계산
const size = Dimensions.get("window").width;

const MyGallery: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  //리덕스 유저 아이디 가져오기
  const userId = useSelector((state: State) => state.USER);

  //전체 후원 작가 조회 API
  //URL:
  //users/{user_id}/supports/new
  //user_id = userId
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
  //Dummy:
  const userDummy = {
    user_id: "asdf",
    profile_img: require("../../assets/photodummy4.jpg"),
    nickname: "Jekoo",
    biography: "나랏말싸미 동국에 달아 사맛디 아니할세",
    genres: ["Animation", "Comics"],
    equipments: ["갤럭시"],
  };

  //탭 이동 시 사용할 상태
  const [selectedOption, setSelectedOption] = useState<string>("Photographs");

  //내 사진 목록 조회
  //URL:
  //users/{user_id}/photos
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
          });
        }}
      >
        <ImageBackground
          // source={{ uri: item.story }}
          source={item.photo}
          style={{ width: "100%", height: "100%" }}
        />
      </TouchableOpacity>
    );
  };

  //내 전시 목록 조회
  //URL:
  //users/{user_id}/exhibitions
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
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={{ flex: 1 }}>
        {/* 후원중인 사진가 타이틀 시작 */}
        <View
          style={{
            ...GlobalStyles.rowSpaceBetweenContainer,
            paddingHorizontal: 20,
            alignItems: "flex-end",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "500" }}>
            Supporting Photographers
          </Text>
          <TouchableOpacity>
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
            marginVertical: 10,
          }}
          showsHorizontalScrollIndicator={false}
        >
          {supportsDummy.map((e, i) => {
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
              >
                <Image
                  source={e.profile_img}
                  style={{ width: 70, height: 70, borderRadius: 50 }}
                />
                <Text>{displayedName}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {/* 후원중인 작가 수평 스크롤뷰 끝 */}
        <View style={{ backgroundColor: "black" }}>
          <View
            style={{
              ...GlobalStyles.rowSpaceBetweenContainer,
              paddingHorizontal: 20,
              alignItems: "flex-end",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "500", color: "white" }}>
              My Profile
            </Text>
            <TouchableOpacity>
              <Text style={{ color: "white" }}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              gap: 20,
              marginTop: 10,
              backgroundColor: "black",
            }}
          >
            <Image
              source={userDummy.profile_img}
              style={{ width: 140, height: 140 }}
            />
            <View style={{ width: 170, gap: 10, justifyContent: "center" }}>
              <Text style={{ fontSize: 20, color: "white", fontWeight: "500" }}>
                {userDummy.nickname}
              </Text>
              <Text style={{ fontSize: 16, color: "white" }}>
                {userDummy.biography}
              </Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 10,
              marginVertical: 15,
            }}
          >
            {userDummy.genres.map((e, i) => {
              return (
                <Text
                  style={{ color: "white", marginHorizontal: 10, fontSize: 16 }}
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
            {userDummy.equipments.map((e, i) => {
              return (
                <Text
                  style={{ color: "white", marginHorizontal: 10, fontSize: 16 }}
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
            }}
          >
            <TouchableOpacity
              style={styles.tabBox}
              onPress={() => setSelectedOption("Photographs")}
            >
              <Text style={styles.tapText}>Photographs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabBox}
              onPress={() => setSelectedOption("Exhibitions")}
            >
              <Text style={styles.tapText}>Exhibitions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabBox}
              onPress={() => setSelectedOption("GuestBook")}
            >
              <Text style={styles.tapText}>GuestBook</Text>
            </TouchableOpacity>
          </View>
          {selectedOption === "Photographs" ? (
            // 내 사진 확인 시작
            <FlatList
              scrollEnabled={false}
              data={MyPhoto.content}
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
                <TouchableOpacity>
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
            <View></View>
          )}
        </View>
      </ScrollView>

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
  },
  tapText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
});
