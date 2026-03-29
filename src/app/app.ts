import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '../../projects/siwa-ui/src/lib/services/theme.service';
import { LocaleService } from '../../projects/siwa-ui/src/lib/services/locale.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    inject(ThemeService).init();
    inject(LocaleService).init();
  }
}
