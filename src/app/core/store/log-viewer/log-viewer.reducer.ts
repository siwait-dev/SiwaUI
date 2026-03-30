import { createFeature, createReducer, on } from '@ngrx/store';
import { LogViewerActions } from './log-viewer.actions';
import { ClientLogDto } from './log-viewer.models';

export interface LogViewerState {
  logs: ClientLogDto[];
  totalCount: number;
  loading: boolean;
  page: number;
  pageSize: number;
  level: string | null;
  userId: string;
  correlationId: string;
  from: string;
  to: string;
}

const initialState: LogViewerState = {
  logs: [],
  totalCount: 0,
  loading: true,
  page: 1,
  pageSize: 50,
  level: null,
  userId: '',
  correlationId: '',
  from: '',
  to: '',
};

export const logViewerFeature = createFeature({
  name: 'logViewer',
  reducer: createReducer(
    initialState,
    on(LogViewerActions.loadLogs, state => ({
      ...state,
      loading: true,
    })),
    on(LogViewerActions.loadLogsSuccess, (state, { response }) => ({
      ...state,
      logs: response.items,
      totalCount: response.totalCount,
      page: response.page,
      pageSize: response.pageSize,
      loading: false,
    })),
    on(LogViewerActions.loadLogsFailure, state => ({
      ...state,
      loading: false,
    })),
    on(LogViewerActions.setLevelFilter, (state, { level }) => ({
      ...state,
      level,
      page: 1,
    })),
    on(LogViewerActions.setUserFilter, (state, { userId }) => ({
      ...state,
      userId,
      page: 1,
    })),
    on(LogViewerActions.setCorrelationFilter, (state, { correlationId }) => ({
      ...state,
      correlationId,
      page: 1,
    })),
    on(LogViewerActions.setDateRange, (state, { from, to }) => ({
      ...state,
      from,
      to,
      page: 1,
    })),
    on(LogViewerActions.clearFilters, state => ({
      ...state,
      level: null,
      userId: '',
      correlationId: '',
      from: '',
      to: '',
      page: 1,
    })),
    on(LogViewerActions.setPage, (state, { page, pageSize }) => ({
      ...state,
      page,
      pageSize,
    })),
  ),
});
