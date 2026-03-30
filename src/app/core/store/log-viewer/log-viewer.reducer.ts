import { createFeature, createReducer, on } from '@ngrx/store';
import { LogViewerActions } from './log-viewer.actions';
import { ClientLogDto } from './log-viewer.models';
import { ADMIN_LOGS_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from '../../constants/paging.constants';

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
  page: DEFAULT_PAGE_NUMBER,
  pageSize: ADMIN_LOGS_PAGE_SIZE,
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
      page: DEFAULT_PAGE_NUMBER,
    })),
    on(LogViewerActions.setUserFilter, (state, { userId }) => ({
      ...state,
      userId,
      page: DEFAULT_PAGE_NUMBER,
    })),
    on(LogViewerActions.setCorrelationFilter, (state, { correlationId }) => ({
      ...state,
      correlationId,
      page: DEFAULT_PAGE_NUMBER,
    })),
    on(LogViewerActions.setDateRange, (state, { from, to }) => ({
      ...state,
      from,
      to,
      page: DEFAULT_PAGE_NUMBER,
    })),
    on(LogViewerActions.clearFilters, state => ({
      ...state,
      level: null,
      userId: '',
      correlationId: '',
      from: '',
      to: '',
      page: DEFAULT_PAGE_NUMBER,
    })),
    on(LogViewerActions.setPage, (state, { page, pageSize }) => ({
      ...state,
      page,
      pageSize,
    })),
  ),
});
