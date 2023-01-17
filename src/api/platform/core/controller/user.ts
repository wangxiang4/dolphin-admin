/**
 * 提供api模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
 * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
 * author entfrm开发团队-王翔
 */

import type { Captcha, User, LoginParams, TokenEnhancer } from '../entity/user';
import type { RequestOptions } from '/#/axios';
import { encryptionLogin } from '/@/utils/cipher';
import { useGlobSetting } from '/@/hooks/setting';
import { defHttp } from '/@/utils/http/axios';
import qs from 'qs';

const globSetting = useGlobSetting();
enum Api {
  login = '/auth_proxy/oauth/token',
  logout = '/auth_proxy/token/logout',
  getUserInfo = '/system_proxy/system/user/info',
  getCaptcha = '/code',
}

/** 用户登录接口 */
export const login = (params: LoginParams, options?: boolean | RequestOptions) => {
  // 非对称密钥AES加密处理
  const user =  encryptionLogin({
    data: params,
    key: globSetting.gatewayAseEncodeSecret,
    param: ['password']
  });

  const username = user.username.trim();
  const password = user.password;
  const code = user.code;
  const realKey = user.realKey;
  const grant_type = 'password';
  const scope = 'server';

  const data = qs.stringify({'username': username, 'password': password});
  return defHttp.post<TokenEnhancer>({
    url: Api.login,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    },
    params: { code, realKey, grant_type, scope },
    data: data
  }, <RequestOptions>options);
};

/** 获取当前用户信息 */
export const getUserInfo = () => defHttp.get<User>({ url: Api.getUserInfo });

/** 登出 */
export const logout = () => defHttp.delete({ url: Api.logout });

/** 获取验证码 */
export const getCaptcha = () => defHttp.get<Captcha>({ url: `${Api.getCaptcha}?key=${Date.now()}` });
