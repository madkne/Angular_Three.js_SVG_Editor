import {
  AfterContentInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TransmitService } from 'src/app/services/transmit.service';
import { SVGLoader } from '@three.js/loaders/SVGLoader.js';
import { SVGRenderer } from '@three.js/renderers/SVGRenderer.js';
import * as THREE from 'three';
@Component({
  selector: 'app-svg-editor-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})
export class SvgEditorWorkspaceComponent
  implements OnInit, OnDestroy, AfterContentInit
{
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  notifier = new Subject<void>();
  renderer!: THREE.Renderer;
  width = window.innerWidth;
  height = window.innerHeight;
  camera!: THREE.PerspectiveCamera;
  scene!: THREE.Scene;

  constructor(protected transmit: TransmitService) {}
  loader = new SVGLoader();

  ngOnInit(): void {
    this.transmit
      .listen<File>('load-svg-file')
      .pipe(takeUntil(this.notifier))
      .subscribe(file => {
        if (!file) return;
        const svgUrl = URL.createObjectURL(file);
        // =>load a SVG resource
        this.loader.load(
          // resource URL
          svgUrl,
          // called when the resource is loaded
          data => {
            const paths = data.paths;
            const group = new THREE.Group();

            for (let i = 0; i < paths.length; i++) {
              const path = paths[i];

              const material = new THREE.MeshBasicMaterial({
                color: path.color,
                side: THREE.DoubleSide,
                depthWrite: false,
              });

              const shapes = SVGLoader.createShapes(path);

              for (let j = 0; j < shapes.length; j++) {
                const shape = shapes[j];
                const geometry = new THREE.ShapeGeometry(shape);
                const mesh = new THREE.Mesh(geometry, material);
                group.add(mesh);
              }
            }
            this.scene.add(group);
            // this.init(group);
            // console.log(data);
          }
        );
      });
  }

  get canvas() {
    return this.canvasRef?.nativeElement;
  }

  ngAfterContentInit(): void {
    this._initRenderer();
    this._initCamera();
    this._initScene();
  }

  private _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas as HTMLCanvasElement,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private _initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      100000
    );
    this.camera.position.z = 1500;
  }

  private _initScene() {
    this.scene = new THREE.Scene();
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  init(svgObject) {
    // svgObject.position.x = Math.random() * innerWidth;
    // svgObject.position.y = 200;
    // svgObject.position.z = Math.random() * 10000 - 5000;
    // svgObject.scale.x = svgObject.scale.y = svgObject.scale.z = 0.01;

    var ambient = new THREE.AmbientLight(0x80ffff);
    this.scene.add(ambient);
    var directional = new THREE.DirectionalLight(0xffff00);
    directional.position.set(-1, 0.5, 0);
    this.scene.add(directional);
    // this.renderer = new SVGRenderer();
    // this.renderer.setClearColor(0xf0f0f0);
    // this.renderer.setSize(window.innerWidth, window.innerHeight - 5);
    // document.body.appendChild(this.renderer.domElement);

    window.addEventListener('resize', this.onWindowResize, false);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.render();
  }

  render() {
    var time = Date.now() * 0.0002;
    this.camera.position.x = Math.sin(time) * 200;
    this.camera.position.z = Math.cos(time) * 200;
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
  }
}
