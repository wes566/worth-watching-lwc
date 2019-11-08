import {
    register,
    ValueChangedEvent,
    WireEventTarget
} from "@lwc/wire-service";
import mockResponse from "./mock-data/response";

export const getCurrentGames = (): void => {};

register(getCurrentGames, (eventTarget: WireEventTarget): void => {
    // TODO: add types for configs
    const handleConfig = async (config: {
        [s: string]: any;
    }): Promise<void> => {
        console.log(
            `getCurrentGames wire config: requestTime = ${config.requestTime}`
        );

        try {
            // TODO: add kv-storage and cache responses, stale emit then update
            // from network if cache TTL is expired

            const gamesData = mockResponse;
            const event = new ValueChangedEvent({
                data: gamesData,
                error: undefined
            });
            eventTarget.dispatchEvent(event);
        } catch (error) {
            console.error(error);
            const event = new ValueChangedEvent({
                data: undefined,
                error
            });
            eventTarget.dispatchEvent(event);
        }
    };

    const handleConnect = async (): Promise<void> => {};

    const handleDisconnect = async (): Promise<void> => {
        eventTarget.removeEventListener("disconnect", handleDisconnect);
        eventTarget.removeEventListener("connect", handleConnect);
        eventTarget.removeEventListener("config", handleConfig);
    };

    eventTarget.addEventListener("config", handleConfig);
    eventTarget.addEventListener("connect", handleConnect);
    eventTarget.addEventListener("disconnect", handleDisconnect);
});
