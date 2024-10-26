/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-23 21:27:37
 * @LastEditors: Hesin
 * @LastEditTime: 2024-10-26 16:49:15
 */
import { Mesh, MeshBasicMaterial, PlaneGeometry, PositionalAudio, AudioListener } from "three";
import Core from "../core";
import { PositionalAudioHelper } from "three/examples/jsm/helpers/PositionalAudioHelper.js";
import { AUDIO_URL } from "../Constants";

export default class Audio {
	private core: Core;
	private audio_mesh: Mesh | undefined;
	private positional_audio: PositionalAudio | undefined;
	private listener: AudioListener | undefined;
	constructor() {
		this.core = new Core();
	}


	async createAudio() {
		this.audio_mesh = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ color: 0xff0000 }));
		this.audio_mesh.position.set(-15.9, 4.49, 36.42);
		this.audio_mesh.visible = false;
		this.core.scene.add(this.audio_mesh);

		this.listener = new AudioListener();

		this.core.camera.add(this.listener);
		this.positional_audio = new PositionalAudio(this.listener);
		this.audio_mesh.add(this.positional_audio);

		const buffer = await this.core.loader.audio_loader.loadAsync(AUDIO_URL);
		this.positional_audio.setBuffer(buffer);
		this.positional_audio.setVolume(0.8);
		this.positional_audio.setRefDistance(2);
		this.positional_audio.setDirectionalCone(180, 230, 0.5);
		this.positional_audio.setLoop(true);

		const helper = new PositionalAudioHelper(this.positional_audio);
		this.positional_audio.add(helper);

		return Promise.resolve();
	}

	playAudio() {
		this.positional_audio?.play();
	}
	stopAudio() {
		console.log('暂停音乐')
		this.positional_audio?.pause(); // 暂停音乐
		// this.positional_audio.currentTime = 0; // 重置播放时间
	}
	destroy() {
		// 停止音频播放
		console.log('停止音频播放')
		this.stopAudio();

		// 清理 PositionalAudio
		if (this.positional_audio) {
			this.positional_audio.disconnect(); // 断开音频连接
			this.positional_audio = undefined; // 清理引用
		}

		// 清理 AudioListener
		if (this.listener) {
			this.core.camera.remove(this.listener); // 从相机中移除
			this.listener = undefined; // 清理引用
		}

		// 移除音频网格
		if (this.audio_mesh) {
			this.core.scene.remove(this.audio_mesh); // 从场景中移除
			this.audio_mesh.geometry.dispose(); // 释放几何体
			this.audio_mesh.material.dispose(); // 释放材料
			this.audio_mesh = undefined; // 清理引用
		}
	}
}
