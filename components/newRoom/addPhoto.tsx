import React, { useState, useEffect } from "react";

//요소
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ImageBackground,
  ScrollView,
  View,
} from "react-native";
import {} from "@react-navigation/native";

import Icon from "react-native-vector-icons/Ionicons";


//넓이 계산
const size = Dimensions.get("window").width;

export const AddPhoto = ({
  selectedPhotos,
  setSelectedPhotos,
  myPhotoData,
}: any) => {
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
    <ScrollView style={{ backgroundColor: "black", paddingHorizontal: 20 }}>
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
        >
          전시할 사진을 선택하세요.
        </Text>
      </View>
      <FlatList
        scrollEnabled={false}
        data={myPhotoData.content}
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
  );
};
