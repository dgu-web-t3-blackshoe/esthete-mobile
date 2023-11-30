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
  Platform,
  ImageBackground,
  ScrollView,
  View,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator as Spinner,
  BackHandler,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { NavBar, SvgType } from "../../components/navbar";
import GlobalStyles from "../../assets/styles";
import { AddPhoto } from "../../components/newRoom/addPhoto";

//Redux
import { useSelector } from "react-redux";
import { State } from "../../storage/reducers";

//페이지 이동 타입
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import { SERVER_IP } from "../../components/utils";

type RootStackParamList = {
  AddPhoto: {
    exhibitionTitle: string;
    exhibitionDescription: string;
    exhibitionThumbnail: string;
  };
};

//넓이 계산
const size = Dimensions.get("window").width;

const AddRoom: React.FC = ({ route }: any) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    getMyPhotos();
  }, []);

  // try {
  //   setSpinner(true);
  //   const reponse = await axios.post(`${SERVER_IP}core/exhibitions`, {
  //     user_id: "aab7e8a5-fe79-494a-9d9c-6a5b71aa2c69",
  //     title: title,
  //     description: description,
  //     thumbnail: selectedImage,
  //   });
  //   Alert.alert(
  //     "완료",
  //     "전시회가 등록되었습니다.",
  //     [
  //       {
  //         text: "OK",
  //       },
  //     ],
  //     { cancelable: true }
  //   );
  //   console.log(reponse.data);
  //   navigation.replace("AddRoom", {
  //     exhibition_id: reponse.data.exhibition_id,
  //   });
  //   setTitle("");
  //   setDescription("");
  //   setSelectedImage(null);
  //   setSpinner(false);

  //   return;
  // } catch (e) {
  //   Alert.alert(
  //     "오류",
  //     "네트워크 연결을 확인하세요.",
  //     [
  //       {
  //         text: "OK",
  //       },
  //     ],
  //     { cancelable: true }
  //   );
  //   setSpinner(false);
  //   console.log(e);
  // }

  //내 사진 목록 불러오기
  //내 사진 목록 조회
  const [myPhotoData, setMyPhotoData] = useState<any>(null);

  const getMyPhotos = async () => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/users/aab7e8a5-fe79-494a-9d9c-6a5b71aa2c69/photos`
      );

      setMyPhotoData(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  //방 저장 상태
  const [rooms, setRooms] = useState<Array<any>>([]);

  //방 제목
  const [roomTitle, setRoomTitle] = useState<string>("");

  //방 설명
  const [roomDescription, setRoomDescription] = useState<string>("");

  //방 썸네일
  const [roomThumbnail, setRoomThumbnail] = useState<string>("");

  //사진 선택 화면 보여주는 상태
  const [showCompo, setShowCompo] = useState<number>(0);

  //선택한 사진
  const [selectedPhotos, setSelectedPhotos] = useState<Array<string>>([]);

  //반응형 버튼 onPress
  const Press = () => {
    if (showCompo === 0) {
    } else if (showCompo === 1) {
      if (
        roomTitle.length > 0 &&
        roomDescription.length > 0 &&
        roomThumbnail.length > 0
      ) {
        setShowCompo(2);
      } else {
        Alert.alert(
          "알림",
          "방 정보 입력과 대표 사진을 완료해주세요.",
          [
            {
              text: "OK",
            },
          ],
          { cancelable: true }
        );
      }
    }
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
        onPress={() => {
          if (selectedPhotos.length !== 0) {
            if (selectedPhotos.includes(item.photo_id)) {
              setSelectedPhotos((prev) =>
                prev.filter((id) => id !== item.photo_id)
              );
            } else {
              setSelectedPhotos((prev) => [...prev, item.photo_id]);
            }
          } else {
            setSelectedPhotos((prev) => [...prev, item.photo_id]);
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

              backgroundColor: selectedPhotos.includes(item.photo_id)
                ? "rgba(0, 0, 0, 0.5)"
                : "rgba(0,0,0,0)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {selectedPhotos.includes(item.photo_id) ? (
              <Icon name="checkmark" size={27} color={"white"} />
            ) : null}
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* 맨 위 제목과 Add Photo버튼 뷰 시작 */}
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
            paddingHorizontal: 15,
            backgroundColor:
              (showCompo === 0 && rooms.length > 0) ||
              (showCompo === 1 &&
                roomTitle.length > 0 &&
                roomDescription.length > 0 &&
                roomThumbnail.length > 0)
                ? "black"
                : "#c9c9c9",
          }}
          onPress={Press}
        >
          <Text style={{ color: "white", fontSize: 17 }}>
            {showCompo === 0
              ? "Publish"
              : showCompo === 1
              ? "Add Photo"
              : "Save"}
          </Text>
        </TouchableOpacity>
      </View>
      {/* 맨 위 제목과 Add Photo버튼 뷰 끝 */}

      {/* 전시회 이름 시작 */}
      {route.params.title.length > 0 && (
        <View
          style={{
            width: "100%",
            paddingHorizontal: 30,
            paddingVertical: 5,
            backgroundColor: "#c9c9c9",
          }}
        >
          <Text style={{ fontSize: 18, color: "black" }}>
            {route.params.title}
          </Text>
        </View>
      )}
      {/* 전시회 이름 끝 */}
      {showCompo === 0 ? (
        <ScrollView style={{ flex: 1, backgroundColor: "#DEDEDE" }}>
          {rooms.length === 0 ? (
            <View
              style={{
                width: "100%",
                paddingHorizontal: 20,
                alignItems: "center",
                marginBottom: 15,
                backgroundColor: "white",
                paddingVertical: 10,
              }}
            >
              <Text style={{ fontWeight: "500", fontSize: 18 }}>
                아직 방이 없습니다. 방을 추가해보세요.
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setShowCompo(1)}
          >
            <Icon name="add" size={40} color="black" />
          </TouchableOpacity>
        </ScrollView>
      ) : showCompo === 1 ? (
        <AddPhoto
          roomTitle={roomTitle}
          setRoomTitle={setRoomTitle}
          roomDescription={roomDescription}
          setRoomDescription={setRoomDescription}
          roomThumbnail={roomThumbnail}
          setRoomThumbnail={setRoomThumbnail}
          myPhotoData={myPhotoData}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default AddRoom;
