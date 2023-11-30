import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgEditorEditPropertiesComponent } from './edit-properties.component';

describe('EditPropertiesComponent', () => {
  let component: SvgEditorEditPropertiesComponent;
  let fixture: ComponentFixture<SvgEditorEditPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SvgEditorEditPropertiesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgEditorEditPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
