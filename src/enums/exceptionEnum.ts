/**
 * @program: dolphin-admin
 * @description: 异常相关枚举
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */

export enum ExceptionEnum {
  // 页面无法访问
  PAGE_NOT_ACCESS = 403,

  // 网页未找到
  PAGE_NOT_FOUND = 404,

  // 错误
  ERROR = 500,

  // 前端Js错误
  NET_WORK_ERROR = 10000,

  // 无数据页面
  PAGE_NOT_DATA = 10100,
}

export enum ErrorTypeEnum {
  VUE = 'vue',
  SCRIPT = 'script',
  RESOURCE = 'resource',
  AJAX = 'ajax',
  PROMISE = 'promise',
}
