import { BulkSeriesParams } from '@/types/series';
import { FilterItem } from '@/types/filter';
import React, { useCallback, useState } from 'react'
import { SortDirectionEnum } from '@/enum/sortDirectionEnum';
import { SortMatchEnum } from '@/enum/sortMatchEnum';
import { useTranslations } from 'next-intl';
import FilterChipsWrapper from '../../Wrapper/FilterChipsWrapper/FilterChipsWrapper';
import SortMenu from '../../FilterMenu/SortMenu/SortMenu';
import FilterMenu from '../../FilterMenu/FilterMenu';
import { getAllGames } from '@/actions/game';
import { getAllFormats, getAllStatus } from '@/actions/series';

type MatchFiltersProps = {
    onFiltersChange: (filters: BulkSeriesParams) => void;
  };

function MatchFilters({ onFiltersChange }: MatchFiltersProps) {
    const [selectedGames, setSelectedGames] = useState<FilterItem[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<FilterItem[]>([]);
    const [selectedFormats, setSelectedFormats] = useState<FilterItem[]>([]);
    const [selectedSort, setSelectedSort] = useState<SortMatchEnum>(SortMatchEnum.START_DATE);
    const [selectedSortDirection, setSelectedSortDirection] = useState<SortDirectionEnum>(SortDirectionEnum.ASC);

    const updateFilters = useCallback(() => {
        const filters: BulkSeriesParams = {
            status: selectedStatuses.length > 0 ? selectedStatuses.map(item => item.uid) : undefined,
            game: selectedGames.length > 0 ? selectedGames.map(item => item.uid) : undefined,
            format: selectedFormats.length > 0 ? selectedFormats.map(item => item.uid) : undefined,
            sort: selectedSort,
            order: selectedSortDirection,
        }

        onFiltersChange(filters);
    }, [selectedGames, selectedStatuses, selectedFormats, selectedSort, selectedSortDirection, onFiltersChange]);

    const handleGameChange = useCallback((items: FilterItem[]) => {
        setSelectedGames(items);
    }, []);

    const handleStatusChange = useCallback((items: FilterItem[]) => {
        setSelectedStatuses(items);
    }, []);

    const handleFormatChange = useCallback((items: FilterItem[]) => {
        setSelectedFormats(items);
    }, []);

    const handleSortChange = useCallback((item: SortMatchEnum, direction: SortDirectionEnum) => {
        setSelectedSortDirection(direction);
        setSelectedSort(item);
    }, []);

    React.useEffect(() => {
        updateFilters();
    }, [updateFilters]);

    const t = useTranslations("matchesList");

  return (
    <FilterChipsWrapper hasDivider={true} trailingItem={<SortMenu
      defaultSortDirection={SortDirectionEnum.ASC}
      defaultSelectedItem={SortMatchEnum.START_DATE}
      variant="outlined"
      items={SortMatchEnum}
      onItemSelected={handleSortChange}
      t={t}
    />}>
        <FilterMenu
            serverAction={getAllGames}
            label={t(SortMatchEnum.GAME_ID)}
            variant="elevated"
            onLoading={() => {}}
            onItemSelected={handleGameChange}
            multiple={true}
        />
        <FilterMenu
            serverAction={getAllFormats}
            label={t("format")}
            variant="elevated"
            onLoading={() => {}}
            onItemSelected={handleFormatChange}
            multiple={true}
        />
        <FilterMenu
            serverAction={getAllStatus}
            label={t(SortMatchEnum.STATUS_ID)}
            variant="elevated"
            onLoading={() => {}}
            onItemSelected={handleStatusChange}
            multiple={true}
        />
    </FilterChipsWrapper>
  )
}

export default MatchFilters