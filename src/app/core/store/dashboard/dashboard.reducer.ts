import { createFeature, createReducer, on } from '@ngrx/store';
import { DashboardActions } from './dashboard.actions';
import { DashboardStats, LiveNotification } from './dashboard.models';

export interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  liveNotifications: LiveNotification[];
  liveConnected: boolean;
}

const initialState: DashboardState = {
  stats: null,
  loading: true,
  liveNotifications: [],
  liveConnected: false,
};

export const dashboardFeature = createFeature({
  name: 'dashboard',
  reducer: createReducer(
    initialState,
    on(DashboardActions.loadStats, state => ({
      ...state,
      loading: true,
    })),
    on(DashboardActions.loadStatsSuccess, (state, { stats }) => ({
      ...state,
      stats,
      loading: false,
    })),
    on(DashboardActions.loadStatsFailure, state => ({
      ...state,
      loading: false,
    })),
    on(DashboardActions.liveConnected, state => ({
      ...state,
      liveConnected: true,
    })),
    on(DashboardActions.liveConnectionFailed, state => ({
      ...state,
      liveConnected: false,
    })),
    on(DashboardActions.leavePage, state => ({
      ...state,
      liveConnected: false,
    })),
    on(DashboardActions.userRegistered, (state, { email, registeredAt }) => ({
      ...state,
      stats: state.stats
        ? {
            ...state.stats,
            totalUsers: state.stats.totalUsers + 1,
          }
        : state.stats,
      liveNotifications: [
        { email, time: new Date(registeredAt) },
        ...state.liveNotifications.slice(0, 9),
      ],
    })),
  ),
});
