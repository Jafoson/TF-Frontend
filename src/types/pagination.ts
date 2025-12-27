export interface PaginationResponseDTO<T> {
  data: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PaginationRespestDTO {
    page?: number;
    size?: number;
}