import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import useFetch from "@/app/hooks/useFetch";
import useGameDetails from "@/app/hooks/useGameDetails";
import { icons } from "@/constants/icons";
import useFavorites from "../context/favoritesContext";
import { AntDesign } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { useState } from "react";
import ImageViewing from "react-native-image-viewing";
import GameCard from "@/components/GameCard";

interface GameInfoProps {
  label: string;
  value?: string | number | null;
}

interface Platform {
  name: string;
}

interface GameMode {
  name: string;
}

interface Genre {
  name: string;
}

interface Company {
  name: string;
}

interface InvolvedCompany {
  developer?: boolean;
  publisher?: boolean;
  company: Company;
}

interface Screenshot {
  url: string;
}

interface Video {
  video_id: string;
}

interface Game {
  id: number;
  name: string;
  summary?: string;
  rating?: number;
  rating_count?: number;
  aggregated_rating?: number;
  aggregated_rating_count?: number;
  first_release_date?: number;
  cover?: { url: string };
  genres?: Genre[];
  platforms?: Platform[];
  game_modes?: GameMode[];
  involved_companies?: InvolvedCompany[];
  screenshots?: Screenshot[];
  videos?: Video[];
  similar_games?: Game[];
}

const GameInfo = ({ label, value }: GameInfoProps) => (
  <View style={styles.infoBlock}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || "N/A"}</Text>
  </View>
);

export function GameDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const numericId =
    typeof id === "string"
      ? parseInt(id, 10)
      : Array.isArray(id)
      ? parseInt(id[0], 10)
      : undefined;
  if (!numericId) return <Text>Invalid ID</Text>;

  const toggleFavorite = () => {
    if (isFavorite(numericId)) {
      removeFavorite(numericId);
    } else {
      addFavorite(numericId);
    }
  };

  const { fetchDetails } = useGameDetails(numericId);
  const { data, loading, error } = useFetch<Game[]>(fetchDetails);
  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  if (error) return <Text>Error: {error.message}</Text>;

  const game = data?.[0];
  if (!game) return <Text>No data found</Text>;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View>
          {game.cover?.url && (
            <Image
              source={{
                uri: `https:${game.cover.url.replace(
                  "t_thumb",
                  "t_cover_big"
                )}`,
              }}
              style={styles.coverImage}
              resizeMode="stretch"
            />
          )}
          <TouchableOpacity
            onPress={toggleFavorite}
            style={styles.favoriteButton}
          >
            <AntDesign
              name={isFavorite(numericId) ? "heart" : "hearto"}
              size={24}
              color={isFavorite(numericId) ? "#FF4C4C" : "#FF7F9F"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.gameTitle}>{game?.name}</Text>
          <Text style={styles.textSmall}>
            {game.first_release_date
              ? new Date(game.first_release_date * 1000)
                  .toISOString()
                  .split("T")[0]
              : "Unknown release date"}
          </Text>

          {game.platforms && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Available on:</Text>
              <Text style={styles.textSmall}>
                {game.platforms.map((p) => p.name).join(", ")}
              </Text>
            </View>
          )}

          {game.game_modes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Game Modes:</Text>
              <Text style={styles.textSmall}>
                {game.game_modes.map((m) => m.name).join(", ")}
              </Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⭐ IGDB Ratings:</Text>
            <Text style={styles.textSmall}>
              Player Rating:{" "}
              {typeof game.rating === "number"
                ? `${game.rating.toFixed(1)} / 100 (${game.rating_count} votes)`
                : "Unavailable"}
            </Text>
            <Text style={styles.textSmall}>
              Critic Rating:{" "}
              {typeof game.aggregated_rating === "number"
                ? `${game.aggregated_rating.toFixed(1)} / 100 (${
                    game.aggregated_rating_count
                  } votes)`
                : "Unavailable"}
            </Text>
          </View>

          <GameInfo label="Details" value={game?.summary} />
          <GameInfo
            label="Genres"
            value={game?.genres?.map((g) => g.name).join(", ")}
          />

          {game.involved_companies && (
            <View style={styles.section}>
              <Text style={styles.label}>Companies:</Text>
              {game.involved_companies.filter((c) => c.developer).length >
                0 && (
                <Text style={styles.value}>
                  Developer:{" "}
                  {game.involved_companies
                    .filter((c) => c.developer)
                    .map((c) => c.company.name)
                    .join(", ")}
                </Text>
              )}
              {game.involved_companies.filter((c) => c.publisher).length >
                0 && (
                <Text style={styles.value}>
                  Publisher:{" "}
                  {game.involved_companies
                    .filter((c) => c.publisher)
                    .map((c) => c.company.name)
                    .join(", ")}
                </Text>
              )}
            </View>
          )}

          {game.screenshots && game.screenshots.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Screenshots</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {game.screenshots.map((shot, i) => (
                  <Pressable key={i} onPress={() => setSelectedImageIndex(i)}>
                    <Image
                      source={{
                        uri: `https:${shot.url.replace(
                          "t_thumb",
                          "t_screenshot_big"
                        )}`,
                      }}
                      style={styles.screenshot}
                    />
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {game.videos && game.videos.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎬 Trailers</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {game.videos.map((video, index) => (
                  <View key={index} style={styles.videoContainer}>
                    <WebView
                      source={{
                        uri: `https://www.youtube.com/embed/${video.video_id}`,
                      }}
                      allowsFullscreenVideo
                      javaScriptEnabled
                      domStorageEnabled
                      style={styles.webView}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {game.similar_games && game.similar_games.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Similar Games</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {game.similar_games.map((similar) => (
                  <View key={similar.id} style={styles.similarCard}>
                    <GameCard {...similar} />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity onPress={router.back} style={styles.backButton}>
        <Image source={icons.arrow} style={styles.backIcon} tintColor="#fff" />
        <Text style={styles.backText}>Go back</Text>
      </TouchableOpacity>

      {game.screenshots && selectedImageIndex !== null && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: "black",
          }}
        >
          <ImageViewing
            images={game.screenshots.map((shot) => ({
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#151515" },
  scrollContent: { paddingBottom: 120, flexGrow: 1, minHeight: 100 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  coverImage: { width: "100%", height: 550 },
  favoriteButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 999,
  },
  detailsContainer: { paddingHorizontal: 20, marginTop: 20 },
  gameTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 5,
  },
  textSmall: { color: "#aaa", fontSize: 14, marginBottom: 4 },
  section: { marginTop: 20 },
  sectionTitle: { color: "white", fontWeight: "bold", marginBottom: 5 },
  label: { color: "#ccc", fontSize: 14 },
  value: { color: "#fff", fontSize: 14, fontWeight: "bold", marginTop: 5 },
  infoBlock: { marginTop: 20 },
  screenshot: { width: 240, height: 140, borderRadius: 10, marginRight: 10 },
  videoContainer: {
    width: 288,
    height: 160,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "black",
    marginRight: 10,
  },
  webView: { width: "100%", height: "100%" },
  similarCard: { width: 180, height: 180, marginRight: 10 },
  backButton: {
    position: "absolute",
    bottom: 56,
    left: 20,
    right: 20,
    backgroundColor: "#AB8BFF",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    transform: [{ rotate: "180deg" }],
  },
  backText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});

export const options = { headerShown: false };
export default GameDetails;
