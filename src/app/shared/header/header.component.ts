import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider'; // ✅ AGREGAR ESTA IMPORTACIÓN
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink, 
    RouterLinkActive, 
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule // ✅ AGREGAR ESTA IMPORTACIÓN
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: any;
  isAdmin = false;
  private userSub!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userSub = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = user?.username === 'admin'; // O tu lógica para admin
    });
  }

  logout(): void {
    this.authService.logout();
  }

  changePassword(): void {
    // Implementar cambio de contraseña
    console.log('Cambiar contraseña');
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}