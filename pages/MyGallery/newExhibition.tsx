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
import Icon from "react-native-vector-icons/Ionicons";
import { NavBar, SvgType } from "../../components/navbar";
import GlobalStyles from "../../assets/styles";

//Redux
import { useSelector } from "react-redux";
import { State } from "../../storage/reducers";

//페이지 이동 타입
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import { SERVER_IP } from "../../components/utils";

type RootStackParamList = {
  AddRoom: {
    exhibition_id: string;
  };
};

//넓이 계산
const size = Dimensions.get("window").width;

const NewExhibition: React.FC = ({ route }: any) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  //리덕스 유저 아이디 가져오기
  const userId = useSelector((state: State) => state.USER);
  //input Data,
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  //사진 나열
  const renderItem = ({ item }: any): React.JSX.Element => {
    return (
      <TouchableOpacity
        style={{
          width: (size - 40) / 3,
          height: (size - 40) / 3,
          aspectRatio: 1,
        }}
        onPress={() => {
          if (selectedImage) {
            if (selectedImage === item.photo_id) {
              setSelectedImage(null);
            } else {
              setSelectedImage(item.photo_id);
            }
          } else {
            setSelectedImage(item.photo_id);
          }
        }}
      >
        <ImageBackground
          // source={{ uri: item.story }}
          source={{ uri: item.photo_url }}
          style={{ width: "100%", height: "100%" }}
        >
          <View
            style={{
              flex: 1,
              ...StyleSheet.absoluteFillObject,

              backgroundColor:
                selectedImage === item.photo_id
                  ? "rgba(0, 0, 0, 0.5)"
                  : "rgba(0,0,0,0)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {selectedImage === item.photo_id ? (
              <Icon name="checkmark" size={27} color={"white"} />
            ) : null}
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  //전시회 등록
  const [spinner, setSpinner] = useState<boolean>(false);

  const publishExhibition = async () => {
    if (title.length === 0) {
      Alert.alert(
        "알림",
        "제목을 입력해주세요.",
        [
          {
            text: "OK",
          },
        ],
        { cancelable: true }
      );
      return;
    } else if (description.length === 0) {
      Alert.alert(
        "알림",
        "설명을 입력해주세요.",
        [
          {
            text: "OK",
          },
        ],
        { cancelable: true }
      );
      return;
    } else if (selectedImage === null) {
      Alert.alert(
        "알림",
        "대표 사진을 선택해주세요.",
        [
          {
            text: "OK",
          },
        ],
        { cancelable: true }
      );
      return;
    } else {
      try {
        setSpinner(true);
        const reponse = await axios.post(`${SERVER_IP}core/exhibitions`, {
          user_id: "aab7e8a5-fe79-494a-9d9c-6a5b71aa2c69",
          title: title,
          description: description,
          thumbnail: selectedImage,
        });
        Alert.alert(
          "완료",
          "전시회가 등록되었습니다.",
          [
            {
              text: "OK",
            },
          ],
          { cancelable: true }
        );
        console.log(reponse.data);
        // navigation.navigate("AddRoom",{
        //   exhibition_id: reponse.data

        // })
        setTitle("");
        setDescription("");
        setSelectedImage(null);
        setSpinner(false);

        return;
      } catch (e) {
        Alert.alert(
          "오류",
          "네트워크 연결을 확인하세요.",
          [
            {
              text: "OK",
            },
          ],
          { cancelable: true }
        );
        setSpinner(false);
        console.log(e);
      }
    }
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
        <TouchableOpacity
          style={{
            paddingVertical: 3,
            backgroundColor:
              selectedImage && title.length > 0 && description.length > 0
                ? "black"
                : "#c9c9c9",
            paddingHorizontal: 15,
          }}
          onPress={publishExhibition}
        >
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
            Exhibition Title
          </Text>
          <TextInput
            cursorColor={"#FFA800"}
            placeholder="전시회 제목을 입력하세요."
            style={{
              backgroundColor: "white",
              textAlign: "center",
              height: 35,
            }}
            value={title}
            onChangeText={(text) => setTitle(text)}
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
            style={{
              backgroundColor: "white",
              textAlign: "center",
              height: 100,
            }}
            value={description}
            onChangeText={(text) => setDescription(text)}
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
