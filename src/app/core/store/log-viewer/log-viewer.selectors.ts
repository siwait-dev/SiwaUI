import { createSelector } from '@ngrx/store';
import { logViewerFeature } from './log-viewer.reducer';

export const {
  selectLogs,
  selectTotalCount,
  selectLoading,
  selectPage,
  selectPageSize,
  selectLevel,
  selectUserId,
  selectCorrelationId,
  selectFrom,
  selectTo,
} = logViewerFeature;

export const selectLogViewerQuery = createSelector(
  selectPage,
  selectPageSize,
  selectLevel,
  selectUserId,
  selectCorrelationId,
  selectFrom,
  selectTo,
  (page, pageSize, level, userId, correlationId, from, to) => ({
    page,
    pageSize,
    level,
    userId,
    correlationId,
    from,
    to,
  }),
);
