import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Person } from '../../../core/models/persona.model';
import { PersonService } from '../../../core/services/persona.service';
import { PersonaFormComponent } from '../../../components/persona-form/persona-form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { MapModalComponent } from '../../../components/map-modal/map-modal.component';

@Component({
  selector: 'app-persona-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './persona-list.component.html',
  styleUrl: './persona-list.component.css',
})
export class PersonaListComponent implements OnInit {
 displayedColumns: string[] = [
    'nombre',
    'apellidos',
    'dni',
    'correo',
    'telefono',
    'direccion',
    'pais',
    'departamento',
    'provincia',
    'distrito',
    'acciones'
  ];

  dataSource: MatTableDataSource<any>;
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private personService: PersonService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.loadPeopleWithLocation();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPeopleWithLocation(): void {
    this.isLoading = true;
    this.personService.getPeopleWithLocation().subscribe({
      next: (peopleWithLocation) => {
        this.dataSource.data = peopleWithLocation;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading people with location:', error);
        this.isLoading = false;
        this.loadPeople();
      }
    });
  }

  loadPeople(): void {
    this.personService.getPeople().subscribe({
      next: (people) => {
        this.dataSource.data = people;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading people:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(PersonaFormComponent, {
      width: '700px',
      height: '80vh',
      maxHeight: '80vh',
      panelClass: 'person-form-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPeopleWithLocation();
      }
    });
  }

  openEditDialog(person: Person): void {
    const dialogRef = this.dialog.open(PersonaFormComponent, {
      width: '700px',
      height: '80vh',
      maxHeight: '80vh',
      panelClass: 'person-form-dialog',
      data: { person }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPeopleWithLocation();
      }
    });
  }

  deletePerson(person: Person): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: `¿Estás seguro de que deseas eliminar a ${person.nombre} ${person.apellidos}? Esta acción no se puede deshacer.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.personService.deletePerson(person.id!).subscribe({
          next: () => {
            this.loadPeopleWithLocation();
            this.showSuccessMessage('Persona eliminada correctamente');
          },
          error: (error) => {
            console.error('Error deleting person:', error);
            this.showErrorMessage('Error al eliminar la persona');
          }
        });
      }
    });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  openMapDialog(person: any): void {
    // Verificar si hay coordenadas
    if (!person.coordenadas) {
      this.showErrorMessage('No hay coordenadas disponibles para esta persona');
      return;
    }

    this.dialog.open(MapModalComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: {
        nombre: person.nombre,
        apellidos: person.apellidos,
        direccion: person.direccion,
        pais: person.paisNombre || 'N/A',
        departamento: person.departamentoNombre || 'N/A',
        provincia: person.provinciaNombre || 'N/A',
        distrito: person.distritoNombre || 'N/A',
        coordenadas: person.coordenadas
      }
    });
  }

}
