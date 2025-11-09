"use client";

import styles from "./TeamList.module.scss";
import RenderList from "./RenderList/RenderList";
import { useSearchParams } from "next/navigation";
import { convertSearchParamsToBulkTeamsParams } from "@/utils/paramsConverter";
import { useMemo, useEffect, useState, useCallback } from "react";
import { ALoadingCircleIcon } from "@/assets/icons";
import { TeamBulkDTO } from "@/types/teams";
import { GameDTO } from "@/types/game";
import { getTeams } from "@/actions/teams";
import { getGamesBatch } from "@/actions/game";

function TeamList() {
  const searchParams = useSearchParams();
  const [teams, setTeams] = useState<TeamBulkDTO[]>([]);
  const [games, setGames] = useState<GameDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingGames, setIsLoadingGames] = useState(false);

  // Konvertiere searchParams zu BulkTeamsParams
  const filters = useMemo(() => {
    const params = convertSearchParamsToBulkTeamsParams(searchParams);
    return {
      ...params,
      page: 0,
      size: 20,
    };
  }, [searchParams]);

  // Lade Game-Details basierend auf Game-IDs aus den Teams
  const loadGameDetails = useCallback(async (teamsData: TeamBulkDTO[], isAppend = false) => {
    if (!teamsData || teamsData.length === 0) return;

    // Extrahiere alle eindeutigen Game-IDs aus den Teams
    const newGameIds = [...new Set(teamsData.map(team => team.gameId).filter(Boolean))];
    
    if (newGameIds.length === 0) return;

    // Prüfe welche Game-IDs bereits geladen sind
    const existingGameIds = games.map(game => game.gameId);
    const missingGameIds = newGameIds.filter(gameId => !existingGameIds.includes(gameId));
    
    if (missingGameIds.length === 0) {
      console.log('🔍 TeamList - Alle Game-IDs bereits geladen');
      return;
    }

    setIsLoadingGames(true);
    
    try {
      console.log('🔍 TeamList - Lade neue Game-Details für IDs:', missingGameIds);
      const result = await getGamesBatch(missingGameIds);
      
      if (result.success && result.data) {
        console.log('🔍 TeamList - Game-Details geladen:', result.data);
        
        if (isAppend) {
          // Beim Infinity Scroll: Füge neue Games zu bestehenden hinzu
          setGames(prevGames => [...prevGames, ...result.data]);
        } else {
          // Beim ersten Laden: Setze Games
          setGames(result.data);
        }
      } else {
        console.error('Fehler beim Laden der Game-Details:', result.error);
      }
    } catch (error) {
      console.error('Error loading game details:', error);
    } finally {
      setIsLoadingGames(false);
    }
  }, [games]);

  // Lade initiale Teams wenn sich Filter ändern
  useEffect(() => {
    const loadInitialTeams = async () => {
      setIsLoading(true);
      
      // Debug: Zeige die Filter an
      console.log('🔍 TeamList - Aktuelle Filter:', filters);
      console.log('🔍 TeamList - SearchParams:', Object.fromEntries(searchParams.entries()));
      
      try {
        const result = await getTeams(filters);
        console.log('🔍 TeamList - API Result:', result);
        setTeams(result.data?.data || []);
        
        // Lade Game-Details nach dem Laden der Teams
        if (result.success && result.data && result.data.data) {
          loadGameDetails(result.data.data);
        }
      } catch (error) {
        console.error('Error loading teams:', error);
        setTeams([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialTeams();
  }, [filters, searchParams]);

  if (isLoading) {
    return (
      <div className={styles.scrollContainer}>
        <div className={styles.loadingContainer}>
          <ALoadingCircleIcon className={styles.loadingIcon} />
          <p>Teams werden geladen...</p>
        </div>
      </div>
    );
  }

  if (teams.length === 0 && !isLoading) {
    return (
      <div className={styles.scrollContainer}>
        <div className={styles.emptyContainer}>
          <p>Keine Teams gefunden</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.scrollContainer}>
      <RenderList 
        teams={teams} 
        filters={filters} 
        games={games}
        isLoadingGames={isLoadingGames}
        onLoadGameDetails={loadGameDetails}
      />
    </div>
  );
}

export default TeamList;
