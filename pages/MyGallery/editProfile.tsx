//6-6
import React, { useState } from "react";

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
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ScrollView,
  View,
  TextInput,
} from "react-native";
import { NavBar, SvgType } from "../../components/navbar";
import GlobalStyles from "../../assets/styles";
import { GenreArray } from "../../components/constants";

//Redux
import { useSelector } from "react-redux";
import { State } from "../../storage/reducers";
const size = Dimensions.get("window").width;

const EditProfile: React.FC = ({ route }: any) => {
  //이름 저장 상태
  const [nickname, setNickname] = useState<string>(route.params.nickname);
  //설명 저장 상태
  const [biography, setBiography] = useState<string>(route.params.biography);
  //장르는 밑에 선언

  //장비 저장 상태
  const [equipments, setEquipments] = useState<string>(
    route.params.equipments.toString()
  );

  //저장 완료 전송 함수
  const submitSupport = () => {
    Alert.alert(
      "완료",
      "저장하였습니다.",
      [
        {
          text: "cancel",
        },
        {
          text: "OK",
        },
      ],
      { cancelable: true }
    );
  };

  //장르--------------------------------------------------------------------
  //장르 선택 상태
  const [checkedItems, setCheckedItems] = useState<Array<string>>(
    route.params.genres
  );

  //장르 선택 함수
  const handleCheck = (item: string) => {
    if (checkedItems.includes(item)) {
      const temp = checkedItems.filter((e) => {
        return e !== item;
      });
      setCheckedItems(temp);
    } else {
      setCheckedItems((prev) => [...prev, item]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* 맨위 Edit Profile 타이틀, Save 버튼 뷰 시작*/}
      <View
        style={{
          ...GlobalStyles.rowSpaceBetweenContainer,
          paddingHorizontal: 20,
        }}
      >
        <Text style={GlobalStyles.bigFont}>Edit Profile</Text>
        <TouchableOpacity
          style={GlobalStyles.backgroundBlackBox}
          onPress={submitSupport}
        >
          <Text style={{ color: "white", fontSize: 17 }}>save</Text>
        </TouchableOpacity>
      </View>
      {/* 맨위 Edit Profile 타이틀, Save 버튼 뷰 끝*/}

      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingVertical: 20,
          backgroundColor: "black",
        }}
      >
        {/* 프사, 이름, 설명 부분 시작 */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            borderBottomWidth: 0.8,
            borderColor: "white",
            paddingBottom: 20,
          }}
        >
          <Image
            source={route.params.profile_img}
            style={{ width: 150, height: 150 }}
          />
          <View style={{ gap: 15, width: size - 200 }}>
            <TextInput
              cursorColor={"#FFA800"}
              value={nickname}
              onChangeText={(text) => setNickname(text)}
              style={{ ...styles.text, fontSize: 18, height: 25 }}
            />

            <TextInput
              cursorColor={"#FFA800"}
              value={biography}
              onChangeText={(text) => setBiography(text)}
              style={{ ...styles.text, height: 110 }}
              multiline
            />
          </View>
        </View>
        {/* 프사, 이름, 설명 부분 끝 */}

        {/* 장르 부분 시작 */}
        <Text style={styles.bigText}>Genre</Text>
        <View
          style={{
            borderBottomWidth: 0.8,
            borderColor: "white",
            paddingHorizontal: 5,
            paddingBottom: 7,
          }}
        >
          {GenreArray.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginVertical: 5,
                width: "100%",
              }}
              onPress={() => {
                handleCheck(item);
              }}
            >
              <View
                style={{
                  width: 13,
                  height: 13,
                  backgroundColor: checkedItems.includes(item)
                    ? "#FFA800"
                    : "white",
                  borderWidth: 1,
                  borderColor: "white",
                }}
              />
              <Text style={{ color: "white", fontSize: 16 }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* 장르 부분 끝 */}
        {/* 장비 부분 시작 */}
        <Text style={styles.bigText}>Equipment</Text>
        <TextInput
          cursorColor={"#FFA800"}
          value={equipments}
          style={styles.bigTextInput}
        />
        {/* 장비 부분 끝 */}
      </ScrollView>
      <NavBar type={SvgType.MyGallery} />
    </KeyboardAvoidingView>
  );
};

export default EditProfile;
const styles = StyleSheet.create({
  text: {
    fontWeight: "500",
    textAlign: "center",
    backgroundColor: "white",
    paddingHorizontal: 5,

    borderRadius: 4,
  },
  bigText: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 7,
  },
  bigTextInput: {
    marginTop: 10,
    fontWeight: "500",
    textAlign: "center",
    backgroundColor: "white",
    fontSize: 18,
    height: 100,
    borderRadius: 4,
    marginBottom: 60,
  },
});
