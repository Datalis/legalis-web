/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EmptyResultsComponent } from './empty-results.component';

describe('EmptyResultsComponent', () => {
  let component: EmptyResultsComponent;
  let fixture: ComponentFixture<EmptyResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmptyResultsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
