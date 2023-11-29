import { ToolBoxGroup, ToolBoxItemTabProperties } from './interfaces';

const SVGEditorToolboxLabelSharedTabProperties: ToolBoxItemTabProperties[] = [
  {
    title: 'Content',
    properties: [
      {
        title: 'Label text',
        name: 'label',
        type: 'string',
        defaultValue: 'Label',
      },
    ],
  },
  {
    title: 'View',
    subTabs: [
      {
        title: 'Text',
        properties: [
          {
            title: 'Font size',
            name: 'font_size',
            type: 'number',
            defaultValue: 1,
          },
        ],
      },
      {
        title: 'Shape',
        properties: [
          {
            title: 'Fill',
            name: 'fill',
            type: 'color',
            defaultValue: 'black',
          },
          {
            title: 'Width',
            name: 'width',
            type: 'number',
            defaultValue: 3,
          },
          {
            title: 'Height',
            name: 'height',
            type: 'number',
            defaultValue: 1,
          },
        ],
      },
    ],
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
        tabProperties: SVGEditorToolboxLabelSharedTabProperties,
      },
      {
        title: 'Rectangle',
        icon: 'rectangle',
        tabProperties: SVGEditorToolboxLabelSharedTabProperties,
      },
      {
        title: 'Ellipse',
        icon: 'circle',
        tabProperties: SVGEditorToolboxLabelSharedTabProperties,
      },
      {
        title: 'Text',
        icon: 'abc',
        tabProperties: SVGEditorToolboxLabelSharedTabProperties,
      },
    ],
  },
  {
    title: 'Components',
    items: [], //TODO:
  },
];
