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

//넓이 계산
const size = Dimensions.get("window").width;

const NewExhibition: React.FC = ({ route }: any) => {
  //리덕스 유저 아이디 가져오기
  const userId = useSelector((state: State) => state.USER);
  console.log("at newExhibition: ", route.params);
  //input Data,
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

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
          source={{ uri: item.photo_url }}
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
      {route.params.myPhotos ? (
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
            {title}
          </Text>
          <TextInput
            cursorColor={"#FFA800"}
            placeholder="전시회 제목을 입력하세요."
            style={{
              backgroundColor: "white",
              textAlign: "center",
              height: 35,
            }}
          />

          <Text
            style={{
              fontSize: 17,
              fontWeight: "500",
              marginVertical: 15,
              color: "white",
            }}
          >
            {description}
          </Text>
          <TextInput
            cursorColor={"#FFA800"}
            placeholder="전시회 설명을 입력하세요."
            style={{
              backgroundColor: "white",
              textAlign: "center",
              height: 100,
            }}
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
            data={route.params.myPhotos}
            renderItem={renderItem}
            keyExtractor={(item) => item.photo_id}
            numColumns={3}
            style={{
              flex: 1,
              backgroundColor: "black",
              marginBottom: 20,
            }}
          />
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
    </KeyboardAvoidingView>
  );
};

export default NewExhibition;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 5,
    paddingVertical: 5,
  },
  buttonText: {
    color: "black",
    fontWeight: "600",
    fontSize: 18,
    letterSpacing: 3,
  },
});
