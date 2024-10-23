/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-23 14:25:06
 * @LastEditors: Hesin
 * @LastEditTime: 2024-10-23 20:47:31
 */

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { AudioLoader, DefaultLoadingManager, TextureLoader } from "three";
import Core from "../core";
import { ON_LOAD_PROGRESS } from "../Constants";

export default class Loader {
	gltf_loader: GLTFLoader;
	texture_loader: TextureLoader;
	audio_loader: AudioLoader;
	private core: Core;

	constructor() {
		this.core = new Core();
		this.gltf_loader = new GLTFLoader();
		this.texture_loader = new TextureLoader();
		this.audio_loader = new AudioLoader();

		DefaultLoadingManager.onProgress = (url, loaded, total) => {
			this.core.$emit(ON_LOAD_PROGRESS, { url, loaded, total });
		};
	}
}
