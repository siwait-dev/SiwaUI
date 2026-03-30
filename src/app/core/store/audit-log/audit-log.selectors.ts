import { createSelector } from '@ngrx/store';
import { auditLogFeature } from './audit-log.reducer';

export const {
  selectLogs,
  selectTotalCount,
  selectLoading,
  selectPage,
  selectPageSize,
  selectMethod,
  selectEmail,
  selectPath,
  selectFrom,
  selectTo,
} = auditLogFeature;

export const selectAuditLogQuery = createSelector(
  selectPage,
  selectPageSize,
  selectMethod,
  selectEmail,
  selectPath,
  selectFrom,
  selectTo,
  (page, pageSize, method, email, path, from, to) => ({
    page,
    pageSize,
    method,
    email,
    path,
    from,
    to,
  }),
);
