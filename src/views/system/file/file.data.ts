/**
 * @program: dolphin-admin
 * @description: 文件模块动态渲染配置
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/21
 */

import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { getFileSize } from '/@/utils/file/download';

/** 表格列配置 */
export const columns: BasicColumn[] = [
  {
    title: '源文件名称',
    dataIndex: 'original'
  },
  {
    title: '空间名称',
    dataIndex: 'bucketName'
  },
  {
    title: '文件名称',
    dataIndex: 'fileName'
  },
  {
    title: '文件类型',
    dataIndex: 'type'
  },
  {
    title: '文件大小',
    dataIndex: 'fileSize',
    customRender: ({ record }) => getFileSize(record.fileSize)
  },
  {
    title: '上传人',
    dataIndex: 'createByName'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime'
  }
];

/** 搜索表单配置 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'fileName',
    label: '文件名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入文件名称',
    },
    colProps: { span: 6 }
  }
];
