import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPerfilElegidoComponent } from './editar-perfil-elegido.component';

describe('EditarPerfilElegidoComponent', () => {
  let component: EditarPerfilElegidoComponent;
  let fixture: ComponentFixture<EditarPerfilElegidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPerfilElegidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPerfilElegidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
