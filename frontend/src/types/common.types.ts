// Common/shared TypeScript types

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface TableColumn {
  key: string;
  title: string;
  dataIndex?: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: any) => React.ReactNode;
}

export interface FilterState {
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
  [key: string]: any;
}
