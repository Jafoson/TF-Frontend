import { getBulkGames } from "@/actions/game";
import GamesList from "@/components/layout/Lists/GamesList/GamesList";
import GameFilters from "@/components/layout/FiltersWrapper/GameFilters/GameFilters";
import styles from "./page.module.scss";
import { BulkGamesParams } from "@/types/game";
import { getTranslations } from "next-intl/server";

// Hilfsfunktion: URL-Params in Filter umwandeln
function mapSearchParamsToFilters(searchParams: { [key: string]: string | string[] | undefined }): BulkGamesParams {
  const filters: BulkGamesParams = {
    size: 10,
    page: 0,
  };

  if (searchParams.genres) {
    filters.genreIds = String(searchParams.genres).split(",");
  }

  if (searchParams.year) {
    filters.publishingYear = Number(searchParams.year);
  }

  if (searchParams.developers) {
    filters.developerIds = String(searchParams.developers).split(",");
  }

  if (searchParams.ages) {
    filters.ageIds = String(searchParams.ages).split(",");
  }

  if (searchParams.platforms) {
    filters.platformIds = String(searchParams.platforms).split(",");
  }

  if (searchParams.sort) {
    filters.sortBy = searchParams.sort as any;
  }

  if (searchParams.direction) {
    filters.sortDirection = searchParams.direction as any;
  }

  return filters;
}

// Server Component
export default async function GamesPage({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  const t = await getTranslations("gamesList");

  // Filter aus URL holen
  const filters = mapSearchParamsToFilters(searchParams);

  // Serverseitig Daten laden
  const gamesResponse = await getBulkGames(filters);
  
  if (!gamesResponse.success) {
    console.error('Error loading games:', gamesResponse);
    throw new Error(gamesResponse.error || 'Failed to load games');
  }
  
  const games = gamesResponse.data?.data || [];

  return (
    <div className={styles.container}>
      <GameFilters />
      <div className={styles.gamesContainer}>
        {/* <GamesList
          key={JSON.stringify(filters)}
          initialData={games}
          initialPage={filters.page ?? 0}
          pageSize={filters.size ?? 10}
          filters={filters}
        /> */}
      </div>
    </div>
  );
}
