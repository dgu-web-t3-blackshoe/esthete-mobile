//6-7 ~
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
  Platform,
  ImageBackground,
  ScrollView,
  View,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { NavBar, SvgType } from "../../components/navbar";
import GlobalStyles from "../../assets/styles";

//Redux
import { useSelector } from "react-redux";
import { State } from "../../storage/reducers";

//페이지 이동 타입
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

//넓이 계산
const size = Dimensions.get("window").width;

const NewExhibition: React.FC = () => {
  //리덕스 유저 아이디 가져오기
  const userId = useSelector((state: State) => state.USER);

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
    totalElements: 4,
  };

  //사진 나열
  const renderItem = ({ item }: any): React.JSX.Element => {
    return (
      <TouchableOpacity
        style={{
          width: (size - 40) / 3,
          height: (size - 40) / 3,
          aspectRatio: 1,
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={{
          ...GlobalStyles.rowSpaceBetweenContainer,
          paddingHorizontal: 20,
        }}
      >
        <Text style={GlobalStyles.bigFont}>New Exhibition</Text>
        <TouchableOpacity style={GlobalStyles.backgroundBlackBox}>
          <Text style={{ color: "white", fontSize: 17 }}>Add Room</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{ backgroundColor: "black", flex: 1, paddingHorizontal: 20 }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: "500",
            marginVertical: 15,
            color: "white",
          }}
        >
          Exhibition Title
        </Text>
        <TextInput
          cursorColor={"#FFA800"}
          placeholder="전시회 제목을 입력하세요."
          style={{ backgroundColor: "white", textAlign: "center", height: 35 }}
        />

        <Text
          style={{
            fontSize: 17,
            fontWeight: "500",
            marginVertical: 15,
            color: "white",
          }}
        >
          Exhibition Description
        </Text>
        <TextInput
          cursorColor={"#FFA800"}
          placeholder="전시회 설명을 입력하세요."
          style={{ backgroundColor: "white", textAlign: "center", height: 100 }}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            marginVertical: 15,
            gap: 10,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "500",

              color: "white",
            }}
          >
            Photographs
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#c9c9c9",
            }}
          >
            전시회 대표 이미지를 선택하세요.
          </Text>
        </View>
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
      </ScrollView>

      <NavBar type={SvgType.MyGallery} />
    </KeyboardAvoidingView>
  );
};

export default NewExhibition;
