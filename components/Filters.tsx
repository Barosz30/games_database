import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useGameMeta } from "@/app/context/gameMetaContext";
import { useFilters } from "@/app/context/filtersContext"; // import context here

const GameFilters = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const {
    genres: availableGenres,
    platforms: availablePlatforms,
    loading,
  } = useGameMeta();

  const { selectedFilters, setSelectedFilters } = useFilters(); // use global context

  const toggleGenre = (id: number) => {
    const updated = selectedFilters.genres.includes(id)
      ? selectedFilters.genres.filter((g) => g !== id)
      : [...selectedFilters.genres, id];
    setSelectedFilters({ ...selectedFilters, genres: updated });
  };

  const togglePlatform = (id: number) => {
    const updated = selectedFilters.platforms.includes(id)
      ? selectedFilters.platforms.filter((p) => p !== id)
      : [...selectedFilters.platforms, id];
    setSelectedFilters({ ...selectedFilters, platforms: updated });
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="flex-row items-center justify-between bg-gray-800 px-4 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold text-base">Filters</Text>
        <AntDesign name="filter" size={18} color="#ffffff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end">
          <Pressable
            className="absolute inset-0"
            onPress={() => setModalVisible(false)}
          />
          <View
            className="bg-gray-900 p-5 rounded-t-2xl"
            style={{ maxHeight: "85%" }}
          >
            {loading ? (
              <Text className="text-white text-base">Loading Filters...</Text>
            ) : (
              <>
                <Text className="text-white font-bold mb-2 text-lg">
                  Genres
                </Text>
                <ScrollView
                  style={{ height: 300 }}
                  showsVerticalScrollIndicator={false}
                  className="mb-4"
                >
                  <View className="flex-row flex-wrap gap-2">
                    {availableGenres.map((genre) => (
                      <TouchableOpacity
                        key={genre.id}
                        onPress={() => toggleGenre(genre.id)}
                      >
                        <Text
                          className={`px-3 py-1 rounded-full ${
                            selectedFilters.genres.includes(genre.id)
                              ? "bg-accent text-white"
                              : "bg-gray-700 text-light-200"
                          }`}
                        >
                          {genre.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                <Text className="text-white font-bold mb-2 text-lg">
                  Platforms
                </Text>
                <ScrollView
                  style={{ height: 300 }}
                  showsVerticalScrollIndicator={false}
                >
                  <View className="flex-row flex-wrap gap-2">
                    {availablePlatforms.map((platform) => (
                      <TouchableOpacity
                        key={platform.id}
                        onPress={() => togglePlatform(platform.id)}
                      >
                        <Text
                          className={`px-3 py-1 rounded-full ${
                            selectedFilters.platforms.includes(platform.id)
                              ? "bg-accent text-white"
                              : "bg-gray-700 text-light-200"
                          }`}
                        >
                          {platform.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="mt-6 bg-accent py-3 rounded-lg items-center"
                >
                  <Text className="text-white font-semibold text-base">
                    Apply Filters
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default GameFilters;
