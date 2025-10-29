import React from 'react'
import FilterMenu from '@/components/layout/FilterMenu/FilterMenu'
import SortMenu from '../../FilterMenu/SortMenu/SortMenu';
import { SortDirectionEnum } from '@/enum/sorting/sortDirectionEnum';
import { getTranslations } from 'next-intl/server';
import FilterChipsWrapper from '../../Wrapper/FilterChipsWrapper/FilterChipsWrapper';
import { SortTeamEnum } from '@/enum/sorting/sortTeamEnum';
import { getAllFoundingYears } from '@/actions/teams';
import { getAllGames } from '@/actions/game';

export default async function GameFilters() {
  
  const  t  = await getTranslations("teamList");

  return (
        <FilterChipsWrapper hasDivider={true} trailingItem={<SortMenu
          defaultSortDirection={SortDirectionEnum.ASC}
          defaultSelectedItem={SortTeamEnum.NAME}
          variant="outlined"
          items={SortTeamEnum}
          translationKey="teamList"
        />}>
        <FilterMenu 
          serverAction={getAllGames} 
          label={t(SortTeamEnum.GAME)} 
          variant="elevated" 
          multiple={true}
          urlKey="games"
        />
        <FilterMenu 
          serverAction={getAllFoundingYears} 
          label={t(SortTeamEnum.FOUNDING_DATE)} 
          variant="elevated" 
          multiple={false}
          urlKey="foundingYear"
        />
        </FilterChipsWrapper>

  )
}
