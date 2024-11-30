import Core from "../core";
import Loader from "../loader";
import { BOARD_TEXTURES, BOARDS_INFO, COLLISION_SCENE_URL, ON_LOAD_MODEL_FINISH, ON_LOAD_PROGRESS, STATIC_SCENE_URL } from "../Constants";
import { Group, Material, Mesh, MeshBasicMaterial, Object3D, SRGBColorSpace, Texture, PlaneGeometry } from "three";
import { isLight, isMesh } from "../utils/typeAssert";
import { MeshBVH, MeshBVHOptions, StaticGeometryGenerator } from "three-mesh-bvh";
import { Reflector } from "../../../lib/Reflector";
import * as THREE from 'three';
import { fetchShangpinList } from "../../../services/homeServices";

export default class Environment {
	private core: Core;
	private loader: Loader;
	private collision_scene: Group | undefined;
	collider: Mesh | undefined;
	private texture_boards: Record<string, Texture> = {};
	private texture_info: Record<string, {}> = {};
	private gallery_boards: Record<string, Mesh> = {};
	raycast_objects: Object3D[] = [];
	is_load_finished = false;

	constructor() {
		this.core = new Core();
		this.loader = this.core.loader;
		this._loadScenes();
	}

	/*
	* 加载全部场景物体（地图、画框和贴图、地板反射）
	* */
	private async _loadScenes() {
		try {
			await this._loadSceneAndCollisionDetection();
			await this._loadStaticScene();
			await this._loadBoardsTexture();
			this._configureGallery();
			this._createSpecularReflection();
			this.is_load_finished = true;
			this.core.$emit(ON_LOAD_MODEL_FINISH);
		} catch (e) {
			console.log(e);
		}
	}
	// 加载画廊数据纹理
	private async _loadBoardsTexture(): Promise<void> {
		// for (let i = 0; i < BOARD_TEXTURES.length; i++) {
		// 	this.texture_boards[i + 1] = await this.loader.texture_loader.loadAsync(BOARD_TEXTURES[i]);
		// }
		//调接口 查询列表
		const res = await fetchShangpinList();
		const datas = res.list
		// console.log(datas)
		for (let i = 0; i < datas.length; i++) {
			this.texture_boards[i + 1] = await this.loader.texture_loader.loadAsync(datas[i].tupian);
			console.log(`tupian${i + 1}`, datas[i].tupian)
			console.log(`tupian${i + 1}`, this.texture_boards[i + 1])
			this.texture_info[i + 1] = datas[i]
		}
		for (const key in this.texture_boards) {
			const texture = this.texture_boards[key]
			texture.colorSpace = SRGBColorSpace;

			// 根据纹理的宽高比和平面的宽高比，计算需要的缩放比例
			const texture_aspect_ratio = texture.image.width / texture.image.height;
			let scale_x = 1;
			let scale_y = 1;

			if (texture_aspect_ratio > 1) {
				scale_x = 1 / texture_aspect_ratio;
			} else {
				scale_y = texture_aspect_ratio;
			}

			// 设置纹理的偏移和重复以进行居中和适应
			texture.offset.set(0.5 - scale_x / 2, 0.5 - scale_y / 2);
			texture.repeat.set(scale_x, scale_y);
			texture.needsUpdate = true;
		}

		return Promise.resolve();
	}

	/*
	* 设置画板userData数据、贴图翻转
	* */
	private async _configureGallery() {
		console.log(' this.gallery_boards', this.gallery_boards)
		for (let key in this.texture_boards) {

			const board = this.gallery_boards[`gallery${key}_board`];
			const board_material = board.material;
			(board_material as MeshBasicMaterial).map = this.texture_boards[key];

			console.log(`gallery${key}_board`, board_material.map)
			board.userData = {
				name: this.texture_info[key].shangpinmingcheng,
				title: this.texture_info[key].shangpinmingcheng,
				author: this.texture_info[key].pinpai,
				describe: this.texture_info[key].shangpinxiangqing,
				index: key,
				src: this.texture_boards[key].image.src,
				show_boards: true
			};

			// board.userData = {
			// 	name: board.name,
			// 	title: BOARDS_INFO[key].title,
			// 	author: BOARDS_INFO[key].author,
			// 	describe: BOARDS_INFO[key].describe,
			// 	index: key,
			// 	src: this.texture_boards[key].image.src,
			// 	show_boards: true
			// };

			// 翻转贴图
			if ([4, 5, 6, 7, 9].includes(+key)) {
				board.rotation.y = -Math.PI / 2;
			}
			if (8 === +key) {
				board.rotation.y = Math.PI;
			}

			(board_material as MeshBasicMaterial).needsUpdate = true;
		}
	}

	/*
	* 产生地面镜面反射
	* */
	private _createSpecularReflection() {
		const mirror = new Reflector(new PlaneGeometry(100, 100), {
			textureWidth: window.innerWidth * window.devicePixelRatio,
			textureHeight: window.innerHeight * window.devicePixelRatio,
			color: 0xffffff,
		});
		if (mirror.material instanceof Material) {
			mirror.material.transparent = true;
		}
		mirror.rotation.x = -0.5 * Math.PI;
		this.core.scene.add(mirror);
	}

	/*
	* 加载不含碰撞其他的场景
	* */
	private _loadStaticScene(): Promise<void> {
		return new Promise(resolve => {
			this.loader.gltf_loader.load(STATIC_SCENE_URL, (gltf) => {
				this.core.scene.add(gltf.scene);
				gltf.scene.traverse(item => {
					if (item.name === "computer") {
						item.userData = {
							name: item.name,
							title: "噢，搜索相关信息 🏕",
						};
						this.raycast_objects.push(item);
					}
				});
				resolve();
			}, (event) => {
				this.core.$emit(ON_LOAD_PROGRESS, { url: STATIC_SCENE_URL, loaded: event.loaded, total: event.total });
			});
		});
	}

	/*
	* 加载含碰撞检测的场景
	* */
	private _loadSceneAndCollisionDetection(): Promise<void> {
		return new Promise(resolve => {
			this.loader.gltf_loader.load(COLLISION_SCENE_URL, (gltf) => {
				this.collision_scene = gltf.scene;

				this.collision_scene.updateMatrixWorld(true);

				this.collision_scene.traverse(item => {
					if (item.name === "home001" || item.name === "PointLight") {
						item.castShadow = true;
					}
					// 墙壁
					if (item.name === "home" || item.name === 'wall2') {
						const textureLoader = new THREE.TextureLoader();
						const diffuseTexture = textureLoader.load('/textures/synthetic_wood_diff_1k.jpg')
						const normalTexture = textureLoader.load('/textures/synthetic_wood_nor_gl_1k.jpg'); // 法线纹理
						const roughnessTexture = textureLoader.load('/textures/synthetic_wood_rough_1k.jpg'); // 粗糙度纹理

						// 控制纹理的重复次数
						diffuseTexture.repeat.set(13,0); // 纹理将在 X 轴和 Y 轴上各重复 2 次
						diffuseTexture.wrapS = THREE.RepeatWrapping;
						diffuseTexture.wrapT = THREE.RepeatWrapping;
						normalTexture.repeat.set(13,0); // 纹理将在 X 轴和 Y 轴上各重复 2 次
						normalTexture.wrapS = THREE.RepeatWrapping;
						normalTexture.wrapT = THREE.RepeatWrapping;
						roughnessTexture.repeat.set(13,0); // 纹理将在 X 轴和 Y 轴上各重复 2 次
						roughnessTexture.wrapS = THREE.RepeatWrapping;
						roughnessTexture.wrapT = THREE.RepeatWrapping;

						if (item.material) {
							item.material.map = null; // 移除 UV 贴图
							item.material.needsUpdate = true; // 更新材质
							// item.material.color.set(0x00ff00); // 将颜色改为红色
							const material = new THREE.MeshStandardMaterial({
								color: 0xC02A2A, // 颜色
								map: diffuseTexture,
								normalMap: normalTexture, // 法线纹理
								roughnessMap: roughnessTexture, // 粗糙度纹理
								roughness: 1.0, // 粗糙度
							});
							item.material = material;
						}
					}
					// 灯光
					if (item.name.includes("PointLight") && isLight(item)) {
						item.intensity *= 1500;
					}

					if (item.name === "home002") {
						item.castShadow = true;
						item.receiveShadow = true;
					}

					// 提取出相框元素
					if (/gallery.*_board/.test(item.name) && isMesh(item)) {
						this.gallery_boards[item.name] = item;
					}

					this.raycast_objects.push(item);
				});

				const static_generator = new StaticGeometryGenerator(this.collision_scene);
				static_generator.attributes = ["position"];

				const merged_geometry = static_generator.generate();
				merged_geometry.boundsTree = new MeshBVH(merged_geometry, { lazyGeneration: false } as MeshBVHOptions);

				this.collider = new Mesh(merged_geometry);
				this.core.scene.add(this.collision_scene);

				resolve();
			}, (event) => {
				this.core.$emit(ON_LOAD_PROGRESS, { url: COLLISION_SCENE_URL, loaded: event.loaded, total: event.total });
			});
		});
	}
}
