import React, { useState, useRef, useEffect } from "react";

//요소
import {
  Image,
  Alert,
  TextInput,
  Text,
  KeyboardAvoidingView,
  View,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator as Spinner,
} from "react-native";
import { NavBar, SvgType } from "../../components/navbar";
import GlobalStyles from "../../assets/styles";

//구글맵 Autocomplete API KEY
import { API_KEY } from "@env";

//Redux
import { useSelector } from "react-redux";
import { State } from "../../storage/reducers";

//라이브러리
import Swiper from "react-native-swiper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker, Region } from "react-native-maps";
import axios from "axios";
import * as Location from "expo-location";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

//위치 정보 인터페이스
interface Location {
  latitude: number;
  longitude: number;
}

const DarkRoom: React.FC = () => {
  //스위퍼 인덱스 핸들링
  const swiperRef = useRef<Swiper>(null);
  const goToNextSlide = () => {
    swiperRef.current?.scrollBy(1);
  };
  const goToPrevSlide = () => {
    swiperRef.current?.scrollBy(-1);
  };

  //맵뷰 관련 시작-----------------------------------------------------------------
  //현재 위치 업데이트
  const { lat, lon } = useSelector((state: State) => state.location);
  //맵뷰 visible 상태
  const [showMap, setShowMap] = useState<Boolean | false>(false);
  //맵뷰 위치정보 상태
  const [region, setRegion] = useState<Region>({
    latitude: 37.557067,
    longitude: 126.971179,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
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

      const formattedAddress = response.data.results[0].formatted_address;

      const addressParts = formattedAddress.split(" ");
      const length = addressParts.length;
      const state = addressParts[length - 4] || "";
      const city = addressParts[length - 3] || "";
      const town = addressParts[length - 2] || "";

      setLocationInfo([longitude, latitude, state, city, town]);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  //위도, 경도로 위치 정보 이름 가져오기
  useEffect(() => {
    if (temporaryLocation !== null) {
      getLocationInfo(temporaryLocation.latitude, temporaryLocation.longitude);
    }
  }, [temporaryLocation]);

  //맵뷰 관련 끝-----------------------------------------------------------------

  //슬라이드3 관련-----------------------------------------------------------------------------
  //Date Picker 시작----------------------------------------
  const [date, setDate] = useState<Date>(new Date());
  // console.log(date);
  //위 콘솔 로그 : 2023-11-09T03:21:10.405Z -> 파싱 필요
  const [show, setShow] = useState<Boolean | false>(false);
  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };
  //Date Picker 끝------------------------------------------
  //장르----------------------------------------------------
  // "Portrait"
  // "Landscape"
  // "Street"
  // "Food"
  // "Travel"
  // "Fashion"
  // "Architectural"
  // "Night"
  // "Sports"
  // "Journalism"
  // "Wildlife"
  // "Fine-art"

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
            <TouchableOpacity style={GlobalStyles.backgroundBlackBox}>
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
                  width: 300,
                  height: 430,
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon name="plus-thick" size={27} color={"black"} />
              </TouchableOpacity>
              {/* 사진 추가 넣는 박스 끝 */}

              {/* 사진 정보 시작 */}
              <Swiper
                style={{
                  height: 280,
                  marginVertical: 8,
                  marginTop: 30,
                }}
                activeDotColor="white"
                dotColor="grey"
                paginationStyle={{ bottom: -10 }}
                dotStyle={{
                  width: 13,
                  height: 13,
                  borderRadius: 50,
                  borderWidth: 0.8,
                  borderColor: "black",
                }}
                activeDotStyle={{
                  width: 13,
                  height: 13,
                  borderRadius: 50,
                  borderColor: "black",
                }}
                ref={swiperRef}
              >
                {/* 슬라이드1 시작 */}
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  {/* 슬라이드1 제목 입력 뷰 시작 */}
                  <View
                    style={{
                      ...GlobalStyles.rowSpaceBetweenContainer,
                      width: 300,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 22,
                        color: "white",
                        fontWeight: "500",
                      }}
                    >
                      Title
                    </Text>
                    <TextInput
                      style={{
                        borderColor: "gray",
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        width: 220,
                        backgroundColor: "white",
                      }}
                      placeholder="사진 제목을 입력하세요."
                    />
                  </View>
                  {/* 슬라이드1 제목 입력 뷰 끝 */}

                  {/* 슬라이드1 설명 입력 뷰 시작 */}
                  <View style={{ width: 300, marginVertical: 15 }}>
                    <Text
                      style={{
                        fontSize: 22,
                        color: "white",
                        fontWeight: "500",
                        marginBottom: 15,
                      }}
                    >
                      Description
                    </Text>
                    <TextInput
                      style={{
                        paddingHorizontal: 10,
                        width: 300,
                        height: 150,
                        backgroundColor: "white",
                        textAlign: "center",
                      }}
                      placeholder="사진 설명을 입력하세요."
                    />
                  </View>
                  {/* 슬라이드1 설명 입력 뷰 끝 */}
                </View>
                {/* 슬라이드1 끝 */}

                {/* 슬라이드2 시작 */}
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 300,
                    }}
                  >
                    <View
                      style={{
                        ...GlobalStyles.rowSpaceBetweenContainer,
                        marginBottom: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 22,
                          color: "white",
                          fontWeight: "500",
                        }}
                      >
                        Location
                      </Text>
                      {locationInfo[2] === "state" ? null : (
                        <Text
                          style={{
                            color: "white",

                            width: 200,
                          }}
                        >
                          {locationInfo[2] +
                            " " +
                            locationInfo[3] +
                            " " +
                            locationInfo[4]}
                        </Text>
                      )}
                    </View>

                    {/* <Spinner size="small" color="white" /> */}

                    {selectedLocation === null ? (
                      <TouchableOpacity
                        style={{
                          width: 300,
                          height: 180,
                          backgroundColor: "white",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => setShowMap(!showMap)}
                      >
                        <Text>위치 정보를 입력하세요</Text>
                      </TouchableOpacity>
                    ) : (
                      <MapView
                        scrollEnabled={false}
                        style={{ width: 300, height: 180 }}
                        initialRegion={{
                          latitude: selectedLocation.latitude,
                          longitude: selectedLocation.longitude,
                          latitudeDelta: 0.0922,
                          longitudeDelta: 0.0421,
                        }}
                      >
                        <Marker
                          coordinate={{
                            latitude: selectedLocation.latitude,
                            longitude: selectedLocation.longitude,
                          }}
                          title={"내 위치"}
                        />
                      </MapView>
                    )}
                  </View>
                </View>

                {/* 슬라이드3 날짜 etc */}
                <View style={{ paddingHorizontal: 20 }}>
                  <View style={GlobalStyles.rowSpaceBetweenContainer}>
                    <Text
                      style={{
                        fontSize: 20,
                        color: "white",
                        fontWeight: "500",
                      }}
                    >
                      Time
                    </Text>
                    <TouchableOpacity onPress={showDatepicker}>
                      <Text style={{ color: "white" }}>Select Date</Text>
                    </TouchableOpacity>
                    {show && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={"date"}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                      />
                    )}
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 20,
                        color: "white",
                        fontWeight: "500",
                      }}
                    >
                      Genres
                    </Text>

                    <Text
                      style={{
                        fontSize: 20,
                        color: "white",
                        fontWeight: "500",
                      }}
                    >
                      Equipments
                    </Text>
                    <Text
                      style={{
                        borderWidth: 0.8,
                        padding: 15,
                        lineHeight: 20,
                        marginVertical: 10,
                        height: 50,
                      }}
                    ></Text>
                  </View>
                </View>
              </Swiper>
              {/* 사진 정보 끝 */}
            </View>
          </ScrollView>
        </SafeAreaView>
        // {/* 아래쪽 전부 끝 */}
      )}

      <NavBar type={SvgType.DarkRoom} />
    </KeyboardAvoidingView>
  );
};
export default DarkRoom;
