import React, { useState, useRef, useEffect } from "react";

//요소
import {
  Image,
  Text,
  View,
  Animated,
  Alert,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

//Redux
import { useSelector } from "react-redux";
import { State } from "../../storage/reducers";

//nav
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GenreArray, getGenreValueByKey } from "../../components/constants";

//api
import { SERVER_IP } from "../../components/utils";
import axios from "axios";

type RootStackParamList = {
  SocialLogin: {
    what: string;
    auto: boolean;
  };
  Error: undefined;
  PageExhibition: undefined;
};

const UserInfo: React.FC = () => {
  const userId = useSelector((state: State) => state.USER);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [nickname, setNickname] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [equipments, setEquipments] = useState<string>("");

  const [checkedItems, setCheckedItems] = useState<Array<string>>([]);
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

  const sign = async () => {
    try {
      await axios.post(`${SERVER_IP}core/users/${userId}/sign-up`, {
        biography: description,
        genres: checkedItems.map((e, i) => getGenreValueByKey(e)),
        equipments: [`${equipments}`],
        nickname: nickname,
      });
      navigation.replace("PageExhibition");
    } catch (e) {
      console.log("at sign :", e);
      Alert.alert(
        "실패",
        "네트워크 오류가 발생하였습니다.",
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
      navigation.replace("Error");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          justifyContent: "space-between",
          paddingVertical: 10,
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Text
          style={{
            color: "black",
            fontSize: 18,
            textAlign: "center",
            fontWeight: "500",
            letterSpacing: 1,
          }}
        >
          사용자 정보를 입력해주세요.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor:
              nickname.length > 0 &&
              description.length > 0 &&
              checkedItems.length > 0 &&
              equipments.length > 0
                ? "black"
                : "#c9c9c9",
            justifyContent: "center",
            height: 30,
          }}
          disabled={
            !(
              nickname.length > 0 &&
              description.length > 0 &&
              checkedItems.length > 0 &&
              equipments.length > 0
            )
          }
          onPress={sign}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "500",
              fontSize: 17,
              paddingHorizontal: 13,
            }}
          >
            Submit
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ backgroundColor: "black" }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View style={{ paddingVertical: 25, gap: 30 }}>
          <View style={{ flexDirection: "row", gap: 23 }}>
            <Text style={{ color: "white", fontWeight: "500", fontSize: 18 }}>
              이름 :
            </Text>
            <TextInput
              style={{
                borderColor: "gray",
                borderWidth: 1,
                paddingHorizontal: 10,
                borderRadius: 5,
                width: 230,
                backgroundColor: "white",
              }}
              value={nickname}
              placeholder="이름을 입력해주세요."
              onChangeText={(text) => setNickname(text)}
            />
          </View>
          <View style={{ flexDirection: "row", gap: 23 }}>
            <Text style={{ color: "white", fontWeight: "500", fontSize: 18 }}>
              소개 :
            </Text>
            <TextInput
              style={{
                borderColor: "gray",
                borderWidth: 1,
                paddingHorizontal: 10,
                width: 230,
                borderRadius: 5,
                height: 100,
                backgroundColor: "white",
              }}
              multiline
              value={description}
              placeholder="간단한 설명을 입력해주세요."
              onChangeText={(text) => setDescription(text)}
            />
          </View>
        </View>
        {/* 장르 부분 시작 */}
        <View
          style={{
            width: "100%",
            paddingHorizontal: 35,
            paddingTop: 5,
            borderTopWidth: 0.8,

            borderColor: "white",
          }}
        >
          <Text style={styles.bigText}>Genre</Text>
          <View
            style={{
              borderBottomWidth: 0.8,
              borderColor: "white",
              paddingHorizontal: 5,
              paddingBottom: 15,
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
            placeholder="사용 중인 장비를 입력해주세요."
            placeholderTextColor={"#c9c9c9"}
            multiline
            onChangeText={(text) => setEquipments(text)}
          />
          {/* 장비 부분 끝 */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  bigTextInput: {
    marginTop: 10,
    fontWeight: "500",
    textAlign: "center",
    backgroundColor: "white",
    fontSize: 16,
    height: 100,
    borderRadius: 4,
    marginBottom: 60,
  },
  bigText: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 7,
  },
});
