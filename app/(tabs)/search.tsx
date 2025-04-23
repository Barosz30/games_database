import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useIGDB from "../hooks/useIGDB";
import useFetch from "../hooks/useFetch";

const Search = () => {
  const { fetchGames } = useIGDB();
  const [query, setQuery] = useState("zelda");
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
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Search for a game"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={() => setSearchTrigger((n) => n + 1)}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          borderRadius: 6,
          marginBottom: 16,
        }}
      />

      {loading && <ActivityIndicator size="small" />}
      {error && <Text style={{ color: "red" }}>{error.message}</Text>}

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
    </View>
  );
};

export default Search;
