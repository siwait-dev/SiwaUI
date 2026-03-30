import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiQueryParams, PagedQuery } from '../models/api.models';
import { ApiService } from './api.service';

export interface AuditLogListQuery extends PagedQuery {
  method: string | null;
  email: string;
  path: string;
  from: string;
  to: string;
}

@Injectable({ providedIn: 'root' })
export class AuditLogApiService {
  private readonly api = inject(ApiService);

  getLogs<T>(query: AuditLogListQuery): Observable<T> {
    const params: ApiQueryParams = {
      page: query.page,
      pageSize: query.pageSize,
    };

    if (query.method) params['method'] = query.method;
    if (query.email) params['email'] = query.email;
    if (query.path) params['path'] = query.path;
    if (query.from) params['from'] = new Date(query.from).toISOString();
    if (query.to) params['to'] = new Date(query.to).toISOString();

    return this.api.get<T>('audit', params);
  }
}
