import React, { useState, useRef } from "react";

//요소
import {
  Image,
  Alert,
  TextInput,
  Text,
  KeyboardAvoidingView,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { NavBar, SvgType } from "../../components/navbar";
import GlobalStyles from "../../assets/styles";

//라이브러리
import Swiper from "react-native-swiper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import * as Location from "expo-location";

const DarkRoom: React.FC = () => {
  //스위퍼 레프
  const swiperRef = useRef<Swiper>(null);
  const goToNextSlide = () => {
    swiperRef.current?.scrollBy(1);
  };
  const goToPrevSlide = () => {
    swiperRef.current?.scrollBy(-1);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* 맨 위 Dark Room 글자랑 Publish 버튼 뷰 시작 */}
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
      {/* 맨 위 Dark Room 글자랑 Publish 버튼 뷰 끝 */}

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
                  style={{ fontSize: 22, color: "white", fontWeight: "500" }}
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
                <Text
                  style={{
                    fontSize: 22,
                    color: "white",
                    fontWeight: "500",
                    marginBottom: 20,
                  }}
                >
                  Location
                </Text>
                <TouchableOpacity
                  style={{
                    width: 300,
                    height: 200,
                    backgroundColor: "white",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>위치 정보를 입력하세요</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 슬라이드3 날짜 etc */}
            <View>
              <View style={GlobalStyles.rowSpaceBetweenContainer}>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>Time</Text>
                <View style={{ width: 230, borderBottomWidth: 0.8 }}>
                  <Text style={{ fontSize: 14 }}> </Text>
                </View>
              </View>
              <View>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>Genres</Text>
                <Text
                  style={{
                    borderWidth: 0.8,
                    padding: 15,
                    lineHeight: 20,
                    marginVertical: 10,
                    height: 50,
                  }}
                ></Text>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
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
      {/* 아래쪽 전부 끝 */}

      <NavBar type={SvgType.DarkRoom} />
    </SafeAreaView>
  );
};
export default DarkRoom;
