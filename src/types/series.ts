import { SortMatchEnum } from "@/enum/sortMatchEnum";
import { StatusEnum } from "../enum/statusEnum";
import { SortDirectionEnum } from "@/enum/sortDirectionEnum";
import { PaginationRespestDTO } from "./pagination";

export interface SeriesDTO {
  id: string;
  status: StatusEnum;
  formatName: string;
  gameName: string;
  maxRounds: number;
  tournamentName: string;
  team1Name: string;
  team2Name: string;
  team1Id: string;
  team2Id: string;
  team1LogoUrl: string | null;
  team2LogoUrl: string | null;
  score1: number;
  score2: number;
  winnerId: string;
  startDateTime: string;
}

export interface BulkSeriesFilters{
  from?: string;
  duration?: string;
  team?: string[];
  status?: string[];
  game?: string[];
  format?: string[];
  start?: string;
  end?: string;
}

export interface BulkSeriesSorting{
  sort?: SortMatchEnum;
  order?: SortDirectionEnum;
}

export interface BulkSeriesParams extends BulkSeriesFilters, BulkSeriesSorting, PaginationRespestDTO{
}