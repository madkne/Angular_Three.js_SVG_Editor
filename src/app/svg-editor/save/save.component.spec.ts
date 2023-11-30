import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgEditorSaveComponent } from './save.component';

describe('SaveComponent', () => {
  let component: SvgEditorSaveComponent;
  let fixture: ComponentFixture<SvgEditorSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SvgEditorSaveComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgEditorSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
