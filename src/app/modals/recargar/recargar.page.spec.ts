import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecargarPage } from './recargar.page';

describe('RecargarPage', () => {
  let component: RecargarPage;
  let fixture: ComponentFixture<RecargarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecargarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecargarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
