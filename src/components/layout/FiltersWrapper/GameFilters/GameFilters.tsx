import React, { useState, useCallback } from 'react'
import FilterMenu from '@/components/layout/FilterMenu/FilterMenu'
import { getAllGenres, getAllAgeRatings, getAllPublishYears, getAllDevelopers, getAllPlatforms } from '@/actions/game'
import { BulkGamesParams } from '@/types/game';
import { FilterItem } from '@/types/filter';
import SortMenu from '../../FilterMenu/SortMenu/SortMenu';
import { SortGameEnum } from '@/enum/sortGameEnum';
import { SortDirectionEnum } from '@/enum/sortDirectionEnum';
import { useTranslations } from 'next-intl';
import FilterChipsWrapper from '../../Wrapper/FilterChipsWrapper/FilterChipsWrapper';
type GameFiltersProps = {
    onFiltersChange: (filters: BulkGamesParams) => void;
  };
  
export default function GameFilters({ onFiltersChange }: GameFiltersProps) {
  // State für jeden Filter
  const [selectedGenres, setSelectedGenres] = useState<FilterItem[]>([]);
  const [selectedPublishYear, setSelectedPublishYear] = useState<FilterItem[]>([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState<FilterItem[]>([]);
  const [selectedAgeRatings, setSelectedAgeRatings] = useState<FilterItem[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<FilterItem[]>([]);
  const [selectedSort, setSelectedSort] = useState<SortGameEnum>(SortGameEnum.GAME_NAME);
  const [selectedSortDirection, setSelectedSortDirection] = useState<SortDirectionEnum>(SortDirectionEnum.ASC);

  // Funktion um alle Filter zu BulkGamesParams zusammenzufassen
  const updateFilters = useCallback(() => {
    const filters: BulkGamesParams = {
      // Genre IDs
      genreIds: selectedGenres.length > 0 ? selectedGenres.map(item => item.uid) : undefined,
      
      // Publishing Year (nur der erste Wert, da es single-select ist)
      publishingYear: selectedPublishYear.length > 0 ? Number(selectedPublishYear[0].name) : undefined,
      
      // Developer IDs
      developerIds: selectedDevelopers.length > 0 ? selectedDevelopers.map(item => item.uid) : undefined,
      
      // Age Rating IDs
      ageIds: selectedAgeRatings.length > 0 ? selectedAgeRatings.map(item => item.uid) : undefined,
      
      // Platform IDs
      platformIds: selectedPlatforms.length > 0 ? selectedPlatforms.map(item => item.uid) : undefined,

      // Sort
      sortBy: selectedSort,
      sortDirection: selectedSortDirection,
    };

    onFiltersChange(filters);
  }, [selectedGenres, selectedPublishYear, selectedDevelopers, selectedAgeRatings, selectedPlatforms, selectedSort, selectedSortDirection, onFiltersChange]);

  // Handler für Genre Filter
  const handleGenreChange = useCallback((items: FilterItem[]) => {
    setSelectedGenres(items);
  }, []);

  // Handler für Publish Year Filter
  const handlePublishYearChange = useCallback((items: FilterItem[]) => {
    setSelectedPublishYear(items);
  }, []);

  // Handler für Developer Filter
  const handleDeveloperChange = useCallback((items: FilterItem[]) => {
    setSelectedDevelopers(items);
  }, []);

  // Handler für Age Rating Filter
  const handleAgeRatingChange = useCallback((items: FilterItem[]) => {
    setSelectedAgeRatings(items);
  }, []);

  // Handler für Platform Filter
  const handlePlatformChange = useCallback((items: FilterItem[]) => {
    setSelectedPlatforms(items);
  }, []);

  // Handler für Sort Filter
  const handleSortChange = useCallback((item: SortGameEnum, direction: SortDirectionEnum) => {
    setSelectedSortDirection(direction);
    setSelectedSort(item);
  }, []);

  // Update filters whenever any filter changes
  React.useEffect(() => {
    updateFilters();
  }, [updateFilters]);

  const  t  = useTranslations("gamesList");

  return (
        <FilterChipsWrapper trailingItem={<SortMenu
          defaultSortDirection={SortDirectionEnum.ASC}
          defaultSelectedItem={SortGameEnum.GAME_NAME}
          variant="outlined"
          items={SortGameEnum}
          onItemSelected={handleSortChange}
          t={t}
        />}>
        <FilterMenu 
          serverAction={getAllGenres} 
          label={t(SortGameEnum.GENRE)} 
          variant="elevated" 
          onLoading={() => {}} 
          onItemSelected={handleGenreChange} 
          multiple={true}
        />
        <FilterMenu 
          serverAction={getAllPublishYears} 
          label={t(SortGameEnum.PUBLISHING_YEAR)} 
          variant="elevated" 
          onLoading={() => {}} 
          onItemSelected={handlePublishYearChange} 
          multiple={false} 
        />
        <FilterMenu 
          serverAction={getAllDevelopers} 
          label={t(SortGameEnum.DEVELOPER)} 
          variant="elevated" 
          onLoading={() => {}} 
          onItemSelected={handleDeveloperChange} 
          multiple={true} 
        />
        <FilterMenu 
          serverAction={getAllAgeRatings} 
          label={t(SortGameEnum.AGE)} 
          variant="elevated" 
          onLoading={() => {}} 
          onItemSelected={handleAgeRatingChange} 
          multiple={true} 
        />
        <FilterMenu 
          serverAction={getAllPlatforms} 
          label={t(SortGameEnum.PLATFORM)} 
          variant="elevated" 
          onLoading={() => {}} 
          onItemSelected={handlePlatformChange} 
          multiple={true} 
        />
        </FilterChipsWrapper>

  )
}
