import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPerfilDespuesComponent } from './editar-perfil-despues.component';

describe('EditarPerfilDespuesComponent', () => {
  let component: EditarPerfilDespuesComponent;
  let fixture: ComponentFixture<EditarPerfilDespuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPerfilDespuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPerfilDespuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
