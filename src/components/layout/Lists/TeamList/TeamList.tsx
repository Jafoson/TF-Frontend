"use client";

import styles from "./TeamList.module.scss";
import RenderList from "./RenderList/RenderList";
import { useSearchParams } from "next/navigation";
import { convertSearchParamsToBulkTeamsParams } from "@/utils/paramsConverter";
import { useMemo, useEffect, useState } from "react";
import { ALoadingCircleIcon } from "@/assets/icons";
import { TeamBulkDTO } from "@/types/teams";
import { getTeams } from "@/actions/teams";

function TeamList() {
  const searchParams = useSearchParams();
  const [teams, setTeams] = useState<TeamBulkDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Konvertiere searchParams zu BulkGamesParams
  const filters = useMemo(() => {
    const params = convertSearchParamsToBulkTeamsParams(searchParams);
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
      console.log('🔍 TeamList - Aktuelle Filter:', filters);
      console.log('🔍 TeamList - SearchParams:', Object.fromEntries(searchParams.entries()));
      
      try {
        const result = await getTeams(filters);
        console.log('🔍 TeamList - API Result:', result);
        setTeams(result.data?.data || []);
      } catch (error) {
        console.error('Error loading teams:', error);
        setTeams([]);
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
      <RenderList teams={teams} filters={filters} />
    </div>
  );
}

export default TeamList;
