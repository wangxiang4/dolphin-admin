/**
 * @program: dolphin-admin
 * @description: axios配置可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/7
 */

import type { AxiosResponse } from 'axios';
import type { RequestOptions, R } from '/#/axios';
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
import { VAxios } from './Axios';
import { checkStatus } from './checkStatus';
import { useGlobSetting } from '/@/hooks/setting';
import { useMessage } from '/@/hooks/web/useMessage';
import { RequestEnum, ResultEnum, ContentTypeEnum } from '/@/enums/httpEnum';
import { isString } from '/@/utils/is';
import { getAccessToken } from '/@/utils/auth';
import { setObjToUrlParams, deepMerge } from '/@/utils';
import { t } from '/@/hooks/web/useI18n';
import { joinTimestamp, formatRequestDate } from './helper';
import { Base64 } from 'js-base64';

const globSetting = useGlobSetting();
const urlPrefix = globSetting.urlPrefix;
const { createMessage, createErrorModal } = useMessage();

/** 数据处理，方便区分多种处理方式 */
const transform: AxiosTransform = {
  /** 处理请求数据。如果数据不是预期格式，可直接抛出错误 */
  transformRequestHook: (res: AxiosResponse<R>, options: RequestOptions) => {
    const { isReturnNativeResponse, isReturnResultResponse } = options;

    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }

    // 检查是否有code,并且code等于200,直接返回结果
    const { data }  = res;
    const hasCode = data && Reflect.has(data, 'code');
    if (hasCode && data.code === ResultEnum.SUCCESS && !isReturnResultResponse) {
      return data.data;
    // 检查是否有code,如果code不等于200,说明返回的结果集有错误,直接抛错
    } else if (hasCode && data.code !== ResultEnum.SUCCESS) {
      if (options.errorMessageMode === 'modal') {
        createErrorModal({ title: t('sys.api.errorTip'), content: data?.msg });
      } else if (options.errorMessageMode === 'message') {
        createMessage.error(data?.msg);
      }
      throw new Error(data?.msg || t('sys.api.errMsgDefault'));
    }

    return data;

  },

  /** 请求之前处理config */
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true } = options;

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }
    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }

    const params = config.params || {};
    const data = config.data || false;
    formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
          config.data = data;
          config.params = params;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data)
          );
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /** 请求拦截器处理 */
  requestInterceptors: (config, options) => {
    // 请求之前处理config
    const token = getAccessToken();
    const { clientId, clientSecret } = globSetting;
    const { clientId: customClientId, clientSecret: customClientSecret } = config.requestOptions!;
    // 使用token进行请求
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      (config as Recordable).headers.Authorization = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token;
    } else {
      // 使用客户端信息密钥请求
      (config as Recordable).headers.Authorization =
        `Basic ${Base64.encode(`${customClientId || clientId}:${customClientSecret || clientSecret}`)}`;
    }
    return config;
  },

  /** 响应拦截器处理 */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res;
  },

  /** 响应错误处理 */
  responseInterceptorsCatch: (error: any) => {
    const { response, code, message, config } = error || {};
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none';
    const err: string = response?.data?.msg?.toString?.() ?? '';
    let errMessage = err;
    // 优先使用预设错误提示
    const status = error?.response?.status || 200;
    if(!checkStatus(status, errMessage, errorMessageMode)){
      try {
        // 扩展预设异常处理
        if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
          errMessage = t('sys.api.apiTimeoutMessage');
        } else if (err?.includes('Network Error')) {
          errMessage = t('sys.api.networkExceptionMsg');
        }
        if (errMessage) {
          if (errorMessageMode === 'modal') {
            createErrorModal({ title: t('sys.api.errorTip'), content: errMessage });
          } else if (errorMessageMode === 'message') {
            createMessage.error(errMessage);
          }
          return Promise.reject(err);
        }
      } catch (error: any) {
        throw new Error(error);
      }
    }
    return Promise.reject(error);
  }
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge({
        // 认证方案，例如：Bearer
        // 其他方案: https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        authenticationScheme: 'Bearer',
        timeout: 10 * 1000,
        // 接口可能会有通用的地址部分，可以统一抽取出来
        urlPrefix: urlPrefix,
        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口地址
          apiUrl: globSetting.apiUrl,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
        },
      }, opt || {})
  );
}

export const defHttp = createAxios();
