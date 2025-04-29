import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import useFetch from "@/app/hooks/useFetch";
import useGameDetails from "@/app/hooks/useGameDetails";
import { icons } from "@/constants/icons";
import useFavorites from "../context/favoritesContext";
import { AntDesign } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { useState } from "react";
import { Pressable } from "react-native";
import ImageViewing from "react-native-image-viewing";

interface GameInfoProps {
  label: string;
  value?: string | number | null;
}

const GameInfo = ({ label, value }: GameInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

export function GameDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const numericId =
    typeof id === "string"
      ? parseInt(id, 10)
      : Array.isArray(id)
      ? parseInt(id[0], 10)
      : undefined;

  if (!numericId) {
    return <Text>Invalid ID</Text>;
  }

  const toggleFavorite = () => {
    if (isFavorite(numericId)) {
      removeFavorite(numericId);
    } else {
      addFavorite(numericId);
    }
  };

  const { fetchDetails } = useGameDetails(numericId);

  const { data, loading, error } = useFetch(fetchDetails);

  if (loading)
    return (
      <View className="bg-primary flex-1">
        <ActivityIndicator />
      </View>
    );
  if (error) return <Text>Error: {error.message}</Text>;

  const game = data?.[0];

  if (!game) return <Text>No data found</Text>;

  return (
    <View className="bg-primary flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: 120,
          flexGrow: 1,
        }}
      >
        <View className="flex-1 flex-col">
          {game.cover?.url && (
            <Image
              source={{
                uri: `https:${game.cover.url.replace(
                  "t_thumb",
                  "t_cover_big"
                )}`,
              }}
              className="w-full h-[550px]"
              resizeMode="stretch"
            />
          )}
          <TouchableOpacity
            onPress={toggleFavorite}
            className="absolute top-10 right-5 bg-black/50 p-2 rounded-full z-10"
          >
            <AntDesign
              name={isFavorite(numericId) ? "heart" : "hearto"}
              size={24}
              color={isFavorite(numericId) ? "#FF4C4C" : "#FF7F9F"}
            />
          </TouchableOpacity>
        </View>
        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{game?.name}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {game.first_release_date
                ? new Date(game.first_release_date * 1000)
                    .toISOString()
                    .split("T")[0]
                : "Unknown release date"}
            </Text>
          </View>
          {game.platforms && (
            <View className="mt-2">
              <Text className="text-white font-bold mb-1">Available on:</Text>
              <Text className="text-light-200 text-sm">
                {game.platforms
                  .map((platform: { name: string }) => platform.name)
                  .join(", ")}
              </Text>
            </View>
          )}
          {game.game_modes && (
            <View className="mt-2">
              <Text className="text-white font-bold mb-1">Game Modes:</Text>
              <Text className="text-light-200 text-sm">
                {game.game_modes
                  .map((mode: { name: string }) => mode.name)
                  .join(", ")}
              </Text>
            </View>
          )}
          <View className="mt-4">
            <Text className="text-white font-bold mb-1">⭐ IGDB Ratings:</Text>

            <Text className="text-light-200 text-sm">
              Player Rating:{" "}
              {typeof game.rating === "number"
                ? `${game.rating.toFixed(1)} / 100 (${game.rating_count} votes)`
                : "Unavailable"}
            </Text>

            <Text className="text-light-200 text-sm mt-1">
              Critic Rating:{" "}
              {typeof game.aggregated_rating === "number"
                ? `${game.aggregated_rating.toFixed(1)} / 100 (${
                    game.aggregated_rating_count
                  } votes)`
                : "Unavailable"}
            </Text>
            <GameInfo label="Details" value={game?.summary} />
            <GameInfo
              label="Genres"
              value={
                game?.genres
                  ? game.genres
                      .map((genre: { name: string }) => genre.name)
                      .join(", ")
                  : undefined
              }
            />
            {game.involved_companies && (
              <View className="mt-4">
                <Text className="text-light-200 font-normal text-sm">
                  Companies:
                </Text>

                {game.involved_companies
                  .filter((comp: { developer: boolean }) => comp.developer)
                  .map(
                    (comp: { company: { name: string } }) => comp.company.name
                  )
                  .join(", ") && (
                  <Text className="text-light-100 font-bold text-sm mt-2">
                    Developer:{" "}
                    {game.involved_companies
                      .filter((comp: { developer: boolean }) => comp.developer)
                      .map(
                        (comp: { company: { name: string } }) =>
                          comp.company.name
                      )
                      .join(", ")}
                  </Text>
                )}

                {game.involved_companies
                  .filter((comp: { publisher: boolean }) => comp.publisher)
                  .map(
                    (comp: { company: { name: string } }) => comp.company.name
                  )
                  .join(", ") && (
                  <Text className="text-light-100 font-bold text-sm mt-2">
                    Publisher:{" "}
                    {game.involved_companies
                      .filter((comp: { publisher: boolean }) => comp.publisher)
                      .map(
                        (comp: { company: { name: string } }) =>
                          comp.company.name
                      )
                      .join(", ")}
                  </Text>
                )}
              </View>
            )}
            {game.screenshots && game.screenshots.length > 0 && (
              <View className="mt-8 min-h-40">
                <Text className="text-white font-bold mb-2">Screenshots</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-row flex-1"
                >
                  {game.screenshots.map(
                    (shot: { url: string }, index: number) => (
                      <Pressable
                        key={index}
                        onPress={() => setSelectedImageIndex(index)}
                        className="mr-4"
                      >
                        <Image
                          source={{
                            uri: `https:${shot.url.replace(
                              "t_thumb",
                              "t_screenshot_big"
                            )}`,
                          }}
                          className="w-60 h-36 rounded-lg"
                          resizeMode="cover"
                        />
                      </Pressable>
                    )
                  )}
                </ScrollView>
              </View>
            )}
            {game.videos && game.videos.length > 0 && (
              <View className="mt-8 min-h-48">
                <Text className="text-white font-bold mb-2">🎬 Trailers</Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-row"
                >
                  {game.videos.map(
                    (video: { video_id: string }, index: number) => (
                      <View
                        key={index}
                        className="w-72 h-40 rounded-lg overflow-hidden mr-4 bg-black"
                      >
                        <WebView
                          source={{
                            uri: `https://www.youtube.com/embed/${video.video_id}`,
                          }}
                          allowsFullscreenVideo
                          javaScriptEnabled
                          domStorageEnabled
                          style={{ flex: 1 }}
                        />
                      </View>
                    )
                  )}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={router.back}
        className="absolute bottom-14 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#ffffff"
        />
        <Text className="text-white font-semibold text-base">Go back</Text>
      </TouchableOpacity>
      {game.screenshots && selectedImageIndex !== null && (
        <View className="absolute inset-0 bg-black z-50">
          <ImageViewing
            images={game.screenshots.map((shot: { url: string }) => ({
              uri: `https:${shot.url.replace("t_thumb", "t_screenshot_big")}`,
            }))}
            imageIndex={selectedImageIndex}
            visible={true}
            onRequestClose={() => setSelectedImageIndex(null)}
            animationType="fade"
          />
        </View>
      )}
    </View>
  );
}

export const options = {
  headerShown: false,
};

export default GameDetails;
