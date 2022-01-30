import { GetServerSidePropsContext, NextApiRequest } from 'next';
import { AppContext } from 'next/app';
import { BaseSyntheticEvent } from 'react';

export type ReqOrContextType = AppContext &
  GetServerSidePropsContext &
  NextApiRequest | AppContext | GetServerSidePropsContext | NextApiRequest;

export interface IErrorObject {
  message: string;
  opts?: {
    [key: string]: string;
  };
}

export interface TypedFormEvent<T, F = {}> extends BaseSyntheticEvent<Event, EventTarget & T, EventTarget & F> {}

export interface IApiResponse extends IErrorObject {
  code: number;
  message?: string;
  fields?: string[];
  data?: {
    [key: string]: any;
  };
}
