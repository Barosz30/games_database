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

const Search = () => {
  const { fetchGames } = useIGDB();
  const [query, setQuery] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);

  const fetchFunction = useCallback(() => {
    return fetchGames(`
      search "${query}";
      fields name, summary, cover.url, genres.name, platforms.name, total_rating;
      limit 20;
    `);
  }, [query]);

  const { data, loading, error, refetch, reset } = useFetch(
    fetchFunction,
    false
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        refetch();
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTrigger]);

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
        renderItem={({ item }) => <GameCard {...item} />}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 20,
          paddingRight: 5,
          marginBottom: 10,
        }}
        className="pb-32"
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="mt-10 px-5">
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
            {!loading && !error && query.trim() && data?.length > 0 && (
              <Text className="text-xl text-white font-bold">
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
