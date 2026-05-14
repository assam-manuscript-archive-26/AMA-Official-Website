import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import tokens from "./tokens.json";

interface Tokens {
  [key: string]: string | false;
}

const base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function toBase64(num: number): string {
  let result = "";
  const str = num.toString();
  for (let i = 0; i < str.length; i++) {
    const charCode = parseInt(str[i]);
    result += base64chars[charCode % 64];
  }
  return result;
}

export const _DATABASE = import.meta.env.PUBLIC_DATABASE || "s5_intern_database";
export const _BASE_URL = import.meta.env.PUBLIC_BASE_URL || "https://v5.frontql.dev";
const local_host = import.meta.env.PUBLIC_FRONTQL_local_host || "http://localhost:4466";

type HttpMethod = "get" | "post" | "put" | "delete" | "sql";

type RequestOptions = {
  loading?: boolean;
  body?: {
    sql: "string";
    params: [{ [key: string]: string | number }];
  };
  key?: Record<string, string | any>;
  page?: Record<string, string | number>;
  sort?: Record<string, string | number>;
  joins?: Record<string, string | number>;
  filter?: Record<string, string | number>;
  search?: Record<string, string | number>;
  nearby?: Record<string, string | number>;
  hidden?: Record<string, string | number>;
  fields?: Record<string, string | number>;
  session?: Record<string, string | number>;
  validation?: Record<string, string | number>;
  permissions?: Record<string, string | number>;
};

function uniqueKey(input: string) {
  let code = input.charCodeAt(0);
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    code = (code << 5) - code + char;
    code &= code;
  }
  return toBase64(Math.abs(code)).substring(0, 8);
}

function cleanUrlPath(urlPath: String) {
  let urlPathArr = urlPath.split('/');
  if (urlPathArr.length > 2) {
    urlPathArr.pop();
  }
  return urlPathArr.join('/');
}

function getKey(method: HttpMethod, url: string, options: RequestOptions) {
  const _url = cleanUrlPath(url);

  const request: any = {
    fields: options?.fields,
    hidden: options?.hidden,
    filter: options?.filter,
    nearby: options?.nearby,
    collections: options?.joins,
    permissions: options?.permissions,
    validation: options?.validation
  };

  request["body_is_array"] = Array.isArray(options.body || {});

  let tokenStr = method + ">" + _url;
  for (let key in request) {
    tokenStr += key + ":" + request[key];
  }
  return method + ":" + _url + ">" + uniqueKey(tokenStr);
}

const makeRequest = async (
  method: HttpMethod,
  endpoint: string,
  options: RequestOptions = {},
): Promise<any> => {
  const {
    body,
    page,
    sort,
    joins,
    hidden,
    fields,
    filter,
    search,
    nearby,
    session,
    validation,
    permissions,
  } = options;

  const headers: any = {};

  if (hidden) headers.hidden = hidden;
  if (filter) headers.filter = filter;
  if (fields) headers.fields = fields;
  if (session) headers.session = session;
  if (nearby) headers.nearby = nearby;
  if (joins) headers.collections = joins;
  if (validation) headers.validation = validation;
  if (permissions) headers.permissions = permissions;

  const key = getKey(method, endpoint, options);
  const token = (tokens as Tokens)[key] || false;

  if (!token) {
    headers["key"] = key;
  } else {
    headers.token = token;
  }

  const params: any = {
    page: page,
    sort: sort,
    search: search,
  };

  try {
    const axiosInstance = axios.create({
      baseURL: token ? _BASE_URL : local_host,
      headers: { app: _DATABASE },
    });

    const requestConfig: AxiosRequestConfig = {
      method,
      params,
      headers,
      data: body,
      url: endpoint,
    };

    const response = await axiosInstance(requestConfig);
    return response.data;
  } catch (error: any) {
    console.error(`${method.toUpperCase()} Error:`, error.message);
    throw error;
  }
};

const Api = {
  get: async (endpoint: string, options?: RequestOptions): Promise<any> =>
    makeRequest("get", endpoint, options),
  put: async (endpoint: string, options?: RequestOptions): Promise<any> =>
    makeRequest("put", endpoint, options),
  post: async (endpoint: string, options?: RequestOptions): Promise<any> =>
    makeRequest("post", endpoint, options),
  delete: async (endpoint: string, options?: RequestOptions): Promise<any> =>
    makeRequest("delete", endpoint, options),
  sql: async (endpoint: string, options?: RequestOptions): Promise<any> =>
    makeRequest("post", `/sql-${endpoint.replace("/", "")}`, options),
};

export default Api;