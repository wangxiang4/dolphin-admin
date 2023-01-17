/**
 * @program: dolphin-admin
 * @description: 利用vue组件工厂创建异步组件工具类
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */

import { defineAsyncComponent} from 'vue';
import { Spin } from 'ant-design-vue';
import { noop } from '/@/utils/index';

interface Options {
  size?: 'default' | 'small' | 'large';
  delay?: number;
  timeout?: number;
  loading?: boolean;
  retry?: boolean;
}

export function createAsyncComponent(loader: Fn, options: Options = {}) {
  const { size = 'small', delay = 100, timeout = 30000, loading = false, retry = true } = options;
  // 参考文档: https://v3.cn.vuejs.org/api/global-api.html#defineasynccomponent
  return defineAsyncComponent({
    loader,
    loadingComponent: loading ? <Spin spinning={true} size={size} /> : undefined,
    // 如果超时，将显示错误组件
    timeout,
    // 在显示 loadingComponent 之前的延迟 | 默认值：200（单位 ms）
    delay,
    /**
     * 请求发生错误时调用函数
     * @param {*} error 错误消息对象
     * @param {*} retry 指示当加载器承诺拒绝时异步组件是否应重试的函数
     * @param {*} fail  失败的结束
     * @param {*} attempts 最大允许重试次数
     */
    onError: !retry
      ? noop
      : (error, retry, fail, attempts) => {
          if (error.message.match(/fetch/) && attempts <= 3) {
            // 请求发生错误时重试，最多可尝试 3 次
            retry();
          } else {
            // 注意，retry/fail 就像 promise 的 resolve/reject 一样：
            // 必须调用其中一个才能继续错误处理。
            fail();
          }
        },
  });
}
