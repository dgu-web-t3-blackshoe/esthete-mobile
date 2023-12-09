import React from "react";

//요소
import { Text, View, TouchableOpacity } from "react-native";
import GlobalStyles from "../../assets/styles";

import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

//Step2
export const Step2 = ({
  selectedLocation,
  setSelectedLocation,
  showMap,
  setShowMap,
  locationInfo,
}: any) => {
  const clearLocation = () => {
    setSelectedLocation(null);
    setShowMap(!showMap);
  };
  return (
    <View>
      {/* 위치 정보 타이틀 시작 */}
      <View
        style={{
          ...GlobalStyles.rowSpaceBetweenContainer,
          marginBottom: 5,
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
            {locationInfo[2] + " " + locationInfo[3] + " " + locationInfo[4]}
          </Text>
        )}
      </View>
      {/* 위치 정보 타이틀 끝*/}

      {/* 위치 정보 지도 맵뷰 시작 */}
      {selectedLocation === null ? (
        <TouchableOpacity
          style={{
            width: 300,
            height: 180,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={clearLocation}
        >
          <Text>위치 정보를 입력하세요</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{ width: 300, height: 180 }}
          onPress={clearLocation}
        >
          <MapView
            scrollEnabled={false}
            style={{ width: 300, height: 180 }}
            initialRegion={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            provider={PROVIDER_GOOGLE}
          >
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
              title={"내 위치"}
            />
          </MapView>
        </TouchableOpacity>
      )}
      {/* 위치 정보 지도 맵뷰 끝 */}
    </View>
  );
};
