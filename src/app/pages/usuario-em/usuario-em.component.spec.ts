import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioEmComponent } from './usuario-em.component';

describe('UsuarioEmComponent', () => {
  let component: UsuarioEmComponent;
  let fixture: ComponentFixture<UsuarioEmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioEmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioEmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
