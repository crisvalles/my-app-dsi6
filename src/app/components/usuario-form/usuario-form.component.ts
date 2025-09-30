import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { Usuario } from '../../core/models/usuario.model';
import { UsuarioService } from '../../core/services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    DatePipe
  ],
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css'],
})
export class UsuarioFormComponent implements OnInit {
  usuarioForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UsuarioFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usuario: Usuario }
  ) {
    this.usuarioForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.data?.usuario) {
      this.isEditMode = true;
      this.loadFormData(this.data.usuario);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.minLength(6)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [''],
      activo: [true],
      fechaCreacion: ['']
    });
  }

  private loadFormData(usuario: Usuario): void {
    this.usuarioForm.patchValue({
      username: usuario.username,
      correo: usuario.correo,
      telefono: usuario.telefono || '',
      activo: usuario.activo !== undefined ? usuario.activo : true,
      fechaCreacion: usuario.fechaCreacion || ''
    });

    // En modo edición, la contraseña no es requerida
    this.usuarioForm.get('password')?.clearValidators();
    this.usuarioForm.get('password')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      this.isLoading = true;
      
      const formData = { ...this.usuarioForm.value };

      // Si estamos en modo edición y no se cambió la contraseña, eliminarla del objeto
      if (this.isEditMode && !formData.password) {
        delete formData.password;
      }

      const request$ = this.isEditMode
        ? this.usuarioService.updateUsuario(this.data.usuario.id!, formData)
        : this.usuarioService.createUsuario(formData);

      request$.subscribe({
        next: () => {
          this.isLoading = false;
          this.showMessage(`Usuario ${this.isEditMode ? 'actualizado' : 'creado'} correctamente`, 'success');
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error saving usuario:', error);
          this.showMessage(`Error al ${this.isEditMode ? 'actualizar' : 'crear'} el usuario`, 'error');
        }
      });
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.markFormGroupTouched(this.usuarioForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private showMessage(message: string, type: 'success' | 'error' | 'warn'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: [`${type}-snackbar`],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  // Método para validar si el formulario tiene errores
  hasError(controlName: string, errorName: string): boolean {
    const control = this.usuarioForm.get(controlName);
    return control ? control.hasError(errorName) && control.touched : false;
  }

  // Método para obtener el mensaje de error
  getErrorMessage(controlName: string): string {
    const control = this.usuarioForm.get(controlName);
    
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    
    if (control?.hasError('email')) {
      return 'Formato de correo inválido';
    }
    
    return '';
  }
}