//4-1 4-2
import React, { useState, useRef, useEffect } from "react";

//요소
import {
  Image,
  Alert,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator as Spinner,
} from "react-native";
import { NavBar, SvgType } from "../../components/navbar";

//구글지오코딩 API KEY
import { API_KEY } from "@env";

//Redux
import { useSelector } from "react-redux";
import { State } from "../../storage/reducers";

//라이브러리
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/FontAwesome5";

//네비게이션
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

//api
import axios from "axios";
import { SERVER_IP } from "../../components/utils";

type RootStackParamList = {
  LightMapList: {
    state: string;
    city: string;
    town: string;
  };
};

const LightMap: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  //현재 위치 (기본값 : 서울역)
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 37.557067,
    longitude: 126.971179,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  //현재 위치 업데이트
  const { lat, lon } = useSelector((state: State) => state.location);
  //맵뷰의 현재 보여주는 곳 참조
  const mapRef = useRef<MapView>(null);

  //좌표 찍을 곳
  const [locationInfo, setLocationInfo] = useState<any>(null);

  useEffect(() => {
    if (lat !== null && lon !== null) {
      setCurrentRegion({
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      getLocationInfo(lat, lon);
    }
  }, [lat, lon]);

  useEffect(() => {
    getData(lat, lon);
  }, [locationInfo]);

  const goToCurrentLocation = async () => {
    let currentLocation = await Location.getCurrentPositionAsync({});
    setCurrentRegion({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    mapRef.current?.animateToRegion(
      {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      1000
    );
  };

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

      setLocationInfo([state, city, town]);
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  // const getCoordinatesFromAddress = async (
  //   country: string,
  //   state: string,
  //   city: string
  // ) => {
  //   try {
  //     const address = `${city}, ${state}, ${country}`;

  //     const response = await axios.get(
  //       "https://maps.googleapis.com/maps/api/geocode/json",
  //       {
  //         params: {
  //           address: address,
  //           key: API_KEY,
  //           language: "ko",
  //         },
  //       }
  //     );

  //     const location = response.data.results[0].geometry.location;
  //     const latitude = location.lat;
  //     const longitude = location.lng;

  //     return latitude;
  //   } catch (e) {
  //     console.error(e);
  //     return null;
  //   }
  // };

  const [photoData, setPhotoData] = useState<any>(null);

  const getData = async (lat: any, lon: any) => {
    try {

      const response = await axios.get(
        `${SERVER_IP}core/photos/locations?state=서울특별시&city=중구&page=0&size=10&sort=recent`
      );
      setPhotoData(response.data.content);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* 맨 위 지역 명, 내 위치로 이동 버튼 뷰 시작 */}
      <View
        style={{
          backgroundColor: "white",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          height: 40,
        }}
      >
        {locationInfo && (
          <Text style={{ fontSize: 16, borderBottomWidth: 0.8, width: 250 }}>
            {locationInfo[0]}, {locationInfo[1]}, {locationInfo[2]}
          </Text>
        )}

        <TouchableOpacity onPress={goToCurrentLocation} style={{}}>
          <Icon name="map-marked" size={25} color={"black"} />
        </TouchableOpacity>
      </View>
      {/* 맨 위 지역 명, 내 위치로 이동 버튼 뷰 끝 */}
      {photoData ? (
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={currentRegion}
          region={currentRegion}
        >
          <Marker
            coordinate={{
              latitude: currentRegion.latitude,
              longitude: currentRegion.longitude,
            }}
            title={"내 위치"}
          />

          <Marker
            coordinate={{
              latitude: lat || 0,
              longitude: lon || 0,
            }}
            onPress={() =>
              navigation.navigate("LightMapList", {
                state: locationInfo[0],
                city: locationInfo[1],
                town: locationInfo[2],
              })
            }
          >
            <Image
              source={{ uri: photoData[0]?.photo_url }}
              style={{
                width: 100 ,
                height: 100 ,
                borderRadius: 50,
              }}
            />
          </Marker>
        </MapView>
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

      <NavBar type={SvgType.LightMap} />
    </SafeAreaView>
  );
};

export default LightMap;
