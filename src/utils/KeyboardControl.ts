/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-23 15:13:19
 * @LastEditors: Hesin
 * @LastEditTime: 2024-10-23 15:50:48
 */
import { Scene, PerspectiveCamera, Vector3 } from 'three';

/*
* Events
* */
export const ON_LOAD_PROGRESS = "on-load-progress";
export const ON_LOAD_MODEL_FINISH = "on-load-model-finish";
export const ON_CLICK_RAY_CAST = "on-click-ray-cast";
export const ON_SHOW_TOOLTIP = "on-show-tooltip";
export const ON_HIDE_TOOLTIP = "on-hide-tooltip";
export const ON_KEY_DOWN = "on-key-down";
export const ON_KEY_UP = "on-key-up";
export const ON_ENTER_APP = "on-enter-app";

type Keys = "KeyW" | "KeyA" | "KeyS" | "KeyD";
type KeyStatus = { [key in Keys]: boolean };

export default class KeyboardControl {
    private scene: Scene;
    private camera: PerspectiveCamera;
    keyStatus: KeyStatus = {
        "KeyW": false,
        "KeyA": false,
        "KeyS": false,
        "KeyD": false,
    };
    isEnabled = true;

    constructor(scene: Scene, camera: PerspectiveCamera) {
        this.scene = scene;
        this.camera = camera;
        this._bindEvents();
    }

    private _bindEvents() {
        document.addEventListener("keydown", this._onKeyDown.bind(this));
        document.addEventListener("keyup", this._onKeyUp.bind(this));
    }

    private _onKeyDown(event: KeyboardEvent) {
        console.log("Key down:", event.code);
        this.keyStatus[event.code] = true;
        if (this.isAllowKey(event.code) && this.isEnabled) {
            this._moveObject();
            this.scene.dispatchEvent(new Event(ON_KEY_DOWN)); // 触发事件
        }
    }

    private _onKeyUp(event: KeyboardEvent) {
        if (this.isAllowKey(event.code) && this.isEnabled) {
            console.log("Key _onKeyUp:", event.code);
            this.keyStatus[event.code] = false;
            this.scene.dispatchEvent(new Event(ON_KEY_UP)); // 触发事件
        }
    }

    private isAllowKey(key: string): key is Keys {
        return ["KeyW", "KeyA", "KeyS", "KeyD"].includes(key as Keys);
    }

    private _moveObject() {
        if (this.isEnabled) {
            const speed = 0.2; // 定义移动速度
    
            // 向前移动（Z轴方向）
            if (this.keyStatus["KeyW"]) {
                this.camera.translateZ(-speed); // 向前移动
            }
    
            // 向后移动（负Z轴方向）
            if (this.keyStatus["KeyS"]) {
                this.camera.translateZ(speed); // 向后移动
            }
    
            // 向左移动（负X轴方向）
            if (this.keyStatus["KeyA"]) {
                this.camera.translateX(-speed); // 向左移动
            }
    
            // 向右移动（正X轴方向）
            if (this.keyStatus["KeyD"]) {
                this.camera.translateX(speed); // 向右移动
            }
    
            // 保持摄像机的Y高度不变
            this.camera.position.y = this.camera.position.y; // 保持当前Y高度不变
        }
    }

    enable() {
        this.isEnabled = true;
    }

    disable() {
        this.isEnabled = false;
    }
}