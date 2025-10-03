import React from 'react'
import styles from './page.module.scss'
import MatchFilters from '@/components/layout/FiltersWrapper/MatchFilters/MatchFilters'
import { BulkSeriesParams, SeriesDTO } from '@/types/series';
import MatchList from '@/components/layout/Lists/MatchList/MatchList';
import { getSeries } from '@/actions/series';
import { getTranslations } from 'next-intl/server';

// Hilfsfunktion: URL-Params in Filter umwandeln
function mapSearchParamsToFilters(searchParams: { [key: string]: string | string[] | undefined }): BulkSeriesParams {
  const filters: BulkSeriesParams = {
    size: 10,
    page: 0,
  };

  if (searchParams.matchGames) {
    filters.game = String(searchParams.matchGames).split(",");
  }

  if (searchParams.matchFormats) {
    filters.format = String(searchParams.matchFormats).split(",");
  }

  if (searchParams.matchStatuses) {
    filters.status = String(searchParams.matchStatuses).split(",");
  }

  if (searchParams.date) {
    filters.start = String(searchParams.date + "T00:00:00Z");
    filters.end = String(searchParams.date + "T23:59:59Z");
  }

  if (searchParams.sort) {
    filters.sort = searchParams.sort as any;
  }

  if (searchParams.direction) {
    filters.order = searchParams.direction as any;
  }

  return filters;
}

// Server Component
export default async function MatchOverviewPage({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  const t = await getTranslations("matchesList");

  // Filter aus URL holen
  const filters = mapSearchParamsToFilters(searchParams);

  // Serverseitig Daten laden
  const matchesResponse = await getSeries(filters);
  
  if (!matchesResponse.success) {
    console.error('Error loading matches:', matchesResponse);
    throw new Error(matchesResponse.error || 'Failed to load matches');
  }
  
  const matches = matchesResponse.data?.data || [];

  return (
    <div className={styles.matchesContainer}>
      <MatchFilters />
      <div className={styles.matchesContainer}>
        {/* <MatchList
          key={JSON.stringify(filters)}
          initialData={matches}
          initialPage={filters.page ?? 0}
          pageSize={filters.size ?? 10}
          filters={filters}
        /> */}
      </div>
    </div>
  );
}
