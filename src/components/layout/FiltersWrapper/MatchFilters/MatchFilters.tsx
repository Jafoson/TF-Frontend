import React from 'react'
import { SortDirectionEnum } from '@/enum/sortDirectionEnum';
import { SortMatchEnum } from '@/enum/sortMatchEnum';
import { getTranslations } from 'next-intl/server';
import FilterChipsWrapper from '../../Wrapper/FilterChipsWrapper/FilterChipsWrapper';
import SortMenu from '../../FilterMenu/SortMenu/SortMenu';
import FilterMenu from '../../FilterMenu/FilterMenu';
import { getAllGames } from '@/actions/game';
import { getAllFormats, getAllStatus } from '@/actions/series';
import DayPicker from '../../DayPicker/DayPicker';
import styles from "./MatchFIlters.module.scss";


async function MatchFilters() {

    const t = await getTranslations("matchesList");

  return (
    <div className={styles.wrapper}>
    <FilterChipsWrapper hasDivider={false} trailingItem={<SortMenu
      defaultSortDirection={SortDirectionEnum.ASC}
      defaultSelectedItem={SortMatchEnum.START_DATE}
      variant="outlined"
      items={SortMatchEnum}
      translationKey="matchesList"
    />}>
            <FilterMenu
            serverAction={getAllGames}
            label={t(SortMatchEnum.GAME_ID)}
            variant="elevated"
            multiple={true}
            urlKey="games"
        />
        <FilterMenu
            serverAction={getAllFormats}
            label={t("format")}
            variant="elevated"
            multiple={true}
            urlKey="formats"
        />
        <FilterMenu
            serverAction={getAllStatus}
            label={t(SortMatchEnum.STATUS_ID)}
            variant="elevated"
            multiple={true}
            urlKey="status"
        />
    </FilterChipsWrapper>
    <DayPicker urlKey="date" />
    </div>
  )
}

export default MatchFilters