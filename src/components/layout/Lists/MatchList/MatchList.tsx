"use client";

import { useCallback, useEffect, useState } from "react";
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
  const [gamesLoaded, setGamesLoaded] = useState<boolean>(false);
  const [loadedGameIds, setLoadedGameIds] = useState<Set<string>>(new Set());
  const [scrollTrigger, isInView] = useInView({
    rootMargin: "600px 0px",
    threshold: 0,
  });

  // Lade Games lazy nach dem ersten Render
  const loadGamesLazy = useCallback(async () => {
    if (gamesLoaded) return;

    try {
      // Extrahiere alle einzigartigen gameIds aus den aktuellen Series
      const allGameIds = [...new Set(series.map((s) => s.gameName))].filter(Boolean);
      
      // Filtere nur die Game-IDs heraus, die noch nicht geladen wurden
      const newGameIds = allGameIds.filter(gameId => !loadedGameIds.has(gameId));
      
      if (newGameIds.length > 0) {
        const gamesResponse = await getGamesBatch(newGameIds);
        if (gamesResponse.success && gamesResponse.data) {
          setGames(prevGames => {
            // Füge nur neue Games hinzu (vermeide Duplikate)
            const existingGameIds = new Set(prevGames.map(g => g.gameId));
            const uniqueNewGames = gamesResponse.data!.filter(
              game => !existingGameIds.has(game.gameId)
            );
            return [...prevGames, ...uniqueNewGames];
          });
          
          // Aktualisiere die Set der geladenen Game-IDs
          setLoadedGameIds(prev => {
            const newSet = new Set(prev);
            newGameIds.forEach(id => newSet.add(id));
            return newSet;
          });
        }
      }
      
      setGamesLoaded(true);
    } catch (error) {
      console.error("Error loading games:", error);
    }
  }, [series, gamesLoaded, loadedGameIds]);

  // Lade Games nach dem ersten Render
  useEffect(() => {
    loadGamesLazy();
  }, [loadGamesLazy]);

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
      const newSeries: SeriesDTO[] = seriesResponse.data?.data || [];

      if (newSeries.length < pageSize) {
        setHasMoreData(false);
      }

      // Extrahiere neue gameIds aus den neuen Series
      const allNewGameIds = [...new Set(newSeries.map((s) => s.gameName))].filter(
        Boolean
      );

      // Filtere nur die Game-IDs heraus, die noch nicht geladen wurden
      const newGameIds = allNewGameIds.filter(gameId => !loadedGameIds.has(gameId));

      // Lade Game-Daten für neue gameIds wenn vorhanden
      if (newGameIds.length > 0) {
        try {
          const gamesResponse = await getGamesBatch(newGameIds);
          if (gamesResponse.success && gamesResponse.data) {
            setGames((prevGames) => {
              // Füge nur neue Games hinzu (vermeide Duplikate)
              const existingGameIds = new Set(prevGames.map((g) => g.gameId));
              const uniqueNewGames = gamesResponse.data!.filter(
                (game) => !existingGameIds.has(game.gameId)
              );
              return [...prevGames, ...uniqueNewGames];
            });
            
            // Aktualisiere die Set der geladenen Game-IDs
            setLoadedGameIds(prev => {
              const newSet = new Set(prev);
              newGameIds.forEach(id => newSet.add(id));
              return newSet;
            });
          }
        } catch (gameError) {
          console.error("Error loading games:", gameError);
        }
      }

      setSeries((prevSeries) => [...prevSeries, ...newSeries]);
    } catch (error) {
      console.error("Error loading more series:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, hasMoreData, isLoading, loadedGameIds]);

  useEffect(() => {
    if (isInView && hasMoreData && !isLoading) {
      loadMoreSeries();
    }
  }, [isInView, hasMoreData, isLoading]);

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
        <div ref={scrollTrigger} className={styles.loading}>
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