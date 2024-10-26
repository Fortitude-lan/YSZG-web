/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-23 14:25:06
 * @LastEditors: Hesin
 * @LastEditTime: 2024-10-26 15:26:44
 */
import { ACESFilmicToneMapping, Clock, Color, PerspectiveCamera, Scene, SRGBColorSpace, WebGLRenderer } from "three";
import World from "../world";
import Emitter from "../utils/Emitter";
import Loader from "../loader";
import ControlManage from "../controlManage";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import UI from "./UI";

let instance: Core | null = null;

export default class Core extends Emitter {
	scene!: Scene;
	renderer!: WebGLRenderer;
	camera!: PerspectiveCamera;
	clock!: Clock;
	orbit_controls!: OrbitControls;

	ui!: UI;
	control_manage!: ControlManage;
	loader!: Loader;
	world!: World;

	constructor() {
		super();

		if (instance) {
			return instance;
		}
		instance = this;




	}
	init() {
		this.scene = new Scene();
		this.renderer = new WebGLRenderer({ antialias: true });
		this.camera = new PerspectiveCamera();
		this.clock = new Clock();

		this.orbit_controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.control_manage = new ControlManage();
		this.loader = new Loader();
		this.world = new World();
		this.ui = new UI(this); // 传递 Core 实例
	}
	render() {
		this.init()

		this._initScene();
		this._initCamera();
		this._initRenderer();// 加载模型
		this._initResponsiveResize();


		this.ui.init(); // 在渲染时初始化 UI

		this.renderer.setAnimationLoop(() => {
			this.renderer.render(this.scene, this.camera);
			const delta_time = Math.min(0.05, this.clock.getDelta());
			this.world.update(delta_time);
			this.orbit_controls.update();
		});
	}
	destroy() {
		try {
			// 清理场景中的所有物体和材料
			this.renderer.dispose();
			this.renderer.domElement.remove();
			this.world.destroy();
			this.world = null
			this.ui = null
			this.loader = null
			console.log('XXXXXXXXXX')
		} catch (e) {
			console.error("Failed to destroy Three.js resources", e);
		}
	}
	private _initScene() {
		this.scene.background = new Color(0x000000);
	}

	private _initCamera() {
		this.camera.fov = 55;
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.near = 0.1;
		this.camera.far = 1000;
		this.camera.position.set(0, 0, 3);
		this.camera.updateProjectionMatrix();
	}

	private _initRenderer() {
		console.log('chushihhasd')
		this.renderer.shadowMap.enabled = true;
		this.renderer.outputColorSpace = SRGBColorSpace;
		this.renderer.toneMapping = ACESFilmicToneMapping;
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.domElement.style.position = "absolute";
		this.renderer.domElement.style.zIndex = "1";
		this.renderer.domElement.style.top = "0px";
		document.querySelector("#app1")?.appendChild(this.renderer.domElement);
	}

	private _initResponsiveResize() {
		window.addEventListener("resize", () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.renderer.setPixelRatio(window.devicePixelRatio);
		});
	}

}
