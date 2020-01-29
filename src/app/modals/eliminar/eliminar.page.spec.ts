import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarPage } from './eliminar.page';

describe('EliminarPage', () => {
  let component: EliminarPage;
  let fixture: ComponentFixture<EliminarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliminarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
