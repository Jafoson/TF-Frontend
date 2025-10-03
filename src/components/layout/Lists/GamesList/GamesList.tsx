"use client";

import { useCallback, useState } from "react";
import styles from "./GamesList.module.scss";
import { BulkGameDTO, BulkGamesParams } from "@/types/game";
import BulkGameCards from "../../Cards/BulkGameCards/BulkGameCards";
import { getBulkGames } from "@/actions/game";
import { useInView } from "react-intersection-observer";
import { SadIcon, ALoadingCircleIcon } from "@/assets/icons";
import { useTranslations } from "next-intl";

type GamesListProps = {
  initialData: BulkGameDTO[];
  initialPage: number;
  pageSize: number;
  filters?: BulkGamesParams;
};

function GamesList({
  initialData,
  initialPage,
  pageSize,
  filters = { page: 0, size: 10 },
}: GamesListProps) {
  const t = useTranslations("gamesList");
  const [games, setGames] = useState<BulkGameDTO[]>(initialData);
  const [page, setPage] = useState<number>(initialPage);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scrollTrigger, isInView] = useInView({
    rootMargin: "600px 0px",
    threshold: 0,
  });

  // Reset games when component mounts with new key (filter changes)
  // This happens automatically when the key prop changes

  const loadMoreGames = useCallback(async () => {
    if (isLoading || !hasMoreData) return;

    setIsLoading(true);
    const nextPage = page + 1;
    setPage(nextPage);

    try {
      const params: BulkGamesParams = {
        ...filters,
        page: nextPage,
        size: pageSize,
      };

      const gamesResponse = await getBulkGames(params);

      if (!gamesResponse.success || !gamesResponse.data) {
        console.error("Failed to load games:", gamesResponse);
        setHasMoreData(false);
        return;
      }

      const newGames: BulkGameDTO[] = gamesResponse.data.data || [];
      const totalPages = gamesResponse.data.totalPages || 0;

      // Prüfe ob mehr Daten verfügbar sind
      if (newGames.length < pageSize || nextPage >= totalPages) {
        setHasMoreData(false);
      }

      setGames((prevGames) => [...prevGames, ...newGames]);
    } catch (error) {
      console.error("Error loading more games:", error);
      setHasMoreData(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, hasMoreData, isLoading, filters]);

  // Infinite scroll handler - called when scroll trigger comes into view
  const handleScrollTrigger = () => {
    if (hasMoreData && !isLoading) {
      loadMoreGames();
    }
  };

  // Call loadMoreGames when isInView changes to true
  if (isInView && hasMoreData && !isLoading) {
    loadMoreGames();
  }

  return (
    <div className={styles.scrollContainer}>
      {games.length > 0 ? (
        games.map((game) => <BulkGameCards key={game.uid} game={game} />)
      ) : (
        <div className={styles.noGames}>
          <SadIcon />
          <p>{t("noGames")}</p>
        </div>
      )}
      {hasMoreData && (
        <div 
          ref={scrollTrigger} 
          className={styles.loading}
        >
          <ALoadingCircleIcon />
          <p>{t("loadingMore")}</p>
        </div>
      )}
    </div>
  );
}

export default GamesList;
