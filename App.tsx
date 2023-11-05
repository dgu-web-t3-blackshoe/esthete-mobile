import React, { useState } from "react";

//Components
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";

//Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

//Pages
import One_Profile from "./pages/One/One_Profile";

export default function App() {
  //SearchBar
  const [search, setSearch] = useState<Boolean | false>(false);
  const CustomHeader: React.FC = () => {
    return (
      <View style={styles.headerContainer}>
        <TextInput style={styles.searchInput} placeholder="검색" />
        <TouchableOpacity onPress={() => setSearch(!search)}>
          {/* //search-outline */}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Profile"
          component={One_Profile}
          options={{
            header: () => <CustomHeader />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    backgroundColor: "black",
  },
  searchInput: {
    flex: 1,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});
