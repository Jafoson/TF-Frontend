import { StatusEnum } from "../enum/statusEnum";

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