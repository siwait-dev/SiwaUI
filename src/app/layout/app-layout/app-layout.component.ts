import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { ThemeSettingsFacade } from '../../core/store/theme-settings/theme-settings.facade';

/**
 * AppLayout — authenticated shell.
 *
 * Supports two layouts controlled by ThemeService:
 *  - 'sidebar'  → fixed left sidebar + content area
 *  - 'topbar'   → sticky top navigation bar + content area
 */
@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
})
export class AppLayoutComponent {
  private readonly themeSettingsFacade = inject(ThemeSettingsFacade);
  protected readonly layout = this.themeSettingsFacade.layout;

  /** Whether the sidebar is collapsed (only relevant in sidebar layout). */
  protected readonly sidebarCollapsed = signal(false);

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }
}
