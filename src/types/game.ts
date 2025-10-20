import { SortGameEnum } from "@/enum/sorting/sortGameEnum";
import { SortDirectionEnum } from "@/enum/sorting/sortDirectionEnum";
import {FilterItem} from "@/types/filter";
import {PaginationRespestDTO} from "@/types/pagination";

export interface GameDTO {
  gameId: string;
  gameName: string;
  imgUrl: string;
  altImgUrl: string;
}

export interface GameBatchRequest {
  gameIds: string[];
}

export interface AgeRatingDTO extends FilterItem {
  age: number;
}

// Link/URL Types
export interface GameLinkDTO {
  uid: string;
  name: string;
  url: string;
  description: string;
  iconUrl: string;
  isActive: boolean;
}

// Platform Type für BulkGame (kann null UID haben)
export interface BulkGamePlatformDTO {
  uid: string | null;
  name: string;
}

// BulkGame DTO - Vollständige Spiel-Information
export interface BulkGameDTO {
  uid: string;
  name: string;
  imgUrl: string;
  altImgUrl: string;
  platforms: BulkGamePlatformDTO[];
  links: GameLinkDTO[];
  genres: FilterItem[];
  developers: FilterItem[];
  ages: AgeRatingDTO[];
  publishingYear: number;
  description: string;
}

// Die Referenzdaten-Endpunkte verwenden die Standard Response<T> Struktur aus @/types/response

// Bulk Games Filter und Sortierung Types
export interface BulkGamesFilters {
  genreIds?: string[];
  publishingYear?: number;
  developerIds?: string[];
  ageIds?: string[];
  platformIds?: string[];
}

export interface BulkGamesSorting {
  sortBy?: SortGameEnum
  sortDirection?: SortDirectionEnum
}

export interface BulkGamesParams extends BulkGamesFilters, BulkGamesSorting, PaginationRespestDTO {
}
