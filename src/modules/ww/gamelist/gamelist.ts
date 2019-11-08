import { LightningElement, api } from "lwc";
import { Game } from "../../../models/Game";

export default class GameList extends LightningElement {
    @api
    public games?: Game[];

    private get hasGames(): boolean {
        return this.games !== undefined;
    }
}
