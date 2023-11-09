//6-4
import React, { useState, useRef, useEffect } from "react";

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
  ImageBackground,
  ScrollView,
  View,
  TextInput,
} from "react-native";
import { NavBar, SvgType } from "../../components/navbar";

//Redux
import { useSelector } from "react-redux";
import { State } from "../../storage/reducers";

//페이지 이동 타입
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const AllSupportingPG: React.FC = () => {
  //유저아이디
  const userId = useSelector((state: State) => state.USER);

  //필터 여는 상태
  const [showFilter, setShowFilter] = useState<boolean>(false);

  //전체 후원 작가 조회
  //URL:
  //users/{user_id}/supports/all?nickname={}&sort={}&genres={a,b,c}&size={}&page={}
  const MySupportDummy = {
    content: [
      {
        photographer_id: "1",
        profile_img: require("../../assets/photodummy1.jpg"),
        nickname: "Jekoo",
        biography: "It is Photographer1 data.",
        genres: ["Landscape", "Food", "Night"],
        highlights: [
          require("../../assets/photodummy3.jpg"),
          require("../../assets/photodummy4.jpg"),
          require("../../assets/photodummy5.jpg"),
        ],
      },
      {
        photographer_id: "2",
        profile_img: require("../../assets/photodummy2.jpg"),
        nickname: "Kjg123",
        biography: "It is Photographer2 data.",
        genres: ["Sports", "Travel", "Landscape"],
        highlights: [
          require("../../assets/photodummy6.jpg"),
          require("../../assets/photodummy1.jpg"),
          require("../../assets/photodummy2.jpg"),
          require("../../assets/photodummy3.jpg"),
          require("../../assets/photodummy4.jpg"),
        ],
      },
    ],
  };

  //이미지 넓이 계산
  const [imageWidth, setImageWidth] = useState<Map<string, number>>(new Map());
  const handleImageLoaded = (event: any, highlights_photo_id: string) => {
    const { width, height } = event.nativeEvent.source;
    const aspectRatio = width / height;
    const fixedHeight = 80;
    const calculatedWidth = fixedHeight * aspectRatio;

    setImageWidth((prevWidth) => {
      const newHeights = new Map(prevWidth);
      newHeights.set(highlights_photo_id, calculatedWidth);
      return newHeights;
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!showFilter ? (
        <View style={{ backgroundColor: "black", flex: 1 }}>
          {/* Supporting Photographers 타이틀 시작 */}
          <View
            style={{
              width: "100%",
              backgroundColor: "white",
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                paddingVertical: 10,
                fontSize: 20,
                fontWeight: "500",
                backgroundColor: "white",
              }}
            >
              Supporting Photographers
            </Text>
          </View>
          {/* Supporting Photographers 타이틀 끝  */}
          {/* 필터 버튼 시작 */}
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              width: 100,
              alignItems: "center",
              marginHorizontal: 20,
              marginVertical: 15,
            }}
            onPress={() => setShowFilter(!showFilter)}
          >
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Filter</Text>
          </TouchableOpacity>
          {/* 필터 버튼 끝 */}
          <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            style={{ flex: 1, backgroundColor: "black", paddingHorizontal: 20 }}
          >
            {MySupportDummy.content.map((e, i) => {
              return (
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderTopWidth: 1,
                    borderColor: "white",
                    paddingVertical: 20,
                  }}
                >
                  {/* 후원작가 프로필 사진, 닉네임, 장르, 설명 시작 */}
                  <View
                    key={i}
                    style={{ flexDirection: "row", marginBottom: 10, gap: 15 }}
                  >
                    <Image
                      source={e.profile_img}
                      style={{ width: 140, height: 140 }}
                    />
                    <View style={{ gap: 10 }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "500",
                          color: "white",
                        }}
                      >
                        {e.nickname}
                      </Text>

                      <Text style={{ color: "white" }}>
                        {e.genres.map((e, i) => {
                          return e + "   ";
                        })}
                      </Text>
                      <Text style={{ color: "white" }}>{e.biography}</Text>
                    </View>
                  </View>

                  {/* 하이라이트 시작 */}
                  <Text style={{ color: "white", marginBottom: 10 }}>
                    Highlights
                  </Text>
                  <ScrollView
                    horizontal
                    contentContainerStyle={{ gap: 20, marginBottom: 10 }}
                  >
                    {e.highlights.map((he, hi) => {
                      const highlightId = e.photographer_id + hi.toString();
                      return (
                        <Image
                          key={hi}
                          source={he}
                          style={{
                            height: 80,
                            width: imageWidth.get(highlightId),
                          }}
                          onLoad={(event) =>
                            handleImageLoaded(event, highlightId)
                          }
                        />
                      );
                    })}
                  </ScrollView>
                  {/* 후원작가 프로필 사진, 닉네임, 장르, 설명 끝 */}
                  <View style={{ width: "100%", alignItems: "flex-end" }}>
                    <TouchableOpacity>
                      <Text style={{ color: "white" }}>Visit Gallery</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems:'center',
              width: "100%",
              backgroundColor: "white",
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: 25,
                fontWeight: "500",
              }}
            >
              Filter
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "black",
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={{
                  color: "white",

                  fontSize: 17,
                }}
              >
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <NavBar type={SvgType.MyGallery} />
    </SafeAreaView>
  );
};

export default AllSupportingPG;
