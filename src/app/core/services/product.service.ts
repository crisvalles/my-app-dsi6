import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product, Category } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = 'http://localhost:3000';
  private readonly productsUrl = `${this.apiUrl}/products`;
  private readonly categoriesUrl = `${this.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  private handleError = (error: any) => {
    console.error('[ProductService] error:', error);
    return throwError(() => error);
  };

  // CRUD Productos
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(catchError(this.handleError));
  }
  getById(id: number | string): Observable<Product> {
    return this.http.get<Product>(`${this.productsUrl}/${id}`).pipe(catchError(this.handleError));
  }
  create(payload: Product): Observable<Product> {
    return this.http.post<Product>(this.productsUrl, payload).pipe(catchError(this.handleError));
  }
  update(id: number | string, payload: Product): Observable<Product> {
    return this.http.put<Product>(`${this.productsUrl}/${id}`, payload).pipe(catchError(this.handleError));
  }
  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.productsUrl}/${id}`).pipe(catchError(this.handleError));
  }

  // Categorías
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl).pipe(catchError(this.handleError));
  }

  getProductsWithCategory(): Observable<Product[]> {
  return forkJoin({
    products: this.getAll(),
    categories: this.getCategories()
  }).pipe(
    map(({ products, categories }) => {
      // Mapeo de categorias: crea un Map donde el id de la categoria es la clave y el nombre es el valor
      const catMap = new Map<number, string>((categories ?? []).map(c => [Number(c.id), c.nombre]));  // Convertimos id de categoria a numero
      return (products ?? []).map(p => ({
        ...p,
        categoriaNombre: catMap.get(p.categoriaId) ?? '—'  // Asignamos el nombre de la categoria al producto
      }));
    }),
    catchError(this.handleError)
  );
}
}
