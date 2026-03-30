import { createFeature, createReducer, on } from '@ngrx/store';
import { AuditLogActions } from './audit-log.actions';
import { AuditLogDto } from './audit-log.models';
import { ADMIN_LOGS_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from '../../constants/paging.constants';

export interface AuditLogState {
  logs: AuditLogDto[];
  totalCount: number;
  loading: boolean;
  page: number;
  pageSize: number;
  method: string | null;
  email: string;
  path: string;
  from: string;
  to: string;
}

const initialState: AuditLogState = {
  logs: [],
  totalCount: 0,
  loading: true,
  page: DEFAULT_PAGE_NUMBER,
  pageSize: ADMIN_LOGS_PAGE_SIZE,
  method: null,
  email: '',
  path: '',
  from: '',
  to: '',
};

export const auditLogFeature = createFeature({
  name: 'auditLog',
  reducer: createReducer(
    initialState,
    on(AuditLogActions.loadLogs, state => ({
      ...state,
      loading: true,
    })),
    on(AuditLogActions.loadLogsSuccess, (state, { response }) => ({
      ...state,
      logs: response.items,
      totalCount: response.totalCount,
      page: response.page,
      pageSize: response.pageSize,
      loading: false,
    })),
    on(AuditLogActions.loadLogsFailure, state => ({
      ...state,
      loading: false,
    })),
    on(AuditLogActions.setMethodFilter, (state, { method }) => ({
      ...state,
      method,
      page: DEFAULT_PAGE_NUMBER,
    })),
    on(AuditLogActions.setEmailFilter, (state, { email }) => ({
      ...state,
      email,
      page: DEFAULT_PAGE_NUMBER,
    })),
    on(AuditLogActions.setPathFilter, (state, { path }) => ({
      ...state,
      path,
      page: DEFAULT_PAGE_NUMBER,
    })),
    on(AuditLogActions.setDateRange, (state, { from, to }) => ({
      ...state,
      from,
      to,
      page: DEFAULT_PAGE_NUMBER,
    })),
    on(AuditLogActions.clearFilters, state => ({
      ...state,
      method: null,
      email: '',
      path: '',
      from: '',
      to: '',
      page: DEFAULT_PAGE_NUMBER,
    })),
    on(AuditLogActions.setPage, (state, { page, pageSize }) => ({
      ...state,
      page,
      pageSize,
    })),
  ),
});
