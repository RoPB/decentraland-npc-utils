/// <reference types="dcl" />
import { DialogWindow } from '../ui/index';
import { Dialog, FollowPathData, NPCData, NPCState } from '../utils/types';
import { DialogBubble } from '../ui/bubble';
/**
 * Creates a talking, walking and animated NPC
 *
 * @param {TranformConstructorArgs} position Transform argument object that can contain position, rotation and scale for NPC
 * @param {string} model String with path to 3D model to use for NPC
 * @param {() => void} onActivate Function to execute each time the NPC is activated. By default when clicking it or walking near, or calling the `activate()` function
 * @param {NPCData} data Object of type NPCData, containing multiple configurable parameters
 *
 */
export declare class NPC extends Entity {
    introduced: boolean;
    dialog: DialogWindow;
    bubble: DialogBubble | undefined;
    onActivate: () => void;
    onWalkAway: null | (() => void);
    inCooldown: boolean;
    coolDownDuration: number;
    faceUser: boolean;
    idleAnim: AnimationState;
    walkingAnim: null | AnimationState;
    walkingSpeed: number;
    lastPlayedAnim: AnimationState;
    endAnimTimer: Entity;
    closeDialogTimer: Entity;
    pauseWalkingTimer: Entity;
    state: NPCState;
    bubbleHeight: number;
    /**
     * Creates a talking, walking and animated NPC
     *
     * @param {TranformConstructorArgs} position Transform argument object that can contain position, rotation and scale for NPC
     * @param {string} model String with path to 3D model to use for NPC
     * @param {() => void} onActivate Function to execute each time the NPC is activated. By default when clicking it or walking near, or calling the `activate()` function
     * @param {NPCData} data Object of type NPCData, containing multiple configurable parameters
     *
     */
    constructor(position: TranformConstructorArgs, model: string, onActivate: () => void, data?: NPCData);
    /**
     * Calls the NPC's activation function (set on NPC definition). If NPC has `faceUser` = true, it will rotate to face the player. It starts a cooldown counter to avoid reactivating.
     */
    activate(): void;
    /**
     * Closes dialog UI and makes NPC stop turning to face player
     */
    endInteraction(): void;
    /**
     * Ends interaction and calls the onWalkAway function
     */
    handleWalkAway(): void;
    /**
     * Starts a conversation, using the Dialog UI
     * @param {Dialog[]} script Instructions to follow during the conversation
     * @param {number|string} startIndex Where to start in the script. Can refer to an index in the array or the `name` field of a Dialog entry.
     * @param {number} duration In seconds. If set, the UI will close after the set time
     *
     */
    talk(script: Dialog[], startIndex?: number | string, duration?: number): void;
    /**
     * Starts a conversation, using the Dialog UI
     * @param {Dialog[]} script Instructions to follow during the conversation
     * @param {number|string} startIndex Where to start in the script. Can refer to an index in the array or the `name` field of a Dialog entry.
     *
     */
    talkBubble(script: Dialog[], startIndex?: number | string): void;
    /**
     * The NPC model plays an animation
     * @param {string} animationName Name of the animation to play, as stored in the model
     * @param {boolean} noLoop If true, animation plays only once. You must also provide a duration
     * @param {number} duration In seconds. After the duration is over, the NPC will return to the default animation.
     *
     */
    playAnimation(animationName: string, noLoop?: boolean, duration?: number): void;
    /**
     * Change the idle animation on the NPC.
     * @param {animation} string Name of the new animation to set as idle.
     * @param {play} boolean If true, start playing this new idle animation.
     */
    changeIdleAnim(animation: string, play?: boolean): void;
    /**
     * Instruct the NPC to walk following a path. If no data is provided, the NPC uses data from the last time `followPath` was called, or its definition.
     * @param {FollowPathData} data Object with data to describe a path that an NPC can walk.
     */
    followPath(data?: FollowPathData): void;
    /**
     * Stops the NPC's walking. If a default animation exists, it will play it.
     * @param {number} duration In seconds. If a duration is provided, the NPC will return to walking after the duration is over.
     */
    stopWalking(duration?: number): void;
}
