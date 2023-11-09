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
};

const MyGallery: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  //유저 아이디 가져오기
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
      </ScrollView>

      <NavBar type={SvgType.MyGallery} />
    </SafeAreaView>
  );
};

export default MyGallery;
