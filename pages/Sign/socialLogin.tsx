import React, { useEffect, useState } from "react";
//components
import { View, StyleSheet } from "react-native";

//navigation
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

//async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

//redux
import { useDispatch } from "react-redux";
import { setToken, setUserId } from "../../storage/actions";

//api
import { SERVER_IP } from "../../components/utils";

//library
import { WebView } from "react-native-webview";

const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.stopLoading(true);`;

type RootStackParamList = {
  SignLobby: undefined;
  EveryHere: undefined;
  SignUp: undefined;
};

const SocialLogin = ({ route }: any) => {
  // Navigation----------------------------------
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const { what } = route.params;

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

  // Render--------------------------------------
  useEffect(() => {
    if (url?.includes("social-login")) {
      const params: any = getParams(url);
      if (params["sign-up"] === "false") {
        navigation.navigate("SignUp");
      } else {
        AsyncStorage.setItem("user_id", params["userId"]);
        AsyncStorage.setItem("access_token", params["access-token"]);
        dispatch(setUserId(params["userId"]));
        dispatch(setToken(params["access-token"]));
        navigation.navigate("EveryHere");
      }
    }
  }, [url]);

  return (
    <>
      <View style={styles.container}>
        <WebView
          style={{ flex: 1 }}
          originWhitelist={["*"]}
          scalesPageToFit={false}
          source={{
            uri: `${SERVER_IP}oauth2/authorize/${what}`,
          }}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          injectedJavaScript={INJECTED_JAVASCRIPT}
          javaScriptEnabled={true}
          thirdPartyCookiesEnabled={true}
          userAgent="Chrome/99.0.4844.51 Safari/537.36"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: "#fff",
  },
});

export default SocialLogin;
