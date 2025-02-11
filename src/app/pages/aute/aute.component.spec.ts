import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuteComponent } from './aute.component';

describe('AuteComponent', () => {
  let component: AuteComponent;
  let fixture: ComponentFixture<AuteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
