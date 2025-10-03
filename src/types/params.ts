import { SortGameEnum } from '@/enum/sortGameEnum';
import { BulkGamesParams } from '@/types/game';
import { SortDirectionEnum } from '@/enum/sortDirectionEnum';

export function parseBulkGamesParams(
  searchParams: Record<string, string | string[] | undefined>
): BulkGamesParams {
  return {
    genreIds: toArray(searchParams.genreIds),
    publishingYear: toNumber(searchParams.publishingYear),
    developerIds: toArray(searchParams.developerIds),
    ageIds: toArray(searchParams.ageIds),
    platformIds: toArray(searchParams.platformIds),
    sortBy: searchParams.sortBy as SortGameEnum,
    sortDirection: searchParams.sortDirection as SortDirectionEnum,
  };
}

// Helper:
function toArray(value: string | string[] | undefined): string[] | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value : value.split(',');
}

function toNumber(value: string | string[] | undefined): number | undefined {
  if (!value) return undefined;
  const v = Array.isArray(value) ? value[0] : value;
  const n = Number(v);
  return isNaN(n) ? undefined : n;
}