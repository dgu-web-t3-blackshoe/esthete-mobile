import React, { useState } from "react";

//Components
import {
  View,
  StyleSheet,
  TextInput,
  StatusBar,
  TouchableOpacity,
} from "react-native";

//Gesture
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

//Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

//icons & SVGs
import Icon from "react-native-vector-icons/Ionicons";
import { Logo } from "./assets/svg";

//Pages
import InitialPage from "./pages/initial";
import Photo from "./pages/photo";

import Box from "./pages/Exibition/box";
import Gallery from "./pages/Exibition/gallery";
import Exhibition from "./pages/Exibition/exibition";
import Room from "./pages/Exibition/room";

import LightMap from "./pages/LightMap/lightMap";
import LightMapList from "./pages/LightMap/lightMapList";

import DarkRoom from "./pages/DarkRoom/darkRoom";

import MyGallery from "./pages/MyGallery/myGallery";
import AllSupportingPG from "./pages/MyGallery/allSupportingPG";
import EditProfile from "./pages/MyGallery/editProfile";
import NewExhibition from "./pages/MyGallery/newExhibition";

//Redux
import { Provider } from "react-redux";
import Store from "./storage/store";

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

  const CustomHeader2: React.FC = () => {
    return (
      <View
        style={{ ...styles.headerContainer, paddingRight: search ? 10 : 15 }}
      >
        <Logo />
      </View>
    );
  };

  return (
    <Provider store={Store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="InitialPage"
              screenOptions={{
                animationEnabled: false,
              }}
            >
              <Stack.Screen
                name="Box"
                component={Box}
                options={{
                  header: () => <CustomHeader />,
                }}
              />
              <Stack.Screen
                name="InitialPage"
                component={InitialPage}
                options={{
                  header: () => <CustomHeader />,
                }}
              />
              <Stack.Screen
                name="Gallery"
                component={Gallery}
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
              <Stack.Screen
                name="Room"
                component={Room}
                options={{
                  header: () => <CustomHeader />,
                }}
              />

              {/* Light Map */}
              <Stack.Screen
                name="LightMap"
                component={LightMap}
                options={{
                  header: () => <CustomHeader />,
                }}
              />
              <Stack.Screen
                name="LightMapList"
                component={LightMapList}
                options={{
                  header: () => <CustomHeader />,
                }}
              />

              {/* Dark Room */}
              <Stack.Screen
                name="DarkRoom"
                component={DarkRoom}
                options={{
                  header: () => <CustomHeader2 />,
                }}
              />

              {/* My Gallery */}
              <Stack.Screen
                name="MyGallery"
                component={MyGallery}
                options={{
                  header: () => <CustomHeader2 />,
                }}
              />

              <Stack.Screen
                name="AllSupportingPG"
                component={AllSupportingPG}
                options={{
                  header: () => <CustomHeader2 />,
                }}
              />
              <Stack.Screen
                name="EditProfile"
                component={EditProfile}
                options={{
                  header: () => <CustomHeader2 />,
                }}
              />
              <Stack.Screen
                name="NewExhibition"
                component={NewExhibition}
                options={{
                  header: () => <CustomHeader2 />,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
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
