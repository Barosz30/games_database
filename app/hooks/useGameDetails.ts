import useIGDB from "@/app/hooks/useIGDB";

const useGameDetails = (id: number | string) => {
  const { fetchGames } = useIGDB();

  const fetchDetails = () => {
    const query = `
      fields name, summary, storyline, total_rating, rating, rating_count, aggregated_rating, aggregated_rating_count, first_release_date, genres.name, platforms.name, cover.url, screenshots.url, videos.video_id, game_modes.name, involved_companies.company.name, involved_companies.developer, involved_companies.publisher;
      where id = ${id};
      limit 1;
    `;
    return fetchGames(query);
  };

  return { fetchDetails };
};

export default useGameDetails;