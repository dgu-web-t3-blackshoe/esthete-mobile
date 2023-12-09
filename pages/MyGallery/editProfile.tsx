//6-6
import React, { useState, useRef } from "react";

//요소
import {
  Image,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  TextInput,
} from "react-native";
import { NavBar, SvgType } from "../../components/navbar";
import GlobalStyles from "../../assets/styles";
import { GenreArray } from "../../components/constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getGenreValueByKey } from "../../components/constants";

//페이지 이동 타입
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

//라이브러리
import { Modalize } from "react-native-modalize";

import mime from "mime";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Redux
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setUserId } from "../../storage/actions";
import { State } from "../../storage/reducers";

//api
import { SERVER_IP } from "../../components/utils";

const size = Dimensions.get("window").width;

type RootStackParamList = {
  InitialPage: undefined;
  MyGallery: undefined;
  Error: undefined;
};

const EditProfile: React.FC = ({ route }: any) => {
  //리덕스 유저 아이디 가져오기
  const userId = useSelector((state: State) => state.USER);
  const dispatch = useDispatch();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  //모달
  const modalRef = useRef<Modalize>(null);
  const openModal = () => modalRef.current?.open();
  const closeModal = () => modalRef.current?.close();

  //이름 저장 상태
  const [nickname, setNickname] = useState<string>(route.params.nickname);
  //설명 저장 상태
  const [biography, setBiography] = useState<string>(route.params.biography);
  //장르는 밑에 선언

  //장비 저장 상태
  const [equipments, setEquipments] = useState<string>(
    route.params.equipments.toString()
  );

  //장르--------------------------------------------------------------------
  //장르 선택 상태
  const [checkedItems, setCheckedItems] = useState<Array<string>>(
    route.params.genres.map((e: { genre: string }, i: any) => {
      return e.genre;
    })
  );

  //장르 선택 함수
  const handleCheck = (item: string) => {
    if (checkedItems.includes(item)) {
      const temp = checkedItems.filter((e) => {
        return e !== item;
      });
      setCheckedItems(temp);
    } else {
      setCheckedItems((prev) => [...prev, item]);
    }
  };

  //사진 등록 관련 시작---------------------------------------------------
  const [isImgChange, setImgChange] = useState<boolean>(false);

  const [selectedImage, setSelectedImage] = useState<string>(
    route.params.profile_img
  );

  //카메라 접근 권한 허용
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null
  );

  const requestPermissions = async (): Promise<boolean> => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaLibraryStatus } =
      await MediaLibrary.requestPermissionsAsync();

    setCameraPermission(cameraStatus === "granted");
    setMediaLibraryPermission(mediaLibraryStatus === "granted");

    return cameraStatus === "granted" && mediaLibraryStatus === "granted";
  };

  //갤러리 접근 권한 허용
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState<
    boolean | null
  >(null);

  const pickImageFromLibrary = async (): Promise<void> => {
    if (!mediaLibraryPermission) {
      if (!(await requestPermissions())) {
        alert("권한 설정을 확인하세요!");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      exif: true,
    });
    if (!result.canceled && result.assets && result.assets[0].uri) {
      setSelectedImage(result.assets[0].uri);
      closeModal();
    }
    setImgChange(true);
  };
  const takePhotoWithCamera = async (): Promise<void> => {
    if (!cameraPermission) {
      if (!(await requestPermissions())) {
        alert("권한 설정을 확인하세요!");
        return;
      }
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      exif: true,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setSelectedImage(result.assets[0].uri);
      closeModal();
    }
    setImgChange(true);
  };

  const submitSupport = async () => {
    const formData: any = new FormData();
    formData.append("profile_img", {
      uri: selectedImage,
      type: mime.getType(selectedImage),
      name: selectedImage.split("/").pop(),
    });

    const profileData = {
      biography: biography,
      equipments: [`${equipments}`],
      genres: checkedItems.map((e, i) => getGenreValueByKey(e)),
      
      nickname: nickname,
    };

    const jsonData = JSON.stringify(profileData);
    formData.append("userUpdateProfileRequest", jsonData);

    try {
      await fetch(`${SERVER_IP}core/users/${userId}/profile`, {
        method: "put",
        headers: {
          "content-Type": "multipart/form-data; ",
          // Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      Alert.alert(
        "완료",
        "저장하였습니다.",
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
      navigation.replace("MyGallery");
    } catch (e) {
      console.log(e);
      Alert.alert(
        "실패",
        "저장에 실패하셨습니다.",
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
      navigation.replace("Error");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* 맨위 Edit Profile 타이틀, Save 버튼 뷰 시작*/}
      <View
        style={{
          ...GlobalStyles.rowSpaceBetweenContainer,
          paddingHorizontal: 20,
        }}
      >
        <Text style={GlobalStyles.bigFont}>Edit Profile</Text>
        <TouchableOpacity
          style={{
            ...GlobalStyles.backgroundBlackBox,
            backgroundColor:
              nickname !== route.params.nickname ||
              biography !== route.params.biography ||
              equipments !== route.params.equipments[0] ||
              !(
                route.params.genres.map((e: { genre: any }) => e.genre)
                  .length === checkedItems.length &&
                route.params.genres
                  ?.map((e: { genre: any }) => e.genre)
                  .every((element: string) => checkedItems.includes(element))
              ) ||
              isImgChange
                ? "black"
                : "#c9c9c9",
          }}
          onPress={submitSupport}
          disabled={
            !(
              nickname !== route.params.nickname ||
              biography !== route.params.biography ||
              equipments !== route.params.equipments[0] ||
              !(
                route.params.genres.map((e: { genre: any }) => e.genre)
                  .length === checkedItems.length &&
                route.params.genres
                  ?.map((e: { genre: any }) => e.genre)
                  .every((element: string) => checkedItems.includes(element))
              ) ||
              isImgChange
            )
          }
        >
          <Text style={{ color: "white", fontSize: 17 }}>save</Text>
        </TouchableOpacity>
      </View>
      {/* 맨위 Edit Profile 타이틀, Save 버튼 뷰 끝*/}

      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingVertical: 20,
          backgroundColor: "black",
        }}
      >
        {/* 프사, 이름, 설명 부분 시작 */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            borderBottomWidth: 0.8,
            borderColor: "white",
            paddingBottom: 20,
          }}
        >
          <TouchableOpacity onPress={openModal}>
            {selectedImage === "" ? (
              <Image
                source={require("../../assets/default_profile.png")}
                style={{ width: 150, height: 150 }}
              />
            ) : (
              <Image
                source={{ uri: selectedImage }}
                style={{ width: 150, height: 150 }}
              />
            )}
          </TouchableOpacity>
          <View style={{ gap: 15, width: size - 200 }}>
            <TextInput
              cursorColor={"#FFA800"}
              value={nickname}
              maxLength={7}
              onChangeText={(text) => setNickname(text)}
              style={{ ...styles.text, fontSize: 18, height: 25 }}
            />

            <TextInput
              cursorColor={"#FFA800"}
              value={biography}
              onChangeText={(text) => setBiography(text)}
              style={{ ...styles.text, height: 110 }}
              multiline
            />
          </View>
        </View>
        {/* 프사, 이름, 설명 부분 끝 */}

        {/* 장르 부분 시작 */}
        <Text style={styles.bigText}>Genre</Text>
        <View
          style={{
            borderBottomWidth: 0.8,
            borderColor: "white",
            paddingHorizontal: 5,
            paddingBottom: 7,
          }}
        >
          {GenreArray.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginVertical: 5,
                width: "100%",
              }}
              onPress={() => {
                handleCheck(item);
              }}
            >
              <View
                style={{
                  width: 13,
                  height: 13,
                  backgroundColor: checkedItems.includes(item)
                    ? "#FFA800"
                    : "white",
                  borderWidth: 1,
                  borderColor: "white",
                }}
              />
              <Text style={{ color: "white", fontSize: 16 }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* 장르 부분 끝 */}
        {/* 장비 부분 시작 */}
        <Text style={styles.bigText}>Equipment</Text>
        <TextInput
          cursorColor={"#FFA800"}
          value={equipments}
          style={styles.bigTextInput}
          multiline
          onChangeText={(text) => setEquipments(text)}
        />
        {/* 장비 부분 끝 */}

        <View
          style={{ width: "100%", marginBottom: 45, alignItems: "flex-end" }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              width: 100,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 3,
              paddingHorizontal: 10,
              borderRadius: 4,
            }}
            onPress={() => {
              dispatch(setUserId(null));
              navigation.navigate("InitialPage");
              AsyncStorage.removeItem("user_id");
            }}
          >
            <Text style={{ color: "black", fontWeight: "500", fontSize: 18 }}>
              로그 아웃
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <NavBar type={SvgType.MyGallery} />
      <Modalize ref={modalRef} adjustToContentHeight={true}>
        <View style={styles.modal_container}>
          <View style={{ ...styles.horizontal_container, paddingVertical: 30 }}>
            <Text style={styles.modal_title_text}>프로필 사진 변경</Text>
            <TouchableOpacity onPress={closeModal}>
              <Icon name="close" size={30} color={"#26282C"} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ ...styles.modal_button, backgroundColor: "#363538" }}
            onPress={pickImageFromLibrary}
          >
            <Icon
              name="image"
              size={30}
              color={"white"}
              style={{ position: "absolute", left: 20 }}
            />
            <Text style={{ ...styles.modal_button_text, color: "white" }}>
              라이브러리에서 선택
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.modal_button, backgroundColor: "#363538" }}
            onPress={takePhotoWithCamera}
          >
            <Icon
              name="camera"
              size={30}
              color={"white"}
              style={{ position: "absolute", left: 20 }}
            />
            <Text style={{ ...styles.modal_button_text, color: "white" }}>
              사진찍기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.modal_button,
              backgroundColor: "#D0D3D4",
              marginTop: 15,
              marginBottom: 45,
            }}
            onPress={closeModal}
          >
            <Text style={{ ...styles.modal_button_text, color: "black" }}>
              취소
            </Text>
          </TouchableOpacity>
        </View>
      </Modalize>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;
const styles = StyleSheet.create({
  text: {
    fontWeight: "500",
    textAlign: "center",
    backgroundColor: "white",
    paddingHorizontal: 5,
  },
  bigText: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 7,
  },
  bigTextInput: {
    marginTop: 10,
    fontWeight: "500",
    textAlign: "center",
    backgroundColor: "white",
    fontSize: 18,
    height: 100,
    borderRadius: 4,
    marginBottom: 25,
  },
  modal_container: {
    paddingHorizontal: 30,
  },
  horizontal_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modal_title_text: {
    fontWeight: "500",
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 1,
  },
  modal_button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 4,
    marginBottom: 12,
  },
  modal_button_text: {
    fontSize: 16,
  },
});
