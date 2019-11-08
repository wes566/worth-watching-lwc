import { Team } from "./Team";

export type GameGrade = "a" | "b" | "c" | "d" | "f";

export interface Game {
    id: string;

    /**
     * In Unix Time
     */
    startTime: number;

    /**
     * In Unix Time
     */
    endTime?: number;
    homeTeam: Team;
    awayTeam: Team;
    homeScore?: number;
    awayScore?: number;
    isGameOver: boolean;
    isGameInProgress: boolean;
    currentQuarterDescription?: string;
    grade?: GameGrade;
    videoHighlightsLink?: string;
    videoCondensedGameLink?: string;
    videoFullGameLink?: string;
}
