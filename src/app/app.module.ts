import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';

import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SvgEditorComponent } from './svg-editor/svg-editor.component';
import { MatListModule } from '@angular/material/list';
import { SvgEditorToolboxComponent } from './svg-editor/toolbox/toolbox.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SvgEditorWorkspaceComponent } from './svg-editor/workspace/workspace.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SvgEditorEditPropertiesComponent } from './svg-editor/edit-properties/edit-properties.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { SvgEditorSaveComponent } from './svg-editor/save/save.component';

@NgModule({
  declarations: [
    AppComponent,
    SvgEditorComponent,
    SvgEditorToolboxComponent,
    SvgEditorWorkspaceComponent,
    SvgEditorEditPropertiesComponent,
    SvgEditorSaveComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    LayoutModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    MatListModule,
    MatExpansionModule,
    DragDropModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTabsModule,
    MatInputModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
