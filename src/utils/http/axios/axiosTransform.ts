/**
 * @program: dolphin-admin
 * @description: 数据处理类，可根据项目配置
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/7
 */

import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { RequestOptions, R } from '/#/axios';

export interface CreateAxiosOptions extends AxiosRequestConfig {
  authenticationScheme?: string;
  urlPrefix?: string;
  transform?: AxiosTransform;
  requestOptions?: RequestOptions;
}

export abstract class AxiosTransform {

  /** 请求前的流程配置 */
  beforeRequestHook?: (config: CreateAxiosOptions, options: RequestOptions) => CreateAxiosOptions;

  /** 请求成功处理 */
  transformRequestHook?: (res: AxiosResponse<R>, options: RequestOptions) => any;

  /** 请求失败处理 */
  requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>;

  /** 请求之前的拦截器 */
  requestInterceptors?: (config: CreateAxiosOptions, options: CreateAxiosOptions) => CreateAxiosOptions;

  /** 请求之后的拦截器 */
  responseInterceptors?: (res: AxiosResponse) => AxiosResponse;

  /** 请求之前的拦截器错误处理 */
  requestInterceptorsCatch?: (error: Error) => void;

  /** 请求之后的拦截器错误处理 */
  responseInterceptorsCatch?: (error: Error) => void;
}
