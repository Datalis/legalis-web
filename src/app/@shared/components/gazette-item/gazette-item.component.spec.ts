/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GazetteItemComponent } from './gazette-item.component';

describe('GazetteItemComponent', () => {
  let component: GazetteItemComponent;
  let fixture: ComponentFixture<GazetteItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GazetteItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GazetteItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
