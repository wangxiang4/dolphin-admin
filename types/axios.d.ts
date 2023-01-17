/**
 * @program: dolphin-admin
 * @description: 请求定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/10
 */

export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;

export interface RequestOptions {
  // 将请求参数拼接到url
  joinParamsToUrl?: boolean;
  // 格式请求参数时间
  formatDate?: boolean;
  // 是否返回原生响应头
  // 例如：当需要获取响应头时使用该属性
  isReturnNativeResponse?: boolean;
  // 是否返回后端原生结果集响应
  isReturnResultResponse?: boolean;
  // 是否加入url
  joinPrefix?: boolean;
  // 接口地址，留空使用默认apiUrl
  apiUrl?: string;
  // 错误信息提示类型
  errorMessageMode?: ErrorMessageMode;
  // 是否添加时间戳
  joinTime?: boolean;
  ignoreCancelToken?: boolean;
  // 是否在header中发送token
  withToken?: boolean;
  // 客户端ID
  clientId?: string;
  // 客户端密钥
  clientSecret?: string;
}

/** 响应信息主体 */
export interface R<T = any> {
  code: number;
  msg: string;
  total: number;
  data: T;
}

/** 多部分表单数据：上传文件 */
export interface UploadFileParams {
  // 其他参数
  data?: Recordable;
  // 文件参数接口字段名
  name?: string;
  // 文件名
  file: File | Blob;
  // 文件名
  filename?: string;
  [key: string]: any;
}
