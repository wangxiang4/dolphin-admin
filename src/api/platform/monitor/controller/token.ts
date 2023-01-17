/**
 * 提供api模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
 * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
 * author entfrm开发团队-王翔
 */
import type { TokenParams, TokenResult } from '/@/api/platform/monitor/entity/token';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/monitor_proxy/monitor/token/list',
  del = '/monitor_proxy/monitor/token/remove'
}

/** 查询令牌列表 */
export const listToken = (params?: Partial<TokenParams>) => defHttp.get<TokenResult>({ url: Api.list, params }, { isReturnResultResponse: true });

/** 删除令牌 */
export const delToken = (id: string) => defHttp.delete({ url: `${Api.del}/${id}` });
