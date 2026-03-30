import { PagedQuery, PagedResponse } from '../../models/api.models';

export interface AuditLogDto {
  id: number;
  timestamp: string;
  method: string;
  path: string;
  email?: string;
  ipAddress?: string;
  statusCode: number;
  durationMs: number;
}

export type AuditPagedResponse = PagedResponse<AuditLogDto>;

export interface AuditLogQuery extends PagedQuery {
  method: string | null;
  email: string;
  path: string;
  from: string;
  to: string;
}
