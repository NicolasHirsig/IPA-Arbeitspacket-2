import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSmComponent } from './room-sm.component';

describe('RoomSmComponent', () => {
  let component: RoomSmComponent;
  let fixture: ComponentFixture<RoomSmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomSmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
