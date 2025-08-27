export interface GameDTO {
  gameId: string;
  gameName: string;
  imgUrl: string;
  altImgUrl: string;
}

export interface GameBatchRequest {
  gameIds: string[];
}
