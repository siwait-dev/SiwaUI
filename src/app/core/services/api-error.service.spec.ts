import { TestBed } from '@angular/core/testing';
import { ApiErrorService } from './api-error.service';

describe('ApiErrorService', () => {
  let service: ApiErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiErrorService);
  });

  it('returns the backend message when it is filled', () => {
    const result = service.getMessageKey({
      error: {
        errors: [{ code: 'USER.LOGIN.INVALID_CREDENTIALS', message: 'Aangepaste foutmelding' }],
      },
    });

    expect(result).toBe('Aangepaste foutmelding');
  });

  it('falls back to the backend code when message is empty', () => {
    const result = service.getMessageKey({
      error: {
        errors: [{ code: 'USER.LOGIN.INVALID_CREDENTIALS', message: '   ' }],
      },
    });

    expect(result).toBe('USER.LOGIN.INVALID_CREDENTIALS');
  });

  it('supports direct errors payloads too', () => {
    const result = service.getMessageKey({
      errors: [{ code: 'ADMIN.ROLES.ERRORS.CREATE_FAILED', message: '' }],
    });

    expect(result).toBe('ADMIN.ROLES.ERRORS.CREATE_FAILED');
  });

  it('falls back to the http status key when no message or code exists', () => {
    const result = service.getMessageKey({ status: 404 });

    expect(result).toBe('API_ERRORS.HTTP_404');
  });

  it('returns the provided fallback when nothing useful exists', () => {
    const result = service.getMessageKey(null, 'CUSTOM.FALLBACK');

    expect(result).toBe('CUSTOM.FALLBACK');
  });
});
