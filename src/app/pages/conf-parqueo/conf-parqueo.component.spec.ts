import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfParqueoComponent } from './conf-parqueo.component';

describe('ConfParqueoComponent', () => {
  let component: ConfParqueoComponent;
  let fixture: ComponentFixture<ConfParqueoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfParqueoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfParqueoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
