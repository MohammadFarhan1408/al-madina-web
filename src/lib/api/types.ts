// Shared API contract types — mirror the backend response envelopes (doc §7).

/** Standard success envelope: `{ data, message? }`. */
export type ApiEnvelope<T> = { data: T; message?: string };

/** Paginated payload shape returned by list endpoints. */
export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};

/** Standard error envelope: `{ status, message, code, details? }`. */
export type ApiErrorBody = {
  status: number;
  message: string;
  code?: string;
  details?: { issues?: Record<string, string[]> } & Record<string, unknown>;
};

/** Normalized error surfaced to the UI after the interceptor runs. */
export class ApiError extends Error {
  status: number;
  code?: string;
  details?: ApiErrorBody["details"];

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiError";
    this.status = body.status;
    this.code = body.code;
    this.details = body.details;
  }
}

/** User-facing message from a caught error, with a fallback for non-API errors. */
export function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback;
}
