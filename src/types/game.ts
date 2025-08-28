export interface GameDTO {
  gameId: string;
  gameName: string;
  imgUrl: string;
  altImgUrl: string;
}

export interface GameBatchRequest {
  gameIds: string[];
}

// Referenzdaten Types
export interface GenreDTO {
  uid: string;
  name: string;
}

export interface PlatformDTO {
  uid: string;
  name: string;
}

export interface AgeRatingDTO {
  uid: string;
  age: number;
  description: string;
}

export interface DeveloperDTO {
  uid: string;
  name: string;
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
  genres: GenreDTO[];
  developers: DeveloperDTO[];
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
  sortBy?: 'gameName' | 'publishingYear' | 'genre' | 'developer' | 'age' | 'platform';
  sortDirection?: 'asc' | 'desc';
}

export interface BulkGamesParams extends BulkGamesFilters, BulkGamesSorting {
  page?: number;
  size?: number;
}
