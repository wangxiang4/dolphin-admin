/**
 * 提供api模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
 * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
 * author entfrm开发团队-王翔
 */
import type { OperLogParams, OperLog, OperLogResult } from '/@/api/platform/monitor/entity/operLog';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/monitor_proxy/monitor/operLog/list',
  del = '/monitor_proxy/monitor/operLog/remove',
  clean = '/monitor_proxy/monitor/operLog/clean'
}

/** 查询操作日志列表 */
export const listOperLog = (params?: Partial<OperLogParams>) => defHttp.get<OperLogResult>({ url: Api.list, params }, { isReturnResultResponse: true });

/** 删除操作日志 */
export const delOperLog = (ids: string) => defHttp.delete({ url: `${Api.del}/${ids}` });

/** 清除所有操作日志 */
export const cleanOperLog = () => defHttp.delete({ url: Api.clean });
