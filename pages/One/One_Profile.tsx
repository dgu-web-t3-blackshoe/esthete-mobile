import React, { useState, useEffect } from "react";
import { Text, SafeAreaView, StyleSheet, View } from "react-native";
import { Logo } from "../../assets/svg";

const One_Profile: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Logo/>

      </View>
    </SafeAreaView>
  );
};

export default One_Profile;

const styles = StyleSheet.create({

});
