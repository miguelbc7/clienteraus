import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoFamiliaPage } from './saldo-familia.page';

describe('SaldoFamiliaPage', () => {
  let component: SaldoFamiliaPage;
  let fixture: ComponentFixture<SaldoFamiliaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaldoFamiliaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaldoFamiliaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
