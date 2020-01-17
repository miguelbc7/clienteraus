import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Register3Page } from './register3.page';

describe('Register3Page', () => {
  let component: Register3Page;
  let fixture: ComponentFixture<Register3Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Register3Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Register3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
