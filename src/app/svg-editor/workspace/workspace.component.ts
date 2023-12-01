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
import * as THREE from 'three';
import { EnvironmentService } from 'src/app/services/environment.service';
import { OrbitControls } from '@three.js/controls/OrbitControls.js';
import {
  DraggedToolboxItemData,
  ToolBoxItem,
  WorkspaceObject,
  WorkspaceObjectItemJson,
} from 'src/app/common/interfaces';
import { SVGEditorHelper } from 'src/app/common/svg-editor-helper';
import { clone, loadTexture } from 'src/app/common/public';
import { TextGeometry } from '@three.js/geometries/TextGeometry.js';

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
  renderer!: THREE.WebGLRenderer;
  width = window.innerWidth;
  height = window.innerHeight;
  camera!: THREE.PerspectiveCamera;
  scene!: THREE.Scene;
  loader!: SVGLoader;
  controls!: OrbitControls;
  baseImageZPosition = 5;
  pointer = new THREE.Vector2();
  worldPoint = new THREE.Vector3();
  private _vec = new THREE.Vector3();
  workspaceObjects: WorkspaceObject[] = [];
  selectedWorkspaceObjectIndex = -1;
  mode: 'edit' | 'delete' | undefined = undefined;
  grids: THREE.GridHelper[] = [];
  protected mouseRaycaster!: THREE.Raycaster;
  static SELECT_OBJECT_COLOR = '#ff0000';

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
        this._loadSVGImage(svgUrl);
      });
    // =>listen on drag toolbox item
    this.transmit
      .listen<DraggedToolboxItemData>('dragged-toolbox-item')
      .pipe(takeUntil(this.notifier))
      .subscribe(item => {
        if (!item) return;
        this.loadAndRenderToolboxItem(item);
      });
    // =>listen on edit mode
    this.transmit
      .listen<boolean>('edit-workspace-mode')
      .pipe(takeUntil(this.notifier))
      .subscribe(mode => {
        if (mode === undefined) return;
        this.mode = mode ? 'edit' : undefined;
        this.toggleEditMode();
      });
    // =>listen on update object
    this.transmit
      .listen<WorkspaceObject>('update-workspace-object')
      .pipe(takeUntil(this.notifier))
      .subscribe(async object => {
        if (!object) return;
        // ==>find object by name
        const workspaceObjectIndex = this.workspaceObjects.findIndex(
          i => i.name === object.name
        );
        if (workspaceObjectIndex < 0) return;
        // =>if selected, so reset
        if (workspaceObjectIndex === this.selectedWorkspaceObjectIndex) {
          this._resetSelectedObject();
        }
        // =>remove object
        this.scene.remove(this.workspaceObjects[workspaceObjectIndex].object);
        // =>update object
        this.workspaceObjects[workspaceObjectIndex].item = object.item;
        await SVGEditorHelper.itemPropertiesTo3DObjectConvertor(
          this.workspaceObjects[workspaceObjectIndex]
        );

        this.scene.add(this.workspaceObjects[workspaceObjectIndex].object);
        this._saveWorkspaceObjectsJson();
      });
    // =>listen on resize window
    this.transmit
      .listen('resize-window')
      .pipe(takeUntil(this.notifier))
      .subscribe(item => {
        if (!item) return;
        this.onWindowResize();
      });
  }

  async loadAndRenderToolboxItem(item: DraggedToolboxItemData) {
    let itemGeometry!: THREE.BufferGeometry;
    const objectName = item.item.name + '_' + Math.ceil(Math.random() * 10000);
    // =>create geometry by type
    if (item.item.geometryType === 'circle') {
      itemGeometry = new THREE.CircleGeometry(20, 32);
    } else if (item.item.geometryType === 'plane') {
      itemGeometry = new THREE.PlaneGeometry(10, 10);
    } else if (item.item.geometryType === 'text') {
      itemGeometry = new TextGeometry('Hello three.js!', {
        // font: font,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5,
      });
    }
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const itemGeometryMesh = new THREE.Mesh(itemGeometry, material);
    console.log(
      'pointer',
      [this.pointer.x, this.pointer.y],
      [this.worldPoint.x, this.worldPoint.y]
    );
    itemGeometryMesh.name = objectName;
    itemGeometryMesh.position.set(
      this.worldPoint.x,
      this.worldPoint.y,
      this.baseImageZPosition + 1
    ); //FIXME:
    const workspaceObject = {
      object: itemGeometryMesh,
      geometry: itemGeometry,
      material,
      item: clone<ToolBoxItem>(item.item),
      name: objectName,
    };
    SVGEditorHelper.setObjectPositionToItemProperties(workspaceObject);
    await SVGEditorHelper.itemPropertiesTo3DObjectConvertor(
      workspaceObject
    );
    this.workspaceObjects.push(workspaceObject);

    this.scene.add(itemGeometryMesh);
    this._saveWorkspaceObjectsJson();
  }

  get canvas() {
    return this.canvasRef?.nativeElement;
  }

  ngAfterContentInit(): void {
    const waitToLoadInterval = setInterval(() => {
      console.log('waiting...', this.canvasRef);
      if (!this.canvas) return;
      clearInterval(waitToLoadInterval);
      this.onWindowResize();
      this._initRenderer();
      this._initScene();
      this._initCamera();
      this._initEvents();
      // =>load default svg image
      this._loadSVGImage('/assets/images/android.svg');
      this.onWindowResize();
      this.animate();
    }, 10);
  }

  protected toggleEditMode() {
    if (this.mode) {
      // =>add grids
      const gridXZ = new THREE.GridHelper(250, 20);
      gridXZ.scale.set(1, 0.5, 0.25);
      gridXZ.position.y = -25;
      gridXZ.position.z = 25;
      this.scene.add(gridXZ);
      this.grids.push(gridXZ);

      const gridXY = new THREE.GridHelper(250, 20);
      gridXY.position.z = this.baseImageZPosition - 2;
      gridXY.position.y = 1;
      gridXY.rotation.x = Math.PI / 2;
      this.scene.add(gridXY);
      this.grids.push(gridXY);

      // const gridYZ = new THREE.GridHelper(250, 6);
      // gridYZ.position.x = -1;
      // gridYZ.position.y = 1;
      // gridYZ.rotation.z = Math.PI / 2;
      // gridYZ.scale.set(1, 1, 0.25);
      // this.scene.add(gridYZ);
      // this.grids.push(gridYZ);

      this.mouseRaycaster = new THREE.Raycaster();
    } else {
      // =>remove grids
      for (const grid of this.grids) {
        this.scene.remove(grid);
      }
      this.grids = [];
      // =>restore selected object
      this._resetSelectedObject();
    }
  }

  onMouseMove(event: MouseEvent) {
    // Relative screen position
    // (WebGL is -1 to 1 left to right, 1 to -1 top to bottom)
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -(((event.clientY - rect.top) / rect.height) * 2) + 1;

    // =>Get real world 3d point
    this._vec.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
      0.5
    );
    this._vec.unproject(this.camera);
    this._vec.sub(this.camera.position).normalize();
    var distance = -this.camera.position.z / this._vec.z;
    this.worldPoint
      .copy(this.camera.position)
      .add(this._vec.multiplyScalar(distance));
  }

  onMouseDown(event: MouseEvent) {
    console.log('pointer:', this.pointer, this.worldPoint);

    // =>if edit mode
    if (this.mode === 'edit' && this.selectedWorkspaceObjectIndex > -1) {
      this.transmit.emit<WorkspaceObject>(
        'open-edit-properties',
        this.workspaceObjects[this.selectedWorkspaceObjectIndex]
      );
    }
  }

  onWindowResize() {
    this.width = this.canvas.offsetWidth;
    this.height = this.canvas.offsetHeight;
    if (this.camera) {
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
    }
    if (this.renderer) {
      this.renderer.setSize(this.width, this.height);
    }

  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    if (this.controls) {
      this.controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    }

    this.render();

    // =>if edit mode, hover an object
    if (this.mode === 'edit') {
      // find intersections

      this.mouseRaycaster.setFromCamera(this.pointer, this.camera);

      const intersects = this.mouseRaycaster.intersectObjects(
        this.workspaceObjects.map(i => i.object),
        false
      );
      if (intersects.length > 0) {
        // console.log('intersects', intersects);
        // =>reset
        if (this.selectedWorkspaceObjectIndex > -1) {
          this._resetSelectedObject();
        }
        this.selectedWorkspaceObjectIndex = this.workspaceObjects.findIndex(
          i => i.object.name === intersects[0].object.name
        );
        // =>find index
        this.workspaceObjects[this.selectedWorkspaceObjectIndex][
          'currentColor'
        ] =
          this.workspaceObjects[
            this.selectedWorkspaceObjectIndex
          ].material.color.getStyle();
        this.workspaceObjects[
          this.selectedWorkspaceObjectIndex
        ].material.color.setStyle(
          SvgEditorWorkspaceComponent.SELECT_OBJECT_COLOR
        );
      } else if (this.selectedWorkspaceObjectIndex > -1) {
        this._resetSelectedObject();
      }
    }
  }

  render() {
    // var time = Date.now() * 0.0002;
    // this.camera.position.x = Math.sin(time) * 200;
    // this.camera.position.z = Math.cos(time) * 200;
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
  }
  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  /************************************** */
  /************************************** */
  /************************************** */
  private _resetSelectedObject() {
    if (this.selectedWorkspaceObjectIndex > -1) {
      this.workspaceObjects[
        this.selectedWorkspaceObjectIndex
      ].material.color.setStyle(
        this.workspaceObjects[this.selectedWorkspaceObjectIndex]['currentColor']
      );
    }

    this.selectedWorkspaceObjectIndex = -1;
    this.mouseRaycaster = new THREE.Raycaster();
  }

  private _initRenderer() {
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
      75,
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

    this.camera.position.set(2, 3, 80);
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

  private _initEvents() {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
  }

  private _saveWorkspaceObjectsJson() {
    this.env.svgEditorObjectsJson = [];
    for (const obj of this.workspaceObjects) {
      this.env.svgEditorObjectsJson.push(
        SVGEditorHelper.item2JSON(obj.item, obj.name)
      );
    }
  }

  private async _loadSVGImage(svgUrl: string) {
    this.scene.clear();
    const geometry = new THREE.PlaneGeometry(100, 100, 10);

    const texture = await loadTexture(svgUrl);

    let mat = new THREE.MeshBasicMaterial({
      // color: 0xffff00,
      side: THREE.DoubleSide,
    });
    mat.transparent = true;
    mat.map = texture;
    mat.map.minFilter = THREE.LinearFilter;
    const cube = new THREE.Mesh(geometry, mat);

    cube.position.set(0, 0, this.baseImageZPosition);
    this.scene.add(cube);
  }
}
