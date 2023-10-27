// @ts-ignore
import * as THREE from "three";
// @ts-ignore
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// @ts-ignore
import {ViewHelper} from "three/examples/jsm/helpers/ViewHelper";
// @ts-ignore
import {TransformControls} from "three/examples/jsm/controls/TransformControls.js";
// @ts-ignore
import {GCodeLoader} from "three/examples/jsm/loaders/GCodeLoader.js";

export default class Simulation {

    constructor(loading_callback: any) {
        const _this: any = this;
        _this.loading = new THREE.LoadingManager(()=>{
            loading_callback({type: "resource:loading:end"});
        }, (url: any, loaded: any, total: any)=>{
            loading_callback({type: "resource:loading:progress", progress: parseFloat(((loaded * 100) / total).toFixed(2))});
        });
        _this.container = document.getElementById("world");
        _this.engine = {
            scene: false,
            clock: false,
            light: {
                ambient: false,
                hemisphere: false,
                directional: false
            },
            ground: false,
            axes_helper: false,
            control: false,
            control_camera: false,
            view_helper: false,
            tool: false,
            tool_bit: false,
            renderer: false,
        }
        _this.loader = new GCodeLoader(_this.loading);
    }

    InitEngine(){
        const _this: any = this;

        _this.engine.scene = new THREE.Scene();
        _this.engine.scene.name = "default_scene";
        _this.engine.scene.background = new THREE.Color("rgb(30, 31, 34)");

        _this.engine.clock = new THREE.Clock();
        _this.engine.clock_delta = 0.00;

        _this.engine.ground = new THREE.GridHelper(50, 100, 0xf9f9f9, 0xf9f9f9);
        _this.engine.ground.name = "default_ground";
        _this.engine.ground.material.transparent = true;
        _this.engine.ground.material.opacity = 0.05;
        //_this.engine.ground.rotation.x = 90 * Math.PI / 180;
        _this.engine.ground.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
        _this.engine.ground.matrixAutoUpdate = true;
        _this.engine.scene.add(_this.engine.ground);

        _this.engine.axes_helper = new THREE.AxesHelper(1, 1, 1);
        _this.engine.axes_helper.name = "default_axes_helper";
        _this.engine.axes_helper.position.y =0;
        _this.engine.scene.add(_this.engine.axes_helper);

        _this.engine.control_camera = new THREE.PerspectiveCamera(45, _this.container.clientWidth / _this.container.clientHeight, 0.1, 20000);
        _this.engine.control_camera.name = "default_camera";
        _this.engine.control_camera.position.set(0, -10, 5);
        _this.engine.control_camera.lookAt(0, 0, 0);
        _this.engine.control_camera.up.set(0, 0, 1);
        _this.engine.control = new OrbitControls(_this.engine.control_camera, _this.container);
        _this.engine.control.enabled = true;
        _this.engine.control.mouseButtons.RIGHT = 0; // 禁用右键拖拽
        _this.engine.control.minDistance = 5; // 相机距离观察目标最小距离
        _this.engine.control.maxDistance = 20; // 相机距离观察目标最大距离
        _this.engine.control.maxPolarAngle = Math.PI / 2;
        _this.engine.control.enableDamping = true;
        _this.engine.control.dampingFactor = 0.2; // 视角惯性量
        _this.engine.control.target.set(0, 0.1, 0);
        _this.engine.control.update();
        _this.engine.scene.add(_this.engine.control_camera);

        _this.engine.view_helper = new ViewHelper(_this.engine.control_camera, _this.container);
        _this.engine.view_helper.scale.set(0.7, 0.7, 0.7);
        _this.engine.view_helper.position.set(0.8, -0.8, -1);

        _this.engine.tool = new THREE.Object3D();
        _this.engine.tool.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
        _this.engine.tool.add(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0, 0.5, 32, 2, false)));
        _this.engine.tool.position.z = 0.25;
        _this.engine.tool.matrixAutoUpdate = true;
        _this.engine.scene.add(_this.engine.tool);

        _this.engine.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        _this.engine.renderer.setClearColor(0xf9f9f9, 1);
        _this.engine.renderer.setPixelRatio(1);
        _this.engine.renderer.sortObjects = false;
        _this.engine.renderer.autoClear = false;
        _this.engine.renderer.updateSize = _this.engine.renderer.setSize;
        _this.container.appendChild(_this.engine.renderer.domElement);

        _this.onEngineResize();
        _this.onEngineEvent();
        _this.onEngineAnimate()
    }

    onloadCode(file_path: string){
        const _this: any = this;
        _this.loader.load(file_path, (object: any)=>{
            _this.engine.scene.add(object);
        });
    }

    onEngineResize(){
        const _this: any = this;
        _this.engine.control_camera.aspect = _this.container.clientWidth / _this.container.clientHeight;
        _this.engine.control_camera.updateProjectionMatrix();
        _this.engine.renderer.updateSize(_this.container.clientWidth, _this.container.clientHeight);
    }

    onEngineEvent(){
        const _this: any = this;
    }

    onEngineAnimate(){
        const _this: any = this;
        _this.engine.clock_delta = _this.engine.clock.getDelta();
        _this.engine.control.update();
        _this.engine.renderer.clear();
        _this.engine.renderer.render(_this.engine.scene, _this.engine.control_camera);
        _this.engine.view_helper.render(_this.engine.renderer);
        requestAnimationFrame(_this.onEngineAnimate.bind(_this));
        _this.onEngineResize();
    }

    onEngineDestroy(){
        const _this: any = this;
        cancelAnimationFrame(_this.onEngineAnimate.bind(_this));
        _this.engine.scene.children.forEach((object: any)=>{
            if (object.isMesh) {
                object.geometry.dispose();
                object.material.dispose();
            }
            _this.engine.scene.remove(object);
        });
        _this.engine.renderer.dispose();
    }
}