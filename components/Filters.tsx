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

type GameFiltersProps = {
  onFilterChange: (filters: { genres: string[]; platforms: string[] }) => void;
};

const GameFilters = ({ onFilterChange }: GameFiltersProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const {
    genres: availableGenres,
    platforms: availablePlatforms,
    loading,
  } = useGameMeta();

  const toggleGenre = (genre: string) => {
    const updated = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(updated);
    onFilterChange({ genres: updated, platforms: selectedPlatforms });
  };

  const togglePlatform = (platform: string) => {
    const updated = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter((p) => p !== platform)
      : [...selectedPlatforms, platform];
    setSelectedPlatforms(updated);
    onFilterChange({ genres: selectedGenres, platforms: updated });
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
                        key={genre}
                        onPress={() => toggleGenre(genre)}
                      >
                        <Text
                          className={`px-3 py-1 rounded-full ${
                            selectedGenres.includes(genre)
                              ? "bg-accent text-white"
                              : "bg-gray-700 text-light-200"
                          }`}
                        >
                          {genre}
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
                        key={platform}
                        onPress={() => togglePlatform(platform)}
                      >
                        <Text
                          className={`px-3 py-1 rounded-full ${
                            selectedPlatforms.includes(platform)
                              ? "bg-accent text-white"
                              : "bg-gray-700 text-light-200"
                          }`}
                        >
                          {platform}
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
