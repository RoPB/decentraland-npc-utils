(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define('@dcl/npc-scene-utils', ['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['@dcl/npc-scene-utils'] = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    var TrackUserFlag = /** @class */ (function () {
        function TrackUserFlag(lockXZRotation, rotSpeed, active) {
            this.lockXZRotation = false;
            this.active = false;
            if (!faceUserAdded) {
                addFaceUserSystem();
            }
            this.lockXZRotation = lockXZRotation ? lockXZRotation : false;
            this.rotSpeed = rotSpeed ? rotSpeed : 2;
            if (active) {
                this.active = true;
            }
        }
        TrackUserFlag = __decorate([
            Component('trackUserFlag'),
            __metadata("design:paramtypes", [Boolean, Number, Boolean])
        ], TrackUserFlag);
        return TrackUserFlag;
    }());
    var faceUserAdded = false;
    var player = Camera.instance;
    // Rotates NPC to face the user during interaction
    function addFaceUserSystem() {
        faceUserAdded = true;
        engine.addSystem(new FaceUserSystem());
    }
    var FaceUserSystem = /** @class */ (function () {
        function FaceUserSystem() {
            this.followingNPCs = engine.getComponentGroup(TrackUserFlag);
        }
        FaceUserSystem.prototype.update = function (dt) {
            var e_1, _a;
            try {
                for (var _b = __values(this.followingNPCs.entities), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var npc = _c.value;
                    var transform = npc.getComponent(Transform);
                    var trackUser = npc.getComponent(TrackUserFlag);
                    if (trackUser.active) {
                        // Rotate to face the player
                        var lookAtTarget = new Vector3(player.position.x, player.position.y, player.position.z);
                        var direction = lookAtTarget.subtract(transform.position);
                        transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(direction), dt * trackUser.rotSpeed);
                        if (trackUser.lockXZRotation) {
                            transform.rotation.x = 0;
                            transform.rotation.z = 0;
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        return FaceUserSystem;
    }());

    var canvas = new UICanvas();
    canvas.visible = true;
    var SFFont = new Font(Fonts.SanFrancisco);
    var SFHeavyFont = new Font(Fonts.SanFrancisco_Heavy);
    var lightTheme = new Texture('https://decentraland.org/images/ui/light-atlas-v3.png');
    var darkTheme = new Texture('https://decentraland.org/images/ui/dark-atlas-v3.png');
    var bubblesTexture = new Texture('https://decentraland.org/images/ui/dialog-bubbles.png');
    function setUVs(plane, _uv00, _uv10, _uv11, _uv01) {
        //log(_uv00, _uv10, _uv11, _uv01)
        plane.uvs = [
            _uv00.x,
            _uv00.y,
            _uv10.x,
            _uv10.y,
            _uv11.x,
            _uv11.y,
            _uv01.x,
            _uv01.y,
            //----
            _uv00.x,
            _uv00.y,
            _uv10.x,
            _uv10.y,
            _uv11.x,
            _uv11.y,
            _uv01.x,
            _uv01.y,
        ];
    }
    function setUVSection(plane, section, sizeX, sizeY) {
        if (sizeX === void 0) { sizeX = 512; }
        if (sizeY === void 0) { sizeY = 512; }
        setUVs(plane, new Vector2(section.sourceLeft / sizeX, (sizeY - section.sourceTop - section.sourceHeight) / sizeY), new Vector2((section.sourceLeft + section.sourceWidth) / sizeX, (sizeY - section.sourceTop - section.sourceHeight) / sizeY), new Vector2((section.sourceLeft + section.sourceWidth) / sizeX, (sizeY - section.sourceTop) / sizeY), new Vector2(section.sourceLeft / sizeX, (sizeY - section.sourceTop) / sizeY));
    }

    (function (ButtonStyles) {
        ButtonStyles["E"] = "e";
        ButtonStyles["F"] = "f";
        ButtonStyles["DARK"] = "dark";
        ButtonStyles["RED"] = "red";
        ButtonStyles["ROUNDBLACK"] = "roundblack";
        ButtonStyles["ROUNDWHITE"] = "roundwhite";
        ButtonStyles["ROUNDSILVER"] = "roundsilver";
        ButtonStyles["ROUNDGOLD"] = "roundgold";
        ButtonStyles["SQUAREBLACK"] = "squareblack";
        ButtonStyles["SQUAREWHITE"] = "squarewhite";
        ButtonStyles["SQUARESILVER"] = "squaresilver";
        ButtonStyles["SQUAREGOLD"] = "squaregold";
        ButtonStyles["WHITE"] = "white";
    })(exports.ButtonStyles || (exports.ButtonStyles = {}));
    (function (NPCState) {
        NPCState["STANDING"] = "standing";
        NPCState["TALKING"] = "talking";
        NPCState["FOLLOWPATH"] = "followPath";
        //FOLLOWPLAYER = 'followPlayer'
    })(exports.NPCState || (exports.NPCState = {}));
    (function (NPCLerpType) {
        NPCLerpType["SMOOTH_PATH"] = "smooth";
        NPCLerpType["RIGID_PATH"] = "rigid";
    })(exports.NPCLerpType || (exports.NPCLerpType = {}));

    function setSection(image, section) {
        image.sourceWidth = section.sourceWidth;
        image.sourceHeight = section.sourceHeight;
        image.sourceLeft = section.sourceLeft ? section.sourceLeft : 0;
        image.sourceTop = section.sourceTop ? section.sourceTop : 0;
    }
    function buttonIconPos(textLen) {
        var pos = -10 - textLen * 4;
        return pos > -65 ? pos : -65;
    }
    var resources = {
        buttons: {
            buttonE: {
                sourceWidth: 174,
                sourceHeight: 46,
                sourceLeft: 512,
                sourceTop: 662
            },
            buttonF: {
                sourceWidth: 174,
                sourceHeight: 46,
                sourceLeft: 512,
                sourceTop: 612
            },
            white: {
                sourceWidth: 174,
                sourceHeight: 46,
                sourceLeft: 698,
                sourceTop: 662
            },
            buttonRed: {
                sourceWidth: 174,
                sourceHeight: 46,
                sourceLeft: 512,
                sourceTop: 662
            },
            buttonDark: {
                sourceWidth: 174,
                sourceHeight: 46,
                sourceLeft: 512,
                sourceTop: 612
            },
            roundBlack: {
                sourceWidth: 128,
                sourceHeight: 32,
                sourceLeft: 512,
                sourceTop: 458
            },
            squareBlack: {
                sourceWidth: 128,
                sourceHeight: 32,
                sourceLeft: 646,
                sourceTop: 457
            },
            roundWhite: {
                sourceWidth: 128,
                sourceHeight: 32,
                sourceLeft: 512,
                sourceTop: 494
            },
            squareWhite: {
                sourceWidth: 128,
                sourceHeight: 32,
                sourceLeft: 646,
                sourceTop: 493
            },
            roundSilver: {
                sourceWidth: 128,
                sourceHeight: 32,
                sourceLeft: 512,
                sourceTop: 531
            },
            squareSilver: {
                sourceWidth: 128,
                sourceHeight: 32,
                sourceLeft: 646,
                sourceTop: 531
            },
            roundGold: {
                sourceWidth: 128,
                sourceHeight: 32,
                sourceLeft: 512,
                sourceTop: 567
            },
            squareGold: {
                sourceWidth: 128,
                sourceHeight: 32,
                sourceLeft: 646,
                sourceTop: 567
            }
        },
        buttonLabels: {
            E: {
                sourceWidth: 26,
                sourceHeight: 26,
                sourceLeft: 697,
                sourceTop: 611
            },
            F: {
                sourceWidth: 26,
                sourceHeight: 26,
                sourceLeft: 733,
                sourceTop: 611
            },
            EBlack: {
                sourceWidth: 26,
                sourceHeight: 26,
                sourceLeft: 766,
                sourceTop: 611
            },
            FBlack: {
                sourceWidth: 26,
                sourceHeight: 26,
                sourceLeft: 802,
                sourceTop: 611
            }
        },
        backgrounds: {
            promptBackground: {
                sourceWidth: 416,
                sourceHeight: 352,
                sourceLeft: 501,
                sourceTop: 12
            },
            promptLargeBackground: {
                sourceWidth: 480,
                sourceHeight: 384,
                sourceLeft: 7,
                sourceTop: 12
            },
            promptSlantedBackground: {
                sourceWidth: 486,
                sourceHeight: 326,
                sourceLeft: 7,
                sourceTop: 413
            },
            NPCDialog: {
                sourceWidth: 766,
                sourceHeight: 248,
                sourceLeft: 22,
                sourceTop: 756
            }
        },
        icons: {
            closeW: {
                sourceWidth: 32,
                sourceHeight: 32,
                sourceLeft: 942,
                sourceTop: 306
            },
            closeD: {
                sourceWidth: 32,
                sourceHeight: 32,
                sourceLeft: 986,
                sourceTop: 306
            },
            closeWLarge: {
                sourceWidth: 64,
                sourceHeight: 64,
                sourceLeft: 512,
                sourceTop: 381
            },
            closeDLarge: {
                sourceWidth: 64,
                sourceHeight: 64,
                sourceLeft: 583,
                sourceTop: 381
            },
            closeWNoBack: {
                sourceWidth: 24,
                sourceHeight: 24,
                sourceLeft: 946,
                sourceTop: 252
            },
            closeDNoBack: {
                sourceWidth: 24,
                sourceHeight: 24,
                sourceLeft: 946,
                sourceTop: 214
            },
            closeWNoBackLarge: {
                sourceWidth: 32,
                sourceHeight: 32,
                sourceLeft: 987,
                sourceTop: 214
            },
            closeDNoBackLarge: {
                sourceWidth: 32,
                sourceHeight: 32,
                sourceLeft: 987,
                sourceTop: 260
            },
            FDark: {
                sourceWidth: 32,
                sourceHeight: 32,
                sourceLeft: 950,
                sourceTop: 4
            },
            FWhite: {
                sourceWidth: 32,
                sourceHeight: 32,
                sourceLeft: 987,
                sourceTop: 4
            },
            EDark: {
                sourceWidth: 32,
                sourceHeight: 32,
                sourceLeft: 950,
                sourceTop: 40
            },
            EWhite: {
                sourceWidth: 32,
                sourceHeight: 32,
                sourceLeft: 987,
                sourceTop: 40
            },
            Timer: {
                sourceWidth: 24,
                sourceHeight: 32.2,
                sourceLeft: 718,
                sourceTop: 388
            },
            TimerLarge: {
                sourceWidth: 48,
                sourceHeight: 68,
                sourceLeft: 662,
                sourceTop: 386
            },
            ClickWhite: {
                sourceWidth: 32,
                sourceHeight: 48,
                sourceLeft: 799,
                sourceTop: 389
            },
            ClickDark: {
                sourceWidth: 32,
                sourceHeight: 48,
                sourceLeft: 757,
                sourceTop: 389
            }
        },
        checkboxes: {
            wOff: {
                sourceWidth: 24,
                sourceHeight: 24,
                sourceLeft: 987,
                sourceTop: 76
            },
            wOn: {
                sourceWidth: 24,
                sourceHeight: 24,
                sourceLeft: 987,
                sourceTop: 104
            },
            dOff: {
                sourceWidth: 24,
                sourceHeight: 24,
                sourceLeft: 958,
                sourceTop: 76
            },
            dOn: {
                sourceWidth: 24,
                sourceHeight: 24,
                sourceLeft: 958,
                sourceTop: 104
            },
            wLargeOff: {
                sourceWidth: 32,
                sourceHeight: 32,
                sourceLeft: 987,
                sourceTop: 132
            },
            wLargeOn: {
                sourceWidth: 32,
                sourceHeight: 32,
                sourceLeft: 987,
                sourceTop: 168
            },
            dLargeOff: {
                sourceWidth: 32,
                sourceHeight: 32,
                sourceLeft: 950,
                sourceTop: 132
            },
            dLargeOn: {
                sourceWidth: 32,
                sourceHeight: 32,
                sourceLeft: 950,
                sourceTop: 168
            }
        },
        switches: {
            roundOff: {
                sourceWidth: 64,
                sourceHeight: 32,
                sourceLeft: 783,
                sourceTop: 454
            },
            roundRed: {
                sourceWidth: 64,
                sourceHeight: 32,
                sourceLeft: 853,
                sourceTop: 454
            },
            roundGreen: {
                sourceWidth: 64,
                sourceHeight: 32,
                sourceLeft: 923,
                sourceTop: 454
            },
            squareOff: {
                sourceWidth: 64,
                sourceHeight: 32,
                sourceLeft: 783,
                sourceTop: 501
            },
            squareRed: {
                sourceWidth: 64,
                sourceHeight: 32,
                sourceLeft: 852,
                sourceTop: 501
            },
            squareGreen: {
                sourceWidth: 64,
                sourceHeight: 32,
                sourceLeft: 921,
                sourceTop: 501
            }
        },
        bubbles: {
            short: {
                sourceWidth: 116 * 2,
                sourceHeight: 84 * 2,
                sourceLeft: 305 * 2,
                sourceTop: 417 * 2,
            },
            normal: {
                sourceWidth: 286 * 2,
                sourceHeight: 84 * 2,
                sourceLeft: 8 * 2,
                sourceTop: 417 * 2,
            },
            long: {
                sourceWidth: 497 * 2,
                sourceHeight: 153 * 2,
                sourceLeft: 6 * 2,
                sourceTop: 254 * 2,
            },
            huge: {
                sourceWidth: 497 * 2,
                sourceHeight: 239 * 2,
                sourceLeft: 6 * 2,
                sourceTop: 7 * 2,
            },
        },
    };

    /**
     * Execute once after X milliseconds
     */
    var NPCDelay = /** @class */ (function () {
        /**
         * @param seconds amount of time in seconds
         * @param onTimeReachedCallback callback for when time is reached
         */
        function NPCDelay(seconds, onTimeReachedCallback) {
            var _this = this;
            NPCTimerSystem.createAndAddToEngine();
            this.elapsedTime = 0;
            this.targetTime = seconds;
            this.onTimeReachedCallback = onTimeReachedCallback;
            this.onTargetTimeReached = function (entity) {
                _this.onTimeReachedCallback();
                entity.removeComponent(NPCDelay_1);
            };
        }
        NPCDelay_1 = NPCDelay;
        NPCDelay.prototype.setCallback = function (onTimeReachedCallback) {
            this.onTimeReachedCallback = onTimeReachedCallback;
        };
        var NPCDelay_1;
        NPCDelay = NPCDelay_1 = __decorate([
            Component('npcTimerDelay'),
            __metadata("design:paramtypes", [Number, Function])
        ], NPCDelay);
        return NPCDelay;
    }());
    var entitiesWithDelay = engine.getComponentGroup(NPCDelay);
    var NPCTimerSystem = /** @class */ (function () {
        function NPCTimerSystem() {
            NPCTimerSystem._instance = this;
        }
        NPCTimerSystem.createAndAddToEngine = function () {
            if (this._instance == null) {
                this._instance = new NPCTimerSystem();
                engine.addSystem(this._instance);
            }
            return this._instance;
        };
        NPCTimerSystem.prototype.update = function (dt) {
            var e_1, _a;
            try {
                for (var _b = __values(entitiesWithDelay.entities), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var ent = _c.value;
                    var timerComponent = ent.getComponent(NPCDelay);
                    timerComponent.elapsedTime += dt;
                    if (timerComponent.elapsedTime >= timerComponent.targetTime) {
                        timerComponent.onTargetTimeReached(ent);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        NPCTimerSystem._instance = null;
        return NPCTimerSystem;
    }());

    var ConfirmMode;
    (function (ConfirmMode) {
        ConfirmMode[ConfirmMode["Confirm"] = 0] = "Confirm";
        ConfirmMode[ConfirmMode["Cancel"] = 1] = "Cancel";
        ConfirmMode[ConfirmMode["Next"] = 2] = "Next";
        ConfirmMode[ConfirmMode["Button3"] = 3] = "Button3";
        ConfirmMode[ConfirmMode["Button4"] = 4] = "Button4";
    })(ConfirmMode || (ConfirmMode = {}));
    var UIscaleMultiplier = 0.75;
    var portraitXPos = -350 * UIscaleMultiplier;
    var portraitYPos = 0 * UIscaleMultiplier;
    var imageXPos = 350 * UIscaleMultiplier;
    var imageYPos = 50 * UIscaleMultiplier;
    var portraitScale = 256 * UIscaleMultiplier;
    var imageScale = 256 * UIscaleMultiplier;
    var textSize = 24 * UIscaleMultiplier;
    var textYPos = 10 * UIscaleMultiplier;
    var buttonWidth = 174 * UIscaleMultiplier;
    var buttonHeight = 46 * UIscaleMultiplier;
    var buttonTextSize = 20 * UIscaleMultiplier;
    var button1XPos = 150 * UIscaleMultiplier;
    var button2XPos = -80 * UIscaleMultiplier;
    var button3XPos = -80 * UIscaleMultiplier;
    var button4XPos = 150 * UIscaleMultiplier;
    var button1YPos = -65 * UIscaleMultiplier;
    var button2YPos = -65 * UIscaleMultiplier;
    var button1YPos4 = -20 * UIscaleMultiplier;
    var button2YPos4 = -20 * UIscaleMultiplier;
    var button3YPos = -80 * UIscaleMultiplier;
    var button4YPos = -80 * UIscaleMultiplier;
    var skipButtonXPos = -300 * UIscaleMultiplier;
    var skipButtonYPos = -100 * UIscaleMultiplier;
    var buttonIconWidth = 26 * UIscaleMultiplier;
    var buttonIconHeight = 26 * UIscaleMultiplier;
    /**
     * Displays a UI screen with text from an array of Dialog objects. Each entry can also include a portrait image, questions with triggered actions by each, etc.
     *
     * @param defaultPortrait ImageData object with soruce and dimension of default portrait image to use on the Dialog UI
     * @param useDarkTheme If true, use the dark theme for all the UI. Can also be an alternative `Texture` object to use a different themed atlas, with identical coordinates for each element.
     * @param sound Path to a sound file to play once for every dialog window shown.
     *
     */
    var DialogWindow = /** @class */ (function () {
        function DialogWindow(defaultPortrait, useDarkTheme, sound, customTheme) {
            var _this = this;
            this.NPCScript = [];
            this.isDialogOpen = false;
            this.isQuestionPanel = false;
            this.isFixedScreen = false;
            this.activeTextId = 0;
            this.UIOpenTime = 0;
            this.defaultSound = null;
            this.canvas = canvas;
            this.ClickAction = null;
            this.EButtonAction = null;
            this.FButtonAction = null;
            this.defaultPortrait = defaultPortrait ? defaultPortrait : null;
            if (customTheme) {
                this.uiTheme = customTheme;
            }
            else {
                this.uiTheme = useDarkTheme ? darkTheme : lightTheme;
            }
            // Container
            this.container = new UIContainerRect(canvas);
            //this.container.adaptWidth = true
            this.container.width = '100%';
            this.container.vAlign = 'bottom';
            this.container.positionY = 140 * UIscaleMultiplier;
            this.container.visible = false;
            // Text Panel
            this.panel = new UIImage(this.container, this.uiTheme);
            setSection(this.panel, resources.backgrounds.NPCDialog);
            this.panel.width = 766 * UIscaleMultiplier;
            this.panel.height = 248 * UIscaleMultiplier;
            this.panel.onClick = new OnClick(function () {
                _this.confirmText(ConfirmMode.Next);
            });
            this.defaultPortraitTexture = new Texture(defaultPortrait ? defaultPortrait.path : this.uiTheme.src);
            // Portrait
            this.portrait = new UIImage(this.container, this.defaultPortraitTexture);
            this.portrait.sourceWidth =
                defaultPortrait && defaultPortrait.section ? defaultPortrait.section.sourceWidth : 256;
            this.portrait.sourceHeight =
                defaultPortrait && defaultPortrait.section ? defaultPortrait.section.sourceHeight : 256;
            this.portrait.width = defaultPortrait && defaultPortrait.width ? defaultPortrait.width * UIscaleMultiplier : portraitScale;
            this.portrait.height = defaultPortrait && defaultPortrait.height ? defaultPortrait.height * UIscaleMultiplier : portraitScale;
            this.portrait.positionX =
                defaultPortrait && defaultPortrait.offsetX
                    ? defaultPortrait.offsetX * UIscaleMultiplier + portraitXPos
                    : portraitXPos;
            this.portrait.positionY =
                defaultPortrait && defaultPortrait.offsetY
                    ? defaultPortrait.offsetY * UIscaleMultiplier + portraitYPos
                    : portraitYPos;
            this.portrait.onClick = new OnClick(function () {
                _this.confirmText(ConfirmMode.Next);
            });
            // Image
            this.image = new UIImage(this.container, new Texture(this.uiTheme.src));
            this.image.sourceWidth = 256;
            this.image.sourceHeight = 256;
            this.image.sourceTop = 0;
            this.image.sourceLeft = 0;
            this.image.width = imageScale;
            this.image.height = imageScale;
            this.image.positionX = imageXPos;
            this.image.positionY = imageYPos;
            this.image.onClick = new OnClick(function () {
                _this.confirmText(ConfirmMode.Next);
            });
            // Dialog Text
            this.text = new UIText(this.container);
            this.text.visible = false;
            this.text.adaptWidth = false;
            this.text.textWrapping = true;
            this.text.width = 460 * UIscaleMultiplier;
            this.text.positionX = 40 * UIscaleMultiplier;
            this.text.hAlign = 'center';
            this.text.vAlign = 'center';
            this.text.font = SFHeavyFont;
            this.text.fontSize = textSize;
            //this.text.hTextAlign = 'center'
            this.text.hTextAlign = 'left';
            this.text.vTextAlign = 'center';
            this.text.positionY = textYPos;
            //this.text.fontWeight = 'normal'
            this.text.color = useDarkTheme ? Color4.White() : Color4.Black();
            this.text.isPointerBlocker = false;
            //  Input Text
            this.fillInBox = new UIInputText(this.container);
            this.fillInBox.visible = false;
            this.fillInBox.textWrapping = true;
            this.fillInBox.width = 460 * UIscaleMultiplier;
            this.fillInBox.height = 40 * UIscaleMultiplier;
            this.fillInBox.hTextAlign = 'center';
            this.fillInBox.vTextAlign = 'center';
            this.fillInBox.font = SFHeavyFont;
            this.fillInBox.fontSize = textSize;
            this.fillInBox.hTextAlign = 'left';
            this.fillInBox.vTextAlign = 'center';
            this.fillInBox.positionY = textYPos;
            this.fillInBox.color = useDarkTheme ? Color4.White() : Color4.Black();
            this.fillInBox.placeholder = "?";
            this.fillInBox.isPointerBlocker = true;
            this.soundEnt = new Entity();
            this.soundEnt.addComponent(new Transform());
            engine.addEntity(this.soundEnt);
            this.soundEnt.setParent(Attachable.AVATAR);
            if (sound) {
                this.soundEnt.addComponent(new AudioSource(new AudioClip(sound)));
                this.soundEnt.getComponent(AudioSource).volume = 0.5;
                this.defaultSound = sound;
            }
            this.button1 = new CustomDialogButton(this.container, this.uiTheme, 'yes', button1XPos, button1YPos, function () {
                _this.confirmText(ConfirmMode.Confirm);
            }, useDarkTheme ? true : false, exports.ButtonStyles.E);
            this.button1.hide();
            this.button2 = new CustomDialogButton(this.container, this.uiTheme, 'no', button2XPos, button2YPos, function () {
                _this.confirmText(ConfirmMode.Cancel);
            }, useDarkTheme ? true : false, exports.ButtonStyles.F);
            this.button2.hide();
            this.button3 = new CustomDialogButton(this.container, this.uiTheme, 'maybe', button3XPos, button3YPos, function () {
                _this.confirmText(ConfirmMode.Button3);
            }, useDarkTheme ? true : false, exports.ButtonStyles.DARK);
            this.button3.hide();
            this.button4 = new CustomDialogButton(this.container, this.uiTheme, 'maybe', button4XPos, button4YPos, function () {
                _this.confirmText(ConfirmMode.Button4);
            }, useDarkTheme ? true : false, exports.ButtonStyles.DARK);
            this.button4.hide();
            this.skipButton = new CustomDialogButton(this.container, this.uiTheme, 'Skip', skipButtonXPos, skipButtonYPos, function () {
                _this.skipDialogs();
            }, false, darkTheme ? exports.ButtonStyles.WHITE : exports.ButtonStyles.F);
            this.skipButton.image.width = 80 * UIscaleMultiplier;
            this.skipButton.image.height = 30 * UIscaleMultiplier;
            this.skipButton.label.hTextAlign = 'left';
            this.skipButton.label.fontSize = 12 * UIscaleMultiplier;
            this.skipButton.label.positionX = 40 * UIscaleMultiplier;
            this.skipButton.label.font = SFHeavyFont;
            this.skipButton.icon.height = 20 * UIscaleMultiplier;
            this.skipButton.icon.width = 20 * UIscaleMultiplier;
            this.skipButton.icon.positionX = -20 * UIscaleMultiplier;
            this.skipButton.hide();
            // Left Click Icon
            this.leftClickIcon = new UIImage(this.container, this.uiTheme);
            this.leftClickIcon.width = 32 * UIscaleMultiplier;
            this.leftClickIcon.height = 48 * UIscaleMultiplier;
            this.leftClickIcon.positionX = 340 * UIscaleMultiplier;
            this.leftClickIcon.positionY = -80 * UIscaleMultiplier;
            this.leftClickIcon.visible = false;
            setSection(this.leftClickIcon, useDarkTheme ? resources.icons.ClickDark : resources.icons.ClickWhite);
            DialogTypeInSystem.createAndAddToEngine();
        }
        /**
         * Opens a dialog UI to start a conversation.
         * @param {Dialog[]} NPCScript  Instructions to follow during the conversation
         * @param {number|string} textId Where to start in the script. Can refer to an index in the array or the `name` field of a Dialog entry.
         */
        DialogWindow.prototype.openDialogWindow = function (NPCScript, textId) {
            var _this = this;
            this.UIOpenTime = +Date.now();
            this.NPCScript = NPCScript;
            if (!textId) {
                this.activeTextId = 0;
            }
            else if (typeof textId === 'number') {
                this.activeTextId = textId;
            }
            else {
                this.activeTextId = findDialogByName(NPCScript, textId);
            }
            var currentText = NPCScript[this.activeTextId]
                ? NPCScript[this.activeTextId]
                : { text: '' };
            if (currentText.audio) {
                this.soundEnt.addComponentOrReplace(new AudioSource(new AudioClip(currentText.audio)));
                this.soundEnt.getComponent(AudioSource).volume = 0.5;
                this.soundEnt.getComponent(AudioSource).playOnce();
            }
            else if (this.defaultSound) {
                this.soundEnt.addComponentOrReplace(new AudioSource(new AudioClip(this.defaultSound)));
                this.soundEnt.getComponent(AudioSource).playOnce();
            }
            // Set portrait
            if (currentText.portrait) {
                this.portrait.source = new Texture(currentText.portrait.path);
                this.portrait.positionX = currentText.portrait.offsetX
                    ? currentText.portrait.offsetX * UIscaleMultiplier + portraitXPos
                    : portraitXPos;
                this.portrait.positionY = currentText.portrait.offsetY
                    ? currentText.portrait.offsetY * UIscaleMultiplier + portraitYPos
                    : portraitYPos;
                this.portrait.width = currentText.portrait.width ? currentText.portrait.width * UIscaleMultiplier : portraitScale;
                this.portrait.height = currentText.portrait.height ? currentText.portrait.height * UIscaleMultiplier : portraitScale;
                if (currentText.portrait.section) {
                    setSection(this.portrait, currentText.portrait.section);
                }
                this.portrait.visible = true;
            }
            else if (this.defaultPortrait) {
                this.portrait.source = this.defaultPortraitTexture;
                this.portrait.positionX =
                    this.defaultPortrait && this.defaultPortrait.offsetX
                        ? this.defaultPortrait.offsetX * UIscaleMultiplier + portraitXPos
                        : portraitXPos;
                this.portrait.positionY =
                    this.defaultPortrait && this.defaultPortrait.offsetY
                        ? this.defaultPortrait.offsetY * UIscaleMultiplier + portraitYPos
                        : portraitYPos;
                this.portrait.width =
                    this.defaultPortrait && this.defaultPortrait.width ? this.defaultPortrait.width * UIscaleMultiplier : portraitScale;
                this.portrait.height =
                    this.defaultPortrait && this.defaultPortrait.height ? this.defaultPortrait.height * UIscaleMultiplier : portraitScale;
                if (this.defaultPortrait.section) {
                    setSection(this.portrait, this.defaultPortrait.section);
                }
                this.portrait.visible = true;
            }
            else {
                log('No portrait');
                this.portrait.visible = false;
            }
            // Set image on the right
            if (currentText.image) {
                var image = currentText.image;
                log('setting image to ', image.path);
                this.image.source = new Texture(image.path);
                this.image.positionX = image.offsetX ? image.offsetX * UIscaleMultiplier + imageXPos : imageXPos;
                this.image.positionY = image.offsetY ? image.offsetY * UIscaleMultiplier + imageYPos : imageYPos;
                this.image.width = image.width ? image.width * UIscaleMultiplier : imageScale;
                this.portrait.height = image.height ? image.height * UIscaleMultiplier : imageScale;
                if (image.section) {
                    setSection(this.image, image.section);
                }
                this.image.visible = true;
            }
            else {
                this.image.visible = false;
            }
            if (currentText.isQuestion && currentText.isEntryQuestion) {
                this.fillInBox.fontSize = currentText.fontSize ? currentText.fontSize * UIscaleMultiplier : textSize;
                this.fillInBox.positionY = currentText.offsetY ? currentText.offsetY * UIscaleMultiplier + textYPos : textYPos;
                this.fillInBox.positionX = currentText.offsetX ? currentText.offsetX * UIscaleMultiplier : 0;
                this.fillInBox.visible = true;
                this.container.visible = true;
            }
            else {
                // Set text
                //this.text.value = currentText.text
                this.text.fontSize = currentText.fontSize ? currentText.fontSize * UIscaleMultiplier : textSize;
                this.text.positionY = currentText.offsetY ? currentText.offsetY * UIscaleMultiplier + textYPos : textYPos;
                this.text.positionX = currentText.offsetX ? currentText.offsetX * UIscaleMultiplier : 0;
                this.text.visible = true;
                this.container.visible = true;
                DialogTypeInSystem._instance.newText(this, currentText.text, this.activeTextId, currentText.typeSpeed ? currentText.typeSpeed : undefined);
            }
            // Global button events
            if (!this.ClickAction) {
                this.ClickAction = Input.instance.subscribe('BUTTON_DOWN', ActionButton.POINTER, false, function (e) {
                    if (!_this.isDialogOpen || +Date.now() - _this.UIOpenTime < 100)
                        return;
                    if (currentText.isQuestion && currentText.isEntryQuestion)
                        return;
                    if (!DialogTypeInSystem._instance.done) {
                        DialogTypeInSystem._instance.rush();
                        return;
                    }
                    else if (!_this.isQuestionPanel && !_this.isFixedScreen) {
                        _this.confirmText(ConfirmMode.Next);
                    }
                });
                this.EButtonAction = Input.instance.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, false, function (e) {
                    if (!_this.isDialogOpen || +Date.now() - _this.UIOpenTime < 100)
                        return;
                    if (_this.isQuestionPanel) {
                        _this.confirmText(ConfirmMode.Confirm);
                    }
                    else if (!_this.isQuestionPanel && !_this.isFixedScreen) {
                        _this.confirmText(ConfirmMode.Next);
                    }
                });
                this.FButtonAction = Input.instance.subscribe('BUTTON_DOWN', ActionButton.SECONDARY, false, function (e) {
                    if (!_this.isDialogOpen || +Date.now() - _this.UIOpenTime < 100)
                        return;
                    if (_this.isQuestionPanel) {
                        _this.confirmText(ConfirmMode.Cancel);
                    }
                    else if (currentText.skipable && !_this.isFixedScreen) {
                        _this.skipDialogs();
                    }
                });
            }
            this.layoutDialogWindow(this.activeTextId);
            this.isDialogOpen = true;
        };
        // Progresses text
        DialogWindow.prototype.confirmText = function (mode) {
            var currentText = this.NPCScript[this.activeTextId];
            this.UIOpenTime = +Date.now();
            // Update active text
            if (mode == ConfirmMode.Next) {
                if (!currentText.isQuestion) {
                    if (currentText.triggeredByNext) {
                        currentText.triggeredByNext();
                    }
                    if (currentText.isEndOfDialog) {
                        this.closeDialogWindow();
                        return;
                    }
                    this.activeTextId++;
                }
            }
            if (mode == ConfirmMode.Confirm) {
                if (currentText.buttons && currentText.buttons.length >= 1) {
                    if (typeof currentText.buttons[0].goToDialog === 'number') {
                        this.activeTextId = currentText.buttons[0].goToDialog;
                    }
                    else {
                        this.activeTextId = findDialogByName(this.NPCScript, currentText.buttons[0].goToDialog);
                    }
                    if (currentText.buttons[0].triggeredActions) {
                        var fillInBoxTextValue = currentText.isEntryQuestion ? this.fillInBox.value : undefined;
                        currentText.buttons[0].triggeredActions(fillInBoxTextValue);
                    }
                }
            }
            if (mode == ConfirmMode.Cancel) {
                if (currentText.buttons && currentText.buttons.length >= 2) {
                    if (typeof currentText.buttons[1].goToDialog === 'number') {
                        this.activeTextId = currentText.buttons[1].goToDialog;
                    }
                    else {
                        this.activeTextId = findDialogByName(this.NPCScript, currentText.buttons[1].goToDialog);
                    }
                    if (currentText.buttons[1].triggeredActions) {
                        var fillInBoxTextValue = currentText.isEntryQuestion ? this.fillInBox.value : undefined;
                        currentText.buttons[1].triggeredActions(fillInBoxTextValue);
                    }
                }
            }
            if (mode == ConfirmMode.Button3) {
                if (currentText.buttons && currentText.buttons.length >= 3) {
                    if (typeof currentText.buttons[2].goToDialog === 'number') {
                        this.activeTextId = currentText.buttons[2].goToDialog;
                    }
                    else {
                        this.activeTextId = findDialogByName(this.NPCScript, currentText.buttons[2].goToDialog);
                    }
                    if (currentText.buttons[2].triggeredActions) {
                        var fillInBoxTextValue = currentText.isEntryQuestion ? this.fillInBox.value : undefined;
                        currentText.buttons[2].triggeredActions(fillInBoxTextValue);
                    }
                }
            }
            if (mode == ConfirmMode.Button4) {
                if (currentText.buttons && currentText.buttons.length >= 4) {
                    if (typeof currentText.buttons[3].goToDialog === 'number') {
                        this.activeTextId = currentText.buttons[3].goToDialog;
                    }
                    else {
                        this.activeTextId = findDialogByName(this.NPCScript, currentText.buttons[3].goToDialog);
                    }
                    if (currentText.buttons[3].triggeredActions) {
                        var fillInBoxTextValue = currentText.isEntryQuestion ? this.fillInBox.value : undefined;
                        currentText.buttons[3].triggeredActions(fillInBoxTextValue);
                    }
                }
            }
            // Update active text with new active text
            currentText = this.NPCScript[this.activeTextId];
            if (currentText.isQuestion && currentText.isEntryQuestion) {
                this.text.visible = false;
                this.fillInBox.value = "";
                this.fillInBox.visible = true;
                // Buttons & action icons
                this.layoutDialogWindow(this.activeTextId);
            }
            else {
                this.fillInBox.visible = false;
                this.text.visible = true;
                DialogTypeInSystem._instance.newText(this, currentText.text, this.activeTextId, currentText.typeSpeed ? currentText.typeSpeed : undefined);
            }
        };
        // Adds the buttons or mouse icon depending on the type of window
        DialogWindow.prototype.layoutDialogWindow = function (textId) {
            var _this = this;
            var currentText = this.NPCScript[textId] ? this.NPCScript[textId] : { text: '' };
            // Update text
            var textY = currentText.offsetY ? currentText.offsetY * UIscaleMultiplier + textYPos : textYPos;
            if (currentText.buttons && currentText.buttons.length >= 3) {
                textY += 50 * UIscaleMultiplier;
            }
            else if (currentText.buttons && currentText.buttons.length >= 1) {
                textY += 24 * UIscaleMultiplier;
            }
            this.text.fontSize = currentText.fontSize ? currentText.fontSize * UIscaleMultiplier : textSize;
            this.text.positionY = textY;
            if (currentText.audio) {
                this.soundEnt.addComponentOrReplace(new AudioSource(new AudioClip(currentText.audio)));
                this.soundEnt.getComponent(AudioSource).volume = 0.5;
                this.soundEnt.getComponent(AudioSource).playOnce();
            }
            else if (this.defaultSound) {
                this.soundEnt.addComponentOrReplace(new AudioSource(new AudioClip(this.defaultSound)));
                this.soundEnt.getComponent(AudioSource).playOnce();
            }
            if (currentText.portrait) {
                this.portrait.source = new Texture(currentText.portrait.path);
                this.portrait.positionX = currentText.portrait.offsetX
                    ? currentText.portrait.offsetX * UIscaleMultiplier + portraitXPos
                    : portraitXPos;
                this.portrait.positionY = currentText.portrait.offsetY
                    ? currentText.portrait.offsetY * UIscaleMultiplier + portraitYPos
                    : portraitYPos;
                this.portrait.width = currentText.portrait.width ? currentText.portrait.width * UIscaleMultiplier : portraitScale;
                this.portrait.height = currentText.portrait.height ? currentText.portrait.height * UIscaleMultiplier : portraitScale;
                if (currentText.portrait.section) {
                    setSection(this.portrait, currentText.portrait.section);
                }
                this.portrait.visible = true;
            }
            else if (this.defaultPortrait) {
                this.portrait.source = new Texture(this.defaultPortrait.path);
                this.portrait.positionX =
                    this.defaultPortrait && this.defaultPortrait.offsetX
                        ? this.defaultPortrait.offsetX * UIscaleMultiplier + portraitXPos
                        : portraitXPos;
                this.portrait.positionY =
                    this.defaultPortrait && this.defaultPortrait.offsetY
                        ? this.defaultPortrait.offsetY * UIscaleMultiplier + portraitYPos
                        : portraitYPos;
                this.portrait.width =
                    this.defaultPortrait && this.defaultPortrait.width ? this.defaultPortrait.width * UIscaleMultiplier : portraitScale;
                this.portrait.height =
                    this.defaultPortrait && this.defaultPortrait.height ? this.defaultPortrait.height * UIscaleMultiplier : portraitScale;
                if (this.defaultPortrait.section) {
                    setSection(this.portrait, this.defaultPortrait.section);
                }
                this.portrait.visible = true;
            }
            else {
                log('No portrait');
                this.portrait.visible = false;
            }
            this.image.visible = false;
            // Set image on the right
            if (currentText.image) {
                var image = currentText.image;
                log('setting image to ', image.path);
                this.image.source = new Texture(image.path);
                this.image.positionX = image.offsetX ? image.offsetX * UIscaleMultiplier + imageXPos : imageXPos;
                this.image.positionY = image.offsetY ? image.offsetY * UIscaleMultiplier + imageYPos : imageYPos;
                this.image.width = currentText.image.width ? currentText.image.width * UIscaleMultiplier : imageScale;
                this.image.height = currentText.image.height ? currentText.image.height * UIscaleMultiplier : imageScale;
                if (image.section) {
                    setSection(this.image, image.section);
                }
                this.image.visible = true;
            }
            else {
                this.image.visible = false;
            }
            this.isQuestionPanel = currentText.isQuestion ? currentText.isQuestion : false;
            this.isFixedScreen = currentText.isFixedScreen ? currentText.isFixedScreen : false;
            this.button1.hide();
            this.button2.hide();
            this.button3.hide();
            this.button4.hide();
            // Mouse icon
            this.leftClickIcon.visible = false;
            if (currentText.isQuestion) {
                this.skipButton.hide();
                // Button E
                if (currentText.buttons && currentText.buttons.length >= 1) {
                    this.button1.update(currentText.buttons[0].label, currentText.buttons[0].offsetX
                        ? currentText.buttons[0].offsetX * UIscaleMultiplier + button1XPos
                        : button1XPos, currentText.buttons.length >= 3
                        ? currentText.buttons[0].offsetY
                            ? currentText.buttons[0].offsetY * UIscaleMultiplier + button1YPos4
                            : button1YPos4
                        : currentText.buttons[0].offsetY
                            ? currentText.buttons[0].offsetY * UIscaleMultiplier + button1YPos
                            : button1YPos);
                }
                // Button F
                if (currentText.buttons && currentText.buttons.length >= 2) {
                    this.button2.update(currentText.buttons[1].label, currentText.buttons[1].offsetX * UIscaleMultiplier
                        ? currentText.buttons[1].offsetX * UIscaleMultiplier + button2XPos
                        : button2XPos, currentText.buttons.length >= 3
                        ? currentText.buttons[1].offsetY * UIscaleMultiplier
                            ? currentText.buttons[1].offsetY * UIscaleMultiplier + button2YPos4
                            : button2YPos4
                        : currentText.buttons[1].offsetY * UIscaleMultiplier
                            ? currentText.buttons[1].offsetY * UIscaleMultiplier + button2YPos
                            : button2YPos);
                }
                // Button 3
                if (currentText.buttons && currentText.buttons.length >= 3) {
                    this.button3.update(currentText.buttons[2].label, currentText.buttons[2].offsetX * UIscaleMultiplier
                        ? currentText.buttons[2].offsetX * UIscaleMultiplier + button3XPos
                        : button3XPos, currentText.buttons[2].offsetY * UIscaleMultiplier
                        ? currentText.buttons[2].offsetY * UIscaleMultiplier + button3YPos
                        : button3YPos);
                }
                // Button 4
                if (currentText.buttons && currentText.buttons.length >= 4) {
                    this.button4.update(currentText.buttons[3].label, currentText.buttons[3].offsetX * UIscaleMultiplier
                        ? currentText.buttons[3].offsetX * UIscaleMultiplier + button4XPos
                        : button4XPos, currentText.buttons[3].offsetY * UIscaleMultiplier
                        ? currentText.buttons[3].offsetY * UIscaleMultiplier + button4YPos
                        : button4YPos);
                }
                dummyQuestionDelays.addComponentOrReplace(new NPCDelay(0.7, function () {
                    // Button E
                    if (currentText.buttons && currentText.buttons.length >= 1) {
                        _this.button1.show();
                    }
                    // Button F
                    if (currentText.buttons && currentText.buttons.length >= 2) {
                        _this.button2.show();
                    }
                    // Button 3
                    if (currentText.buttons && currentText.buttons.length >= 3) {
                        _this.button3.show();
                    }
                    // Button 4
                    if (currentText.buttons && currentText.buttons.length >= 4) {
                        _this.button4.show();
                    }
                }));
            }
            else if (!this.isFixedScreen) {
                this.leftClickIcon.visible = true;
                if (currentText.skipable) {
                    this.skipButton.show();
                }
                else {
                    this.skipButton.hide();
                }
            }
        };
        /**
         * Closes a dialog UI.
         */
        DialogWindow.prototype.closeDialogWindow = function () {
            if (this.isDialogOpen) {
                this.isDialogOpen = false;
                this.portrait.visible = false;
                this.text.value = '';
                this.text.visible = false;
                this.fillInBox.value = '';
                this.fillInBox.visible = false;
                this.button1.hide();
                this.button2.hide();
                this.button3.hide();
                this.button4.hide();
                this.skipButton.hide();
                this.leftClickIcon.visible = false;
                this.container.visible = false;
            }
        };
        DialogWindow.prototype.skipDialogs = function () {
            if (!this.isDialogOpen || +Date.now() - this.UIOpenTime < 100)
                return;
            while (this.NPCScript[this.activeTextId] &&
                this.NPCScript[this.activeTextId].skipable &&
                !this.NPCScript[this.activeTextId].isQuestion) {
                if (this.NPCScript[this.activeTextId].triggeredByNext) {
                    this.NPCScript[this.activeTextId].triggeredByNext();
                }
                if (this.NPCScript[this.activeTextId].skipable &&
                    this.NPCScript[this.activeTextId].isEndOfDialog) {
                    this.closeDialogWindow();
                    return;
                }
                this.activeTextId += 1;
            }
            //this.activeTextId -= 1
            this.confirmText(ConfirmMode.Next);
        };
        return DialogWindow;
    }());
    var DEFAULT_SPEED = 45;
    var DialogTypeInSystem = /** @class */ (function () {
        function DialogTypeInSystem() {
            this.timer = 0;
            this.speed = DEFAULT_SPEED;
            this.visibleChars = 0;
            this.fullText = '';
            this.UIText = null;
            this.done = true;
            DialogTypeInSystem._instance = this;
        }
        DialogTypeInSystem.createAndAddToEngine = function () {
            if (this._instance == null) {
                this._instance = new DialogTypeInSystem();
                engine.addSystem(this._instance);
            }
            return this._instance;
        };
        DialogTypeInSystem.prototype.update = function (dt) {
            if (this.done)
                return;
            this.timer += dt;
            if (this.timer >= 2 / this.speed) {
                var charsToAdd = Math.floor(this.timer / (1 / this.speed));
                this.timer = 0;
                this.visibleChars += charsToAdd;
                // support <> tags
                this.closeTag(charsToAdd);
                if (this.visibleChars >= this.fullText.length) {
                    this.done = true;
                    this.visibleChars = this.fullText.length;
                }
                if (this.UIText) {
                    this.UIText.value = this.fullText.substr(0, this.visibleChars);
                }
            }
        };
        DialogTypeInSystem.prototype.newText = function (dialog, text, textId, speed) {
            this.timer = 0;
            this.done = false;
            this.UIText = dialog.text;
            this.fullText = text;
            this.visibleChars = 0;
            if (speed && speed <= 0) {
                this.rush();
            }
            else if (speed) {
                this.speed = speed;
            }
            else {
                this.speed = DEFAULT_SPEED;
            }
            // Buttons & action icons
            dialog.layoutDialogWindow(textId);
        };
        DialogTypeInSystem.prototype.rush = function () {
            this.done = true;
            this.timer = 0;
            this.visibleChars = this.fullText.length;
            if (this.UIText) {
                this.UIText.value = this.fullText;
            }
        };
        DialogTypeInSystem.prototype.closeTag = function (newChars) {
            if (this.visibleChars == 0 || newChars == 0)
                return;
            var openTag = false;
            var closeTag = false;
            for (var i = this.visibleChars - newChars; i < this.visibleChars; i++) {
                if (!openTag) {
                    if (this.fullText.substr(i, 1) == '<') {
                        openTag = true;
                    }
                }
                else {
                    if (this.fullText.substr(i, 1) == '>') {
                        closeTag = true;
                    }
                }
            }
            if (!openTag || closeTag) {
                return;
            }
            while (this.visibleChars < this.fullText.length && this.fullText.substr(this.visibleChars - 1, 1) != '>') {
                this.visibleChars += 1;
            }
            return;
        };
        DialogTypeInSystem._instance = null;
        return DialogTypeInSystem;
    }());
    var CustomDialogButton = /** @class */ (function (_super) {
        __extends(CustomDialogButton, _super);
        function CustomDialogButton(parent, texture, 
        //UIOpenTime: number,
        label, posX, posY, onClick, useDarkTheme, style) {
            var _this = _super.call(this) || this;
            _this.icon = null;
            _this.image = new UIImage(parent, texture);
            _this.image.positionX = posX;
            _this.image.positionY = posY;
            _this.image.width = buttonWidth;
            _this.image.height = buttonHeight;
            _this.label = new UIText(_this.image);
            _this.style = style ? style : null;
            _this.onClick = onClick;
            if (_this.style) {
                switch (_this.style) {
                    case exports.ButtonStyles.E:
                        setSection(_this.image, resources.buttons.buttonE);
                        _this.label.positionX = 25 * UIscaleMultiplier;
                        _this.icon = new UIImage(_this.image, useDarkTheme == true ? darkTheme : lightTheme);
                        _this.icon.width = buttonIconWidth;
                        _this.icon.height = buttonIconHeight;
                        // this.button1Icon.positionY = 15
                        _this.icon.hAlign = 'center';
                        _this.icon.vAlign = 'center';
                        _this.icon.isPointerBlocker = false;
                        setSection(_this.icon, resources.buttonLabels.E);
                        _this.icon.positionX = buttonIconPos(label.length);
                        break;
                    case exports.ButtonStyles.F:
                        setSection(_this.image, resources.buttons.buttonF);
                        _this.label.positionX = 25 * UIscaleMultiplier;
                        _this.icon = new UIImage(_this.image, useDarkTheme == true ? darkTheme : lightTheme);
                        _this.icon.width = buttonIconWidth;
                        _this.icon.height = buttonIconHeight;
                        // this.button1Icon.positionY = 15
                        _this.icon.hAlign = 'center';
                        _this.icon.vAlign = 'center';
                        _this.icon.isPointerBlocker = false;
                        setSection(_this.icon, resources.buttonLabels.F);
                        _this.icon.positionX = buttonIconPos(label.length);
                        break;
                    case exports.ButtonStyles.WHITE:
                        setSection(_this.image, resources.buttons.white);
                        _this.label.positionX = 25 * UIscaleMultiplier;
                        _this.icon = new UIImage(_this.image, useDarkTheme == true ? darkTheme : lightTheme);
                        _this.icon.width = buttonIconWidth;
                        _this.icon.height = buttonIconHeight;
                        // this.button1Icon.positionY = 15
                        _this.icon.hAlign = 'center';
                        _this.icon.vAlign = 'center';
                        _this.icon.isPointerBlocker = false;
                        setSection(_this.icon, resources.buttonLabels.FBlack);
                        _this.icon.positionX = buttonIconPos(label.length);
                        break;
                    case exports.ButtonStyles.RED:
                        setSection(_this.image, resources.buttons.buttonRed);
                        break;
                    case exports.ButtonStyles.DARK:
                        setSection(_this.image, resources.buttons.buttonDark);
                        break;
                    case exports.ButtonStyles.ROUNDBLACK:
                        setSection(_this.image, resources.buttons.roundBlack);
                        break;
                    case exports.ButtonStyles.ROUNDWHITE:
                        setSection(_this.image, resources.buttons.roundWhite);
                        break;
                    case exports.ButtonStyles.ROUNDSILVER:
                        setSection(_this.image, resources.buttons.roundSilver);
                        break;
                    case exports.ButtonStyles.ROUNDGOLD:
                        setSection(_this.image, resources.buttons.roundGold);
                        break;
                    case exports.ButtonStyles.SQUAREBLACK:
                        setSection(_this.image, resources.buttons.squareBlack);
                        break;
                    case exports.ButtonStyles.SQUAREWHITE:
                        setSection(_this.image, resources.buttons.squareWhite);
                        break;
                    case exports.ButtonStyles.SQUARESILVER:
                        setSection(_this.image, resources.buttons.squareSilver);
                        break;
                    case exports.ButtonStyles.SQUAREGOLD:
                        setSection(_this.image, resources.buttons.squareGold);
                        break;
                }
            }
            else {
                setSection(_this.image, resources.buttons.roundSilver);
            }
            _this.label.value = label;
            _this.label.hTextAlign = 'center';
            _this.label.vTextAlign = 'center';
            _this.label.fontSize = buttonTextSize;
            _this.label.font = SFFont;
            _this.label.color =
                style == exports.ButtonStyles.ROUNDWHITE ||
                    style == exports.ButtonStyles.SQUAREWHITE ||
                    style == exports.ButtonStyles.WHITE
                    ? Color4.Black()
                    : Color4.White();
            _this.label.isPointerBlocker = false;
            _this.image.onClick = new OnClick(function () {
                _this.onClick();
            });
            if (style == exports.ButtonStyles.E) {
                Input.instance.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, false, function (e) {
                    if (_this.image.visible) {
                        // && +Date.now() - UIOpenTime > 100) {
                        _this.onClick();
                    }
                });
            }
            else if (style == exports.ButtonStyles.F) {
                Input.instance.subscribe('BUTTON_DOWN', ActionButton.SECONDARY, false, function (e) {
                    if (_this.image.visible) {
                        // && +Date.now() - UIOpenTime > 100) {
                        _this.onClick();
                    }
                });
            }
            return _this;
        }
        CustomDialogButton.prototype.hide = function () {
            this.image.visible = false;
        };
        CustomDialogButton.prototype.show = function () {
            this.image.visible = true;
        };
        CustomDialogButton.prototype.grayOut = function () {
            this.label.color = Color4.Gray();
            this.image.isPointerBlocker = false;
        };
        CustomDialogButton.prototype.enable = function () {
            this.label.color = Color4.White();
            this.image.isPointerBlocker = true;
        };
        CustomDialogButton.prototype.update = function (label, posX, posY) {
            this.label.value = label;
            this.image.positionX = posX;
            this.image.positionY = posY;
            if (this.icon && (this.style == exports.ButtonStyles.E || this.style == exports.ButtonStyles.F)) {
                this.icon.positionX = buttonIconPos(label.length);
            }
        };
        return CustomDialogButton;
    }(Entity));
    var dummyQuestionDelays = new Entity();
    engine.addEntity(dummyQuestionDelays);
    function findDialogByName(dialogs, name) {
        for (var i = 0; i < dialogs.length; i++) {
            if (dialogs[i].name && dialogs[i].name == name) {
                return i;
            }
        }
        return 0;
    }

    var NPCTriggerSystem = /** @class */ (function () {
        function NPCTriggerSystem() {
            this._triggers = {};
            NPCTriggerSystem._instance = this;
            this._cameraTriggerWrapper = new CameraTrigger(new TriggerBoxShape(new Vector3(0.5, 1.8, 0.5), new Vector3(0, 0.91, 0)));
            this._componentGroup = engine.getComponentGroup(NPCTriggerComponent);
        }
        Object.defineProperty(NPCTriggerSystem, "instance", {
            get: function () {
                return this.createAndAddToEngine();
            },
            enumerable: false,
            configurable: true
        });
        NPCTriggerSystem.createAndAddToEngine = function () {
            if (this._instance == null) {
                this._instance = new NPCTriggerSystem();
                engine.addSystem(this._instance);
            }
            return this._instance;
        };
        /**
         * set a custom trigger's shape for the camera
         * @param shape custom trigger's shape
         */
        NPCTriggerSystem.prototype.setCameraTriggerShape = function (shape) {
            this._cameraTriggerWrapper.setShape(shape);
        };
        NPCTriggerSystem.prototype.update = function () {
            var _this = this;
            var entitiesWithTriggers = this._componentGroup.entities;
            //iterate through all entities with triggers and wrap entities that weren't wrapped yet
            entitiesWithTriggers.forEach(function (entity) {
                if (_this.shouldWrapTriggerEntity(entity)) {
                    _this.wrapTriggerEntity(entity);
                }
            });
            //iterate through wrapped entities
            for (var key in this._triggers) {
                if (this._triggers.hasOwnProperty(key)) {
                    var wrapper = this._triggers[key];
                    //update debug entity
                    if (wrapper.isDebugging()) {
                        wrapper.updateDebugEntity();
                    }
                    if (!wrapper.isInEngine()) {
                        //remove debugging
                        if (wrapper.isDebugging()) {
                            wrapper.removeDebugEntity();
                        }
                        //remove old collisions
                        NPCTriggerSystem.removeTriggerFromSystem(wrapper);
                        //remove from record
                        delete this._triggers[key];
                    }
                    else if (wrapper.trigger != null && wrapper.trigger.enabled) {
                        //if was set as enabled in last frame
                        if (!wrapper.wasEnabled) {
                            if (wrapper.isDebugging()) {
                                wrapper.addDebugEntity();
                            }
                        }
                        //set as enabled
                        wrapper.wasEnabled = true;
                        //check collision camera
                        if (wrapper.trigger.onCameraEnter || wrapper.trigger.onCameraExit) {
                            this.checkCollisionAgainstCamera(wrapper);
                        }
                        //check collision with others
                        if (wrapper.trigger.onTriggerEnter || wrapper.trigger.onTriggerExit) {
                            this.checkCollisionAgainstOtherTriggers(wrapper);
                        }
                    }
                    else if (wrapper.wasEnabled) {
                        wrapper.wasEnabled = false;
                        //remove debugging
                        if (wrapper.isDebugging()) {
                            wrapper.removeDebugEntity();
                        }
                        NPCTriggerSystem.removeTriggerFromSystem(wrapper);
                    }
                }
            }
        };
        NPCTriggerSystem.prototype.shouldWrapTriggerEntity = function (entity) {
            return this._triggers[entity.uuid] == undefined || this._triggers[entity.uuid] == null;
        };
        NPCTriggerSystem.prototype.wrapTriggerEntity = function (entity) {
            this._triggers[entity.uuid] = new TriggerWrapper(entity);
        };
        NPCTriggerSystem.removeTriggerFromSystem = function (wrapper) {
            var _a;
            var activeCollisions = wrapper.getActiveCollisions();
            for (var i = 0; i < activeCollisions.length; i++) {
                var activeCollisionHasTrigger = !(activeCollisions[i] === ((_a = NPCTriggerSystem._instance) === null || _a === void 0 ? void 0 : _a._cameraTriggerWrapper) ||
                    activeCollisions[i].trigger == null);
                if (activeCollisionHasTrigger && activeCollisions[i].trigger.onTriggerExit && wrapper.entity)
                    activeCollisions[i].trigger.onTriggerExit(wrapper.entity);
                activeCollisions[i].disengageActiveCollision(wrapper);
                wrapper.disengageActiveCollision(activeCollisions[i]);
            }
        };
        NPCTriggerSystem.disengageCollision = function (t1, t2) {
            t1.disengageActiveCollision(t2);
            t2.disengageActiveCollision(t1);
            if (t1.trigger.onTriggerExit && t2.entity)
                t1.trigger.onTriggerExit(t2.entity);
            if (t2.trigger.onTriggerExit && t1.entity)
                t2.trigger.onTriggerExit(t1.entity);
        };
        NPCTriggerSystem.engageCollision = function (t1, t2) {
            t1.engageCollision(t2);
            t2.engageCollision(t1);
            if (t1.trigger.onTriggerEnter && t2.entity)
                t1.trigger.onTriggerEnter(t2.entity);
            if (t2.trigger.onTriggerEnter && t1.entity)
                t2.trigger.onTriggerEnter(t1.entity);
        };
        NPCTriggerSystem.prototype.checkCollisionAgainstCamera = function (wrapper) {
            var wereColliding = wrapper.hasActiveCollision(this._cameraTriggerWrapper);
            var areColliding = NPCTriggerSystem.areColliding(wrapper, this._cameraTriggerWrapper);
            if (wereColliding && !areColliding) {
                wrapper.disengageActiveCollision(this._cameraTriggerWrapper);
                if (wrapper.trigger.onCameraExit)
                    wrapper.trigger.onCameraExit();
            }
            else if (!wereColliding && areColliding) {
                wrapper.engageCollision(this._cameraTriggerWrapper);
                if (wrapper.trigger.onCameraEnter)
                    wrapper.trigger.onCameraEnter();
            }
        };
        NPCTriggerSystem.prototype.checkCollisionAgainstOtherTriggers = function (wrapper) {
            for (var key in this._triggers) {
                if (this._triggers.hasOwnProperty(key)) {
                    if (key != wrapper.uuid && this._triggers[key].trigger.enabled) {
                        if (NPCTriggerSystem.canTriggersCollide(wrapper, this._triggers[key])) {
                            var wereColliding = wrapper.hasActiveCollision(this._triggers[key]);
                            var areColliding = NPCTriggerSystem.areColliding(wrapper, this._triggers[key]);
                            if (wereColliding && !areColliding)
                                NPCTriggerSystem.disengageCollision(wrapper, this._triggers[key]);
                            else if (!wereColliding && areColliding)
                                NPCTriggerSystem.engageCollision(wrapper, this._triggers[key]);
                        }
                    }
                }
            }
        };
        NPCTriggerSystem.canTriggersCollide = function (t1, t2) {
            if (t1.trigger.triggeredByLayer == 0)
                return true;
            return (t2.trigger.layer & t1.trigger.triggeredByLayer) != 0;
        };
        NPCTriggerSystem.areColliding = function (t1, t2) {
            if (t1.getShape() instanceof TriggerBoxShape && t2.getShape() instanceof TriggerBoxShape) {
                return NPCTriggerSystem.areCollidingAABB(t1.getGlobalPosition(), t1.getShape(), t2.getGlobalPosition(), t2.getShape());
            }
            else if (t1.getShape() instanceof TriggerSphereShape &&
                t2.getShape() instanceof TriggerSphereShape) {
                return NPCTriggerSystem.areCollidingSphere(t1.getGlobalPosition(), t1.getShape(), t2.getGlobalPosition(), t2.getShape());
            }
            else if (t1.getShape() instanceof TriggerBoxShape &&
                t2.getShape() instanceof TriggerSphereShape) {
                return NPCTriggerSystem.areCollidingAABBSphere(t1.getGlobalPosition(), t1.getShape(), t2.getGlobalPosition(), t2.getShape());
            }
            else if (t1.getShape() instanceof TriggerSphereShape &&
                t2.getShape() instanceof TriggerBoxShape) {
                return NPCTriggerSystem.areCollidingAABBSphere(t2.getGlobalPosition(), t2.getShape(), t1.getGlobalPosition(), t1.getShape());
            }
            return false;
        };
        NPCTriggerSystem.areCollidingAABB = function (t1GlobalPosition, t1Shape, t2GlobalPosition, t2Shape) {
            var t1 = NPCTriggerSystem.getBoxShapeValues(t1GlobalPosition, t1Shape);
            var t2 = NPCTriggerSystem.getBoxShapeValues(t2GlobalPosition, t2Shape);
            return (t1.min.x <= t2.max.x &&
                t1.max.x >= t2.min.x &&
                t1.min.y <= t2.max.y &&
                t1.max.y >= t2.min.y &&
                t1.min.z <= t2.max.z &&
                t1.max.z >= t2.min.z);
        };
        NPCTriggerSystem.areCollidingSphere = function (t1GlobalPosition, t1Shape, t2GlobalPosition, t2Shape) {
            var sqDist = Vector3.DistanceSquared(t1GlobalPosition.add(t1Shape.position), t2GlobalPosition.add(t2Shape.position));
            return sqDist < t1Shape.radius * t1Shape.radius + t2Shape.radius * t2Shape.radius;
        };
        NPCTriggerSystem.areCollidingAABBSphere = function (t1GlobalPosition, t1Shape, t2GlobalPosition, t2Shape) {
            var box = NPCTriggerSystem.getBoxShapeValues(t1GlobalPosition, t1Shape);
            var sphere = {
                center: t2GlobalPosition.add(t2Shape.position),
                radius: t2Shape.radius
            };
            var dmin = 0;
            if (sphere.center.x < box.min.x)
                dmin += (box.min.x - sphere.center.x) * (box.min.x - sphere.center.x);
            if (sphere.center.x > box.max.x)
                dmin += (sphere.center.x - box.max.x) * (sphere.center.x - box.max.x);
            if (sphere.center.y < box.min.y)
                dmin += (box.min.y - sphere.center.y) * (box.min.y - sphere.center.y);
            if (sphere.center.y > box.max.y)
                dmin += (sphere.center.y - box.max.y) * (sphere.center.y - box.max.y);
            if (sphere.center.z < box.min.z)
                dmin += (box.min.z - sphere.center.z) * (box.min.z - sphere.center.z);
            if (sphere.center.z > box.max.z)
                dmin += (sphere.center.z - box.max.z) * (sphere.center.z - box.max.z);
            return dmin < sphere.radius * sphere.radius;
        };
        NPCTriggerSystem.getBoxShapeValues = function (entityGlobalPosition, shape) {
            var center = entityGlobalPosition.add(shape.position);
            return {
                center: center,
                min: center.subtract(shape.size.scale(0.5)),
                max: center.add(shape.size.scale(0.5))
            };
        };
        NPCTriggerSystem._instance = null;
        return NPCTriggerSystem;
    }());
    var TriggerWrapper = /** @class */ (function () {
        function TriggerWrapper(entity) {
            this.wasEnabled = true;
            this._uuid = '';
            this._collidingWith = {};
            this._isDebug = false;
            this._debugEntity = null;
            this._entity = entity;
            if (entity) {
                this._trigger = entity.getComponent(NPCTriggerComponent);
                this._uuid = entity.uuid;
                this._isDebug = this._trigger.debugEnabled;
                if (this._isDebug) {
                    this.addDebugEntity();
                }
            }
        }
        Object.defineProperty(TriggerWrapper.prototype, "entity", {
            get: function () {
                return this._entity;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TriggerWrapper.prototype, "trigger", {
            get: function () {
                return this._trigger;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TriggerWrapper.prototype, "uuid", {
            get: function () {
                return this._uuid;
            },
            enumerable: false,
            configurable: true
        });
        TriggerWrapper.prototype.getGlobalPosition = function () {
            if (this._entity)
                return TriggerWrapper.getEntityWorldPosition(this._entity);
            return Vector3.Zero();
        };
        TriggerWrapper.prototype.getShape = function () {
            return this._trigger.shape;
        };
        TriggerWrapper.prototype.isInEngine = function () {
            return this._entity != null && this._entity.isAddedToEngine();
        };
        TriggerWrapper.prototype.getActiveCollisions = function () {
            var ret = [];
            for (var key in this._collidingWith) {
                if (this._collidingWith.hasOwnProperty(key)) {
                    ret.push(this._collidingWith[key]);
                }
            }
            return ret;
        };
        TriggerWrapper.prototype.hasActiveCollision = function (other) {
            return this._collidingWith[other.uuid] != undefined && this._collidingWith[other.uuid] != null;
        };
        TriggerWrapper.prototype.disengageActiveCollision = function (other) {
            delete this._collidingWith[other.uuid];
        };
        TriggerWrapper.prototype.engageCollision = function (other) {
            this._collidingWith[other.uuid] = other;
        };
        TriggerWrapper.prototype.isDebugging = function () {
            return this._isDebug;
        };
        TriggerWrapper.prototype.addDebugEntity = function () {
            if (!TriggerWrapper._debugMaterial) {
                TriggerWrapper._debugMaterial = new Material();
                TriggerWrapper._debugMaterial.alphaTest = 0.5;
            }
            if (this._debugEntity == null) {
                this._debugEntity = new Entity();
                var transform = new Transform();
                this._debugEntity.addComponent(transform);
                this._debugEntity.addComponent(TriggerWrapper._debugMaterial);
                if (this.getShape() instanceof TriggerBoxShape) {
                    var shape = new BoxShape();
                    shape.withCollisions = false;
                    this._debugEntity.addComponent(shape);
                    transform.scale = this.getShape().size;
                }
                if (this.getShape() instanceof TriggerSphereShape) {
                    var shape = new SphereShape();
                    shape.withCollisions = false;
                    this._debugEntity.addComponent(shape);
                    var rad = this.getShape().radius;
                    transform.scale = new Vector3(rad, rad, rad);
                }
            }
            engine.addEntity(this._debugEntity);
        };
        TriggerWrapper.prototype.removeDebugEntity = function () {
            if (this._debugEntity != null)
                engine.removeEntity(this._debugEntity);
        };
        TriggerWrapper.prototype.updateDebugEntity = function () {
            if (this._debugEntity) {
                this._debugEntity.getComponent(Transform).position = this.getGlobalPosition().add(this.getShape().position);
            }
        };
        TriggerWrapper.getEntityWorldPosition = function (entity) {
            var entityPosition = entity.hasComponent(Transform)
                ? entity.getComponent(Transform).position.clone()
                : Vector3.Zero();
            var parentEntity = entity.getParent();
            if (parentEntity != null) {
                var parentRotation = parentEntity.hasComponent(Transform)
                    ? parentEntity.getComponent(Transform).rotation
                    : Quaternion.Identity;
                return this.getEntityWorldPosition(parentEntity).add(entityPosition.rotate(parentRotation));
            }
            return entityPosition;
        };
        TriggerWrapper._debugMaterial = null;
        return TriggerWrapper;
    }());
    var CameraTrigger = /** @class */ (function (_super) {
        __extends(CameraTrigger, _super);
        function CameraTrigger(shape) {
            var _this = _super.call(this) || this;
            _this._shape = shape;
            _this._uuid = 'cameraTrigger';
            return _this;
        }
        CameraTrigger.prototype.getGlobalPosition = function () {
            return Camera.instance.position;
        };
        CameraTrigger.prototype.getShape = function () {
            return this._shape;
        };
        CameraTrigger.prototype.setShape = function (shape) {
            this._shape = shape;
        };
        CameraTrigger.prototype.isInEngine = function () {
            return false;
        };
        CameraTrigger.prototype.hasActiveCollision = function (other) {
            return false;
        };
        CameraTrigger.prototype.disengageActiveCollision = function (other) { };
        CameraTrigger.prototype.engageCollision = function (other) { };
        CameraTrigger.prototype.isDebugging = function () {
            return false;
        };
        return CameraTrigger;
    }(TriggerWrapper));
    var NPCTriggerComponent = /** @class */ (function () {
        /**
         *
         * @param {TriggerBoxShape | TriggerSphereShape} shape shape of the triggering collider area
         * @param {TriggerData} data Object of type TriggerData, including the following optional fields: onCameraEnter, onCameraExit, onTriggerEnter, onTriggerExit, layer, triggeredByLayer, enableDebug
         */
        function NPCTriggerComponent(shape, data) {
            /**
             * is trigger enable?
             */
            this.enabled = true;
            /**
             * bit layer of the Tigger (usefull to discriminate between trigger events)
             */
            this.layer = 0;
            /**
             * against which layer are we going to check trigger's collisions
             */
            this.triggeredByLayer = 0;
            NPCTriggerSystem.createAndAddToEngine();
            this.shape = shape;
            this.layer = data && data.layer ? data.layer : 0;
            this.triggeredByLayer = data && data.triggeredByLayer ? data.triggeredByLayer : 0;
            this.onTriggerEnter = data && data.onTriggerEnter ? data.onTriggerEnter : undefined;
            this.onTriggerExit = data && data.onTriggerExit ? data.onTriggerExit : undefined;
            this.onCameraEnter = data && data.onCameraEnter ? data.onCameraEnter : undefined;
            this.onCameraExit = data && data.onCameraExit ? data.onCameraExit : undefined;
            this._debugEnabled = data && data.enableDebug ? data.enableDebug : false;
        }
        Object.defineProperty(NPCTriggerComponent.prototype, "debugEnabled", {
            /**
             * get if debug is enabled
             */
            get: function () {
                return this._debugEnabled;
            },
            enumerable: false,
            configurable: true
        });
        NPCTriggerComponent = __decorate([
            Component('npcTriggerComponent'),
            __metadata("design:paramtypes", [Object, Object])
        ], NPCTriggerComponent);
        return NPCTriggerComponent;
    }());
    var TriggerBoxShape = /** @class */ (function () {
        function TriggerBoxShape(size, position) {
            this.size = size;
            this.position = position;
        }
        return TriggerBoxShape;
    }());
    var TriggerSphereShape = /** @class */ (function () {
        function TriggerSphereShape(radius, position) {
            this.radius = radius;
            this.position = position;
        }
        return TriggerSphereShape;
    }());

    var NPCLerpData = /** @class */ (function () {
        function NPCLerpData(path, type) {
            if (type === void 0) { type = exports.NPCLerpType.SMOOTH_PATH; }
            this.origin = 0;
            this.target = 1;
            this.fraction = 0;
            this.totalDuration = 0;
            this.speed = [];
            this.loop = false;
            this.type = exports.NPCLerpType.SMOOTH_PATH; //default
            this.path = path;
            if (type !== undefined)
                this.type = type;
            NPCWalkSystem.createAndAddToEngine();
        }
        NPCLerpData.prototype.setIndex = function (index) {
            this.fraction = 0;
            this.origin = index;
            this.target = index + 1 < this.path.length ? index + 1 : 0;
        };
        NPCLerpData = __decorate([
            Component('npclerpData'),
            __metadata("design:paramtypes", [Array, String])
        ], NPCLerpData);
        return NPCLerpData;
    }());
    var walkingNPCGroup = engine.getComponentGroup(NPCLerpData);
    var NPCWalkSystem = /** @class */ (function () {
        function NPCWalkSystem() {
            NPCWalkSystem._instance = this;
        }
        NPCWalkSystem.prototype.update = function (dt) {
            var e_1, _a;
            try {
                for (var _b = __values(walkingNPCGroup.entities), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var npcE = _c.value;
                    var npc = npcE;
                    //try{
                    if (npc.state == exports.NPCState.FOLLOWPATH) {
                        var transform = npc.getComponent(Transform);
                        var path = npc.getComponent(NPCLerpData);
                        if (path.type !== undefined && path.type == exports.NPCLerpType.RIGID_PATH) {
                            //stop exactly at each point
                            if (path.fraction < 1) {
                                path.fraction += dt * path.speed[path.origin];
                                //if fraction goes over 1 push it back to 1?
                                transform.position = Vector3.Lerp(path.path[path.origin], path.path[path.target], path.fraction);
                            }
                            else {
                                path.origin = path.target;
                                path.target += 1;
                                if (path.target >= path.path.length) {
                                    if (path.loop) {
                                        path.target = 0;
                                    }
                                    else {
                                        npc.stopWalking();
                                        if (path.onFinishCallback) {
                                            path.onFinishCallback();
                                        }
                                        path.fraction = 1;
                                        return;
                                    }
                                }
                                else if (path.onReachedPointCallback) {
                                    path.onReachedPointCallback();
                                }
                                path.fraction = 0; //starts on this point
                                transform.lookAt(path.path[path.target]);
                            }
                        }
                        else {
                            //default follow, smooth but with low FPS could cut corners
                            //always increment fraction
                            path.fraction += dt * path.speed[path.origin];
                            if (path.fraction >= 1) {
                                path.origin = path.target;
                                var tartInc = Math.max(1, Math.floor(path.fraction));
                                path.target += tartInc;
                                if (path.target >= path.path.length) {
                                    if (path.loop) {
                                        path.target = 0;
                                    }
                                    else {
                                        //path.target = path.path.length - 1
                                        npc.stopWalking();
                                        if (path.onFinishCallback) {
                                            path.onFinishCallback();
                                        }
                                        path.fraction = 1;
                                        return;
                                    }
                                }
                                else if (path.onReachedPointCallback) {
                                    path.onReachedPointCallback();
                                }
                                path.fraction -= tartInc;
                                //TODO consider lerping look at
                                if (path.target < path.path.length) {
                                    transform.lookAt(path.path[path.target]);
                                }
                            }
                        }
                        //if reached target
                        if (path.target < path.path.length) {
                            transform.position = Vector3.Lerp(path.path[path.origin], path.path[path.target], path.fraction);
                        }
                    }
                    /*}catch(e){
                      debugger
                      log("npc.utils.NPCWalkSystem throw error",e)
                    }*/
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        NPCWalkSystem.createAndAddToEngine = function () {
            if (this._instance == null) {
                this._instance = new NPCWalkSystem();
                engine.addSystem(this._instance);
            }
            return this._instance;
        };
        NPCWalkSystem._instance = null;
        return NPCWalkSystem;
    }());

    var textSize$1 = 1;
    var textYPos$1 = 0;
    var maxLengthShortBubble = 8;
    var maxLengthNormalBubble = 25;
    var maxLengthLongBubble = 50;
    var maxLengthHugeBubble = 100;
    var shortBubbleXOffset = -0.1;
    var normalBubbleXOffset = -0.5;
    var longBubbleXOffset = -0.8;
    var hugeBubbleXOffset = -0.8;
    var shortBubbleYOffset = -0.2;
    var normalBubbleYOffset = -0.2;
    var longBubbleYOffset = 0;
    var hugeBubbleYOffset = 0.2;
    var shortBubbleTextWidth = 0.7;
    var normalBubbleTextWidth = 1.5;
    var longBubbleTextWidth = 2;
    var hugeBubbleTextWidth = 2;
    var shortBubbleX = 116 * 0.005;
    var shortBubbleY = 84 * 0.005;
    var normalBubbleX = 286 * 0.005;
    var normalBubbleY = 84 * 0.005;
    var longBubbleX = 497 * 0.005;
    var longBubbleY = 153 * 0.005;
    var hugeBubbleX = 497 * 0.005;
    var hugeBubbleY = 239 * 0.005;
    var defaultYOffset = 2.5;
    /**
     * Displays an in-world panel as a speech bubble, with text from an array of Dialog objects.
     *
     * @param parent Entity to set as parent. The Bubble will inherit the position, rotation and scale of the parent.
     * @param height Height in meters to float the bubble above the parent's position.
     * @param sound Path to a sound file to play once for every dialog window shown.
     *
     */
    var DialogBubble = /** @class */ (function () {
        // ClickAction: null | (() => false | Subscription[]) = null
        function DialogBubble(parent, height, sound) {
            this.NPCScript = [];
            this.isBubleOpen = false;
            this.activeTextId = 0;
            this.defaultSound = null;
            this.baseYOffset = defaultYOffset;
            this.baseYOffset = height ? height : defaultYOffset;
            // Root
            this.rootEntity = new Entity();
            this.rootEntity.addComponent(new Billboard(false, true, false));
            this.rootEntity.addComponent(new Transform());
            this.rootEntity.setParent(parent);
            // Container
            this.container = new Entity();
            //this.container.addComponent(new Billboard(false, true, false))
            this.container.addComponent(new Transform({
                position: new Vector3(shortBubbleXOffset, this.baseYOffset, 0),
            }));
            this.container.setParent(this.rootEntity);
            // Material
            this.material = new BasicMaterial();
            this.material.texture = bubblesTexture;
            // Background Panel
            this.panel = new Entity();
            this.panel.addComponent(new Transform({
                scale: new Vector3(2, 1, 1),
            }));
            this.panel.setParent(this.container);
            this.panel.addComponent(new PlaneShape());
            this.panel.addComponent(this.material);
            this.panel.getComponent(PlaneShape).visible = false;
            setUVSection(this.panel.getComponent(PlaneShape), resources.bubbles.normal, 1024, 1024);
            // Dialog Text
            this.text = new Entity();
            this.text.addComponent(new Transform({
                position: new Vector3(0, textYPos$1, 0.05),
                rotation: Quaternion.Euler(0, 180, 0),
            }));
            this.text.addComponent(new TextShape(''));
            this.text.setParent(this.container);
            this.text.getComponent(TextShape).textWrapping = true;
            this.text.getComponent(TextShape).font = SFHeavyFont;
            this.text.getComponent(TextShape).hTextAlign = 'center';
            this.text.getComponent(TextShape).vTextAlign = 'center';
            this.text.getComponent(TextShape).fontSize = textSize$1;
            //this.text.getComponent(TextShape).fontWeight = 'normal'
            this.text.getComponent(TextShape).color = Color3.Black();
            this.text.getComponent(TextShape).visible = false;
            this.soundEnt = new Entity();
            if (sound) {
                this.soundEnt.addComponent(new Transform());
                engine.addEntity(this.soundEnt);
                this.soundEnt.setParent(this.container);
                this.soundEnt.addComponent(new AudioSource(new AudioClip(sound)));
                this.soundEnt.getComponent(AudioSource).volume = 0.5;
                this.defaultSound = sound;
            }
            WorldDialogTypeInSystem.createAndAddToEngine();
        }
        /**
         * Opens a dialog bubble to start a conversation.
         * @param {Dialog[]} NPCScript  Instructions to follow during the conversation
         * @param {number|string} textId Where to start in the script. Can refer to an index in the array or the `name` field of a Dialog entry.
         */
        DialogBubble.prototype.openDialogWindow = function (NPCScript, textId) {
            this.NPCScript = NPCScript;
            if (!textId) {
                this.activeTextId = 0;
            }
            else if (typeof textId === 'number') {
                this.activeTextId = textId;
            }
            else {
                this.activeTextId = findDialogByName$1(NPCScript, textId);
            }
            var currentText = NPCScript[this.activeTextId]
                ? NPCScript[this.activeTextId]
                : { text: '' };
            if (currentText.audio) {
                this.soundEnt.addComponentOrReplace(new AudioSource(new AudioClip(currentText.audio)));
                this.soundEnt.getComponent(AudioSource).volume = 0.5;
                this.soundEnt.getComponent(AudioSource).playOnce();
            }
            else if (this.defaultSound) {
                this.soundEnt.addComponentOrReplace(new AudioSource(new AudioClip(this.defaultSound)));
                this.soundEnt.getComponent(AudioSource).playOnce();
            }
            // Set text
            this.text.getComponent(TextShape).fontSize = currentText.fontSize
                ? currentText.fontSize
                : textSize$1;
            this.text.getComponent(Transform).position.y = currentText.offsetY
                ? currentText.offsetY + textYPos$1
                : textYPos$1;
            this.text.getComponent(Transform).position.x = currentText.offsetX
                ? currentText.offsetX
                : 0;
            this.text.getComponent(TextShape).visible = true;
            this.panel.getComponent(PlaneShape).visible = true;
            this.text.getComponent(TextShape).value = '';
            if (currentText.text.length < maxLengthHugeBubble) {
                currentText.text.slice(0, maxLengthHugeBubble);
            }
            WorldDialogTypeInSystem._instance.newText(this, currentText.text, this.activeTextId, currentText.timeOn ? currentText.timeOn : undefined, currentText.typeSpeed ? currentText.typeSpeed : undefined);
            this.adjustBubble(currentText.text.length);
            // Global button events
            //   if (!this.ClickAction) {
            // 	this.ClickAction = Input.instance.subscribe(
            // 	  'BUTTON_DOWN',
            // 	  ActionButton.POINTER,
            // 	  false,
            // 	  (e) => {
            // 		if (!this.isDialogOpen || +Date.now() - this.UIOpenTime < 100) return
            // 		if (!DialogTypeInSystem._instance!.done) {
            // 		  DialogTypeInSystem._instance!.rush()
            // 		  return
            // 		} else if (!this.isQuestionPanel && !this.isFixedScreen) {
            // 		  this.confirmText(ConfirmMode.Next)
            // 		}
            // 	  }
            // 	)
            // }
            this.layoutDialogWindow(this.activeTextId);
            this.isBubleOpen = true;
        };
        DialogBubble.prototype.adjustBubble = function (textLength) {
            if (textLength < maxLengthShortBubble) {
                setUVSection(this.panel.getComponent(PlaneShape), resources.bubbles.short, 1024, 1024);
                this.panel.getComponent(Transform).scale.x = shortBubbleX;
                this.panel.getComponent(Transform).scale.y = shortBubbleY;
                this.container.getComponent(Transform).position.x = shortBubbleXOffset;
                this.container.getComponent(Transform).position.y =
                    this.baseYOffset + shortBubbleYOffset;
                this.text.getComponent(TextShape).width = shortBubbleTextWidth;
            }
            else if (textLength < maxLengthNormalBubble) {
                setUVSection(this.panel.getComponent(PlaneShape), resources.bubbles.normal, 1024, 1024);
                this.panel.getComponent(Transform).scale.x = normalBubbleX;
                this.panel.getComponent(Transform).scale.y = normalBubbleY;
                this.container.getComponent(Transform).position.x = normalBubbleXOffset;
                this.container.getComponent(Transform).position.y =
                    this.baseYOffset + normalBubbleYOffset;
                this.text.getComponent(TextShape).width = normalBubbleTextWidth;
            }
            else if (textLength < maxLengthLongBubble) {
                setUVSection(this.panel.getComponent(PlaneShape), resources.bubbles.long, 1024, 1024);
                this.panel.getComponent(Transform).scale.x = longBubbleX;
                this.panel.getComponent(Transform).scale.y = longBubbleY;
                this.container.getComponent(Transform).position.y =
                    this.baseYOffset + longBubbleYOffset;
                this.container.getComponent(Transform).position.x = longBubbleXOffset;
                this.text.getComponent(TextShape).width = longBubbleTextWidth;
            }
            else {
                setUVSection(this.panel.getComponent(PlaneShape), resources.bubbles.huge, 1024, 1024);
                this.panel.getComponent(Transform).scale.x = hugeBubbleX;
                this.panel.getComponent(Transform).scale.y = hugeBubbleY;
                this.container.getComponent(Transform).position.y =
                    this.baseYOffset + hugeBubbleYOffset;
                this.container.getComponent(Transform).position.x = hugeBubbleXOffset;
                this.text.getComponent(TextShape).width = hugeBubbleTextWidth;
            }
        };
        // Progresses text
        DialogBubble.prototype.next = function () {
            var currentText = this.NPCScript[this.activeTextId];
            if (!currentText) {
                currentText = this.NPCScript[this.activeTextId - 1];
            }
            if (currentText.triggeredByNext) {
                currentText.triggeredByNext();
            }
            if (currentText.isEndOfDialog) {
                this.closeDialogWindow();
                return;
            }
            // Update active text
            this.activeTextId++;
            // Update active text with new active text
            currentText = this.NPCScript[this.activeTextId];
            if (currentText.text.length < maxLengthHugeBubble) {
                currentText.text.slice(0, maxLengthHugeBubble);
            }
            this.text.getComponent(TextShape).value = '';
            this.adjustBubble(currentText.text.length);
            WorldDialogTypeInSystem._instance.newText(this, currentText.text, this.activeTextId, currentText.timeOn ? currentText.timeOn : undefined, currentText.typeSpeed ? currentText.typeSpeed : undefined);
            this.layoutDialogWindow(this.activeTextId);
        };
        // Adds the buttons or mouse icon depending on the type of window
        DialogBubble.prototype.layoutDialogWindow = function (textId) {
            var currentText = this.NPCScript[textId]
                ? this.NPCScript[textId]
                : { text: '' };
            // Update text
            var textY = currentText.offsetY ? currentText.offsetY + textYPos$1 : textYPos$1;
            if (currentText.buttons && currentText.buttons.length >= 3) {
                textY += 50;
            }
            else if (currentText.buttons && currentText.buttons.length >= 1) {
                textY += 24;
            }
            this.text.getComponent(TextShape).fontSize = currentText.fontSize
                ? currentText.fontSize
                : textSize$1;
            this.text.getComponent(TextShape).visible = true;
            this.text.getComponent(Transform).position.y = textY;
            if (currentText.audio) {
                this.soundEnt.addComponentOrReplace(new AudioSource(new AudioClip(currentText.audio)));
                this.soundEnt.getComponent(AudioSource).volume = 0.5;
                this.soundEnt.getComponent(AudioSource).playOnce();
            }
            else if (this.defaultSound) {
                this.soundEnt.addComponentOrReplace(new AudioSource(new AudioClip(this.defaultSound)));
                this.soundEnt.getComponent(AudioSource).playOnce();
            }
        };
        /**
         * Closes the dialog bubble, executing associated triggeredByNext functions.
         */
        DialogBubble.prototype.closeDialogWindow = function () {
            if (this.isBubleOpen) {
                this.isBubleOpen = false;
                this.text.getComponent(TextShape).value = '';
                this.text.getComponent(TextShape).visible = false;
                this.panel.getComponent(PlaneShape).visible = false;
            }
        };
        /**
        * Closes the dialog bubble, and stops executed any associated triggeredByNext actions.
        */
        DialogBubble.prototype.closeDialogEndAll = function () {
            if (this.isBubleOpen) {
                if (WorldDialogTypeInSystem._instance.Dialog == this) {
                    WorldDialogTypeInSystem._instance.done = true;
                    WorldDialogTypeInSystem._instance.Dialog = null;
                }
                this.isBubleOpen = false;
                this.text.getComponent(TextShape).value = '';
                this.text.getComponent(TextShape).visible = false;
                this.panel.getComponent(PlaneShape).visible = false;
            }
        };
        DialogBubble.prototype.skipDialogs = function () {
            if (!this.isBubleOpen)
                return;
            while (this.NPCScript[this.activeTextId]) {
                if (this.NPCScript[this.activeTextId].triggeredByNext) {
                    this.NPCScript[this.activeTextId].triggeredByNext();
                }
                if (this.NPCScript[this.activeTextId].isEndOfDialog) {
                    this.closeDialogWindow();
                    return;
                }
                this.activeTextId += 1;
            }
        };
        return DialogBubble;
    }());
    var DEFAULT_SPEED$1 = 45;
    var DEFAULT_TIME_ON = 3;
    var WorldDialogTypeInSystem = /** @class */ (function () {
        function WorldDialogTypeInSystem() {
            this.timer = 0;
            this.speed = DEFAULT_SPEED$1;
            this.visibleChars = 0;
            this.fullText = '';
            this.Text = null;
            this.textId = 0;
            this.done = true;
            this.showing = false;
            this.timeOn = DEFAULT_TIME_ON;
            WorldDialogTypeInSystem._instance = this;
        }
        WorldDialogTypeInSystem.createAndAddToEngine = function () {
            if (this._instance == null) {
                this._instance = new WorldDialogTypeInSystem();
                engine.addSystem(this._instance);
            }
            return this._instance;
        };
        WorldDialogTypeInSystem.prototype.update = function (dt) {
            if (this.done)
                return;
            this.timer += dt;
            if (this.showing) {
                if (this.timer > this.timeOn) {
                    this.showing = false;
                    this.done = true;
                    this.timer = 0;
                    this.window.next();
                }
            }
            else if (this.timer >= 2 / this.speed) {
                var charsToAdd = Math.floor(this.timer / (1 / this.speed));
                this.timer = 0;
                this.visibleChars += charsToAdd;
                // support <> tags
                this.closeTag(charsToAdd);
                if (this.visibleChars >= this.fullText.length) {
                    this.showing = true;
                    this.timer = 0;
                    this.visibleChars = this.fullText.length;
                }
                if (this.Text) {
                    this.Text.value = this.fullText.substr(0, this.visibleChars);
                }
            }
        };
        WorldDialogTypeInSystem.prototype.newText = function (dialog, text, textId, timeOn, speed) {
            // prevent circular loops
            if (dialog == this.Dialog && textId == this.textId) {
                return;
            }
            var oldDialog = this.Dialog;
            this.Dialog = dialog;
            this.Text = this.Dialog.text.getComponent(TextShape);
            this.textId = textId;
            if (oldDialog && dialog != oldDialog) {
                oldDialog.skipDialogs();
            }
            this.timer = 0;
            this.done = false;
            this.showing = false;
            this.fullText = text;
            this.visibleChars = 0;
            this.window = dialog;
            if (speed && speed <= 0) {
                this.rush();
            }
            else if (speed) {
                this.speed = speed;
            }
            else {
                this.speed = DEFAULT_SPEED$1;
            }
            if (timeOn) {
                this.timeOn = timeOn;
            }
            else {
                this.timeOn = DEFAULT_TIME_ON;
            }
            // Buttons & action icons
            //dialog.layoutDialogWindow(textId)
        };
        WorldDialogTypeInSystem.prototype.rush = function () {
            this.showing = true;
            this.timer = 0;
            this.visibleChars = this.fullText.length;
            if (this.Text) {
                this.Text.value = this.fullText;
            }
        };
        WorldDialogTypeInSystem.prototype.closeTag = function (newChars) {
            if (this.visibleChars == 0 || newChars == 0)
                return;
            var openTag = false;
            var closeTag = false;
            for (var i = this.visibleChars - newChars; i < this.visibleChars; i++) {
                if (!openTag) {
                    if (this.fullText.substr(i, 1) == '<') {
                        openTag = true;
                    }
                }
                else {
                    if (this.fullText.substr(i, 1) == '>') {
                        closeTag = true;
                    }
                }
            }
            if (!openTag || closeTag) {
                return;
            }
            while (this.visibleChars < this.fullText.length && this.fullText.substr(this.visibleChars - 1, 1) != '>') {
                this.visibleChars += 1;
            }
            return;
        };
        WorldDialogTypeInSystem._instance = null;
        return WorldDialogTypeInSystem;
    }());
    function findDialogByName$1(dialogs, name) {
        for (var i = 0; i < dialogs.length; i++) {
            if (dialogs[i].name && dialogs[i].name == name) {
                return i;
            }
        }
        return 0;
    }

    /**
     * Creates a talking, walking and animated NPC
     *
     * @param {TranformConstructorArgs} position Transform argument object that can contain position, rotation and scale for NPC
     * @param {string} model String with path to 3D model to use for NPC
     * @param {() => void} onActivate Function to execute each time the NPC is activated. By default when clicking it or walking near, or calling the `activate()` function
     * @param {NPCData} data Object of type NPCData, containing multiple configurable parameters
     *
     */
    var NPC = /** @class */ (function (_super) {
        __extends(NPC, _super);
        /**
         * Creates a talking, walking and animated NPC
         *
         * @param {TranformConstructorArgs} position Transform argument object that can contain position, rotation and scale for NPC
         * @param {string} model String with path to 3D model to use for NPC
         * @param {() => void} onActivate Function to execute each time the NPC is activated. By default when clicking it or walking near, or calling the `activate()` function
         * @param {NPCData} data Object of type NPCData, containing multiple configurable parameters
         *
         */
        function NPC(position, model, onActivate, data) {
            var _this = _super.call(this) || this;
            _this.introduced = false;
            _this.onWalkAway = null;
            _this.inCooldown = false;
            _this.coolDownDuration = 5;
            _this.faceUser = false;
            _this.walkingAnim = null;
            _this.walkingSpeed = 2;
            _this.bubbleHeight = 2;
            _this.addComponent(new GLTFShape(model));
            _this.addComponent(new Transform(position));
            engine.addEntity(_this);
            _this.state = exports.NPCState.STANDING;
            // dialogs
            if (data && data.noUI) ;
            else if (data && data.portrait) {
                _this.dialog = new DialogWindow(typeof data.portrait === "string" ? { path: data.portrait } : data.portrait, data && data.darkUI ? data.darkUI : false, data.dialogSound ? data.dialogSound : undefined, data && data.dialogCustomTheme ? data.dialogCustomTheme : undefined);
            }
            else {
                _this.dialog = new DialogWindow(undefined, data && data.darkUI ? data.darkUI : false, data && data.dialogSound ? data.dialogSound : undefined, data && data.dialogCustomTheme ? data.dialogCustomTheme : undefined);
            }
            if (data && data.textBubble) {
                if (data && data.bubbleHeight) {
                    _this.bubbleHeight = data.bubbleHeight;
                }
                _this.bubble = new DialogBubble(_this, _this.bubbleHeight, data.dialogSound ? data.dialogSound : undefined);
            }
            // animations
            _this.addComponent(new Animator());
            _this.idleAnim = new AnimationState(data && data.idleAnim ? data.idleAnim : 'Idle', {
                looping: true,
            });
            _this.getComponent(Animator).addClip(_this.idleAnim);
            _this.lastPlayedAnim = _this.idleAnim;
            _this.idleAnim.play();
            if (data && data.walkingAnim) {
                _this.walkingAnim = new AnimationState(data.walkingAnim, {
                    looping: true,
                });
                _this.getComponent(Animator).addClip(_this.walkingAnim);
            }
            _this.onActivate = onActivate;
            if (data && data.onWalkAway) {
                _this.onWalkAway = data.onWalkAway;
            }
            _this.endAnimTimer = new Entity();
            engine.addEntity(_this.endAnimTimer);
            _this.closeDialogTimer = new Entity();
            engine.addEntity(_this.closeDialogTimer);
            _this.pauseWalkingTimer = new Entity();
            engine.addEntity(_this.pauseWalkingTimer);
            var activateButton = data && data.onlyClickTrigger ? ActionButton.POINTER : ActionButton.PRIMARY;
            // Reaction when clicked
            _this.addComponent(new OnPointerDown(function (e) {
                if (_this.inCooldown || (_this.dialog && _this.dialog.isDialogOpen))
                    return;
                _this.activate();
            }, {
                button: activateButton,
                hoverText: data && data.hoverText ? data.hoverText : 'Talk',
                showFeedback: data && data.onlyExternalTrigger ? false : true,
            }));
            if (data && data.onlyExternalTrigger) {
                _this.removeComponent(OnPointerDown);
            }
            // Trigger
            var triggerData = {};
            // when exiting trigger
            if (!data || (data && !data.continueOnWalkAway)) {
                triggerData.onCameraExit = function () {
                    _this.handleWalkAway();
                };
            }
            // when entering trigger
            if (!data ||
                (data && !data.onlyExternalTrigger && !data.onlyClickTrigger && !data.onlyETrigger)) {
                triggerData.onCameraEnter = function () {
                    if (_this.inCooldown) {
                        log(_this.name, ' in cooldown');
                        return;
                    }
                    else if ((_this.dialog && _this.dialog.isDialogOpen) ||
                        (data && data.onlyExternalTrigger) ||
                        (data && data.onlyClickTrigger)) {
                        return;
                    }
                    _this.activate();
                };
            }
            // add trigger
            if (triggerData.onCameraEnter || triggerData.onCameraExit) {
                _this.addComponent(new NPCTriggerComponent(new TriggerSphereShape(data && data.reactDistance ? data.reactDistance : 6, Vector3.Zero()), triggerData));
            }
            if (data && data.faceUser) {
                _this.addComponent(new TrackUserFlag(true, data.turningSpeed ? data.turningSpeed : undefined));
                _this.faceUser = true;
            }
            if (data && data.walkingSpeed) {
                _this.walkingSpeed = data.walkingSpeed;
            }
            if (data && data.coolDownDuration) {
                _this.coolDownDuration = data.coolDownDuration;
            }
            if (data && data.path) {
                _this.addComponent(new NPCLerpData(data.path ? data.path : [], data.pathLerpType));
                _this.getComponent(NPCLerpData).loop = true;
                _this.followPath();
            }
            return _this;
        }
        /**
         * Calls the NPC's activation function (set on NPC definition). If NPC has `faceUser` = true, it will rotate to face the player. It starts a cooldown counter to avoid reactivating.
         */
        NPC.prototype.activate = function () {
            var _this = this;
            if (this.faceUser) {
                this.getComponent(TrackUserFlag).active = true;
            }
            this.inCooldown = true;
            this.addComponentOrReplace(new NPCDelay(this.coolDownDuration, function () {
                _this.inCooldown = false;
            }));
            this.onActivate();
        };
        /**
         * Closes dialog UI and makes NPC stop turning to face player
         */
        NPC.prototype.endInteraction = function () {
            if (this.faceUser) {
                this.getComponent(TrackUserFlag).active = false;
            }
            if (this.dialog && this.dialog.isDialogOpen) {
                this.dialog.closeDialogWindow();
            }
            if (this.bubble && this.bubble.isBubleOpen) {
                this.bubble.closeDialogWindow();
            }
            this.state = exports.NPCState.STANDING;
        };
        /**
         * Ends interaction and calls the onWalkAway function
         */
        NPC.prototype.handleWalkAway = function () {
            if (this.state == exports.NPCState.FOLLOWPATH) {
                //|| this.state == NPCState.FOLLOWPLAYER
                return;
            }
            this.endInteraction();
            if (this.onWalkAway) {
                this.onWalkAway();
            }
        };
        /**
         * Starts a conversation, using the Dialog UI
         * @param {Dialog[]} script Instructions to follow during the conversation
         * @param {number|string} startIndex Where to start in the script. Can refer to an index in the array or the `name` field of a Dialog entry.
         * @param {number} duration In seconds. If set, the UI will close after the set time
         *
         */
        NPC.prototype.talk = function (script, startIndex, duration) {
            var _this = this;
            this.introduced = true;
            this.state = exports.NPCState.TALKING;
            if (this.closeDialogTimer.hasComponent(NPCDelay)) {
                this.closeDialogTimer.removeComponent(NPCDelay);
            }
            if (this.bubble && this.bubble.isBubleOpen) {
                this.bubble.closeDialogWindow();
            }
            this.dialog.openDialogWindow(script, startIndex ? startIndex : 0);
            if (duration) {
                this.closeDialogTimer.addComponentOrReplace(new NPCDelay(duration, function () {
                    _this.dialog.closeDialogWindow();
                }));
            }
        };
        /**
         * Starts a conversation, using the Dialog UI
         * @param {Dialog[]} script Instructions to follow during the conversation
         * @param {number|string} startIndex Where to start in the script. Can refer to an index in the array or the `name` field of a Dialog entry.
         *
         */
        NPC.prototype.talkBubble = function (script, startIndex) {
            // this.introduced = true
            // this.state = NPCState.TALKING
            // if (this.closeDialogTimer.hasComponent(NPCDelay)) {
            //   this.closeDialogTimer.removeComponent(NPCDelay)
            // }
            if (!this.bubble) {
                this.bubble = new DialogBubble(this, this.bubbleHeight);
            }
            this.bubble.openDialogWindow(script, startIndex ? startIndex : 0);
        };
        /**
         * The NPC model plays an animation
         * @param {string} animationName Name of the animation to play, as stored in the model
         * @param {boolean} noLoop If true, animation plays only once. You must also provide a duration
         * @param {number} duration In seconds. After the duration is over, the NPC will return to the default animation.
         *
         */
        NPC.prototype.playAnimation = function (animationName, noLoop, duration) {
            var _this = this;
            // this.lastPlayedAnim.stop()
            if (this.endAnimTimer.hasComponent(NPCDelay)) {
                this.endAnimTimer.removeComponent(NPCDelay);
            }
            var newAnim = this.getComponent(Animator).getClip(animationName);
            //log('playing anim : ', animationName)
            if (noLoop) {
                newAnim.looping = false;
                if (duration) {
                    this.endAnimTimer.addComponentOrReplace(new NPCDelay(duration, function () {
                        newAnim.stop();
                        if (_this.idleAnim) {
                            _this.idleAnim.play();
                            _this.lastPlayedAnim = _this.idleAnim;
                        }
                    }));
                }
            }
            newAnim.play();
            this.lastPlayedAnim = newAnim;
        };
        /**
         * Change the idle animation on the NPC.
         * @param {animation} string Name of the new animation to set as idle.
         * @param {play} boolean If true, start playing this new idle animation.
         */
        NPC.prototype.changeIdleAnim = function (animation, play) {
            // this.idleAnim.stop()
            this.idleAnim = new AnimationState(animation, { looping: true });
            this.getComponent(Animator).addClip(this.idleAnim);
            if (play) {
                // this.lastPlayedAnim.stop()
                this.idleAnim.play();
                this.lastPlayedAnim = this.idleAnim;
            }
        };
        /**
         * Instruct the NPC to walk following a path. If no data is provided, the NPC uses data from the last time `followPath` was called, or its definition.
         * @param {FollowPathData} data Object with data to describe a path that an NPC can walk.
         */
        NPC.prototype.followPath = function (data) {
            if (!this.hasComponent(NPCLerpData)) {
                if (!data) {
                    return;
                }
                this.addComponent(new NPCLerpData(data.path ? data.path : [], data.pathLerpType));
            }
            if (this.faceUser) {
                this.getComponent(TrackUserFlag).active = false;
            }
            var lerp = this.getComponent(NPCLerpData);
            if (data) {
                if (data.path) {
                    if (data.curve) {
                        var curvedPath = Curve3.CreateCatmullRomSpline(data.path, data.path.length * 4, data.loop ? true : false).getPoints();
                        if (data.loop) {
                            curvedPath.pop();
                        }
                        lerp.path = curvedPath;
                    }
                    else {
                        lerp.path = data.path;
                    }
                }
                if (data.loop != null) {
                    lerp.loop = data.loop;
                }
                if (data.startingPoint != null) {
                    lerp.setIndex(data.startingPoint);
                }
                if (data.onFinishCallback) {
                    lerp.onFinishCallback = data.onFinishCallback;
                }
                if (data.onReachedPointCallback) {
                    lerp.onReachedPointCallback = data.onReachedPointCallback;
                }
            }
            // add current location to start of path
            var currentTransform = this.getComponent(Transform);
            var currentPos = currentTransform.position;
            var lerpOriginPath = lerp.path[lerp.origin];
            if (lerpOriginPath === undefined) {
                log("WARNING npc.utils lerpOriginPath is null", lerpOriginPath, lerp.origin, lerp.target, lerp.path);
            }
            if ((lerp.fraction == 0 && lerpOriginPath.subtract(currentPos).lengthSquared() > 0.1) ||
                (lerp.fraction > 0 &&
                    currentPos.subtract(lerpOriginPath).normalize() ==
                        lerp.path[lerp.target].subtract(lerpOriginPath).normalize())) {
                lerp.path.splice(lerp.origin, 0, currentPos);
                lerp.fraction = 0;
            }
            if (lerp.path[lerp.target] === undefined) {
                log("npc.utils lerp.path[lerp.target] is null", lerpOriginPath, lerp.origin, lerp.target, lerp.path);
            }
            currentTransform.lookAt(lerp.path[lerp.target]);
            // speed of sections
            var totalDist = 0;
            var pointsDist = [];
            for (var i = 0; i < lerp.path.length - 1; i++) {
                var sqDist = Vector3.Distance(lerp.path[i], lerp.path[i + 1]);
                totalDist += sqDist;
                pointsDist.push(sqDist);
            }
            // measure return to start
            if (lerp.loop) {
                var sqDist = Vector3.Distance(lerp.path[lerp.path.length - 1], lerp.path[0]);
                totalDist += sqDist;
                pointsDist.push(sqDist);
            }
            if (data && data.totalDuration) {
                lerp.totalDuration = data.totalDuration;
            }
            else if (data && data.speed) {
                lerp.totalDuration = totalDist / data.speed;
            }
            else if (!lerp.totalDuration) {
                lerp.totalDuration = totalDist / this.walkingSpeed;
            }
            lerp.speed = [];
            for (var i = 0; i < pointsDist.length; i++) {
                lerp.speed.push(1 / ((pointsDist[i] / totalDist) * lerp.totalDuration));
            }
            if (this.walkingAnim) {
                if (this.endAnimTimer.hasComponent(NPCDelay)) {
                    this.endAnimTimer.removeComponent(NPCDelay);
                }
                //   this.idleAnim.stop()
                //   this.lastPlayedAnim.stop()
                this.walkingAnim.play();
                this.lastPlayedAnim = this.walkingAnim;
            }
            this.state = exports.NPCState.FOLLOWPATH;
        };
        /**
         * Stops the NPC's walking. If a default animation exists, it will play it.
         * @param {number} duration In seconds. If a duration is provided, the NPC will return to walking after the duration is over.
         */
        NPC.prototype.stopWalking = function (duration) {
            var _this = this;
            this.state = exports.NPCState.STANDING;
            if (this.walkingAnim) {
                //   this.walkingAnim.stop()
                this.idleAnim.play();
                this.lastPlayedAnim = this.idleAnim;
            }
            if (duration) {
                this.pauseWalkingTimer.addComponentOrReplace(new NPCDelay(duration, function () {
                    if (_this.dialog && _this.dialog.isDialogOpen)
                        return;
                    _this.lastPlayedAnim.stop();
                    if (_this.walkingAnim) {
                        _this.walkingAnim.play();
                        _this.lastPlayedAnim = _this.walkingAnim;
                    }
                    if (_this.endAnimTimer.hasComponent(NPCDelay)) {
                        _this.endAnimTimer.removeComponent(NPCDelay);
                    }
                    _this.state = exports.NPCState.FOLLOWPATH;
                }));
            }
        };
        return NPC;
    }(Entity));

    exports.CustomDialogButton = CustomDialogButton;
    exports.DialogTypeInSystem = DialogTypeInSystem;
    exports.DialogWindow = DialogWindow;
    exports.NPC = NPC;
    exports.NPCDelay = NPCDelay;
    exports.NPCLerpData = NPCLerpData;
    exports.NPCTriggerComponent = NPCTriggerComponent;
    exports.SFFont = SFFont;
    exports.SFHeavyFont = SFHeavyFont;
    exports.TrackUserFlag = TrackUserFlag;
    exports.TriggerBoxShape = TriggerBoxShape;
    exports.TriggerSphereShape = TriggerSphereShape;
    exports.canvas = canvas;
    exports.darkTheme = darkTheme;
    exports.lightTheme = lightTheme;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
