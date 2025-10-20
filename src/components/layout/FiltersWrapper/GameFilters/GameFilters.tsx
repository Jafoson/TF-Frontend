import React from 'react'
import FilterMenu from '@/components/layout/FilterMenu/FilterMenu'
import { getAllGenres, getAllAgeRatings, getAllPublishYears, getAllDevelopers, getAllPlatforms } from '@/actions/game'
import SortMenu from '../../FilterMenu/SortMenu/SortMenu';
import { SortGameEnum } from '@/enum/sorting/sortGameEnum';
import { SortDirectionEnum } from '@/enum/sorting/sortDirectionEnum';
import { getTranslations } from 'next-intl/server';
import FilterChipsWrapper from '../../Wrapper/FilterChipsWrapper/FilterChipsWrapper';

export default async function GameFilters() {
  
  const  t  = await getTranslations("gamesList");

  return (
        <FilterChipsWrapper hasDivider={true} trailingItem={<SortMenu
          defaultSortDirection={SortDirectionEnum.ASC}
          defaultSelectedItem={SortGameEnum.GAME_NAME}
          variant="outlined"
          items={SortGameEnum}
          translationKey="gamesList"
        />}>
        <FilterMenu 
          serverAction={getAllGenres} 
          label={t(SortGameEnum.GENRE)} 
          variant="elevated" 
          multiple={true}
          urlKey="genres"
        />
        <FilterMenu 
          serverAction={getAllPublishYears} 
          label={t(SortGameEnum.PUBLISHING_YEAR)} 
          variant="elevated" 
          multiple={false}
          urlKey="year"
        />
        <FilterMenu 
          serverAction={getAllDevelopers} 
          label={t(SortGameEnum.DEVELOPER)} 
          variant="elevated" 
          multiple={true}
          urlKey="developers"
        />
        <FilterMenu 
          serverAction={getAllAgeRatings} 
          label={t(SortGameEnum.AGE)} 
          variant="elevated" 
          multiple={true}
          urlKey="ages"
        />
        <FilterMenu 
          serverAction={getAllPlatforms} 
          label={t(SortGameEnum.PLATFORM)} 
          variant="elevated" 
          multiple={true}
          urlKey="platforms"
        />
        </FilterChipsWrapper>

  )
}
