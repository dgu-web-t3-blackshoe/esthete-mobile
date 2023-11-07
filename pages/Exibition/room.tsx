import React from "react";

import {
  Image,
  Alert,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  ImageBackground,
  View,
} from "react-native";

const Room: React.FC = ({ route }: any) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={{ width: "100%", paddingHorizontal: 20 }}>
        Exhibition Title
      </Text>
    </SafeAreaView>
  );
};

export default Room;
