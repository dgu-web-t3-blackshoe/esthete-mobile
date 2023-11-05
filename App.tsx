import React, { useState } from "react";

//Components
import {
  View,
  StyleSheet,
  TextInput,
  StatusBar,
  TouchableOpacity,
} from "react-native";

//Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

//icons & SVGs
import Icon from "react-native-vector-icons/Ionicons";
import { Logo } from "./assets/svg";

//Pages
import Photo from "./pages/photo";
import ExhibitionProfile from "./pages/Exibition/exibitionProfile";
import Exhibition from "./pages/Exibition/exibition";

export default function App() {
  //Custom Header for SearchBar
  const [search, setSearch] = useState<Boolean | false>(false);
  const CustomHeader: React.FC = () => {
    return (
      <View
        style={{ ...styles.headerContainer, paddingRight: search ? 10 : 15 }}
      >
        {search ? (
          <TextInput style={styles.searchInput} placeholder="검색" />
        ) : (
          <Logo />
        )}

        <TouchableOpacity onPress={() => setSearch(!search)}>
          {search ? (
            <Icon name="close-outline" size={35} color={"#fff"} />
          ) : (
            <Icon name="search-outline" size={30} color={"#fff"} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animationEnabled: false,
        }}
      >
        <Stack.Screen
          name="Profile"
          component={ExhibitionProfile}
          options={{
            header: () => <CustomHeader />,
          }}
        />
        <Stack.Screen
          name="Photo"
          component={Photo}
          options={{
            header: () => <CustomHeader />,
          }}
        />
        <Stack.Screen
          name="Exhibition"
          component={Exhibition}
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
    marginTop: StatusBar.currentHeight,
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    backgroundColor: "black",
    gap: 10,

    paddingLeft: 20,
    justifyContent: "space-between",
  },
  searchInput: {
    flex: 1,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,

    backgroundColor: "white",
  },
});
