import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchFromIGDB } from "@/services/api";
import { Link, useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import useIGDB from "../hooks/useIGDB";
import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";
import GameCard from "@/components/GameCard";
import GameFilters from "@/components/Filters";
import { useFilters } from "../context/filtersContext";

export default function Index() {
  const router = useRouter();
  const { selectedFilters } = useFilters();

  const { fetchGames, isReady } = useIGDB();

  const fetchFunction = () => {
    const genreFilter =
      selectedFilters.genres.length > 0
        ? ` & genres = (${selectedFilters.genres.join(",")})`
        : "";

    const platformFilter =
      selectedFilters.platforms.length > 0
        ? ` & platforms = (${selectedFilters.platforms.join(",")})`
        : "";

    const now = Math.floor(Date.now() / 1000);

    return fetchGames(`
      fields name, first_release_date, cover.url, total_rating;
      where first_release_date != null & first_release_date <= ${now}${genreFilter}${platformFilter};
      sort first_release_date desc;
      limit 20;
    `);
  };

  const { data, loading, error, refetch } = useFetch(fetchFunction, false);

  useEffect(() => {
    if (isReady) {
      refetch();
    }
  }, [isReady, selectedFilters]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <View className="flex-row items-center justify-between relative">
          <View className="flex-1 mt-20">
            <GameFilters />
          </View>
          <View className="flex-1">
            <Image
              source={icons.logo}
              className="w-12 h-10 mt-20 mb-5 mx-auto"
            />
          </View>
          <View className="flex-1" />
        </View>
        {loading ? (
          <ActivityIndicator
            size="small"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : error ? (
          <Text>{error?.message}</Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="Search for a game"
            />
            <>
              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Latest Games
              </Text>
              <FlatList
                data={data}
                renderItem={({ item }) => (
                  <View style={{ width: "45%", gap: 8 }}>
                    <GameCard {...item} />
                  </View>
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export const options = {
  headerShown: false,
};
