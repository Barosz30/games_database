import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";
import placeholder from "@/assets/images/placeholder.png";
import { icons } from "@/constants/icons";

type GameCardProps = {
  id: number;
  name: string;
  first_release_date?: number;
  cover?: {
    url: string;
  };
  total_rating?: number;
};

const GameCard = ({
  id,
  name,
  first_release_date,
  cover,
  total_rating,
}: GameCardProps) => {
  const imageUrl = cover?.url
    ? `https:${cover.url.replace("t_thumb", "t_cover_big")}`
    : null;

  return (
    <Link href={`/games/${id}`} asChild>
      <TouchableOpacity
        style={{
          width: "100%",
          aspectRatio: 2 / 3,
          marginBottom: 20,
        }}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{
              width: "100%",
              height: 150,
              borderRadius: 12,
            }}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={placeholder}
            style={{
              width: "100%",
              height: 150,
              borderRadius: 12,
            }}
            resizeMode="cover"
          />
        )}
        <Text className="text-sm font-bold text-white mt-2">{name}</Text>
        {total_rating && (
          <View className="flex-row items-center justify-start gap-x-1">
            <Image source={icons.star} className="size-4" />
            <Text className="text-xs text-white font-bold uppercase">
              {total_rating.toFixed()}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Link>
  );
};

export default GameCard;
