import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Product, Category } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product-form',
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
    MatSnackBarModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;

  // ✅ Agregado para evitar errores en HTML
  isLoading = false;
  isLoadingCats = false;

  categories: Category[] = [];
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product }
  ) {
    this.productForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadCategories();
    if (this.data?.product) {
      this.isEditMode = true;
      this.loadFormData(this.data.product);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      codigo: ['', [Validators.required, Validators.maxLength(30)]],
      nombre: ['', [Validators.required, Validators.maxLength(120)]],
      descripcion: [''],
      categoriaId: [null, [Validators.required]],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      activo: [true, [Validators.required]],
    });
  }

private loadFormData(product: Product): void {
  this.productForm.patchValue({
    codigo: product.codigo,
    nombre: product.nombre,
    descripcion: product.descripcion || '',
    categoriaId: product.categoriaId,  
    precio: product.precio,
    stock: product.stock,
    activo: product.activo,
  });
}


private loadCategories(): void {
  this.isLoadingCats = true;
  this.productForm.get('categoriaId')?.disable();

  this.productService.getCategories().subscribe({
    next: (cats) => {
      this.categories = cats?.map(cat => ({
        ...cat,
        id: Number(cat.id), // Convertir el id de la categoría a un número
      })) || [];
      this.isLoadingCats = false;
      this.productForm.get('categoriaId')?.enable();
    },
    error: (err) => {
      console.error('Error loading categories:', err);
      this.isLoadingCats = false;
      this.productForm.get('categoriaId')?.enable();
    },
  });
}


  private showMessage(message: string, type: 'success' | 'error' | 'warn' = 'success'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: [`${type}-snackbar`],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

 onSubmit(): void {
  if (this.productForm.invalid || this.isSaving) return;

  this.isSaving = true;
  const raw = this.productForm.getRawValue();

  // Asegurarse de que los valores sean números
  const payload: Product = {
    ...raw,
    precio: Number(raw.precio),
    stock: Number(raw.stock),
    categoriaId: Number(raw.categoriaId),  // Asegura que sea el id numérico
  };

  const request$ = this.isEditMode && this.data.product?.id
    ? this.productService.update(this.data.product.id, payload)
    : this.productService.create(payload);

  request$.subscribe({
    next: () => {
      this.isSaving = false;
      this.showMessage('Producto guardado correctamente', 'success');
      this.dialogRef.close(true);
    },
    error: (error) => {
      this.isSaving = false;
      console.error('Error saving product:', error);
      this.showMessage('Error al guardar el producto', 'error');
    },
  });
}


  onCancel(): void {
    this.dialogRef.close(false);
  }
}