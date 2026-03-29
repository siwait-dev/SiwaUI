/**
 * Centrale navigatieconfiguratie.
 * Wordt gebruikt door zowel de Sidebar (layout=sidebar)
 * als de Topbar (layout=topbar).
 */

export interface NavItem {
  labelKey: string;
  icon: string;
  route: string;
}

export interface NavGroup {
  /** i18n-sleutel voor de groepsnaam */
  labelKey: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    labelKey: 'NAV.GROUP_APP',
    items: [
      { labelKey: 'NAV.DASHBOARD', icon: 'pi pi-home', route: '/app/dashboard' },
      { labelKey: 'NAV.PROFILE', icon: 'pi pi-user', route: '/app/profile' },
      { labelKey: 'NAV.CHANGE_PASSWORD', icon: 'pi pi-lock', route: '/app/change-password' },
      { labelKey: 'NAV.DEMO', icon: 'pi pi-palette', route: '/app/demo' },
    ],
  },
  {
    labelKey: 'NAV.GROUP_ADMIN',
    items: [
      { labelKey: 'NAV.USERS', icon: 'pi pi-users', route: '/app/admin/users' },
      { labelKey: 'NAV.ROLES', icon: 'pi pi-shield', route: '/app/admin/roles' },
      { labelKey: 'NAV.TRANSLATIONS', icon: 'pi pi-language', route: '/app/admin/translations' },
      { labelKey: 'NAV.THEME', icon: 'pi pi-sun', route: '/app/admin/theme' },
      { labelKey: 'NAV.SETTINGS', icon: 'pi pi-cog', route: '/app/admin/settings' },
      { labelKey: 'NAV.PASSWORD_POLICY', icon: 'pi pi-key', route: '/app/admin/password-policy' },
      { labelKey: 'NAV.AUDIT', icon: 'pi pi-list', route: '/app/admin/audit' },
      { labelKey: 'NAV.LOGS', icon: 'pi pi-file-edit', route: '/app/admin/logs' },
    ],
  },
];
