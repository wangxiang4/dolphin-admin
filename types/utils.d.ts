/**
 * @program: dolphin-admin
 * @description: 工具定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/10
 */

import type { ComputedRef, Ref } from 'vue';

/** prop动态类型定义,可以自动根据当前prop的数量进行创建 */
export type DynamicProps<T> = {
  [P in keyof T]: Ref<T[P]> | T[P] | ComputedRef<T[P]>;
};

/** 加密模型定义 */
export interface encryptionLoginModel {
  data: {
    [key: string]: any;
  };
  key: string;
  param: string[];
}
