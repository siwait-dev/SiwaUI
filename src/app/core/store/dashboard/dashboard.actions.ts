import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DashboardStats } from './dashboard.models';

export const DashboardActions = createActionGroup({
  source: 'Dashboard',
  events: {
    'Enter Page': emptyProps(),
    'Leave Page': emptyProps(),
    'Load Stats': emptyProps(),
    'Load Stats Success': props<{ stats: DashboardStats }>(),
    'Load Stats Failure': emptyProps(),
    'Live Connected': emptyProps(),
    'Live Connection Failed': emptyProps(),
    'User Registered': props<{ email: string; registeredAt: string }>(),
  },
});
