import React, { useState, useEffect } from "react";
import {
  Image,
  Alert,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { GuestBook, ProfilePhoto } from "../../assets/svg";
import Icon from "react-native-vector-icons/Ionicons";

import GlobalStyles from "../../assets/styles.tsx";

const One_Profile: React.FC = () => {
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
    profile_img: "",
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
    exhibition_id: "",
    exhibition_title: "",
    exhibition_discription: "",
    exhibition_thumbnail: "",
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
        photo_id: "asdf",
        title: "Love",
        photo: "",
        user_id: "",
        nickname: "",
        created_at: "",
      },
      {
        photo_id: "",
        title: "",
        photo: "",
        user_id: "",
        nickname: "",
        created_at: "",
      },
    ],
  };

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
    <SafeAreaView style={GlobalStyles.container}>
      {/* 1-1 맨 위 A's Gallery, Support Button 시작*/}
      <View style={GlobalStyles.rowSpaceBetweenContainer}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
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
              fontWeight: "500",
              color: "white",
            }}
          >
            Support
          </Text>
        </TouchableOpacity>
      </View>
      {/* 1-1 맨 위 A's Gallery, Support Button 끝*/}

      {/* 1-1 프로필 사진, Biography, 방명록 아이콘 시작*/}
      <View
        style={{
          ...GlobalStyles.rowSpaceBetweenContainer,
          alignItems: "flex-start",
        }}
      >
        <ProfilePhoto />
        {/* <Image source={{ uri: userDataDummy.profile_img }} /> */}
        <Text style={{ width: 130 }}>{userDataDummy.biography}</Text>

        <TouchableOpacity>
          <Icon name="reader-outline" size={27} color={"black"} />
        </TouchableOpacity>
      </View>
      {/* 1-1 프로필 사진, Biography, 방명록 아이콘 끝*/}

      <Text style={{ fontWeight: "500", marginBottom: 10 }}>
        {userDataDummy.genres.map((e, i) => {
          return e + "  ";
        })}
      </Text>
      <Text style={{ fontWeight: "500", marginBottom: 10 }}>
        {userDataDummy.equipments.map((e, i) => {
          return e + "  ";
        })}
      </Text>
      <Text style={{ fontSize: 17, fontWeight: "600" }}>Current Exibition</Text>
    </SafeAreaView>
  );
};

export default One_Profile;

const styles = StyleSheet.create({});
