import { PagedQuery, PagedResponse } from '../../models/api.models';

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

export interface ClientLogPagedResponse extends PagedResponse<ClientLogDto> {
  totalPages: number;
}

export interface LogViewerQuery extends PagedQuery {
  level: string | null;
  userId: string;
  correlationId: string;
  from: string;
  to: string;
}
