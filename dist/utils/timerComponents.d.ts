/// <reference types="dcl" />
export interface ITimerComponent {
    elapsedTime: number;
    targetTime: number;
    onTargetTimeReached: (ownerEntity: IEntity) => void;
}
/**
 * Execute once after X milliseconds
 */
export declare class NPCDelay implements ITimerComponent {
    elapsedTime: number;
    targetTime: number;
    onTargetTimeReached: (ownerEntity: IEntity) => void;
    private onTimeReachedCallback;
    /**
     * @param seconds amount of time in seconds
     * @param onTimeReachedCallback callback for when time is reached
     */
    constructor(seconds: number, onTimeReachedCallback: () => void);
    setCallback(onTimeReachedCallback: () => void): void;
}
export declare class NPCTimerSystem implements ISystem {
    private static _instance;
    static createAndAddToEngine(): NPCTimerSystem;
    private constructor();
    update(dt: number): void;
}
