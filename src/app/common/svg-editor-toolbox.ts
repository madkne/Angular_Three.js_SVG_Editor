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

const SVGEditorToolboxLabelSharedTabProperties: ToolBoxItemTabProperties[] = [
  {
    title: 'View',
    name: 'view',
    subTabs: [
      {
        title: 'Shape',
        name: 'shape',
        properties: [
          {
            title: 'Fill',
            name: 'fill',
            type: 'color',
            value: '#0172f4',
            hint: 'as hex like #0f0f0f',
          },
          {
            title: 'Width',
            name: 'width',
            type: 'number',
            value: 10,
          },
          {
            title: 'Height',
            name: 'height',
            type: 'number',
            value: 10,
          },
          {
            title: 'X',
            name: 'x',
            type: 'number',
          },
          {
            title: 'Y',
            name: 'y',
            type: 'number',
          },
        ],
      },
    ],
  },
  {
    name: 'animation',
    title: 'Animation',
  },
];

export const SVGEditorToolbox: ToolBoxGroup[] = [
  {
    title: 'Backgrounds',
    items: [], //TODO:
  },
  {
    title: 'Label',
    items: [
      {
        title: 'Circle',
        icon: 'circle',
        name: 'label_circle',
        geometryType: 'circle',
        tabPropertiesFunc: () => {
          const prop = clone<ToolBoxItemTabProperties[]>(
            SVGEditorToolboxLabelSharedTabProperties
          );
          prop[0].subTabs![0].properties?.push({
            title: 'Radius',
            name: 'radius',
            type: 'number',
            value: 5,
          });
          prop[0].subTabs![0].properties?.splice(1, 2);
          return prop;
        },
      },
      {
        title: 'Rectangle',
        icon: 'rectangle',
        name: 'label_rectangle',
        geometryType: 'plane',
        tabProperties: clone(SVGEditorToolboxLabelSharedTabProperties),
      },
      // {
      //   title: 'Ellipse',
      //   icon: 'circle',
      //   name: 'label_ellipse',
      //   geometryType: 'circle', //FIXME:
      //   tabProperties: clone(SVGEditorToolboxLabelSharedTabProperties),
      // },
      {
        title: 'Text',
        icon: 'abc',
        disabled: true,
        name: 'label_text',
        geometryType: 'text',
        tabPropertiesFunc: () => {
          const prop = clone<ToolBoxItemTabProperties[]>(
            SVGEditorToolboxLabelSharedTabProperties
          );
          prop.push({
            title: 'Content',
            name: 'content',
            properties: [
              {
                title: 'Label text',
                name: 'label',
                type: 'text',
                value: 'Label',
              },
            ],
          });
          prop[0].subTabs?.push({
            title: 'Text',
            name: 'text',
            properties: [
              {
                title: 'Font size',
                name: 'font_size',
                type: 'number',
                value: 14,
                hint: 'as pixel',
              },
            ],
          });

          return prop;
        },
      },
    ],
  },
  {
    title: 'Components',
    items: [], //TODO:
  },
];
