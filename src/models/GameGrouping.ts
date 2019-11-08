import { Game } from "./Game";

export interface GameGrouping {
    name: string;
    date: Date;
    games: Game[];
}
