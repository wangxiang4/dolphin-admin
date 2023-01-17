/**
 * @program: dolphin-admin
 * @description: 请求枚举
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

/** 请求结果集 */
export enum ResultEnum {
  SUCCESS = 200,
  ERROR = 500,
  UNAUTH = 401,
}

/** 请求方法 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/** 内容类型 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
