import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ClientLogPagedResponse } from './log-viewer.models';

export const LogViewerActions = createActionGroup({
  source: 'Log Viewer',
  events: {
    'Enter Page': emptyProps(),
    'Load Logs': emptyProps(),
    'Load Logs Success': props<{ response: ClientLogPagedResponse }>(),
    'Load Logs Failure': emptyProps(),
    'Set Level Filter': props<{ level: string | null }>(),
    'Set User Filter': props<{ userId: string }>(),
    'Set Correlation Filter': props<{ correlationId: string }>(),
    'Set Date Range': props<{ from: string; to: string }>(),
    'Clear Filters': emptyProps(),
    'Set Page': props<{ page: number; pageSize: number }>(),
  },
});
