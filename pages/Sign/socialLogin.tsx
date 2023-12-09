import React, { useEffect, useState } from "react";
//components
import { View, StyleSheet, LogBox } from "react-native";

//navigation
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

//async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

//redux
import { useDispatch } from "react-redux";
import { setUserId } from "../../storage/actions";

//api
import { SERVER_IP } from "../../components/utils";

//library
import { WebView } from "react-native-webview";

const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.stopLoading(true);`;

type RootStackParamList = {
  UserInfo: undefined;
  PageExhibition: undefined;
};

const SocialLogin = ({ route }: any) => {
  // Navigation----------------------------------
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const what = route.params.what;
  const auto = route.params.auto;

  // Redux---------------------------------------
  const dispatch = useDispatch();

  // State---------------------------------------
  const [url, setUrl] = useState<string>("");

  // Function------------------------------------
  const handleWebViewNavigationStateChange = (newNavState: any) => {
    const { url } = newNavState;
    setUrl(url);
  };

  const getParams = (url: string) => {
    const paramPart = url.split("?")[1];
    if (!paramPart) return;

    const paramStrings = paramPart.split("&");

    return paramStrings.reduce((acc, cur) => {
      const [key, value] = cur.split("=");
      return { ...acc, [key]: value };
    }, {});
  };

  LogBox.ignoreLogs(["Encountered an error loading page"]);

  // Render--------------------------------------
  useEffect(() => {
    if (url?.includes("social-login")) {
      const params: any = getParams(url);
      if (params["sign-up"] === "false") {
        if (auto) {
          AsyncStorage.setItem("user_id", params["userId"]);
        }
        dispatch(setUserId(params["userId"]));
        navigation.navigate("UserInfo");
      } else {
        if (auto) {
          AsyncStorage.setItem("user_id", params["userId"]);
        }
        dispatch(setUserId(params["userId"]));
        navigation.navigate("PageExhibition");
      }
    }
  }, [url]);

  return (
    <View style={styles.container}>
      {/* <View
        style={{
          zIndex: 10,
          position: "absolute",
          backgroundColor:'white',
          top: 0,
          width: "100%",
          height: "100%",
        }}
      /> */}
      <WebView
        originWhitelist={["*"]}
        scalesPageToFit={false}
        source={{
          uri: `${SERVER_IP}core/oauth2/authorize/${what}`,
        }}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        javaScriptEnabled={true}
        thirdPartyCookiesEnabled={true}
        userAgent="Chrome/99.0.4844.51 Safari/537.36"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default SocialLogin;
