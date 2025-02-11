import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearUsFComponent } from './crear-us-f.component';

describe('CrearUsFComponent', () => {
  let component: CrearUsFComponent;
  let fixture: ComponentFixture<CrearUsFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearUsFComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearUsFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
