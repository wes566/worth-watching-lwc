import { LightningElement, track, wire } from "lwc";
import { getCurrentGames } from "../../wires/getCurrentGames/getCurrentGames";
import { Game } from "../../../models/Game";
import { GameGrouping } from "../../../models/GameGrouping";

export default class GameGroup extends LightningElement {
    @track
    private requestTime: Date = new Date();

    public connectedCallback(): void {
        document.addEventListener(
            "visibilitychange",
            this.handleVisibilityChanged
        );
    }

    public disconnectedCallback(): void {
        document.removeEventListener(
            "visibilitychange",
            this.handleVisibilityChanged
        );
    }

    @wire(getCurrentGames, { requestTime: "$requestTime" })
    private gameDataResponse?: {
        data?: GameGrouping;
        error?: Error;
    };

    private get isGameDataLoaded(): boolean {
        return this.gameDataResponse !== undefined;
    }

    private get hasError(): boolean {
        // TODO: make getter for the actual error message and make it pretty
        return (
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.isGameDataLoaded && this.gameDataResponse!.error !== undefined
        );
    }

    private get hasGames(): boolean {
        return (
            this.isGameDataLoaded &&
            !this.hasError &&
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.gameDataResponse!.data !== undefined
        );
    }

    private get games(): Game[] {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.gameDataResponse!.data!.games;
    }

    // TODO - get rid of the refresh button
    private handleRefreshClick = (): void => {
        this.requestTime = new Date();
    };

    private get header(): string {
        return (
            (this.gameDataResponse &&
                this.gameDataResponse.data &&
                this.gameDataResponse.data.name) ||
            ""
        );
    }

    private handleVisibilityChanged = (): void => {
        if (!document.hidden) {
            // only refresh if 5 minutes have passed
            // TODO: get rid of this and hit the wire every time, the wire
            // can do caching with a TTL
            const now = new Date();
            const diffInSeconds =
                (now.getTime() - this.requestTime.getTime()) / 1000;

            if (diffInSeconds > 60 * 5) {
                this.requestTime = new Date();
            }
        }
    };
}
