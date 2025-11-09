import {PaginationRespestDTO} from "@/types/pagination";

export interface FilterItem{
    uid: string;
    name: string | number;
}

export interface FilterRequestDTO extends PaginationRespestDTO{
    search?: string;
}