import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NAV_GROUPS, NavGroup } from '../../../core/navigation/nav-config';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  /** Of de sidebar ingeklapt is — doorgegeven door AppLayout. */
  readonly collapsed = input<boolean>(false);

  readonly collapseToggle = output<void>();
  readonly navGroups: NavGroup[] = NAV_GROUPS;
}
