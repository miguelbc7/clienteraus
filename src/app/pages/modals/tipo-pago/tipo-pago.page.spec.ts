import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoPagoPage } from './tipo-pago.page';

describe('TipoPagoPage', () => {
  let component: TipoPagoPage;
  let fixture: ComponentFixture<TipoPagoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoPagoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoPagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
