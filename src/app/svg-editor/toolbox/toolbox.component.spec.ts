import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgEditorToolboxComponent } from './toolbox.component';

describe('ToolboxComponent', () => {
  let component: SvgEditorToolboxComponent;
  let fixture: ComponentFixture<SvgEditorToolboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SvgEditorToolboxComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgEditorToolboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
