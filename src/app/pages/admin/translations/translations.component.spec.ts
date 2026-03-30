import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslationsComponent } from './translations.component';
import { ApiService } from '../../../core/services/api.service';
import { ApiErrorService } from '../../../core/services/api-error.service';
import { TranslationsEffects } from '../../../core/store/translations/translations.effects';
import { translationsFeature } from '../../../core/store/translations/translations.reducer';

describe('TranslationsComponent', () => {
  let confirmSpy: ReturnType<typeof vi.fn>;

  const api = {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  };

  const apiError = {
    getMessageKey: vi.fn(),
  };

  beforeEach(async () => {
    confirmSpy = vi.fn();
    api.get.mockReset();
    api.post.mockReset();
    api.delete.mockReset();
    apiError.getMessageKey.mockReset();

    api.get.mockImplementation((url: string) => {
      if (url === 'translations/nl/flat') {
        return of({ translations: { 'USER.LOGIN.TITLE': 'Inloggen' } });
      }

      if (url === 'translations/en/flat') {
        return of({ translations: { 'USER.LOGIN.TITLE': 'Login', 'COMMON.SAVE': 'Save' } });
      }

      return of({});
    });

    api.post.mockReturnValue(of({}));
    api.delete.mockReturnValue(of({}));
    apiError.getMessageKey.mockReturnValue('API_ERRORS.UNKNOWN_ERROR');

    await TestBed.configureTestingModule({
      imports: [TranslationsComponent, TranslateModule.forRoot()],
      providers: [
        provideStore(),
        provideState(translationsFeature),
        provideEffects(TranslationsEffects),
        { provide: ApiService, useValue: api },
        { provide: ApiErrorService, useValue: apiError },
        {
          provide: ConfirmationService,
          useValue: {
            confirm: confirmSpy,
          },
        },
      ],
    }).compileComponents();
  });

  it('loads and merges flat translations on init', () => {
    const fixture = TestBed.createComponent(TranslationsComponent);
    fixture.detectChanges();

    expect(api.get).toHaveBeenCalledWith('translations/nl/flat');
    expect(api.get).toHaveBeenCalledWith('translations/en/flat');
    expect(fixture.componentInstance['rows']()).toEqual([
      { key: 'COMMON.SAVE', nl: '', en: 'Save' },
      { key: 'USER.LOGIN.TITLE', nl: 'Inloggen', en: 'Login' },
    ]);
  });

  it('requires a key before saving', () => {
    const fixture = TestBed.createComponent(TranslationsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component['editKey'] = ' ';
    component['editNl'] = 'Hallo';
    component['editEn'] = '';

    component['saveTranslation']();

    expect(component['editError']()).toBe('ADMIN.TRANSLATIONS.ERRORS.KEY_REQUIRED');
    expect(api.post).not.toHaveBeenCalled();
  });

  it('requires at least one translation value before saving', () => {
    const fixture = TestBed.createComponent(TranslationsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component['editKey'] = 'USER.LOGIN.TITLE';
    component['editNl'] = ' ';
    component['editEn'] = ' ';

    component['saveTranslation']();

    expect(component['editError']()).toBe('ADMIN.TRANSLATIONS.ERRORS.VALUE_REQUIRED');
    expect(api.post).not.toHaveBeenCalled();
  });

  it('saves nl and en translations and updates the list through the store', async () => {
    const fixture = TestBed.createComponent(TranslationsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component['editDialogVisible'] = true;
    component['editKey'] = 'USER.REGISTER.TITLE';
    component['editModule'] = 'User';
    component['editNl'] = 'Registreren';
    component['editEn'] = 'Register';

    component['saveTranslation']();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(api.post).toHaveBeenCalledWith('translations', {
      key: 'USER.REGISTER.TITLE',
      languageCode: 'nl',
      value: 'Registreren',
      module: 'User',
    });
    expect(api.post).toHaveBeenCalledWith('translations', {
      key: 'USER.REGISTER.TITLE',
      languageCode: 'en',
      value: 'Register',
      module: 'User',
    });
    expect(component['editDialogVisible']).toBe(false);
    expect(api.get).toHaveBeenCalledTimes(2);
    expect(component['rows']()).toContainEqual({
      key: 'USER.REGISTER.TITLE',
      nl: 'Registreren',
      en: 'Register',
    });
  });

  it('shows mapped delete error feedback when removing a translation fails', async () => {
    api.delete.mockReset();
    api.delete.mockReturnValueOnce(of({})).mockReturnValueOnce(throwError(() => ({ status: 500 })));
    apiError.getMessageKey.mockReturnValue('ADMIN.TRANSLATIONS.ERRORS.DELETE_FAILED');

    const fixture = TestBed.createComponent(TranslationsComponent);
    const component = fixture.componentInstance;
    const translate = TestBed.inject(TranslateService);
    const messageService = fixture.debugElement.injector.get(MessageService);
    const addSpy = vi.spyOn(messageService, 'add');
    vi.spyOn(translate, 'instant').mockImplementation((key: string | string[]) =>
      Array.isArray(key) ? key[0] : key,
    );
    fixture.detectChanges();

    component['deleteTranslation']({ key: 'USER.LOGIN.TITLE', nl: 'Inloggen', en: 'Login' });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(apiError.getMessageKey).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'ADMIN.TRANSLATIONS.ERRORS.DELETE_FAILED',
    });
  });
});
