import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesNotificacionesPage } from './detalles-notificaciones.page';

describe('DetallesNotificacionesPage', () => {
  let component: DetallesNotificacionesPage;
  let fixture: ComponentFixture<DetallesNotificacionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallesNotificacionesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesNotificacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
