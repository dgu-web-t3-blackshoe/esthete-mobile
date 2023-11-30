import React, { useState, useEffect } from "react";

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
  Platform,
  ImageBackground,
  ScrollView,
  View,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator as Spinner,
  BackHandler,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import GlobalStyles from "../../assets/styles";

//Redux
import { useSelector } from "react-redux";
import { State } from "../../storage/reducers";

//페이지 이동 타입

import axios from "axios";
import { SERVER_IP } from "../../components/utils";

//넓이 계산
const size = Dimensions.get("window").width;

const AddPhoto: React.FC = ({ route }: any) => {
  const [selectedPhotos, setSelectedPhotos] = useState<Array<string>>([]);

  //사진 나열
  const renderItem = ({ item }: any): React.JSX.Element => {
    return (
      <TouchableOpacity
        style={{
          width: (size - 40) / 3,
          height: (size - 40) / 3,
          aspectRatio: 1,
        }}
        onPress={() => {
          if (selectedPhotos.length !== 0) {
            if (selectedPhotos.includes(item.photo_id)) {
              setSelectedPhotos((prev: any[]) =>
                prev.filter((id: any) => id !== item.photo_id)
              );
            } else {
              setSelectedPhotos((prev: any) => [...prev, item.photo_id]);
            }
          } else {
            setSelectedPhotos((prev: any) => [...prev, item.photo_id]);
          }
        }}
      >
        <ImageBackground
          // source={{ uri: item.story }}
          source={{ uri: item.photo_url }}
          style={{ width: "100%", height: "100%" }}
        >
          <View
            style={{
              flex: 1,
              ...StyleSheet.absoluteFillObject,

              backgroundColor: selectedPhotos.includes(item.photo_id)
                ? "rgba(0, 0, 0, 0.5)"
                : "rgba(0,0,0,0)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {selectedPhotos.includes(item.photo_id) ? (
              <Icon name="checkmark" size={27} color={"white"} />
            ) : null}
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          ...GlobalStyles.rowSpaceBetweenContainer,
          paddingHorizontal: 20,
        }}
      >
        <Text style={GlobalStyles.bigFont}>New Exhibition</Text>
        <TouchableOpacity
          style={{
            paddingVertical: 3,
            paddingHorizontal: 15,
            backgroundColor: "black",
          }}
        >
          <Text style={{ color: "white", fontSize: 17 }}>Add Photo</Text>
        </TouchableOpacity>
      </View>
      {/* 맨 위 제목과 Add Photo버튼 뷰 끝 */}

      {/* 전시회 이름 시작 */}
      {route.params.exhibitionTitle.length > 0 && (
        <View
          style={{
            width: "100%",
            paddingHorizontal: 30,
            paddingVertical: 10,
            backgroundColor: "black",
          }}
        >
          <Text style={{ fontSize: 18, color: "white" }}>
            {route.params.exhibitionTitle}
          </Text>
        </View>
      )}
      {/* 전시회 이름 끝 */}
      <ScrollView
          style={{ backgroundColor: "black", flex: 1, paddingHorizontal: 20 }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "500",
              marginVertical: 15,
              color: "white",
            }}
          >
            Room Title
          </Text>
          <TextInput
            cursorColor={"#FFA800"}
            placeholder="전시실 제목을 입력하세요."
            style={{
              backgroundColor: "white",
              textAlign: "center",
              height: 35,
            }}
            // value={roomTitle}
            // onChangeText={(text) => setRoomTitle(text)}
          />

          <Text
            style={{
              fontSize: 17,
              fontWeight: "500",
              marginVertical: 15,
              color: "white",
            }}
          >
            Room Description
          </Text>
          <TextInput
            cursorColor={"#FFA800"}
            placeholder="전시회 설명을 입력하세요."
            style={{
              backgroundColor: "white",
              textAlign: "center",
              height: 100,
            }}
            // value={roomDescription}
            // onChangeText={(text) => setRoomDescription(text)}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              marginVertical: 15,
              gap: 10,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: "500",

                color: "white",
              }}
            >
              Photographs
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#c9c9c9",
              }}
            ></Text>
          </View>
          <FlatList
            scrollEnabled={false}
            data={route.params.myPhotos}
            renderItem={renderItem}
            keyExtractor={(item) => item.photo_id}
            numColumns={3}
            style={{
              flex: 1,
              backgroundColor: "black",
              marginBottom: 20,
            }}
          />
        </ScrollView>
    </SafeAreaView>
  );
};

export default AddPhoto;
