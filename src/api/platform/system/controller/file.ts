/**
 * 提供api模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
 * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
 * author entfrm开发团队-王翔
 */
import type { FileParams, FileResult } from '/@/api/platform/system/entity/file';
import { defHttp } from '/@/utils/http/axios';
import { downloadByUrl } from '/@/utils/file/download';
import { useGlobSetting } from '/@/hooks/setting';
const { apiUrl } = useGlobSetting();

enum Api {
  list = '/system_proxy/system/file/list',
  get = '/system_proxy/system/file/getFile',
  getLocal = '/system_proxy/system/file/local',
  del = '/system_proxy/system/file/remove'
}

/** 查询文件列表 */
export const listFile = (params?: Partial<FileParams>) => defHttp.get<FileResult>({ url: Api.list, params }, { isReturnResultResponse: true });

/** 获取文件 */
export const getFile = (bucket: string, fileName: string) => Promise.resolve(downloadByUrl({ url: `${apiUrl}${Api.get}/${bucket}/${fileName}`, fileName: fileName }));

/** 获取本地模板文件 */
export const getLocalFile = (fileName: string) => defHttp.get({ url: `${Api.getLocal}/${fileName}` });

/** 删除文件 */
export const delFile = (ids: string) => defHttp.delete({ url: `${Api.del}/${ids}` });
