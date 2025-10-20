import { ReadonlyURLSearchParams } from "next/navigation";
import { BulkGamesParams } from "@/types/game";
import { BulkSeriesParams } from "@/types/series";
import { SortGameEnum } from "@/enum/sorting/sortGameEnum";
import { SortMatchEnum } from "@/enum/sorting/sortMatchEnum";
import { SortDirectionEnum } from "@/enum/sorting/sortDirectionEnum";
import { StatusEnum } from "@/enum/statusEnum";
import { BulkTeamsParams } from "@/types/teams";
import { SortTeamEnum } from "@/enum/sorting/sortTeamEnum";

/**
 * Konvertiert URL SearchParams in BulkGamesParams für die Spiele-Filterung
 * @param searchParams - Die URL SearchParams aus Next.js
 * @returns BulkGamesParams Objekt mit konvertierten Werten
 */
export function convertSearchParamsToBulkGamesParams(searchParams: ReadonlyURLSearchParams): BulkGamesParams {
  const params: BulkGamesParams = {};
  
  // Debug: Zeige alle verfügbaren URL-Parameter
  console.log('🔍 paramsConverter - Alle URL-Parameter:', Object.fromEntries(searchParams.entries()));

  // Pagination Parameter
  const page = searchParams.get('page');
  if (page) {
    const pageNum = parseInt(page, 10);
    if (!isNaN(pageNum) && pageNum >= 0) {
      params.page = pageNum;
    }
  }

  const size = searchParams.get('size');
  if (size) {
    const sizeNum = parseInt(size, 10);
    if (!isNaN(sizeNum) && sizeNum > 0) {
      params.size = sizeNum;
    }
  }

  // Filter Parameter - Arrays aus kommagetrennten Strings
  // Prüfe sowohl 'genreIds' als auch 'genres' für Rückwärtskompatibilität
  const genreIds = searchParams.get('genreIds') || searchParams.get('genres');
  if (genreIds) {
    params.genreIds = genreIds.split(',').filter(id => id.trim() !== '');
  }

  const developerIds = searchParams.get('developerIds') || searchParams.get('developers');
  if (developerIds) {
    params.developerIds = developerIds.split(',').filter(id => id.trim() !== '');
  }

  const ageIds = searchParams.get('ageIds') || searchParams.get('ages');
  if (ageIds) {
    params.ageIds = ageIds.split(',').filter(id => id.trim() !== '');
  }

  const platformIds = searchParams.get('platformIds') || searchParams.get('platforms');
  if (platformIds) {
    params.platformIds = platformIds.split(',').filter(id => id.trim() !== '');
  }

  // Publishing Year
  const publishingYear = searchParams.get('year');
  if (publishingYear) {
    const year = parseInt(publishingYear, 10);
    if (!isNaN(year) && year > 1900 && year <= new Date().getFullYear()) {
      params.publishingYear = year;
    }
  }

  // Sortierung Parameter - Prüfe sowohl 'sortBy' als auch 'sort' für Rückwärtskompatibilität
  const sortBy = searchParams.get('sortBy') || searchParams.get('sort');
  if (sortBy && Object.values(SortGameEnum).includes(sortBy as SortGameEnum)) {
    params.sortBy = sortBy as SortGameEnum;
  }

  const sortDirection = searchParams.get('sortDirection') || searchParams.get('direction');
  if (sortDirection && Object.values(SortDirectionEnum).includes(sortDirection as SortDirectionEnum)) {
    params.sortDirection = sortDirection as SortDirectionEnum;
  }

  // Debug: Zeige die konvertierten Parameter
  console.log('🔍 paramsConverter - Konvertierte Parameter:', params);
  
  return params;
}

/**
 * Konvertiert BulkGamesParams zurück in URL SearchParams
 * @param params - Die BulkGamesParams
 * @returns URLSearchParams Objekt für die URL
 */
export function convertBulkGamesParamsToSearchParams(params: BulkGamesParams): URLSearchParams {
  const searchParams = new URLSearchParams();

  // Pagination
  if (params.page !== undefined) {
    searchParams.set('page', params.page.toString());
  }
  if (params.size !== undefined) {
    searchParams.set('size', params.size.toString());
  }

  // Filter Arrays
  if (params.genreIds && params.genreIds.length > 0) {
    searchParams.set('genreIds', params.genreIds.join(','));
  }
  if (params.developerIds && params.developerIds.length > 0) {
    searchParams.set('developerIds', params.developerIds.join(','));
  }
  if (params.ageIds && params.ageIds.length > 0) {
    searchParams.set('ageIds', params.ageIds.join(','));
  }
  if (params.platformIds && params.platformIds.length > 0) {
    searchParams.set('platformIds', params.platformIds.join(','));
  }

  // Publishing Year
  if (params.publishingYear !== undefined) {
    searchParams.set('publishingYear', params.publishingYear.toString());
  }

  // Sortierung
  if (params.sortBy) {
    searchParams.set('sortBy', params.sortBy);
  }
  if (params.sortDirection) {
    searchParams.set('sortDirection', params.sortDirection);
  }

  return searchParams;
}

/**
 * Konvertiert URL SearchParams in BulkSeriesParams für die Match-Filterung
 * @param searchParams - Die URL SearchParams aus Next.js
 * @returns BulkSeriesParams Objekt mit konvertierten Werten
 */
export function convertSearchParamsToBulkSeriesParams(searchParams: ReadonlyURLSearchParams): BulkSeriesParams {
  const params: BulkSeriesParams = {};
  
  // Debug: Zeige alle verfügbaren URL-Parameter
  console.log('🔍 paramsConverter (Series) - Alle URL-Parameter:', Object.fromEntries(searchParams.entries()));

  // Pagination Parameter
  const page = searchParams.get('page');
  if (page) {
    const pageNum = parseInt(page, 10);
    if (!isNaN(pageNum) && pageNum >= 0) {
      params.page = pageNum;
    }
  }

  const size = searchParams.get('size');
  if (size) {
    const sizeNum = parseInt(size, 10);
    if (!isNaN(sizeNum) && sizeNum > 0) {
      params.size = sizeNum;
    }
  }

  // Filter Parameter - Arrays aus kommagetrennten Strings
  const team = searchParams.get('team') || searchParams.get('teams');
  if (team) {
    params.team = team.split(',').filter(id => id.trim() !== '');
  }

  const status = searchParams.get('status') || searchParams.get('statuses');
  if (status) {
    const statusArray = status.split(',').filter(s => s.trim() !== '');
    // Validiere Status-Werte
    const validStatuses = statusArray.filter(s => Object.values(StatusEnum).includes(s as StatusEnum));
    if (validStatuses.length > 0) {
      params.status = validStatuses;
    }
  }

  const game = searchParams.get('game') || searchParams.get('games');
  if (game) {
    params.game = game.split(',').filter(id => id.trim() !== '');
  }

  const format = searchParams.get('format') || searchParams.get('formats');
  if (format) {
    params.format = format.split(',').filter(id => id.trim() !== '');
  }



  const date = searchParams.get('date');
  if (date) {
    params.end = date;
    params.start = date;
  }

  // Sortierung Parameter - Prüfe sowohl 'sort' als auch 'sortBy' für Rückwärtskompatibilität
  const sort = searchParams.get('sort') || searchParams.get('sortBy');
  if (sort && Object.values(SortMatchEnum).includes(sort as SortMatchEnum)) {
    params.sort = sort as SortMatchEnum;
  }

  const order = searchParams.get('order') || searchParams.get('direction') || searchParams.get('sortDirection');
  if (order && Object.values(SortDirectionEnum).includes(order as SortDirectionEnum)) {
    params.order = order as SortDirectionEnum;
  }

  // Debug: Zeige die konvertierten Parameter
  console.log('🔍 paramsConverter (Series) - Konvertierte Parameter:', params);
  
  return params;
}

/**
 * Konvertiert BulkSeriesParams zurück in URL SearchParams
 * @param params - Die BulkSeriesParams
 * @returns URLSearchParams Objekt für die URL
 */
export function convertBulkSeriesParamsToSearchParams(params: BulkSeriesParams): URLSearchParams {
  const searchParams = new URLSearchParams();

  // Pagination
  if (params.page !== undefined) {
    searchParams.set('page', params.page.toString());
  }
  if (params.size !== undefined) {
    searchParams.set('size', params.size.toString());
  }

  // Filter Arrays
  if (params.team && params.team.length > 0) {
    searchParams.set('team', params.team.join(','));
  }
  if (params.status && params.status.length > 0) {
    searchParams.set('status', params.status.join(','));
  }
  if (params.game && params.game.length > 0) {
    searchParams.set('game', params.game.join(','));
  }
  if (params.format && params.format.length > 0) {
    searchParams.set('format', params.format.join(','));
  }

  // Datum Parameter
  if (params.from) {
    searchParams.set('from', params.from);
  }
  if (params.duration) {
    searchParams.set('duration', params.duration);
  }
  if (params.start) {
    searchParams.set('start', params.start);
  }
  if (params.end) {
    searchParams.set('end', params.end);
  }

  // Sortierung
  if (params.sort) {
    searchParams.set('sort', params.sort);
  }
  if (params.order) {
    searchParams.set('order', params.order);
  }

  return searchParams;
}


/**
 * Konvertiert URL SearchParams in BulkTeamsParams für die Team-Filterung
 * @param searchParams - Die URL SearchParams aus Next.js
 * @returns BulkTeamsParams Objekt mit konvertierten Werten
 */
export function convertSearchParamsToBulkTeamsParams(searchParams: ReadonlyURLSearchParams): BulkTeamsParams {
  const params: BulkTeamsParams = {};
  
  // Debug: Zeige alle verfügbaren URL-Parameter
  console.log('🔍 paramsConverter - Alle URL-Parameter:', Object.fromEntries(searchParams.entries()));

  // Pagination Parameter
  const page = searchParams.get('page');
  if (page) {
    const pageNum = parseInt(page, 10);
    if (!isNaN(pageNum) && pageNum >= 0) {
      params.page = pageNum;
    }
  }

  const size = searchParams.get('size');
  if (size) {
    const sizeNum = parseInt(size, 10);
    if (!isNaN(sizeNum) && sizeNum > 0) {
      params.size = sizeNum;
    }
  }

  // Filter Parameter - Arrays aus kommagetrennten Strings
  // Prüfe sowohl 'genreIds' als auch 'genres' für Rückwärtskompatibilität
  const gameIds = searchParams.get('gameID') || searchParams.get('games');
  if (gameIds) {
    params.gameId = gameIds.split(',').filter(id => id.trim() !== '');
  }

  const foundingDate = searchParams.get('foundingYear') || searchParams.get('founding');
  if (foundingDate) {
    params.foundingDate = foundingDate;
  }

  const orgaId = searchParams.get('orgaID') || searchParams.get('orga');
  if (orgaId) {
    params.orgaId = orgaId;
  }
  const regionId = searchParams.get('regionID') || searchParams.get('region');
  if (regionId) {
    params.regionId = regionId;
  }

  // Sortierung Parameter - Prüfe sowohl 'sortBy' als auch 'sort' für Rückwärtskompatibilität
  const sortBy = searchParams.get('sortBy') || searchParams.get('sort');
  if (sortBy && Object.values(SortTeamEnum).includes(sortBy as SortTeamEnum)) {
    params.sortBy = sortBy as SortTeamEnum;
  }

  const sortDirection = searchParams.get('sortDirection') || searchParams.get('direction');
  if (sortDirection && Object.values(SortDirectionEnum).includes(sortDirection as SortDirectionEnum)) {
    params.sortOrder = sortDirection as SortDirectionEnum;
  }

  // Debug: Zeige die konvertierten Parameter
  console.log('🔍 paramsConverter - Konvertierte Parameter:', params);
  
  return params;
}
