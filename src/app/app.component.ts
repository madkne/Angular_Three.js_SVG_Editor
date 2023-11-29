import { AfterContentInit, Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MenuItem } from './common/interfaces';
import {
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';
import { PageName } from './common/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterContentInit {
  @ViewChild('drawer', { static: true }) public drawer!: MatDrawer;
  @ViewChild('mainMenu', { static: true }) public mainMenu!: MatSelectionList;
  selectedPage!: PageName;

  mainMenuItems: MenuItem[] = [
    {
      text: 'Dashboard',
      icon: 'dashboard',
      page: 'dashboard',
      disabled: true,
    },
    {
      text: 'SVG editor',
      icon: 'format_shapes',
      page: 'svg_editor',
    },
    {
      text: 'Application',
      icon: 'web_asset',
      page: 'application',
      disabled: true,
    },
    {
      text: '3D editor',
      icon: '3d_rotation',
      page: '3d_editor',
      disabled: true,
    },
  ];

  toggleMainDrawer() {
    this.drawer.toggle();
  }

  ngAfterContentInit(): void {
    this.drawer?.open();
    // =>select svg editor as default
    this.goToPage(this.mainMenuItems[1], true);
  }

  goToPage(item: MenuItem, selected: boolean) {
    this.mainMenuItems.map((i) => (i.selected = false));
    item.selected = selected;
    this.selectedPage = item.page;
  }
}
