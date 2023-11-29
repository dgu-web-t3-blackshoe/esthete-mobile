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
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { NavBar, SvgType } from "../../components/navbar";
import GlobalStyles from "../../assets/styles";

//Redux
import { useSelector } from "react-redux";
import { State } from "../../storage/reducers";

//페이지 이동 타입
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import { SERVER_IP } from "../../components/utils";

//넓이 계산
const size = Dimensions.get("window").width;

const RoomList: React.FC = ({ route }: any) => {
  console.log(route.params);

  //방 목록 조회
  const [rooms, setRooms] = useState<any>(null);
  useEffect(() => {
    getRooms();
  }, []);

  const getRooms = async () => {
    try {
      const response = await axios.get(
        `${SERVER_IP}core/exhibitions/${route.params.exhibition_id}/rooms`
      );
      setRooms(response.data.content);

      Alert.alert(
        "완료",
        "방이 만들어졌습니다.",
        [
          {
            text: "OK",
          },
        ],
        { cancelable: true }
      );
    } catch (e) {
      console.log(e);
    }
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
            backgroundColor: "black",
            paddingHorizontal: 15,
          }}
        >
          <Text style={{ color: "white", fontSize: 17 }}>Publish</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RoomList;