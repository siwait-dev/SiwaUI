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

export interface AuditPagedResponse {
  items: AuditLogDto[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface AuditLogQuery {
  page: number;
  pageSize: number;
  method: string | null;
  email: string;
  path: string;
  from: string;
  to: string;
}
