export type IdType = string | number;

export type QueryParamsType = {
  page?: number;
  limit?: number;
  [key: string]: string | number | undefined;
};

export type APIResponseType = {
  data: any;
  message: string;
  statusCode: number;
  success: boolean;
}
