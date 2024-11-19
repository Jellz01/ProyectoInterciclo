import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarContratosComponent } from './listar-contratos.component';

describe('ListarContratosComponent', () => {
  let component: ListarContratosComponent;
  let fixture: ComponentFixture<ListarContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarContratosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
