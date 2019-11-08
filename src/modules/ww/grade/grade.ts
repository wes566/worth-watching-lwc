import { LightningElement, api } from "lwc";
import { GameGrade } from "../../../models/Game";

export default class Grade extends LightningElement {
    @api
    public grade?: GameGrade;

    private get hasGrade(): boolean {
        return this.grade !== undefined;
    }

    private get icon(): string {
        // some symbols: 🔥 😴 👎 👍
        switch (this.grade) {
            case "a":
                return "👍";
            case "b":
                return "👍";
            case "c":
                return "👍";
            case "d":
                return "😴";
            case "f":
                return "😴";
            default:
                return "";
        }
    }
}
