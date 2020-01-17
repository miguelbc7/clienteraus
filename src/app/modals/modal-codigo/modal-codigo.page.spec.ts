import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCodigoPage } from './modal-codigo.page';

describe('ModalCodigoPage', () => {
  let component: ModalCodigoPage;
  let fixture: ComponentFixture<ModalCodigoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCodigoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCodigoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
