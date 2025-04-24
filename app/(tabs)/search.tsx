import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useIGDB from "../hooks/useIGDB";
import useFetch from "../hooks/useFetch";
import SearchBar from "@/components/SearchBar";

const Search = () => {
  const { fetchGames } = useIGDB();
  const [query, setQuery] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);

  const fetchFunction = useCallback(() => {
    return fetchGames(`
      search "${query}";
      fields name, summary, cover.url, genres.name, platforms.name;
      limit 10;
    `);
  }, [query]);

  const { data, loading, error, refetch } = useFetch(fetchFunction, false);

  useEffect(() => {
    if (query.length > 1) {
      refetch();
    }
  }, [searchTrigger]);

  return (
    <View className="flex-1 bg-primary">
      <ScrollView className="flex-1 px-5">
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
              <Text numberOfLines={2} style={{ color: "#666" }}>
                {item.summary}
              </Text>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};

export default Search;
