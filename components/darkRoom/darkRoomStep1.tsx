import React from "react";
//요소
import { TextInput, Text, View } from "react-native";
import GlobalStyles from "../../assets/styles";

export const Step1 = ({
  title,
  setTitle,
  description,
  setDescription,
}: any) => {
  return (
    <View>
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
          value={title}
          placeholder="사진 제목을 입력하세요."
          onChangeText={(text) => setTitle(text)}
        />
      </View>
      {/* 슬라이드1 제목 입력 뷰 끝 */}

      {/* 슬라이드1 설명 입력 뷰 시작 */}
      <View style={{ width: 300, marginTop: 5 }}>
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
          multiline
          value={description}
          placeholder="사진 설명을 입력하세요."
          onChangeText={(text) => setDescription(text)}
        />
      </View>
    </View>
  );
};
