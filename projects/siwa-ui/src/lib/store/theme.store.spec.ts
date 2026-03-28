import { TestBed } from '@angular/core/testing';
import { ThemeStore } from './theme.store';

describe('ThemeStore', () => {
  let store: InstanceType<typeof ThemeStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(ThemeStore);
  });

  it('should start with light theme and sidebar layout', () => {
    expect(store.theme()).toBe('light');
    expect(store.layout()).toBe('sidebar');
  });

  it('should update theme', () => {
    store.setTheme('dark');
    expect(store.theme()).toBe('dark');
  });

  it('should update layout', () => {
    store.setLayout('topbar');
    expect(store.layout()).toBe('topbar');
  });

  it('should update theme without affecting layout', () => {
    store.setLayout('topbar');
    store.setTheme('dark');
    expect(store.layout()).toBe('topbar');
  });
});
