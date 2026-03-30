import { TestBed } from '@angular/core/testing';
import { provideState, provideStore } from '@ngrx/store';
import { ThemeStoreFacade } from './theme/theme.facade';
import { themeStoreFeature } from './theme/theme.reducer';

describe('ThemeStoreFacade', () => {
  let facade: ThemeStoreFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore(), provideState(themeStoreFeature)],
    });
    facade = TestBed.inject(ThemeStoreFacade);
  });

  it('should start with light theme and sidebar layout', () => {
    expect(facade.theme()).toBe('light');
    expect(facade.layout()).toBe('sidebar');
  });

  it('should update theme', () => {
    facade.setTheme('dark');
    expect(facade.theme()).toBe('dark');
  });

  it('should update layout', () => {
    facade.setLayout('topbar');
    expect(facade.layout()).toBe('topbar');
  });

  it('should update theme without affecting layout', () => {
    facade.setLayout('topbar');
    facade.setTheme('dark');
    expect(facade.layout()).toBe('topbar');
  });
});
