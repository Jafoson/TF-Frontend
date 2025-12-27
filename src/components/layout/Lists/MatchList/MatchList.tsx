"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import styles from "./MatchList.module.scss";
import { useSearchParams } from "next/navigation";
import { convertSearchParamsToBulkSeriesParams } from "@/utils/paramsConverter";
import { getSeries } from "@/actions/series";
import { getGamesBatch } from "@/actions/game";
import { ALoadingCircleIcon } from "@/assets/icons";
import { SortMatchEnum } from "@/enum/sorting/sortMatchEnum";
import { SortDirectionEnum } from "@/enum/sorting/sortDirectionEnum";
import { GameDTO } from "@/types/game";
import RenderList from "./RenderList/RenderList";
import { SeriesDTO } from "@/types/series";
import { ResponseError } from "@/types/response";

function MatchList({ isHomePage = false }: { isHomePage: boolean }) {
  const searchParams = useSearchParams();
  const [series, setSeries] = useState<SeriesDTO[]>([]);
  const [games, setGames] = useState<GameDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  

  // Konvertiere searchParams zu BulkSeriesParams oder verwende Default-Filter für Homepage
  const filters = useMemo(() => {
    if (isHomePage) {
      // Default-Filter für Homepage
      return {
        page: 0,
        size: 20,
        status: ['RUNNING', 'PENDING'], // Nur laufende und anstehende Matches
        sort: SortMatchEnum.START_DATE,
        order: SortDirectionEnum.ASC,
        from: new Date().toISOString().split('.')[0], // Format: 2025-01-15T14:30:00
        duration: 'past',
      };
    } else {
      // URL-Parameter für Matches-Seite
      const params = convertSearchParamsToBulkSeriesParams(searchParams);
      return {
        ...params,
        page: 0,
        size: 20,
      };
    }
  }, [searchParams, isHomePage]);

  // Lade Game-Details basierend auf Game-IDs aus den Series
  const loadGameDetails = useCallback(async (seriesData: SeriesDTO[], isAppend = false) => {
    if (!seriesData || seriesData.length === 0) return;

    // Extrahiere alle eindeutigen Game-IDs aus den Series
    const newGameIds = [...new Set(seriesData.map(serie => serie.gameName).filter(Boolean))];
    
    if (newGameIds.length === 0) return;

    // Prüfe welche Game-IDs bereits geladen sind
    const existingGameIds = games.map(game => game.gameId);
    const missingGameIds = newGameIds.filter(gameId => !existingGameIds.includes(gameId));
    
    if (missingGameIds.length === 0) {
      console.log('🔍 MatchList - Alle Game-IDs bereits geladen');
      return;
    }

    setIsLoadingGames(true);
    
    try {
      console.log('🔍 MatchList - Lade neue Game-Details für IDs:', missingGameIds);
      const result = await getGamesBatch(missingGameIds);
      
      if (result.success && result.data) {
        console.log('🔍 MatchList - Game-Details geladen:', result.data);
        
        if (isAppend) {
          // Beim Infinity Scroll: Füge neue Games zu bestehenden hinzu
          setGames(prevGames => [...prevGames, ...result.data]);
        } else {
          // Beim ersten Laden: Setze Games
          setGames(result.data);
        }
      } else {
        console.error('Error loading game details:', result as ResponseError);
      }
    } catch (error) {
      console.error('Error loading game details:', error);
    } finally {
      setIsLoadingGames(false);
    }
  }, [games]);

  // Prüfe ob ein Datum in der URL vorhanden ist (nur für Matches-Seite)
  const hasDate = isHomePage || searchParams.has('date');

   // Lade Series nur wenn ein Datum vorhanden ist oder es die Homepage ist
   useEffect(() => {
    // Auf Homepage sofort laden, auf Matches-Seite warten bis Datum vorhanden ist
    if (!hasDate) {
      return;
    }

    const loadSeries = async () => {
      setIsLoading(true);
      
      // Debug: Zeige die Filter an
      console.log('🔍 MatchList - Aktuelle Filter:', filters);
      console.log('🔍 MatchList - SearchParams:', Object.fromEntries(searchParams.entries()));
      
      try {
        const result = await getSeries(filters);
        console.log('🔍 MatchList - API Result:', result);
        if (result.success && result.data) {
          // result.data ist jetzt PaginationResponseDTO<SeriesDTO[]>
          const seriesData = result.data.data || [];
          setSeries(seriesData);
          
          // Lade Game-Details nach dem Laden der Series
          loadGameDetails(seriesData);
        } else {
          console.error('Error loading series:', result as ResponseError);
          setSeries([]);
        }
      } catch (error) {
        console.error('Error loading series:', error);
        setSeries([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSeries();
  }, [filters, searchParams, hasDate]);

  // Zeige Loading wenn noch kein Datum vorhanden ist oder Daten geladen werden
  if (!hasDate || isLoading) {
    return (
      <div className={styles.scrollContainer}>
        <div className={styles.loadingContainer}>
          <ALoadingCircleIcon className={styles.loadingIcon} />
          <p>{isHomePage ? 'Heute Matches werden geladen...' : (!hasDate ? 'Datum wird geladen...' : 'Matches werden geladen...')}</p>
        </div>
      </div>
    );
  }

  if (series.length === 0 && !isLoading) {
    return (
      <div className={styles.scrollContainer}>
        <div className={styles.emptyContainer}>
          <p>Keine Matches gefunden</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.scrollContainer}>
      <RenderList 
        series={series} 
        filters={filters} 
        games={games}
        isLoadingGames={isLoadingGames}
        onLoadGameDetails={loadGameDetails}
      />
    </div>
  );
}

export default MatchList;