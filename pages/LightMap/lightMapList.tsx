//4-3
import React, { useState, useEffect } from "react";

//요소
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ImageBackground,
  View,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator as Spinner,
} from "react-native";
import { NavBar, SvgType } from "../../components/navbar";
import GlobalStyles from "../../assets/styles";

//라이브러리
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

//사진 나열 위한 width 계산
const numColumns = 3;
const size = (Dimensions.get("window").width - 40) / numColumns;

//네비게이션
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import axios from "axios";
import { SERVER_IP } from "../../components/utils";

type RootStackParamList = {
  Photo: {
    photo_id: string;
    nickname: string;
  };
};

const LightMapList: React.FC = ({ route }: any) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  //정렬 방식 모달 시작-------------------------------------------
  const [isSortModalVisible, setSortModalVisible] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>("recent");

  const toggleSortModal = () => {
    setSortModalVisible(!isSortModalVisible);
  };

  const handleSortSelection = (option: string) => {
    setSortOption(option);
    toggleSortModal();
  };

  const [photoData, setPhotoData] = useState<any>(null);

  const getData = async (page: number) => {
    try {
      let temp = "";

      if (route.params.town) {
        temp = `&city=${route.params.city}&town=${route.params.town}`;
      } else if (route.params.city) {
        temp = `&city=${route.params.city}`;
      }

      const response = await axios.get(
        `${SERVER_IP}core/photos/locations?state=${route.params.state}${temp}&page=${page}&size=20&sort=recent`
      );
      if (page !== 0) {
        setPhotoData([...photoData, ...response.data.content]);
      } else {
        setPhotoData(response.data.content);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //정렬 방식 모달 끝------------------------------------------------

  //사진 나열
  const renderItem = ({ item }: any): React.JSX.Element => {
    return (
      <TouchableOpacity
        style={{
          width: size,
          height: size,
          aspectRatio: 1,
        }}
        onPress={() => {
          navigation.navigate("Photo", {
            photo_id: item.photo_id,
            nickname: item.nickname,
          });
        }}
      >
        <ImageBackground
          source={{ uri: item.photo_url }}
          style={{ width: "100%", height: "100%" }}
        />
      </TouchableOpacity>
    );
  };

  //페이징 처리
  const [page, setPage] = useState<number>(0);
  const loadMoreData = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    getData(page);
  }, [page]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* 위쪽 위치 정보랑 정렬 모달 아이콘 뷰 시작 */}
      <View
        style={{
          ...GlobalStyles.rowSpaceBetweenContainer,
          paddingHorizontal: 20,
          backgroundColor: "white",
        }}
      >
        <Text style={{ fontSize: 16, borderBottomWidth: 0.8 }}>
          {route.params.state}, {route.params.city}, {route.params.town}
        </Text>
        <TouchableOpacity onPress={toggleSortModal}>
          <Icon name="sort" size={27} color={"black"} />
        </TouchableOpacity>
      </View>
      {/* 위쪽 위치 정보랑 정렬 모달 아이콘 뷰 끝 */}

      {/* 사진 나열 시작 */}
      {photoData ? (
        <FlatList
          data={photoData}
          renderItem={renderItem}
          keyExtractor={(item) => item.photo_id}
          ListHeaderComponent={
            <Text
              style={{
                fontSize: 18,
                color: "white",
                fontWeight: "600",
                marginVertical: 20,
              }}
            >
              Photographs
            </Text>
          }
          numColumns={3}
          // columnWrapperStyle={{ marginBottom: 5 }}
          style={{
            flex: 1,
            paddingHorizontal: 20,
            backgroundColor: "black",
          }}
          onEndReached={loadMoreData}
        />
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

      {/* 사진 나열 끝 */}

      {/* 정렬 모달 시작 */}
      <Modal
        animationType="none"
        transparent={true}
        visible={isSortModalVisible}
        onRequestClose={toggleSortModal}
      >
        <TouchableWithoutFeedback onPress={toggleSortModal}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 22,
            }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  gap: 20,
                  backgroundColor: "white",
                  paddingVertical: 30,
                  paddingHorizontal: 40,
                  width: 200,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <TouchableOpacity
                  style={styles.modalTextContainer}
                  onPress={() => handleSortSelection("recent")}
                >
                  <Text style={styles.modalText}>Recent</Text>
                  {sortOption === "recent" ? (
                    <Icon name="check" size={27} color={"black"} />
                  ) : null}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalTextContainer}
                  onPress={() => handleSortSelection("popular")}
                >
                  <Text style={styles.modalText}>Popular</Text>
                  {sortOption === "popular" ? (
                    <Icon name="check" size={27} color={"black"} />
                  ) : null}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalTextContainer}
                  onPress={() => handleSortSelection("trending")}
                >
                  <Text style={styles.modalText}>Trending</Text>
                  {sortOption === "trending" ? (
                    <Icon name="check" size={27} color={"black"} />
                  ) : null}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {/* 정렬 모달 끝 */}

      <NavBar type={SvgType.LightMap} />
    </SafeAreaView>
  );
};

export default LightMapList;

const styles = StyleSheet.create({
  modalText: {
    fontSize: 20,
  },
  modalTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
