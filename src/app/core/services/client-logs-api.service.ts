import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiQueryParams, PagedQuery } from '../models/api.models';
import { ApiService } from './api.service';

export interface ClientLogListQuery extends PagedQuery {
  level: string | null;
  userId: string;
  correlationId: string;
  from: string;
  to: string;
}

@Injectable({ providedIn: 'root' })
export class ClientLogsApiService {
  private readonly api = inject(ApiService);

  getLogs<T>(query: ClientLogListQuery): Observable<T> {
    const params: ApiQueryParams = {
      page: query.page,
      pageSize: query.pageSize,
    };

    if (query.level) params['level'] = query.level;
    if (query.userId) params['userId'] = query.userId;
    if (query.correlationId) params['correlationId'] = query.correlationId;
    if (query.from) params['from'] = new Date(query.from).toISOString();
    if (query.to) params['to'] = new Date(query.to).toISOString();

    return this.api.get<T>('logs/client', params);
  }
}
