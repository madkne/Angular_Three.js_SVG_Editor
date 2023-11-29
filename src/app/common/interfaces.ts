import { PageName } from './types';

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
  selected?: boolean;
  icon?: string;
  tabProperties?: ToolBoxItemTabProperties[];
}

export interface ToolBoxItemTabProperties {
  title: string;
  properties?: ToolBoxItemProperty[];
  subTabs?: ToolBoxItemTabProperties[];
}

export interface ToolBoxItemProperty {
  title: string;
  name: string;
  type: 'string' | 'number' | 'color';
  defaultValue?: any;
}
