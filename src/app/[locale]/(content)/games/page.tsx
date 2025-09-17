"use client";

import { useEffect, useState, useCallback } from "react";
import GamesList from "@/components/layout/Lists/GamesList/GamesList";
import styles from "./page.module.scss";
import { BulkGameDTO, BulkGamesParams } from "@/types/game";
import { getBulkGames } from "@/actions/game";
import { useTranslations } from "next-intl";
import GameFilters from "@/components/layout/FiltersWrapper/GameFilters/GameFilters";

// Diese Funktion wird serverseitig ausgeführt
async function getData(params: BulkGamesParams) {
  const gamesResponse = await getBulkGames(params);
  console.log("Games response:", gamesResponse);
  const games = gamesResponse.data?.data || [];
  console.log("Games:", games);

  return games;
}

export default function GamesPage() {
  const t = useTranslations("gamesList");
  const [games, setGames] = useState<BulkGameDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState<BulkGamesParams>({
    size: 10,
    page: 0,
  });

  // Gemeinsame Funktion zum Laden der Games
  const loadGames = useCallback(async (filters: BulkGamesParams) => {
    setIsLoading(true);
    try {
      const responseGames = await getData(filters);
      console.log("Games loaded with filters:", filters, "->", responseGames);
      setGames(responseGames);
    } catch (error) {
      console.error("Error loading games:", error);
      setGames([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initiales Laden der Games
  useEffect(() => {
    loadGames({ page: 0, size: 10 });
  }, [loadGames]);

  // ✅ Separater useEffect um zu sehen wenn games sich ändert
  useEffect(() => {
    console.log("Games State updated:", games);
  }, [games]);

  const handleFiltersChange = useCallback(
    async (newFilters: BulkGamesParams) => {
      console.log("Filter changed:", newFilters);
      setCurrentFilters(newFilters);

      // Lade neue Daten mit den Filtern
      await loadGames(newFilters);
    },
    [loadGames]
  );

  return (
    <div className={styles.container}>
      <GameFilters onFiltersChange={handleFiltersChange} />
      <div className={styles.gamesContainer}>
        {isLoading ? (
          <div className={styles.container}>
            <div>{t("loading")}</div>
          </div>
        ) : (
          <GamesList
            initialData={games}
            initialPage={0}
            pageSize={10}
            filters={currentFilters}
          />
        )}
      </div>
    </div>
  );
}
