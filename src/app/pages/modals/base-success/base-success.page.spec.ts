import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseSuccessPage } from './base-success.page';

describe('BaseSuccessPage', () => {
  let component: BaseSuccessPage;
  let fixture: ComponentFixture<BaseSuccessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseSuccessPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
