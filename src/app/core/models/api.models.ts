export type ApiQueryParamValue = string | number | boolean;

export type ApiQueryParams = Record<string, ApiQueryParamValue>;

export interface PagedQuery {
  page: number;
  pageSize: number;
}

export interface PagedResponse<TItem> {
  items: TItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages?: number;
}

export interface ApiErrorMessage {
  code?: string;
  message?: string;
  technicalMessage?: string;
  statusCode?: number;
  type?: string;
}

export interface ApiErrorEnvelope {
  hasError?: boolean;
  errors?: ApiErrorMessage[];
}

export interface ApiErrorPayload extends ApiErrorMessage {
  status?: number;
  error?: ApiErrorEnvelope;
  errors?: ApiErrorMessage[];
}

export interface TranslationDictionaryResponse {
  translations: Record<string, string>;
}
