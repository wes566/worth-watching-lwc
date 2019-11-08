import { LightningElement, api, track } from "lwc";
import { GameGrade, Game } from "../../../models/Game";

export default class GameCard extends LightningElement {
    @api
    public game?: Game;

    @track
    private showScore: boolean = false;

    private get showError(): boolean {
        return this.game === undefined;
    }

    private get gameGrade(): GameGrade | undefined {
        return this.game && this.game.grade;
    }

    private get homeName(): string {
        if (this.game === undefined) {
            return "";
        }

        return this.game.homeTeam.name;
    }

    private get awayName(): string {
        if (this.game === undefined) {
            return "";
        }

        return this.game.awayTeam.name;
    }

    private get homeImage(): string {
        if (this.game === undefined) {
            return "";
        }

        return `./team-logos/nfl/${this.game.homeTeam.id}.svg`;
    }

    private get awayImage(): string {
        if (this.game === undefined) {
            return "";
        }

        return `./team-logos/nfl/${this.game.awayTeam.id}.svg`;
    }

    private get homeScore(): number | undefined {
        return this.game && this.game.homeScore;
    }

    private get awayScore(): number | undefined {
        return this.game && this.game.awayScore;
    }

    private get status(): string {
        if (this.game === undefined) {
            return "";
        }

        const startDate = new Date(this.game.startTime);
        const isToday = new Date().toDateString() === startDate.toDateString();

        if (this.game.isGameOver) {
            if (isToday) {
                return "Final (Today)";
            }

            return `Final (${startDate.toLocaleString(undefined, {
                weekday: "short"
            })})`;
        }

        if (this.game.isGameInProgress) {
            return `In Progress${
                this.game.currentQuarterDescription
                    ? ` (${this.game.currentQuarterDescription})`
                    : ""
            }`;
        }

        if (isToday) {
            return (
                "Today " +
                startDate.toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit"
                })
            );
        }

        return startDate.toLocaleString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            weekday: "short"
        });
    }

    private get hasHighlights(): boolean {
        return !!(this.game && this.game.videoHighlightsLink);
    }

    private get hasScore(): boolean {
        return !!(
            this.game &&
            (this.game.isGameInProgress || this.game.isGameOver) &&
            this.game.homeScore !== undefined &&
            this.game.awayScore !== undefined
        );
    }

    private get scoreLabel(): string {
        if (this.showScore) {
            return "Hide Score";
        }

        return "Show Score";
    }

    private handleHighlightClick(): void {
        if (this.game && this.game.videoHighlightsLink) {
            window.location.href = this.game.videoHighlightsLink;
        }
    }

    private handleShowScoreClick(): void {
        this.showScore = !this.showScore;
    }
}
