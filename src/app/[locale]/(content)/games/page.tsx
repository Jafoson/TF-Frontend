"use client";

import { useEffect, useState } from "react";
import GamesList from "@/components/layout/Lists/GamesList/GamesList";
import styles from "./page.module.scss";
import GameFilters from "@/pages/games/dashboard/filter/filterLogik";
import { BulkGameDTO, BulkGamesParams } from "@/types/game";
import { getBulkGames } from "@/actions/game";

// Diese Funktion wird serverseitig ausgeführt
async function getData(params: BulkGamesParams) {
  const gamesResponse = await getBulkGames(params);
  console.log("Games response:", gamesResponse);
  const games = gamesResponse.data?.data || [];
  console.log("Games:", games);

  return games;
}

export default function GamesPage() {
  const [games, setGames] = useState<BulkGameDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState<BulkGamesParams>({
    size: 10,
    page: 0,
  });

  // Gemeinsame Funktion zum Laden der Games
  const loadGames = async (filters: BulkGamesParams) => {
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
  };

  // ✅ Separater useEffect um zu sehen wenn games sich ändert
  useEffect(() => {
    console.log("Games State updated:", games);
  }, [games]);

  const handleFiltersChange = async (newFilters: BulkGamesParams) => {
    console.log("Filter changed:", newFilters);
    setCurrentFilters(newFilters);

    // Lade neue Daten mit den Filtern
    await loadGames(newFilters);
  };

  return (
    <div className={styles.container}>
      <GameFilters onFiltersChange={handleFiltersChange} />
      <div className={styles.gamesContainer}>
        {isLoading ? (
          <div className={styles.container}>
            <div>Lade Spiele...</div>
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
