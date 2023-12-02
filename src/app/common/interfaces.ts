import { PageName, ToolboxItemGeometryType } from './types';
import * as THREE from 'three';

export interface MenuItem {
  icon: string;
  text: string;
  page: PageName;
  disabled?: boolean;
  selected?: boolean;
}

export interface ToolBoxGroup {
  title: string;
  items: ToolBoxItem[];
}

export interface ToolBoxItem {
  title: string;
  name: string;
  geometryType: ToolboxItemGeometryType;
  selected?: boolean;
  icon?: string;
  disabled?: boolean;
  tabProperties?: ToolBoxItemTabProperties[];
  tabPropertiesFunc?: () => ToolBoxItemTabProperties[];
}

export interface ToolBoxItemTabProperties {
  title: string;
  name: string;
  properties?: ToolBoxItemProperty[];
  subTabs?: ToolBoxItemTabProperties[];
}

export interface ToolBoxItemProperty {
  title: string;
  hint?: string;
  name: string;
  type: 'text' | 'number' | 'color';
  value?: any;
}

export interface DraggedToolboxItemData {
  event: DragEvent;
  item: ToolBoxItem;
}

export interface WorkspaceObject {
  name: string;
  geometry: THREE.BufferGeometry;
  material: THREE.MeshBasicMaterial; //THREE.Material;
  object: THREE.Mesh;
  item: ToolBoxItem;

  _currentColor?: string;
}

export interface WorkspaceObjectItemJson {
  id?: string;
  name: string;
  geometry_type: ToolboxItemGeometryType;
  properties: {};
}


export interface ObjectDragEvent {
type: 'dragend' | 'drag';
object: THREE.Mesh;
target: any;
}