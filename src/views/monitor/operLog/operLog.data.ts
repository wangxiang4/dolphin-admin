/**
 * @program: dolphin-admin
 * @description: 操作日志模块动态渲染配置
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/21
 */

import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

/** 表格列配置 */
export const columns: BasicColumn[] = [
  {
    title: '日志标题',
    dataIndex: 'title'
  },
  {
    title: '请求方式',
    dataIndex: 'method'
  },
  {
    title: '操作人员',
    dataIndex: 'operName'
  },
  {
    title: 'IP地址',
    dataIndex: 'operIp'
  },
  {
    title: '操作地点',
    dataIndex: 'operAddr'
  },
  {
    title: '客户端',
    dataIndex: 'clientId'
  },
  {
    title: '请求时间',
    dataIndex: 'executeTime'
  },
  {
    title: '操作状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({record}) => {
      const status = record.status;
      const enable = ~~status === 0;
      const color = enable ? 'green' : 'red';
      const text = enable ? '正常' : '异常';
      return h(Tag, { color: color }, () => text);
    }
  },
  {
    title: '操作日期',
    dataIndex: 'operTime'
  }
];

/** 搜索表单配置 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '日志标题',
    component: 'Input',
    componentProps: {
      placeholder: '请输入日志标题'
    },
    colProps: { span: 6 }
  },
  {
    field: 'operName',
    label: '操作人员',
    component: 'Input',
    componentProps: {
      placeholder: '请输入操作人员'
    },
    colProps: { span: 6 }
  },
  {
    field: 'status',
    label: '操作状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '正常', value: '0' },
        { label: '异常', value: '1' }
      ]
    },
    colProps: { span: 6 }
  },
  {
    field: 'dateRange',
    label: '创建时间',
    component: 'RangePicker',
    componentProps: {
      style: { width:'100%' },
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期','结束日期']
    },
    colProps: { span: 6 }
  }
];
