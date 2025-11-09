"use client";

import { getBulkGames } from "@/actions/game";
import styles from "./GamesList.module.scss";
import RenderList from "./RenderList/RenderList";
import { useSearchParams } from "next/navigation";
import { convertSearchParamsToBulkGamesParams } from "@/utils/paramsConverter";
import { useMemo, useEffect, useState } from "react";
import { ALoadingCircleIcon } from "@/assets/icons";
import { BulkGameDTO } from "@/types/game";

function GamesList() {
  const searchParams = useSearchParams();
  const [games, setGames] = useState<BulkGameDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Konvertiere searchParams zu BulkGamesParams
  const filters = useMemo(() => {
    const params = convertSearchParamsToBulkGamesParams(searchParams);
    return {
      ...params,
      page: 0,
      size: 20,
    };
  }, [searchParams]);

  // Lade Spiele wenn sich Filter ändern
  useEffect(() => {
    const loadGames = async () => {
      setIsLoading(true);
      
      // Debug: Zeige die Filter an
      console.log('🔍 GamesList - Aktuelle Filter:', filters);
      console.log('🔍 GamesList - SearchParams:', Object.fromEntries(searchParams.entries()));
      
      try {
        const result = await getBulkGames(filters);
        console.log('🔍 GamesList - API Result:', result);
        setGames(result.data?.data || []);
      } catch (error) {
        console.error('Error loading games:', error);
        setGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadGames();
  }, [filters, searchParams]);

  if (isLoading) {
    return (
      <div className={styles.scrollContainer}>
        <div className={styles.loadingContainer}>
          <ALoadingCircleIcon className={styles.loadingIcon} />
          <p>Spiele werden geladen...</p>
        </div>
      </div>
    );
  }

  if (games.length === 0 && !isLoading) {
    return (
      <div className={styles.scrollContainer}>
        <div className={styles.emptyContainer}>
          <p>Keine Spiele gefunden</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.scrollContainer}>
      <RenderList games={games} filters={filters} />
    </div>
  );
}

export default GamesList;
