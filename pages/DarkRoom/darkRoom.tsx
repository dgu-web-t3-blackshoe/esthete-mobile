import React, { useState, useRef, useEffect } from "react";

//요소
import {
  Alert,
  Image,
  Text,
  KeyboardAvoidingView,
  View,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { NavBar, SvgType } from "../../components/navbar";
import {
  GenreArray,
  getGenreValueByKey,
} from "../../components/constants";
import GlobalStyles from "../../assets/styles";

import { Step1 } from "../../components/darkRoom/darkRoomStep1";
import { Step2 } from "../../components/darkRoom/darkRoomStep2";
import { Step3 } from "../../components/darkRoom/darkRoomStep3";
import { ProgressBar } from "../../components/darkRoom/progressBar";

//구글맵 Autocomplete API KEY
import { API_KEY } from "@env";

//Redux
import { useSelector } from "react-redux";
import { State } from "../../storage/reducers";

//라이브러리
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker, Region } from "react-native-maps";
import { Modalize } from "react-native-modalize";
import mime from "mime";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import * as Location from "expo-location";

//api
import { SERVER_IP } from "../../components/utils";

//nav
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

//위치 정보 인터페이스
interface Location {
  latitude: number;
  longitude: number;
}

type RootStackParamList = {
  MyGallery: undefined;
};

const DarkRoom: React.FC = () => {
  const userId = useSelector((state: State) => state.USER);
  const token = useSelector((state: State) => state.TOKEN);
  const { lat, lon } = useSelector((state: State) => state.location);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  //모달
  const modalRef = useRef<Modalize>(null);
  const openModal = () => modalRef.current?.open();
  const closeModal = () => modalRef.current?.close();

  //진행 바 관련
  const [currentStep, setCurrentStep] = useState<number>(1);
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  //정보 입력 상태
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [equipments, setEquipments] = useState<string>("");

  //사진 등록 관련 시작---------------------------------------------------
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  //카메라 접근 권한 허용n
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
      exif: true,
    });
    if (!result.canceled && result.assets && result.assets[0].uri) {
      setSelectedImage(result.assets[0].uri);
      closeModal();
    }
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
      exif: true,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setSelectedImage(result.assets[0].uri);
      closeModal();
    }
  };

  //Upload
  const publish = () => {
    if (
      selectedImage &&
      title.length > 0 &&
      description.length > 0 &&
      locationInfo &&
      equipments.length > 0
    ) {
      upload();
    } else {
      Alert.alert(
        "경고",
        "입력을 완료해주세요.",
        [
          {
            text: "OK",
          },
        ],
        { cancelable: true }
      );
    }
  };

  const upload = async () => {
    const formData = new FormData();
    formData.append("photo", {
      uri: selectedImage,
      type: mime.getType(selectedImage),
      name: selectedImage.split("/").pop(),
    });

    const imageData = {
      title: title,
      description: description,
      latitude: locationInfo[1],
      longitude: locationInfo[0],
      is_public: "string",
      state: locationInfo[2],
      city: locationInfo[3],
      town: locationInfo[4],
      time: dateText,
      equipments: [`${equipments}`],
      genre_ids: genreOption.map((e: string, i: any) => getGenreValueByKey(e)),
    };
    const jsonData = JSON.stringify(imageData);

    formData.append("photo_upload_request", jsonData);

    try {
      await fetch(`${SERVER_IP}core/photos/${userId}`, {
        method: "post",
        headers: {
          "content-Type": "multipart/form-data; ",
        },
        body: formData,
      });
      Alert.alert(
        "게시 완료",
        "사진을 게시하였습니다.",
        [
          {
            text: "OK",
            // onPress: () => navigation.navigate("MyGallery"),
          },
        ],
        { cancelable: false }
      );
      navigation.replace("MyGallery");
    } catch (e) {
      console.log(e);
    }
  };

  //맵뷰 관련 시작-----------------------------------------------------------------
  //맵뷰 visible 상태
  const [showMap, setShowMap] = useState<boolean | false>(false);
  //맵뷰 위치정보 상태
  const [region, setRegion] = useState<Region>({
    latitude: 37.557067,
    longitude: 126.971179,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  useEffect(() => {
    if (lat !== null && lon !== null) {
      setRegion({
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [lat, lon]);

  //맵뷰 위치 핸들링
  const handleSelectLocation = (data: any, details: any = null) => {
    const location = details.geometry.location;
    setRegion({
      ...region,
      latitude: location.lat,
      longitude: location.lng,
    });
  };
  //단순 클릭 시 임시 저장 위치 정보 상태
  const [temporaryLocation, setTemporaryLocation] = useState<Location | null>(
    null
  );

  //선택된 위치 상태
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  //위치 정보 전부 들고 있는 배열 상태
  const [locationInfo, setLocationInfo] = useState<(string | number)[]>([
    0,
    0,
    "state",
    "city",
    "town",
  ]);

  //위도 경도로 위치 정보 받아오는 함수
  const getLocationInfo = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            latlng: `${latitude},${longitude}`,
            key: API_KEY,
            language: "ko",
          },
        }
      );

      let longestAddress = response.data.results[0].formatted_address || "";
      for (const result of response.data.results) {
        const currentAddress = result.formatted_address || "";
        if (currentAddress.length > longestAddress.length) {
          longestAddress = currentAddress;
        }
      }

      const formattedAddress = response.data.results[0].formatted_address;
      const addressParts = formattedAddress.split(" ");
      if (addressParts.includes("대한민국")) {
        const indexofC = addressParts.indexOf("대한민국");
        const state = addressParts[indexofC + 1] || "";
        const city = addressParts[indexofC + 2] || "";
        const town = addressParts[indexofC + 3] || "";
        setLocationInfo([longitude, latitude, state, city, town]);
      } else {
        const state = addressParts[1] || "";
        const city = addressParts[2] || "";
        const town = addressParts[3] || "";

        setLocationInfo([longitude, latitude, state, city, town]);
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  //위도, 경도로 위치 정보 이름 가져오기
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (temporaryLocation !== null) {
      mapRef.current?.animateToRegion(
        {
          latitude: temporaryLocation.latitude,
          longitude: temporaryLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        500
      );
      getLocationInfo(temporaryLocation.latitude, temporaryLocation.longitude);
    }
  }, [temporaryLocation]);

  //맵뷰 관련 끝-----------------------------------------------------------------

  //슬라이드3 관련-----------------------------------------------------------------------------
  //날짜
  const [date, setDate] = useState(new Date());
  const [dateText, setDateText] = useState<string>("촬영 날짜를 입력하세요.");

  //장르----------------------------------------------------
  //장르 모달
  const [isGenreModalVisible, setIsGenreModalVisible] = useState<any>(false);
  const [genreOption, setGenreOption] = useState<any>([]);

  const toggleGenreModal = () => {
    setIsGenreModalVisible(!isGenreModalVisible);
  };

  const handleGenreSelection = (option: any) => {
    if (genreOption.includes(option)) {
      setGenreOption(genreOption.filter((item: any) => item !== option));
    } else {
      setGenreOption([...genreOption, option]);
    }
  };

  const confirmSelection = () => {
    const genreIds = genreOption.map((option: any) =>
      getGenreValueByKey(option)
    );
    toggleGenreModal();
  };

  const cancelSelection = () => {
    setGenreOption([]);
    toggleGenreModal();
  };

  //이미지 레이아웃
  const windowWidth = Dimensions.get("window").width;
  const [imageHeight, setImageHeight] = useState<any>(windowWidth - 90);

  const handleImageLoaded = (event: any) => {
    const { width, height } = event.nativeEvent.source;
    const aspectRatio = height / width;
    const calculatedHeight = (windowWidth - 90) * aspectRatio;
    setImageHeight(calculatedHeight);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {showMap ? (
        //맵뷰 시작
        <SafeAreaView
          style={{
            flex: 1,
          }}
        >
          <GooglePlacesAutocomplete
            placeholder="Search"
            onPress={handleSelectLocation}
            query={{
              key: API_KEY,
              language: "en",
            }}
            GooglePlacesDetailsQuery={{ fields: "geometry" }}
            fetchDetails={true}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
            styles={{
              textInput: {
                backgroundColor: "white",
                height: "90%",
                color: "#5d5d5d",
                fontSize: 18,
                borderWidth: 1,
                width: "80%",
                paddingLeft: 15,
                borderColor: "#DDE1E4",
              },
              container: {
                position: "absolute",
                top: 0,
                paddingTop: "2%",
                paddingBottom: 13,
                paddingHorizontal: "3%",
                width: "100%",
                backgroundColor: "black",
                zIndex: 2,
              },
            }}
          />

          <MapView
            style={{ flex: 1 }}
            ref={mapRef}
            region={region}
            onRegionChangeComplete={setRegion}
            onPress={(e) => {
              setTemporaryLocation(e.nativeEvent.coordinate);
            }}
            initialRegion={{
              latitude: lat ? lat : 37.557067,
              longitude: lon ? lon : 126.971179,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {temporaryLocation && (
              <Marker coordinate={temporaryLocation}>
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor: "black",
                      padding: 5,
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "600",
                        paddingHorizontal: 8,
                      }}
                    >
                      {locationInfo[2] +
                        " " +
                        locationInfo[3] +
                        " " +
                        locationInfo[4]}
                    </Text>
                  </View>
                </View>
              </Marker>
            )}
          </MapView>

          {temporaryLocation ? (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                backgroundColor: "black",
                paddingVertical: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setSelectedLocation(temporaryLocation);
                  setTemporaryLocation(null);
                  setShowMap(!showMap);
                }}
                style={{
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 23,
                    fontWeight: "600",
                    letterSpacing: 10,
                  }}
                >
                  확인
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </SafeAreaView>
      ) : (
        // 맵뷰 끝-------------------------------------------------------------
        <SafeAreaView
          style={{
            flex: 1,
          }}
        >
          {/* //맨 위 Dark Room 글자랑 Publish 버튼 뷰 시작 */}
          <View>
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
                Dark Room
              </Text>
              <TouchableOpacity
                style={{
                  ...GlobalStyles.backgroundBlackBox,
                  backgroundColor:
                    selectedImage &&
                    title.length > 0 &&
                    description.length > 0 &&
                    locationInfo &&
                    equipments.length > 0
                      ? "black"
                      : "#c9c9c9",
                }}
                disabled={
                  !(
                    selectedImage &&
                    title.length > 0 &&
                    description.length > 0 &&
                    locationInfo &&
                    equipments.length > 0
                  )
                }
                onPress={publish}
              >
                <Text
                  style={{
                    fontSize: 17,
                    color: "white",
                  }}
                >
                  Publish
                </Text>
              </TouchableOpacity>
            </View>
            <ProgressBar currentStep={currentStep} />
          </View>

          {/* //맨 위 Dark Room 글자랑 Publish 버튼 뷰 끝  */}

          {/* 아래쪽 전부 시작 */}
          <ScrollView style={{ flex: 1, backgroundColor: "black" }}>
            <View
              style={{
                paddingVertical: 40,
                paddingHorizontal: 20,
                alignItems: "center",
              }}
            >
              {/* 사진 추가 넣는 박스 시작 */}
              <TouchableOpacity
                style={{
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 10,
                }}
                onPress={openModal}
              >
                {selectedImage ? (
                  <Image
                    source={{ uri: selectedImage }}
                    style={{
                      width: imageHeight ? windowWidth - 90 : 0,
                      height: imageHeight || 0,
                    }}
                    onLoad={(event) => handleImageLoaded(event)}
                  />
                ) : (
                  <View
                    style={{
                      width: 300,
                      height: 400,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon name="plus-thick" size={27} color={"black"} />
                  </View>
                )}
              </TouchableOpacity>
              {currentStep === 1 && (
                <Step1
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                />
              )}
              {currentStep === 2 && (
                <Step2
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                  showMap={showMap}
                  setShowMap={setShowMap}
                  locationInfo={locationInfo}
                />
              )}
              {currentStep === 3 && (
                <Step3
                  date={date}
                  setDate={setDate}
                  dateText={dateText}
                  setDateText={setDateText}
                  genreOption={genreOption}
                  toggleGenreModal={toggleGenreModal}
                  equipments={equipments}
                  setEquipments={setEquipments}
                />
              )}
              {/* 아래 쪽 이전 , 다음 버튼 뷰 시작 */}
              <View
                style={{
                  width: 300,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 35,
                }}
              >
                {currentStep > 1 && (
                  <TouchableOpacity
                    onPress={handleBack}
                    style={{
                      ...styles.button,
                      backgroundColor: "white",
                      width: currentStep === 3 ? "100%" : 140,
                    }}
                  >
                    <Text style={styles.buttonText}>Before</Text>
                  </TouchableOpacity>
                )}
                {currentStep < 3 && (
                  <TouchableOpacity
                    onPress={handleNext}
                    style={{
                      ...styles.button,
                      backgroundColor:
                        (currentStep === 1 &&
                          !(
                            selectedImage &&
                            title.length > 0 &&
                            description.length > 0
                          )) ||
                        (currentStep === 2 && !locationInfo)
                          ? "#c9c9c9"
                          : "white",
                      width: currentStep === 1 ? "100%" : 140,
                    }}
                    disabled={
                      (currentStep === 1 &&
                        !(
                          selectedImage &&
                          title.length > 0 &&
                          description.length > 0
                        )) ||
                      (currentStep === 2 && !locationInfo)
                        ? true
                        : false
                    }
                  >
                    <Text style={styles.buttonText}>Next</Text>
                  </TouchableOpacity>
                )}
              </View>
              {/* 아래 쪽 이전 , 다음 버튼 뷰 끝 */}
            </View>
          </ScrollView>
        </SafeAreaView>
        // {/* 아래쪽 전부 끝 */}
      )}

      {/* 장르 모달 */}
      <Modal
        animationType="none"
        transparent={true}
        visible={isGenreModalVisible}
        onRequestClose={toggleGenreModal}
      >
        <TouchableWithoutFeedback onPress={toggleGenreModal}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 22,
              width: "100%",
              height: "100%",

              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                paddingTop: 30,
                paddingBottom: 10,
                width: 280,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {GenreArray.map((e, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    style={styles.modalTextContainer}
                    onPress={() => handleGenreSelection(e)}
                  >
                    <Text style={styles.modalText}>{e}</Text>
                    {genreOption.includes(e) ? (
                      <Icon name="check" size={27} color={"black"} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 10,
                backgroundColor: "white",
                width: 280,
              }}
            >
              <TouchableOpacity
                style={{
                  paddingHorizontal: 35,
                  paddingVertical: 15,
                }}
                onPress={cancelSelection}
              >
                <Text style={{ fontSize: 20, fontWeight: "500" }}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 35,
                }}
                onPress={confirmSelection}
              >
                <Text style={{ fontSize: 20, fontWeight: "500" }}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <NavBar type={SvgType.DarkRoom} />
      <Modalize ref={modalRef} adjustToContentHeight={true}>
        <View style={styles.modal_container}>
          <View style={{ ...styles.horizontal_container, paddingVertical: 30 }}>
            <Text style={styles.modal_title_text}>Upload</Text>
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
export default DarkRoom;

const styles = StyleSheet.create({
  modalText: {
    fontSize: 20,
  },
  modalTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 40,
    paddingVertical: 5,
  },
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
    fontSize: 23,
    lineHeight: 28,
    letterSpacing: 2,
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
