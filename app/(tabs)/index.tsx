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
import { useEffect } from "react";
import GameCard from "@/components/GameCard";

export default function Index() {
  const router = useRouter();

  const { fetchGames, isReady } = useIGDB();

  const now = Math.floor(Date.now() / 1000);
  const query = `
    fields name, first_release_date, summary, cover.url, total_rating;
    where first_release_date != null & first_release_date <= ${now};
    sort first_release_date desc;
    limit 20;
  `;

  const { data, loading, error, refetch } = useFetch(
    () => fetchGames(query),
    false
  );

  useEffect(() => {
    if (isReady) {
      refetch();
    }
  }, [isReady]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
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
                renderItem={({ item }) => <GameCard {...item} />}
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
