import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useIGDB from "../hooks/useIGDB";
import useFetch from "../hooks/useFetch";
import SearchBar from "@/components/SearchBar";
import { images } from "@/constants/images";
import GameCard from "@/components/GameCard";
import { icons } from "@/constants/icons";
import GameFilters from "@/components/Filters";
import { useFilters } from "../context/filtersContext";

const Search = () => {
  const { fetchGames } = useIGDB();
  const [query, setQuery] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);
  const { selectedFilters } = useFilters();

  const fetchFunction = useCallback(() => {
    const genreFilter =
      selectedFilters.genres.length > 0
        ? ` & genres = (${selectedFilters.genres.join(",")})`
        : "";

    const platformFilter =
      selectedFilters.platforms.length > 0
        ? ` & platforms = (${selectedFilters.platforms.join(",")})`
        : "";

    const now = Math.floor(Date.now() / 1000);

    const searchPart = query.trim() ? `search "${query}";` : "";

    const filterQuery = `
      ${searchPart}
      fields name, summary, cover.url, genres.name, platforms.name, total_rating, first_release_date;
      where name != null & first_release_date != null & first_release_date <= ${now}${genreFilter}${platformFilter};
      ${query.trim() ? "" : "sort first_release_date desc;"}
      limit 20;
    `;

    return fetchGames(filterQuery);
  }, [query, selectedFilters, fetchGames]);

  const { data, loading, error, refetch, reset } = useFetch(
    fetchFunction,
    false
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTrigger, selectedFilters]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ width: "45%", gap: 8 }}>
            <GameCard {...item} />
          </View>
        )}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 20,
          paddingRight: 5,
          marginBottom: 10,
        }}
        className="pb-32 px-5"
        ListHeaderComponent={
          <>
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

            <View className="mt-5">
              <SearchBar
                placeholder="Search for a game"
                value={query}
                onChangeText={(text: string) => {
                  setQuery(text);
                  setSearchTrigger((prev) => prev + 1);
                }}
              />
            </View>
            {loading && (
              <ActivityIndicator
                size="small"
                color="#0000ff"
                className="mt-10 self-center"
              />
            )}
            {error && <Text>{error?.message}</Text>}
            {!loading && !error && data?.length > 0 && (
              <Text className="text-xl text-white font-bold mt-5 mb-5">
                Search results for <Text className="text-accent">{query}</Text>
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {query.trim() ? "No games found" : "Search for a game"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;
