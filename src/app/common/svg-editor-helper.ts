import {
  ToolBoxGroup,
  ToolBoxItem,
  ToolBoxItemTabProperties,
  WorkspaceObject,
  WorkspaceObjectItemJson,
} from './interfaces';
import * as THREE from 'three';
import { clone, loadFont } from './public';
import { TextGeometry } from '@three.js/geometries/TextGeometry.js';
import { FontLoader } from '@three.js/loaders/FontLoader';





export namespace SVGEditorHelper {
  export function item2JSON(item: ToolBoxItem, id?: string) {
    // return JSON.stringify(item);
    let json: WorkspaceObjectItemJson = {
      name: item.name,
      id,
      geometry_type: item.geometryType,
      properties: {},
    };
    if (!item.tabProperties && item.tabPropertiesFunc)
      item.tabProperties = item.tabPropertiesFunc();
    // =>iterate properties
    const iterateTabs = (tabs: ToolBoxItemTabProperties[]) => {
      let tabsJson = {};
      for (const tab of tabs) {
        tabsJson[tab.name] = {};
        // =>iterate sub tabs
        if (tab.subTabs) {
          tabsJson[tab.name] = iterateTabs(tab.subTabs);
        }
        // =>iterate properties
        if (tab.properties) {
          for (const prop of tab.properties) {
            tabsJson[tab.name][prop.name] = prop.value; // TODO:cast value
          }
        }
      }
      return tabsJson;
    };

    if (item.tabProperties) {
      json.properties = iterateTabs(item.tabProperties);
    }
    return json;
  }

  export function findPropertyValueByKeys<T = string>(
    json: WorkspaceObjectItemJson,
    keys: string[],
    defaultValue?: T
  ) {
    let propertiesObj = json.properties;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (
        propertiesObj[key] !== undefined &&
        i < keys.length - 1 &&
        typeof propertiesObj[key] === 'object'
      ) {
        propertiesObj = propertiesObj[key];
      } else if (propertiesObj[key] !== undefined && i == keys.length - 1) {
        return propertiesObj[key] as T;
      } else break;
    }
    return defaultValue;
  }

  export function setObjectPositionToItemProperties(object: WorkspaceObject) {
    const shape = object.item.tabProperties
      ?.find(i => i.name === 'view')
      ?.subTabs?.find(i => i.name === 'shape');
    if (!shape) {
      console.warn('bad shape!');
      return;
    }
    // =>set x
    shape.properties!.find(i => i.name === 'x')!.value =
      object.object.position.x;
    // =>set y
    shape.properties!.find(i => i.name === 'y')!.value =
      object.object.position.y;
  }

  export async function itemPropertiesTo3DObjectConvertor(
    object: WorkspaceObject
  ) {
    // =>to json
    const itemJson = item2JSON(object.item);
    // console.log(itemJson);
    // =>set color
    object.material.color.setStyle(
      findPropertyValueByKeys(itemJson, ['view', 'shape', 'fill'], '0x100000')!
    );
    // =>set positions
    if (findPropertyValueByKeys(itemJson, ['view', 'shape', 'x'])) {
      object.object.position.setX(
        Number(findPropertyValueByKeys(itemJson, ['view', 'shape', 'x']))
      );
    }
    if (findPropertyValueByKeys(itemJson, ['view', 'shape', 'y'])) {
      object.object.position.setY(
        Number(findPropertyValueByKeys(itemJson, ['view', 'shape', 'y']))
      );
    }
    // =>set circle specifications
    if (object.item.geometryType === 'circle') {
      const radius = Number(
        findPropertyValueByKeys!(itemJson, ['view', 'shape', 'radius'], '2')
      );
      object.object.geometry.dispose();
      const newCircle = new THREE.CircleGeometry(radius);
      object.object.geometry.copy(newCircle);
      // =>update
      object.object.updateMatrix();
      object.object.updateMatrixWorld(true);
    }
    // =>set rect specifications
    else if (object.item.geometryType === 'plane') {
      const width = Number(
        findPropertyValueByKeys!(itemJson, ['view', 'shape', 'width'], '2')
      );
      const height = Number(
        findPropertyValueByKeys!(itemJson, ['view', 'shape', 'height'], '2')
      );

      object.object.geometry.dispose();
      const newPlane = new THREE.PlaneGeometry(width, height);
      object.object.geometry.copy(newPlane);
      // =>update
      object.object.updateMatrix();
      object.object.updateMatrixWorld(true);
    }
    // =>set text specifications
    else if (object.item.geometryType === 'text') {
      const text = findPropertyValueByKeys!(itemJson, ['content', 'text'], '');
      object.object.geometry.dispose();

      const newText = new TextGeometry(text, {
        font: await loadFont('/assets/fonts/helvetiker_regular.typeface.json'),
        size: 80,
        height: 200,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5,
      });
      object.object.geometry.copy(newText);
      // =>update
      object.object.updateMatrix();
      object.object.updateMatrixWorld(true);
    }
  }
}
