import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import useFetch from "@/app/hooks/useFetch";
import useGameDetails from "@/app/hooks/useGameDetails";
import { icons } from "@/constants/icons";

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

  const numericId =
    typeof id === "string"
      ? parseInt(id, 10)
      : Array.isArray(id)
      ? parseInt(id[0], 10)
      : undefined;

  if (!numericId) {
    return <Text>Invalid ID</Text>;
  }

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
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View>
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
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={router.back}
        className="absolute bottom-14 left-0 right-0 mx-5 bg-accent rounderd-lg py-3.5 flex flex-row items-center justify-center z-50"
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#ffffff"
        />
        <Text className="text-white font-semibold text-base">Go back</Text>
      </TouchableOpacity>
    </View>
  );
}

export const options = {
  headerShown: false,
};

export default GameDetails;
