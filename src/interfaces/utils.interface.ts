import {
  DetailedHTMLProps,
  Dispatch,
  InputHTMLAttributes,
  SetStateAction,
} from 'react';

export type StateSetter<T> = Dispatch<SetStateAction<T>>;

export type ElementProps<T = HTMLElement> = DetailedHTMLProps<
  InputHTMLAttributes<T>,
  T
>;

export interface IFetchPagination {
  total: number;
  page_size: number;
  current_page: number;
  total_pages: number;
  next: boolean;
  previous: boolean;
}

export interface IFetchResponse<T = any> {
  data?: T;
  message?: string;
  status: 'error' | 'success';
  pagination?: IFetchPagination;
}
