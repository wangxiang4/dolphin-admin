/**
 * @program: dolphin-admin
 * @description: 封装取消axios重复请求
 * 可以实现同一个请求多次,最终只会有一个请求发生成功
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/7
 */

import type { AxiosRequestConfig, Canceler } from 'axios';
import axios from 'axios';
import { isFunction } from '/@/utils/is';

/** 用于存储每个请求的识别和取消功能 */
let pendingMap = new Map<string, Canceler>();

export const getPendingUrl = (config: AxiosRequestConfig) => [config.method, config.url].join('&');

export class AxiosCanceler {

  /** 添加请求 */
  addPending(config: AxiosRequestConfig) {
    this.removePending(config);
    const url = getPendingUrl(config);
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel) => {
        if (!pendingMap.has(url)) {
          // 如果当前没有待处理的请求，添加它
          pendingMap.set(url, cancel);
        }
      });
  }

  /** 清除所有待处理 */
  removeAllPending() {
    pendingMap.forEach((cancel) => {
      cancel && isFunction(cancel) && cancel();
    });
    pendingMap.clear();
  }

  /** 删除请求 */
  removePending(config: AxiosRequestConfig) {
    const url = getPendingUrl(config);

    if (pendingMap.has(url)) {
      // 如果当前请求标识符处于待处理状态，
      // 当前请求需要被取消和移除
      const cancel = pendingMap.get(url);
      cancel && cancel(url);
      pendingMap.delete(url);
    }
  }

  /** 重置 */
  reset(): void {
    pendingMap = new Map<string, Canceler>();
  }
}
