export interface Product {
  id?: number;              // Identificador único
  codigo: string;           // Código interno o SKU
  nombre: string;           // Nombre del producto
  descripcion?: string;     // Descripción detallada
  categoriaId: number;      // Relación con categoría
  categoriaNombre?: string; // Nombre de la categoría (join opcional)
  precio: number;           // Precio de venta
  stock: number;            // Cantidad disponible
  activo: boolean;          // Estado del producto
  fechaCreacion?: string;   // ISO date
  fechaActualizacion?: string; // ISO date
}

export interface Category {
  id: number;
  nombre: string;
}