import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPoliticasPage } from './modal-politicas.page';

describe('ModalPoliticasPage', () => {
  let component: ModalPoliticasPage;
  let fixture: ComponentFixture<ModalPoliticasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPoliticasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPoliticasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
