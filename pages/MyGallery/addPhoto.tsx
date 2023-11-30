import React from "react";

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
  return (
    <SafeAreaView style={{ flex: 1 }}>
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
            backgroundColor:
              selectedImage && title.length > 0 && description.length > 0
                ? "black"
                : "#c9c9c9",
            paddingHorizontal: 15,
          }}
          onPress={publishExhibition}
        >
          <Text style={{ color: "white", fontSize: 17 }}>Add Room</Text>
        </TouchableOpacity>
      </View>
      <Text
        style={{
          fontSize: 17,
          fontWeight: "500",
          marginVertical: 15,
          color: "white",
        }}
      >
        Exhibition Title
      </Text>
    </SafeAreaView>
  );
};

export default AddPhoto;
