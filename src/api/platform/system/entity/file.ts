/**
 * @program: dolphin-admin
 * @description: 文件实体类
 * 类型定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */
import type { R } from '/#/axios';
import type { CommonEntity, Page } from '/@/api/common/data/entity';

/** 文件查询参数 */
export type FileParams = Page & File;

/** 文件对象 */
export interface File extends CommonEntity {
    id: string;
    fileName: string;
    bucketName: string;
    original: string;
    type: string;
    fileSize: number;
    availablePath: string;
    duration: number;
    mimeType: string;
    [key: string]: any;
}

/** 文件响应对象 */
export type FileResult = R<File[]>;
