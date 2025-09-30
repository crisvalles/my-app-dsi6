import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-acercade',
  standalone: true, // ✅ ahora es standalone
  imports: [CommonModule], // ✅ para usar *ngFor, ngIf, ngClass
  templateUrl: './acercade.component.html',
  styleUrls: ['./acercade.component.css']
})
export class AcercadeComponent {
  items = [
    {
      titulo: 'Nuestra Historia',
      descripcion: 'Somos una institución académica con una larga y sólida trayectoria de más de dos décadas de experiencia, dedicada a brindar una formación integral y de la más alta calidad. Nuestro compromiso se ha forjado a lo largo del tiempo, guiando a generaciones de estudiantes hacia el éxito profesional y personal con valores y excelencia.',
      imagen: ''
    },
    {
      titulo: 'Misión',
      descripcion: 'Nuestra misión fundamental es formar profesionales íntegros, éticos y altamente capacitados para los desafíos del futuro. Lo logramos a través de un modelo educativo innovador, un cuerpo docente de excelencia y una atención personalizada que fomenta el pensamiento crítico, la creatividad y el compromiso con el desarrollo sostenible de la sociedad.',
      imagen: ''
    },
    {
      titulo: 'Visión',
      descripcion: 'Aspiramos a consolidarnos como la institución líder en educación superior, reconocida a nivel internacional por su innovación, calidad académica y la capacidad de sus egresados de generar un impacto positivo y transformador en un mundo globalizado y en constante evolución.',
      imagen: ''
    }
    // {
    //   titulo: 'Valores',
    //   descripcion: 'Responsabilidad, innovación, respeto y compromiso con la sociedad.',
    //   imagen: 'assets/img/valores.jpg'
    // }
  ];
}
