import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgEditorWorkspaceComponent } from './workspace.component';

describe('WorkspaceComponent', () => {
  let component: SvgEditorWorkspaceComponent;
  let fixture: ComponentFixture<SvgEditorWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SvgEditorWorkspaceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgEditorWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
