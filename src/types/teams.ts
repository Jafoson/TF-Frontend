import { SortDirectionEnum } from "@/enum/sorting/sortDirectionEnum";
import { PaginationRespestDTO } from "./pagination";
import { SortTeamEnum } from "@/enum/sorting/sortTeamEnum";

export interface TeamBulkDTO {
    uid: string;
    name: string;
    logoURL: string;
    altLogoURL: string;
    foundingDate: string;
    slug: string;
    regionId: string;
    gameId: string;
}

export interface BulkTeamsFilter{
    gameId?: string[];
    foundingYear?: number;
    regionId?: string;
    orgaId?: string;
}

export interface BulkTeamsSorting{
    sortBy?: SortTeamEnum;
    sortOrder?: SortDirectionEnum
}

export interface BulkTeamsParams extends BulkTeamsFilter, BulkTeamsSorting, PaginationRespestDTO{

}