/**
 * 提供api模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
 * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
 * author entfrm开发团队-王翔
 */
import type { UploadResult } from '../entity/upload';
import type { UploadFileParams } from '/#/axios';
import { useGlobSetting } from '/@/hooks/setting';
import { defHttp } from '/@/utils/http/axios';

const { uploadUrl = '' } = useGlobSetting();

/** 通用OSS上传 */
export const commonUpload = (params: UploadFileParams, onUploadProgress: (progressEvent: ProgressEvent) => void) =>
  defHttp.uploadFile<UploadResult>({ url: uploadUrl, onUploadProgress }, params);
