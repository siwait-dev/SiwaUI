import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AuditPagedResponse } from './audit-log.models';

export const AuditLogActions = createActionGroup({
  source: 'Audit Log',
  events: {
    'Enter Page': emptyProps(),
    'Load Logs': emptyProps(),
    'Load Logs Success': props<{ response: AuditPagedResponse }>(),
    'Load Logs Failure': emptyProps(),
    'Set Method Filter': props<{ method: string | null }>(),
    'Set Email Filter': props<{ email: string }>(),
    'Set Path Filter': props<{ path: string }>(),
    'Set Date Range': props<{ from: string; to: string }>(),
    'Clear Filters': emptyProps(),
    'Set Page': props<{ page: number; pageSize: number }>(),
  },
});
