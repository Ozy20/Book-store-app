import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  useWindowDimensions,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import Icon from "react-native-elements/dist/icons/Icon";
import { login, resetPass } from "../../firebase/auth";
import { router } from "expo-router";

export default function SignIn() {
  const { height, width } = useWindowDimensions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let imageWidth = width > 700 ? width * 0.5 : width ;
  let imageHeight = height > 900 ? height * 0.08 : height * 0.2;

  const handleSignIn = async () => {
    try {
      const cred = await login(email, password);
      await AsyncStorage.setItem("userUID", cred.user.uid);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", "Invalid email or password. Please try again.");
      console.error("Sign-in error:", error);
    }
  };
  const handelResetPass = async () => {
    try {
      await resetPass(email);
      Alert.alert("Please check Your mail.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{flex:1,justifyContent:'center',alignSelf:'center',gap:20}}>
     

        <View style={{flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',borderRadius: 50, 
      backgroundColor: 'white', borderWidth: 2, width: imageWidth*0.8 , borderColor: '#B3C8CF',padding:5}}>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        textAlign='center'
        style={{
          fontSize: imageHeight*imageWidth * 0.0003 , 
          maxWidth:width * 0.6 ,
          flex:1,
          textAlign:'left'
        }}
      />
      
      <Icon name='mail' type="material" color="#B3C8CF"/>
      </View>
      
      <View style={{flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',borderRadius: 50, 
      backgroundColor: 'white', borderWidth: 2, width: imageWidth*0.8, borderColor: '#B3C8CF',padding:5}}>
      <TextInput
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        textAlign='center'
        style={{
          fontSize:imageHeight*imageWidth * 0.0003 , 
          maxWidth:width * 0.6 ,
          flex:1,
          textAlign:'left'
        }}
      />
      
      <Icon name='lock' type="material" color="#B3C8CF"/>
      </View>

      <Pressable onPress={handleSignIn}>
        <Text
          style={{
            textAlign: "center",
            borderWidth: 2,
            borderRadius: 50,
            borderColor: "#B3C8CF",
            backgroundColor: "white",
            padding: 5,
            fontWeight: "400",
            color: "#82aab9",
          }}
        >
          Sign In
        </Text>
      </Pressable>

      
          <Pressable onPress={handelResetPass}>
          <Text style={{ color: "#4D869C", fontWeight: "200" }}>
            Forgot your password ?
          </Text>
          </Pressable>
          <Pressable onPress={() => router.replace("/account/signup")}>
          <Text style={{ color: "#4D869C", fontWeight: "200" }}>
            Don't have an account ?
          </Text>
          </Pressable>

     
    </View>
  );
}

