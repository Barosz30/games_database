import {
  View,
  Text,
  ImageBackground,
  Image,
  ImageSourcePropType,
} from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

const _Layout = () => {
  const TabIcon = ({
    focused,
    icon,
    name,
  }: {
    focused: boolean;
    icon: ImageSourcePropType;
    name: string;
  }) => {
    if (focused) {
      return (
        <View className="width-full">
          <ImageBackground
            source={images.highlight}
            className="w-[90px] h-[52px] flex-row justify-center mt-4 items-center rounded-full overflow-hidden"
          >
            <Image source={icon} tintColor="#151312" className="size-5" />
            <Text className="text-secondary text-base font-semibold">
              {name}
            </Text>
          </ImageBackground>
        </View>
      );
    }

    return (
      <View className="size-full justify-center mt-4 items-center rounded-full">
        <Image source={icon} tintColor={"#A8B5DB"} className="size-5" />
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarInactiveBackgroundColor: "#0f0D23",
        tabBarShowLabel: false,
        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#0f0D23",
          borderRadius: 50,
          position: "absolute",
          marginHorizontal: 10,
          borderTopWidth: 0,
          height: 52,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} name={"Home"} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} name={"Search"} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.save} name={"Saved"} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} name={"Profile"} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _Layout;
