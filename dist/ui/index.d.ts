/// <reference types="dcl" />
import { ImageData, Dialog, ButtonStyles } from '../utils/types';
export declare enum ConfirmMode {
    Confirm = 0,
    Cancel = 1,
    Next = 2,
    Button3 = 3,
    Button4 = 4
}
export declare let UIscaleMultiplier: number;
/**
 * Displays a UI screen with text from an array of Dialog objects. Each entry can also include a portrait image, questions with triggered actions by each, etc.
 *
 * @param defaultPortrait ImageData object with soruce and dimension of default portrait image to use on the Dialog UI
 * @param useDarkTheme If true, use the dark theme for all the UI. Can also be an alternative `Texture` object to use a different themed atlas, with identical coordinates for each element.
 * @param sound Path to a sound file to play once for every dialog window shown.
 *
 */
export declare class DialogWindow {
    NPCScript: Dialog[];
    private defaultPortrait;
    container: UIContainerRect;
    panel: UIImage;
    portrait: UIImage;
    defaultPortraitTexture: Texture;
    image: UIImage;
    text: UIText;
    fillInBox: UIInputText;
    button1: CustomDialogButton;
    button2: CustomDialogButton;
    button3: CustomDialogButton;
    button4: CustomDialogButton;
    skipButton: CustomDialogButton;
    leftClickIcon: UIImage;
    isDialogOpen: boolean;
    isQuestionPanel: boolean;
    isFixedScreen: boolean;
    activeTextId: number;
    uiTheme: Texture;
    private UIOpenTime;
    soundEnt: Entity;
    defaultSound: string | null;
    canvas: UICanvas;
    ClickAction: null | (() => false | Subscription[] | void);
    EButtonAction: null | (() => false | Subscription[] | void);
    FButtonAction: null | (() => false | Subscription[] | void);
    constructor(defaultPortrait?: ImageData, useDarkTheme?: boolean, sound?: string, customTheme?: Texture);
    /**
     * Opens a dialog UI to start a conversation.
     * @param {Dialog[]} NPCScript  Instructions to follow during the conversation
     * @param {number|string} textId Where to start in the script. Can refer to an index in the array or the `name` field of a Dialog entry.
     */
    openDialogWindow(NPCScript: Dialog[], textId?: number | string): void;
    confirmText(mode: ConfirmMode): void;
    layoutDialogWindow(textId: number): void;
    /**
     * Closes a dialog UI.
     */
    closeDialogWindow(): void;
    skipDialogs(): void;
}
export declare class DialogTypeInSystem implements ISystem {
    static _instance: DialogTypeInSystem | null;
    timer: number;
    speed: number;
    visibleChars: number;
    fullText: string;
    UIText: UIText | null;
    done: boolean;
    static createAndAddToEngine(): DialogTypeInSystem;
    private constructor();
    update(dt: number): void;
    newText(dialog: DialogWindow, text: string, textId: number, speed?: number): void;
    rush(): void;
    closeTag(newChars: number): void;
}
export declare class CustomDialogButton extends Entity {
    label: UIText;
    image: UIImage;
    icon: UIImage | null;
    style: ButtonStyles | null;
    onClick: () => void;
    constructor(parent: UIContainerRect, texture: Texture, label: string, posX: number, posY: number, onClick: () => void, useDarkTheme?: boolean, style?: ButtonStyles);
    hide(): void;
    show(): void;
    grayOut(): void;
    enable(): void;
    update(label: string, posX: number, posY: number): void;
}
