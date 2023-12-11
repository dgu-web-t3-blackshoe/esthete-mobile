import React, { useState, useEffect } from "react";

//요소
import {
  Image,
  Alert,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  View,
  BackHandler,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import GlobalStyles from "../../assets/styles";
import { RoomInfo } from "../../components/newRoom/roomInfo";
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
  MyGallery: undefined;
};

const AddRoom: React.FC = ({ route }: any) => {
  //리덕스 유저 아이디 가져오기
  const userId = useSelector((state: State) => state.USER);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    getMyPhotos();
  }, []);

  //내 사진 목록 불러오기
  //내 사진 목록 조회
  const [myPhotoData, setMyPhotoData] = useState<any>(null);

  const getMyPhotos = async () => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/users/${userId}/photos?size=20&page=0`
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

  const [exhibitionID, setExhibitionID] = useState<any>(null);
  const submit = async () => {
    try {
      if (exhibitionID === null) {
        const response = await axios.post(`${SERVER_IP}core/exhibitions`, {
          user_id: userId,
          title: route.params.title,
          description: route.params.description,
          thumbnail: route.params.thumbnail,
        });
        setExhibitionID(response.data.exhibition_id);
        await axios.post(
          `${SERVER_IP}core/exhibitions/${response.data.exhibition_id}/rooms`,
          {
            description: roomDescription,
            photos: selectedPhotos,
            thumbnail: roomThumbnail,
            title: roomTitle,
          }
        );
      } else {
        await axios.post(`${SERVER_IP}core/exhibitions/${exhibitionID}/rooms`, {
          description: roomDescription,
          photos: selectedPhotos,
          thumbnail: roomThumbnail,
          title: roomTitle,
        });
      }
      Alert.alert(
        "완료",
        "전시실이 등록되었습니다.",
        [
          {
            text: "OK",
          },
        ],
        { cancelable: true }
      );
      setRooms((prev) => [
        ...prev,
        {
          roomTitle: roomTitle,
          roomDescription: roomDescription,
          roomThumbnail: roomThumbnail,
          roomPhotos: selectedPhotos,
        },
      ]);
      setRoomTitle("");
      setRoomDescription("");
      setRoomThumbnail("");
      setSelectedPhotos([]);
      setShowCompo(0);
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
      console.log(e);
    }
  };

  //반응형 버튼 onPress
  const Press = () => {
    if (showCompo === 0) {
      if (rooms.length > 0) {
        Alert.alert(
          "알림",
          "전시회가 등록되었습니다.",
          [
            {
              text: "OK",
            },
          ],
          { cancelable: true }
        );
        navigation.navigate("MyGallery");
      } else {
        Alert.alert(
          "알림",
          "전시실을 등록해주세요.",
          [
            {
              text: "OK",
            },
          ],
          { cancelable: true }
        );
      }
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
    } else {
      if (selectedPhotos.length > 0) {
        submit();
      } else {
        Alert.alert(
          "알림",
          "하나 이상의 사진을 선택하세요.",
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
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (showCompo === 0) {
          if (rooms.length === 0) {
            navigation.goBack();
            return true;
          } else {
            Alert.alert(
              "경고",
              "전시회 등록을 종료하시겠습니까?",
              [
                {
                  text: "취소",
                  onPress: () => null,
                  style: "cancel",
                },
                {
                  text: "확인",
                  onPress: () => navigation.navigate("MyGallery"),
                },
              ],
              { cancelable: false }
            );
            return true;
          }
        } else if (showCompo === 1) {
          setRoomTitle("");
          setRoomDescription("");
          setRoomThumbnail("");
          setShowCompo(0);
          return true;
        } else {
          setSelectedPhotos([]);
          setShowCompo(1);
          return true;
        }
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove();
    }, [navigation, showCompo, rooms])
  );

  function findPhotoUrl(array: any, value: any) {
    return array.find((e: any) => e.photo_id === value);
  }
  function truncateText(text: any, maxLength: any) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    } else {
      return text;
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* 맨 위 제목과 Add Photo버튼 뷰 시작 */}
      <View
        style={{
          ...GlobalStyles.rowSpaceBetweenContainer,
          paddingHorizontal: 20,
          borderBottomWidth: 0.4,
        }}
      >
        <View>
          <Text style={GlobalStyles.bigFont}>
            {showCompo === 0
              ? "New Exhibition"
              : showCompo === 1
              ? "Add Room"
              : "Add Photo"}
          </Text>

          {/* 전시회 이름 시작 */}
          {route.params.title.length > 0 && (
            <View
              style={{
                width: "100%",
              }}
            >
              <Text style={{ fontSize: 15, color: "black" }}>
                {route.params.title}
              </Text>
            </View>
          )}
          {/* 전시회 이름 끝 */}
        </View>
        <TouchableOpacity
          style={{
            paddingVertical: 3,
            paddingHorizontal: 15,
            backgroundColor:
              (showCompo === 0 && rooms.length > 0) ||
              (showCompo === 1 &&
                roomTitle.length > 0 &&
                roomDescription.length > 0 &&
                roomThumbnail.length > 0) ||
              (showCompo === 2 && selectedPhotos.length > 0)
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

      {showCompo === 0 ? (
        <ScrollView style={{ flex: 1, backgroundColor: "#DEDEDE" }}>
          {rooms.length === 0 ? (
            <View
              style={{
                width: "100%",
                paddingHorizontal: 20,
                alignItems: "center",
                marginBottom: 15,
                paddingVertical: 10,
              }}
            >
              <Text style={{ fontWeight: "500", fontSize: 18 }}>
                아직 방이 없습니다. 방을 추가해보세요.
              </Text>
            </View>
          ) : (
            rooms.map((e, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    backgroundColor: "white",
                  }}
                >
                  <Image
                    source={{
                      uri: findPhotoUrl(myPhotoData.content, e.roomThumbnail)
                        .photo_url,
                    }}
                    style={{ width: 80, height: 80 }}
                  />
                  <View
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 30,
                      gap: 5,
                      width: "100%",
                    }}
                  >
                    <Text style={{ fontWeight: "500", fontSize: 18 }}>
                      {e.roomTitle}
                    </Text>
                    <Text style={{ width: "100%" }}>
                      {truncateText(e.roomDescription, 20)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}

          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
            onPress={() => setShowCompo(1)}
          >
            <Icon name="add" size={40} color="black" />
          </TouchableOpacity>
        </ScrollView>
      ) : showCompo === 1 ? (
        <RoomInfo
          roomTitle={roomTitle}
          setRoomTitle={setRoomTitle}
          roomDescription={roomDescription}
          setRoomDescription={setRoomDescription}
          roomThumbnail={roomThumbnail}
          setRoomThumbnail={setRoomThumbnail}
          myPhotoData={myPhotoData}
        />
      ) : (
        <AddPhoto
          selectedPhotos={selectedPhotos}
          setSelectedPhotos={setSelectedPhotos}
          myPhotoData={myPhotoData}
        />
      )}
    </SafeAreaView>
  );
};

export default AddRoom;
