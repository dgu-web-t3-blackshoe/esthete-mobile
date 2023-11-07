//1-1 1-2 1-3
import React, { useState, useRef, useEffect } from "react";
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
const ExhibitionProfile: React.FC = () => {
  //화면 이동(사진 조회)
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  //방명록 모달
  const GuestBookModal = useRef<Modalize>(null);
  const openModal = () => GuestBookModal.current?.open();
  const closeModal = () => GuestBookModal.current?.close();

  //전시회 업로더 프로필 조회
  //URL: users/{gallery_user_id}/profile (get)
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

  return (
    // (API연결시 랜더링 전 data 있는지 체크 후 랜더링 로직 추가)
    <SafeAreaView style={{ flex: 1 }}>
      {/* 1-1 맨 위 A's Gallery, Support Button 시작*/}
      <View
        style={{
          ...GlobalStyles.rowSpaceBetweenContainer,
          backgroundColor: "white",
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "500",
          }}
        >
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
      <NavBar type={SvgType.Exibition} />
      <Modalize ref={GuestBookModal} adjustToContentHeight={true}></Modalize>
    </SafeAreaView>
  );
};

export default ExhibitionProfile;

const styles = StyleSheet.create({});
