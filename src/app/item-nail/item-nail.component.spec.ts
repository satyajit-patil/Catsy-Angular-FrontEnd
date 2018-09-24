import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemNailComponent } from './item-nail.component';

describe('ItemNailComponent', () => {
  let component: ItemNailComponent;
  let fixture: ComponentFixture<ItemNailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemNailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemNailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
