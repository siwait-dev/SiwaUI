import { createFeature, createReducer, on } from '@ngrx/store';
import { AuditLogActions } from './audit-log.actions';
import { AuditLogDto } from './audit-log.models';

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
  page: 1,
  pageSize: 50,
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
      page: 1,
    })),
    on(AuditLogActions.setEmailFilter, (state, { email }) => ({
      ...state,
      email,
      page: 1,
    })),
    on(AuditLogActions.setPathFilter, (state, { path }) => ({
      ...state,
      path,
      page: 1,
    })),
    on(AuditLogActions.setDateRange, (state, { from, to }) => ({
      ...state,
      from,
      to,
      page: 1,
    })),
    on(AuditLogActions.clearFilters, state => ({
      ...state,
      method: null,
      email: '',
      path: '',
      from: '',
      to: '',
      page: 1,
    })),
    on(AuditLogActions.setPage, (state, { page, pageSize }) => ({
      ...state,
      page,
      pageSize,
    })),
  ),
});
