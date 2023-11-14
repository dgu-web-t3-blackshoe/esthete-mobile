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

type RootStackParamList = {
  Gallery: {
    user_id: string;
    profile_img: string;
    nickname: string;
  };
};

const AllSupportingPG: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  //유저아이디
  const userId = useSelector((state: State) => state.USER);

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

  //필터 여는 상태
  const [showFilter, setShowFilter] = useState<boolean>(false);

  //필터 중 정렬 방식 선택 상태
  const [selectedSortOption, setSelectedSortOption] =
    useState<string>("Recent");

  //필터 정렬 방식 라디오 버튼 컴포넌트
  const RadioButton = ({ text, onPress, selected }: any) => (
    <TouchableOpacity
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      onPress={onPress}
    >
      <View
        style={{
          height: 18,
          width: 18,
          borderRadius: 9,
          borderWidth: 2,
          borderColor: "#000",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected ? (
          <View
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: "#000",
            }}
          />
        ) : null}
      </View>
      <Text style={{ marginLeft: 10 }}>{text}</Text>
    </TouchableOpacity>
  );

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
                  key={i}
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

                  {/* 밑에 visit Gallery 버튼 시작 */}
                  <View style={{ width: "100%", alignItems: "flex-end" }}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.push("Gallery", {
                          user_id: e.photographer_id,
                          profile_img: e.profile_img,
                          nickname: e.nickname,
                        });
                      }}
                    >
                      <Text style={{ color: "white" }}>Visit Gallery</Text>
                    </TouchableOpacity>
                  </View>
                  {/* 밑에 visit Gallery 버튼 끝 */}
                </View>
              );
            })}
          </ScrollView>
        </View>
      ) : (
        // 필터 페이지 시작
        <View style={{ flex: 1, backgroundColor: "black" }}>
          {/* 맨 위에 필터 타이틀, Apply 버튼 뷰 시작 */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
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
          {/* 맨 위에 필터 타이틀, Apply 버튼 뷰 끝 */}

          <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
            <Text style={styles.textBox}>Nickname</Text>
            <TextInput
              style={{
                backgroundColor: "white",
                width: "100%",
                height: 40,
                textAlign: "center",
                fontSize: 16,
                marginVertical: 10,
                letterSpacing: 1,
              }}
              placeholder="후원 중인 작가를 검색해보세요."
            />

            <Text style={styles.textBox}>Sorting</Text>
            <RadioButton
              text="Recent"
              selected={selectedSortOption === "Recent"}
              onPress={() => setSelectedSortOption("Recent")}
            />
            <RadioButton
              text="Trending"
              selected={selectedSortOption === "Trending"}
              onPress={() => setSelectedSortOption("Trending")}
            />
            <RadioButton
              text="Popular"
              selected={selectedSortOption === "Popular"}
              onPress={() => setSelectedSortOption("Popular")}
            />
            <Text style={styles.textBox}>Genre</Text>
          </View>
        </View>
      )}
      <NavBar type={SvgType.MyGallery} />
    </SafeAreaView>
  );
};

export default AllSupportingPG;

const styles = StyleSheet.create({
  textBox: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
    marginTop: 5,
  },
});
