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
import {} from "@react-navigation/native";

import Icon from "react-native-vector-icons/Ionicons";
import { NavBar, SvgType } from "../../components/navbar";
import GlobalStyles from "../../assets/styles";

//Redux
import { useSelector } from "react-redux";
import { State } from "../../storage/reducers";

//페이지 이동 타입
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import { SERVER_IP } from "../../components/utils";

//넓이 계산
const size = Dimensions.get("window").width;

const AddRoom: React.FC = ({ route }: any) => {
  const navigation = useNavigation();

  // try {
  //   setSpinner(true);
  //   const reponse = await axios.post(`${SERVER_IP}core/exhibitions`, {
  //     user_id: "aab7e8a5-fe79-494a-9d9c-6a5b71aa2c69",
  //     title: title,
  //     description: description,
  //     thumbnail: selectedImage,
  //   });
  //   Alert.alert(
  //     "완료",
  //     "전시회가 등록되었습니다.",
  //     [
  //       {
  //         text: "OK",
  //       },
  //     ],
  //     { cancelable: true }
  //   );
  //   console.log(reponse.data);
  //   navigation.replace("AddRoom", {
  //     exhibition_id: reponse.data.exhibition_id,
  //   });
  //   setTitle("");
  //   setDescription("");
  //   setSelectedImage(null);
  //   setSpinner(false);

  //   return;
  // } catch (e) {
  //   Alert.alert(
  //     "오류",
  //     "네트워크 연결을 확인하세요.",
  //     [
  //       {
  //         text: "OK",
  //       },
  //     ],
  //     { cancelable: true }
  //   );
  //   setSpinner(false);
  //   console.log(e);
  // }

  //방 저장 상태
  const [rooms, setRooms] = useState<any>([]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* 맨 위 제목과 Publish버튼 뷰 시작 */}
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
            backgroundColor: "black",
            paddingHorizontal: 15,
          }}
        >
          <Text style={{ color: "white", fontSize: 17 }}>Publish</Text>
        </TouchableOpacity>
      </View>
      {route.params.title.length > 0 && (
        <View
          style={{
            width: "100%",
            paddingHorizontal: 30,
            paddingVertical: 10,
            backgroundColor: "black",
          }}
        >
          <Text style={{ fontSize: 18, color: "white" }}>
            {route.params.title}
          </Text>
        </View>
      )}
      {/* 맨 위 제목과 Publish버튼 뷰 끝 */}

      <ScrollView
        style={{ flex: 1, backgroundColor: "#DEDEDE", paddingVertical: 10 }}
      >
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
          // onPress={addRoom}
        >
          <Icon name="add" size={40} color="black" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddRoom;

const styles = StyleSheet.create({
  roomItem: {
    flexDirection: "row",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  thumbnail: {
    width: 50,
    height: 50,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  details: {
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
  },
});
