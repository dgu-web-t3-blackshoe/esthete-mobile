import React, { useState } from "react";

//요소
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ImageBackground,
  View,
} from "react-native";
import { NavBar, SvgType } from "../../components/navbar";
import GlobalStyles from "../../assets/styles";

//라이브러리
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RNPickerSelect from 'react-native-picker-select';

//사진 나열 위한 width 계산
const numColumns = 3;
const size = (Dimensions.get("window").width - 40) / numColumns;

//네비게이션
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
type RootStackParamList = {
  Photo: {
    photo_id: string;
  };
};


const LightMapList: React.FC = ({ route }: any) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  //동별 사진 조회
  //URL: photos?town={동 이름}&sort={}&size={}&page={}
  //응답 :
  const photoDummy = {
    content: [
      {
        photo_id: "1",
        title: "",
        photo: require("../../assets/photodummy4.jpg"),
        user_id: "",
        nickname: "",
        created_at: "",
      },
      {
        photo_id: "2",
        title: "",
        photo: require("../../assets/photodummy3.jpg"),
        user_id: "",
        nickname: "",
        created_at: "",
      },
      {
        photo_id: "3",
        title: "",
        photo: require("../../assets/photodummy2.jpg"),
        user_id: "",
        nickname: "",
        created_at: "",
      },
      {
        photo_id: "4",
        title: "",
        photo: require("../../assets/photodummy1.jpg"),
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
          <View
            style={{
              flex: 1,
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          ></View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* 위쪽 위치 정보랑 정렬 모달 아이콘 뷰 시작 */}
      <View
        style={{
          ...GlobalStyles.rowSpaceBetweenContainer,
          paddingHorizontal: 20,
          backgroundColor: "white",
        }}
      >
        <Text style={{ fontSize: 16, borderBottomWidth: 0.8 }}>
          {route.params.state}, {route.params.city}, {route.params.town}
        </Text>
        <TouchableOpacity >
          <Icon name="sort" size={27} color={"black"} />
        </TouchableOpacity>
      </View>
      {/* 위쪽 위치 정보랑 정렬 모달 아이콘 뷰 끝 */}

      {/* 사진 나열 시작 */}
      <FlatList
        data={photoDummy.content}
        renderItem={renderItem}
        keyExtractor={(item) => item.photo_id}
        ListHeaderComponent={
          <Text
            style={{
              fontSize: 18,
              color: "white",
              fontWeight: "600",
              marginVertical: 20,
            }}
          >
            Photographs
          </Text>
        }
        numColumns={3}
        // columnWrapperStyle={{ marginBottom: 5 }}
        style={{
          flex: 1,
          paddingHorizontal: 20,
          backgroundColor: "black",
        }}
        // onEndReached={loadMoreData}
      />
      {/* 사진 나열 끝 */}

      <NavBar type={SvgType.LightMap} />
    </SafeAreaView>
  );
};

export default LightMapList;
