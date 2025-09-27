"use client";

import React, { useCallback, useState, useEffect } from 'react'
import styles from './page.module.scss'
import MatchFilters from '@/components/layout/FiltersWrapper/MatchFilters/MatchFilters'
import { BulkSeriesParams, SeriesDTO } from '@/types/series';
import MatchList from '@/components/layout/Lists/MatchList/MatchList';
import { getSeries } from '@/actions/series';

export default function MatchOverviewPage() {
  const [matches, setMatches] = useState<SeriesDTO[]>([]);
  const [currentFilters, setCurrentFilters] = useState<BulkSeriesParams>({
    page: 0,
    size: 10,
  });
  const [, setIsLoading] = useState(true);

  const loadMatches = useCallback(async(filters: BulkSeriesParams) => {
    setIsLoading(true);
    try {
      const responseMatches = await getSeries(filters);
      setMatches(responseMatches.data?.data || []);
    } catch (error) {
      console.error("Error loading matches:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFiltersChange = useCallback((filters: BulkSeriesParams) => {
    console.log("Filters changed:", filters);
    setCurrentFilters(filters);
    setMatches([]);
    loadMatches(filters);
  }, [loadMatches]);

  // Initial load only once
  useEffect(() => {
    loadMatches({
      page: 0,
      size: 10,
    });
  }, []); // Empty dependency array - only run once on mount

  return (
        <div className={styles.container}>
          <MatchFilters onFiltersChange={handleFiltersChange} />
          <div className={styles.matchesContainer}>
            <MatchList
              key={JSON.stringify(currentFilters)}
              initialData={matches}
              initialPage={0}
              pageSize={10}
              filters={currentFilters}
            />
          </div>
        </div>
  )
}
