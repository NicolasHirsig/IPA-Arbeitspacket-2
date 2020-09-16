import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomDevComponent } from './room-dev.component';

describe('RoomDevComponent', () => {
  let component: RoomDevComponent;
  let fixture: ComponentFixture<RoomDevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomDevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
