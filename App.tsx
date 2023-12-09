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
import Error from "./pages/error";
import Photo from "./pages/photo";
import Sign from "./pages/Sign/signUp";
import SocialLogin from "./pages/Sign/socialLogin";
import UserInfo from "./pages/Sign/userInfo";

import Gallery from "./pages/gallery";
import Exhibition from "./pages/exibition";
import Room from "./pages/room";
import PageExhibition from "./pages/Exibition/pageExh";

import LightMap from "./pages/LightMap/lightMap";
import LightMapList from "./pages/LightMap/lightMapList";

import DarkRoom from "./pages/DarkRoom/darkRoom";

import MyGallery from "./pages/MyGallery/myGallery";
import AllSupportingPG from "./pages/MyGallery/allSupportingPG";
import EditProfile from "./pages/MyGallery/editProfile";
import NewExhibition from "./pages/MyGallery/newExhibition";
import AddRoom from "./pages/MyGallery/addRoom";
import AddPhoto from "./pages/MyGallery/addPhoto";

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
                name="InitialPage"
                component={InitialPage}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Error"
                component={Error}
                options={{
                  header: () => <CustomHeader2 />,
                }}
              />
              <Stack.Screen
                name="Sign"
                component={Sign}
                options={{
                  headerStyle: {
                    backgroundColor: "white",
                  },
                  headerTitleStyle: {
                    color: "black",
                  },
                  headerTitle: "Sign In",
                }}
              />
              <Stack.Screen
                name="SocialLogin"
                component={SocialLogin}
                options={{
                  headerStyle: {
                    backgroundColor: "white",
                  },
                  headerTitleStyle: {
                    color: "black",
                  },
                  headerTitle: "Sign In",
                }}
              />
              <Stack.Screen
                name="UserInfo"
                component={UserInfo}
                options={{
                  header: () => <CustomHeader2 />,
                }}
              />
              <Stack.Screen
                name="PageExhibition"
                component={PageExhibition}
                options={{
                  header: () => <CustomHeader2 />,
                }}
              />

              <Stack.Screen
                name="Gallery"
                component={Gallery}
                options={{
                  header: () => <CustomHeader2 />,
                }}
              />
              <Stack.Screen
                name="Photo"
                component={Photo}
                options={{
                  header: () => <CustomHeader2 />,
                }}
              />
              <Stack.Screen
                name="Exhibition"
                component={Exhibition}
                options={{
                  header: () => <CustomHeader2 />,
                }}
              />
              <Stack.Screen
                name="Room"
                component={Room}
                options={{
                  header: () => <CustomHeader2 />,
                }}
              />

              {/* Light Map */}
              <Stack.Screen
                name="LightMap"
                component={LightMap}
                options={{
                  header: () => <CustomHeader2 />,
                }}
              />
              <Stack.Screen
                name="LightMapList"
                component={LightMapList}
                options={{
                  header: () => <CustomHeader2 />,
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
              <Stack.Screen
                name="AddRoom"
                component={AddRoom}
                options={{
                  header: () => <CustomHeader2 />,
                }}
              />
              <Stack.Screen
                name="AddPhoto"
                component={AddPhoto}
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
