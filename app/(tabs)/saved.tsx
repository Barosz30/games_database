import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import useFetch from "@/app/hooks/useFetch";
import useIGDB from "@/app/hooks/useIGDB";
import { useEffect } from "react";
import GameCard from "@/components/GameCard";
import useFavorites from "../context/favoritesContext";

export default function Favorites() {
  const { favorites } = useFavorites();
  const { fetchGames, isReady } = useIGDB();

  const query = `
    fields name, first_release_date, cover.url, total_rating;
    where id = (${favorites.join(",")});
    limit ${favorites.length};
  `;

  const { data, loading, error, refetch } = useFetch(
    () => fetchGames(query),
    false
  );

  useEffect(() => {
    if (isReady && favorites.length > 0) {
      refetch();
    }
  }, [isReady, favorites]);

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
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
        <View className="flex-1 mt-5">
          <Text className="text-lg text-white font-bold mt-5 mb-3">
            Favorite Games
          </Text>

          {loading ? (
            <ActivityIndicator
              size="small"
              color="#0000ff"
              className="mt-10 self-center"
            />
          ) : error ? (
            <Text>{error.message}</Text>
          ) : favorites.length === 0 ? (
            <Text className="text-white text-center mt-10">
              No favorite games yet.
            </Text>
          ) : (
            <FlatList
              data={data}
              renderItem={({ item }) => <GameCard {...item} />}
              keyExtractor={(item) => item.id.toString()}
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
          )}
        </View>
      </ScrollView>
    </View>
  );
}
