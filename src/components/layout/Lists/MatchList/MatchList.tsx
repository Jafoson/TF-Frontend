"use client";

import { useCallback, useState } from "react";
import styles from "./MatchList.module.scss";
import { BulkSeriesParams, SeriesDTO } from "@/types/series";
import { GameDTO } from "@/types/game";
import SeriesCards from "../../Cards/SeriesCards/SeriesCards";
import { getSeries } from "@/actions/series";
import { getGamesBatch } from "@/actions/game";
import { useInView } from "react-intersection-observer";
import { SadIcon, ALoadingCircleIcon } from "@/assets/icons";
import { useTranslations } from "next-intl";

type MatchListProps = {
  initialData: SeriesDTO[];
  initialPage: number;
  pageSize: number;
  filters?: BulkSeriesParams;
};

function MatchList({
  initialData,
  initialPage,
  pageSize,
  filters = { page: 0, size: 10 },
}: MatchListProps) {
  const t = useTranslations("homeMatches");
  const [series, setSeries] = useState<SeriesDTO[]>(initialData);
  const [games, setGames] = useState<GameDTO[]>([]);
  const [page, setPage] = useState<number>(initialPage);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadedGameIds, setLoadedGameIds] = useState<Set<string>>(new Set());
  const [scrollTrigger, isInView] = useInView({
    rootMargin: "600px 0px",
    threshold: 0,
  });

  // Reset series when component mounts with new key (filter changes)
  // This happens automatically when the key prop changes

  const loadMoreSeries = useCallback(async () => {
    if (isLoading || !hasMoreData) return;

    setIsLoading(true);
    const nextPage = page + 1;
    setPage(nextPage);

    try {
      const seriesResponse = await getSeries({
        ...filters,
        page: nextPage,
        size: pageSize,
      });

      if (!seriesResponse.success || !seriesResponse.data) {
        console.error("Failed to load series:", seriesResponse);
        setHasMoreData(false);
        return;
      }

      const newSeries: SeriesDTO[] = seriesResponse.data.data || [];
      const totalPages = seriesResponse.data.totalPages || 0;

      // Prüfe ob mehr Daten verfügbar sind
      if (newSeries.length < pageSize || nextPage >= totalPages) {
        setHasMoreData(false);
      }

      setSeries((prevSeries) => [...prevSeries, ...newSeries]);

      // Lade Games für neue Series
      const allGameIds = [...new Set(newSeries.map((s) => s.gameName))].filter(Boolean);
      const newGameIds = allGameIds.filter(gameId => !loadedGameIds.has(gameId));
      
      if (newGameIds.length > 0) {
        try {
          const gamesResponse = await getGamesBatch(newGameIds);
          if (gamesResponse.success && gamesResponse.data) {
            setGames(prevGames => {
              const existingGameIds = new Set(prevGames.map(g => g.gameId));
              const uniqueNewGames = gamesResponse.data!.filter(
                game => !existingGameIds.has(game.gameId)
              );
              return [...prevGames, ...uniqueNewGames];
            });
            
            setLoadedGameIds(prev => {
              const newSet = new Set(prev);
              newGameIds.forEach(id => newSet.add(id));
              return newSet;
            });
          }
        } catch (error) {
          console.error("Error loading games:", error);
        }
      }
    } catch (error) {
      console.error("Error loading more series:", error);
      setHasMoreData(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, hasMoreData, isLoading, filters, loadedGameIds]);

  // Infinite scroll handler - called when scroll trigger comes into view
  const handleScrollTrigger = () => {
    if (hasMoreData && !isLoading) {
      loadMoreSeries();
    }
  };

  // Call loadMoreSeries when isInView changes to true
  if (isInView && hasMoreData && !isLoading) {
    loadMoreSeries();
  }

  // Lade Games für initiale Series
  const loadInitialGames = useCallback(async () => {
    if (series.length === 0) return;

    const allGameIds = [...new Set(series.map((s) => s.gameName))].filter(Boolean);
    const newGameIds = allGameIds.filter(gameId => !loadedGameIds.has(gameId));
    
    if (newGameIds.length > 0) {
      try {
        const gamesResponse = await getGamesBatch(newGameIds);
        if (gamesResponse.success && gamesResponse.data) {
          setGames(prevGames => {
            const existingGameIds = new Set(prevGames.map(g => g.gameId));
            const uniqueNewGames = gamesResponse.data!.filter(
              game => !existingGameIds.has(game.gameId)
            );
            return [...prevGames, ...uniqueNewGames];
          });
          
          setLoadedGameIds(prev => {
            const newSet = new Set(prev);
            newGameIds.forEach(id => newSet.add(id));
            return newSet;
          });
        }
      } catch (error) {
        console.error("Error loading games:", error);
      }
    }
  }, [series, loadedGameIds]);

  // Lade initiale Games
  if (series.length > 0 && games.length === 0) {
    loadInitialGames();
  }

  return (
    <div className={styles.scrollContainer}>
      {series.length > 0 ? (
        series.map((seriesItem) => (
          <SeriesCards key={seriesItem.id} series={seriesItem} games={games} />
        ))
      ) : (
        <div className={styles.noMatches}>
          <SadIcon />
          <p>{t("noMatches")}</p>
        </div>
      )}
      {hasMoreData ? (
        <div 
          ref={scrollTrigger} 
          className={styles.loading}
        >
          <ALoadingCircleIcon />
          <p>{t("loadingMore")}</p>
        </div>
      ) : (
        <div className={styles.noMatches}>
          <SadIcon />
          <p>{t("noMoreMatches")}</p>
        </div>
      )}
    </div>
  );
}

export default MatchList;