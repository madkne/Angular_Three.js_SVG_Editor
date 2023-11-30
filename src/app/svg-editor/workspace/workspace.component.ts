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
import { EnvironmentService } from 'src/app/services/environment.service';
import {
  OrbitControls,
  MapControls,
} from '@three.js/controls/OrbitControls.js';
@Component({
  selector: 'app-svg-editor-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})
export class SvgEditorWorkspaceComponent
  implements OnInit, OnDestroy, AfterContentInit
{
  @ViewChild('workspaceBoundaryCanvas')
  canvasRef!: ElementRef<HTMLCanvasElement>;
  notifier = new Subject<void>();
  renderer!: THREE.WebGLRenderer; // SVGRenderer; //;
  width = window.innerWidth;
  height = window.innerHeight;
  camera!: THREE.PerspectiveCamera;
  scene!: THREE.Scene;
  loader!: SVGLoader;
  controls!: OrbitControls;

  constructor(
    protected env: EnvironmentService,
    protected transmit: TransmitService
  ) {}

  ngOnInit(): void {
    // =>listen on upload new svg file
    this.transmit
      .listen<File>('load-svg-file')
      .pipe(takeUntil(this.notifier))
      .subscribe(file => {
        if (!file) return;
        const svgUrl = URL.createObjectURL(file);
        this.loadSVGImage(svgUrl);
      });
    // =>listen on drag toolbox item
    this.transmit
      .listen('dragged-toolbox-item')
      .pipe(takeUntil(this.notifier))
      .subscribe(item => {
        if (!item) return;
      });
  }

  async loadSVGImage(svgUrl: string) {
    this.scene.clear();
    const geometry = new THREE.PlaneGeometry(100, 100, 10);

    const texture = await this._loadTexture(svgUrl);

    let mat = new THREE.MeshBasicMaterial({
      // color: 0xffff00,
      side: THREE.DoubleSide,
    });
    mat.transparent = true;
    mat.map = texture;
    mat.map.minFilter = THREE.LinearFilter;
    const cube = new THREE.Mesh(geometry, mat);

    cube.position.set(0, 0, 5);
    this.scene.add(cube);
  }

  get canvas() {
    return this.canvasRef?.nativeElement;
  }

  ngAfterContentInit(): void {
    const waitToLoadInterval = setInterval(() => {
      console.log('waiting...', this.canvasRef);
      if (!this.canvas) return;
      clearInterval(waitToLoadInterval);
      this._initRenderer();
      this._initScene();
      this._initCamera();
      window.addEventListener('resize', this.onWindowResize, false);

      // =>load default svg image
      this.loadSVGImage('/assets/images/android.svg');
      this.animate();
    }, 10);
  }

  private _initRenderer() {
    if (!this.canvas) {
      this.env.errorSnackBar('can not load canvas!');
      return;
    }
    this.width = this.canvas.offsetWidth;
    this.height = this.canvas.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas as HTMLCanvasElement,
      alpha: true,
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // this.renderer = new SVGRenderer();
    // this.renderer.setClearColor(0xf0f0f0);
    this.renderer.setSize(this.width, this.height);
    (this.renderer as any).setClearColor(0x000000);
    // document.body.appendChild(this.renderer.domElement);
  }

  private _initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      1,
      1000
    );

    this.renderer.render(this.scene, this.camera);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.listenToKeyEvents(window);
    this.controls.addEventListener('change', e => {
      // console.log('control change', e, this.camera.position);
    });
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    this.controls.screenSpacePanning = false;
    this.controls.autoRotate = false;

    this.controls.minDistance = 2;
    this.controls.maxDistance = 500;
    this.controls.maxPolarAngle = Math.PI / 2;

    this.camera.position.set(2, 3, 145);
    this.controls.update();
  }

  private _initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xcccccc);
    this.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
    // =>lighting
    const ambient = new THREE.AmbientLight('white');
    this.scene.add(ambient);
  }

  onWindowResize() {
    this.width = this.canvas.offsetWidth;
    this.height = this.canvas.offsetHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    if (this.controls) {
      this.controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    }
    this.render();
  }

  render() {
    // var time = Date.now() * 0.0002;
    // this.camera.position.x = Math.sin(time) * 200;
    // this.camera.position.z = Math.cos(time) * 200;

    this.renderer.render(this.scene, this.camera);
  }

  private _loadTexture(textureFilename: string) {
    return new Promise<THREE.Texture>(resolve => {
      fetch(textureFilename)
        .then(response => {
          // Create a blob from the data
          response
            .blob()
            .then(blob => {
              // Read blob uri
              const reader = new FileReader();

              reader.onloadend = () => {
                const dataUrl = reader.result as string;

                // Load the textue to three js
                const loader = new THREE.TextureLoader();
                loader.loadAsync(dataUrl).then(texture => {
                  // mesh.material.map = texture;
                  // Threejs transforms SVG files as PNGs in the scene and we need the
                  // raw data to send it to the SVG renderer, so we save it.
                  texture['sourceFile'] = dataUrl;
                  texture.name = textureFilename;
                  // mesh.material.needsUpdate = true;
                  resolve(texture);
                });
              };

              reader.readAsDataURL(blob);
            })
            .catch(() => {
              console.error('Could create blob from data', response);
            });
        })
        .catch(() => {
          console.error('Could not fetch texture', textureFilename);
        });
    });
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }
}

// function animateV2() {
//   window.requestAnimationFrame(animateV2);
// }
