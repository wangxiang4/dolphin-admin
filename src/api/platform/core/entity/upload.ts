/**
 * @program: dolphin-admin
 * @description: 文件上传实体类
 * 类型定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */

import type { File as OssFile } from '/@/api/platform/system/entity/file';

/** oss上传返回结果对象 */
export interface UploadResult extends OssFile {
}
