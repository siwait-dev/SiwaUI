export interface ClientLogDto {
  id: number;
  level: string;
  message: string;
  stackTrace?: string;
  url: string;
  userAgent?: string;
  userId?: string;
  correlationId?: string;
  timestamp: string;
  actionTrail?: string;
  context?: string;
}

export interface ClientLogPagedResponse {
  items: ClientLogDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LogViewerQuery {
  page: number;
  pageSize: number;
  level: string | null;
  userId: string;
  correlationId: string;
  from: string;
  to: string;
}
