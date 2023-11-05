import React, { useState, useRef, useEffect } from "react";

import {
  Image,
  Alert,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  ImageBackground,
  View,
} from "react-native";

import * as Location from "expo-location";

import GlobalStyles from "../../assets/styles";
import MapView, { Marker } from "react-native-maps";
import { NavBar, SvgType } from "../../components/navbar";

const LightMap: React.FC = () => {
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 37.557067,
    longitude: 126.971179,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});

      setCurrentRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      getData(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
    })();
  }, []);

  const goToCurrentLocation = async () => {
    let currentLocation = await Location.getCurrentPositionAsync({});
    setCurrentRegion({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
    mapRef.current.animateToRegion(
      {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      1000
    );
  };

  const getData = (lat: number, lon: number) => {
    console.log(lat);
    console.log(lon);

    //위도, 경도로 동별 대표사진 및 갯수 조회
    //URL: photos?latitude={}&longitude={}&radius={}
    //응답:
    // {
    //   {
    //   "latitude" : "",
    //   "longitude" : "",
    //   "state" : "",
    //   "district" : "",
    //   "local" : "",
    //   "thumnail" : "",
    //   "count" : 1
    //   },
    //   {
    //   "latitude" : "",
    //   "longitude" : "",
    //   "state" : "",
    //   "city" : "",
    //   "town" : "",
    //   "thumnail" : "",
    //   "count" : 1
    //   }
    //   }
  };

  const locationDummy = [
    {
      latitude: 37.5342,
      longitude: 126.9947,
      state: "",
      district: "",
      local: "",
      thumnail: require("../../assets/photodummy5.jpg"),
      count: 1,
    },
    {
      latitude: 37.5826,
      longitude: 127.0019,
      state: "",
      city: "",
      town: "",
      thumnail: require("../../assets/photodummy4.jpg"),
      count: 1,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={goToCurrentLocation}
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          backgroundColor: "white",
          padding: 10,
        }}
      >
        <Text>내 위치로</Text>
      </TouchableOpacity>
      <MapView
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

        {locationDummy.map((e, i) => (
          <Marker
            key={i}
            coordinate={{
              latitude: e.latitude,
              longitude: e.longitude,
            }}
            onPress={() => {}}
          >
            <Image source={e.thumnail} style={{ width: 50, height: 50 }} />
          </Marker>
        ))}
      </MapView>
      <NavBar type={SvgType.LightMap} />
    </SafeAreaView>
  );
};

export default LightMap;
