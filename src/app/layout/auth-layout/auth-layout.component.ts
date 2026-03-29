import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * AuthLayout — gebruikt voor publieke pagina's (login, register, …).
 * Centreert de inhoud verticaal en horizontaal op de pagina.
 */
@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {}
