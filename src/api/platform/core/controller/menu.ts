/**
 * 提供api模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
 * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
 * author entfrm开发团队-王翔
 */
import type { MenuRouteResult } from '/@/api/platform/core/entity/menu';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/system_proxy/system/menu/menuRoute',
}

/** 获取用户菜单 */
export const listMenuRoute = () => defHttp.get<MenuRouteResult>({ url: Api.list });
