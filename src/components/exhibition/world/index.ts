/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-23 14:25:06
 * @LastEditors: Hesin
 * @LastEditTime: 2024-12-08 12:11:08
 */
import Core from "../core";
import Environment from "../environment";
import Character from "../character";
import Css3DRenderer from "../css3DRenderer";
import Audio from "../audio";
import RayCasterControls from "../rayCasterControls";
import { ON_CLICK_RAY_CAST, ON_HIDE_TOOLTIP, ON_LOAD_MODEL_FINISH, ON_LOAD_PROGRESS, ON_ENTER_APP, ON_SHOW_TOOLTIP } from "../Constants";
import { Object3D } from "three";

export default class World {
	private core: Core;
	private environment: Environment;
	private character: Character;
	private css_3d_renderer: Css3DRenderer;
	private audio: Audio;
	private ray_caster_controls: RayCasterControls;

	constructor() {
		this.core = new Core();

		this.core.$on(ON_LOAD_PROGRESS, this._handleLoadProgress.bind(this));
		this.core.$on(ON_LOAD_MODEL_FINISH, this._onLoadModelFinish.bind(this));
		this.core.$on(ON_CLICK_RAY_CAST, this._onClickRayCast.bind(this));
		this.core.$on(ON_SHOW_TOOLTIP, this._onShowTooltip.bind(this));
		this.core.$on(ON_HIDE_TOOLTIP, this._onHideTooltip.bind(this));
		this.core.$on(ON_ENTER_APP, this._onEnterApp.bind(this));

		this.environment = new Environment();
		this.character = new Character({ speed: 12 });
		this.css_3d_renderer = new Css3DRenderer();
		this.audio = new Audio();
		this.ray_caster_controls = new RayCasterControls();
	}

	update(delta: number) {
		if (this.environment.collider && this.environment.is_load_finished) {
			this.css_3d_renderer.update();
			this.character.update(delta, this.environment.collider);
			this.ray_caster_controls.updateTooltipRayCast(this.environment.raycast_objects);
		}
	}
	// 新增 destroy 方法
	destroy() {
		try {
			// 停止音频播放并销毁音频对象
			// if (this.audio) {
			// 	this.audio.destroy(); // 清理音频资源
			// 	this.audio = null; // 清理引用
			// }

			// 清理其他组件
			// if (this.environment) {
			// 	this.environment.destroy(); // 假设 Environment 类有 destroy 方法
			// 	this.environment = null;
			// }
			// if (this.character) {
			// 	this.character.destroy(); // 假设 Character 类有 destroy 方法
			// 	this.character = null;
			// }
			// if (this.css_3d_renderer) {
			// 	this.css_3d_renderer.destroy(); // 假设 Css3DRenderer 类有 destroy 方法
			// 	this.css_3d_renderer = null;
			// }
			// if (this.ray_caster_controls) {
			// 	this.ray_caster_controls.destroy(); // 假设 RayCasterControls 类有 destroy 方法
			// 	this.ray_caster_controls = null;
			// }

			// 清理核心和事件监听
			this.core.$off(ON_LOAD_PROGRESS, this._handleLoadProgress.bind(this));
			this.core.$off(ON_LOAD_MODEL_FINISH, this._onLoadModelFinish.bind(this));
			this.core.$off(ON_CLICK_RAY_CAST, this._onClickRayCast.bind(this));
			this.core.$off(ON_SHOW_TOOLTIP, this._onShowTooltip.bind(this));
			this.core.$off(ON_HIDE_TOOLTIP, this._onHideTooltip.bind(this));
			this.core.$off(ON_ENTER_APP, this._onEnterApp.bind(this));

			console.log('World resources destroyed');
		} catch (e) {
			console.error("Failed to destroy World resources", e);
		}
	}
	/*
	* 点击进入展馆后的回调
	* */
	private _onEnterApp() {
		// this.audio.playAudio();
		// 进入后才允许控制键盘
		this.core.control_manage.enabled();
	}

	private async _onLoadModelFinish() {
		// 场景模型加载完毕后开始加载音频
		await this.audio.createAudio();
		// 音频加载完毕后移除加载进度UI，显示进入确认UI
		this.core.ui.removeLoading();
		this.core.ui.showLoadingConfirm();

		// 场景模型加载完毕后将场景中需要光线投射检测的物体传入给rayCasterControls
		this.ray_caster_controls.bindClickRayCastObj(this.environment.raycast_objects);
	}

	private _handleLoadProgress([{ url, loaded, total }]: [{ url: string, loaded: number, total: number }]) {
		console.log('_handleLoadProgress')
		const percentage = ((loaded / total) * 100).toFixed(2);
		if (/.*\.(blob|glb)$/i.test(url)) {
			this.core.ui.updateLoadingProgress(`${url.includes("collision") ? "加载碰撞场景模型" : "加载其他场景模型"}：${percentage}%`);
		}
		if (/.*\.(jpg|png|jpeg)$/i.test(url)) {
			this.core.ui.updateLoadingProgress("加载图片素材中...");
		}
		if (/.*\.(m4a|mp3)$/i.test(url)) {
			this.core.ui.updateLoadingProgress("加载声音资源中...");
		}
	}

	private _onClickRayCast([object]: [object: Object3D]) {
		this.core.ui.showBoardsBox(
			object.userData.title,
			object.userData.author,
			object.userData.describe,
			object.userData.src,
			object.userData.datas
		);
	}

	private _onShowTooltip([{ msg, show_preview_tips }]: [{ msg: string, show_preview_tips: boolean }]) {
		this.core.ui.showPreviewTooltip(msg, show_preview_tips);
	}

	private _onHideTooltip() {
		this.core.ui.hidePreviewTooltip();
	}
	public getAudio() {
		return this.audio;
	}
}
