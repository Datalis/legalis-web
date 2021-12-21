/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NormativeItemComponent } from './normative-item.component';

describe('NormativeItemComponent', () => {
  let component: NormativeItemComponent;
  let fixture: ComponentFixture<NormativeItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NormativeItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NormativeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
