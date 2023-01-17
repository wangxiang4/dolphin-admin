/**
 * @program: dolphin-admin
 * @description: 字典模块动态渲染配置
 * @author: entfrm开发团队-王翔
 * @create: 2022/5/8
 */

import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

/** 表格列配置 */
export const columns: BasicColumn[] = [
  {
    title: '字典名称',
    dataIndex: 'name'
  },
  {
    title: '字典类型',
    dataIndex: 'type'
  },
  {
    title: '系统内置',
    dataIndex: 'isSys',
    width: 90,
    customRender: ({ record }) => {
      const isSys = record.isSys;
      const enable = ~~isSys === 0;
      const color = enable ? 'green' : 'red';
      const text = enable ? '是' : '否';
      return h(Tag, { color: color }, () => text);
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 130,
    customRender: ({ record }) => {
      const status = record.status;
      const enable = ~~status === 0;
      const color = enable ? 'green' : 'red';
      const text = enable ? '启用' : '禁用';
      return h(Tag, { color: color }, () => text);
    }
  }
];

/** 搜索表单配置 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '字典名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入字典名称',
    },
    colProps: { span: 8 }
  },
  {
    field: 'type',
    label: '字典类型',
    component: 'Input',
    componentProps: {
      placeholder: '请输入字典类型',
    },
    colProps: { span: 8 }
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '正常', value: '0' },
        { label: '停用', value: '1' }
      ]
    },
    colProps: { span: 8 }
  }
];

/** 表单配置 */
export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false
  },
  {
    field: 'name',
    label: '字典名称',
    component: 'Input',
    required: true,
    colProps:{ span: 12 }
  },
  {
    field: 'type',
    label: '字典类型',
    component: 'Input',
    colProps:{ span: 12 },
    rules: [
      {
        required: true,
        whitespace: true,
        message: '请输入字典类型!'
      },
      {
        pattern: new RegExp('^[0-9a-zA-Z_]{1,}$', 'g'),
        message: '只允许包含数字,字母,下划线!'
      }
    ]
  },
  {
    field: 'isSys',
    label: '系统内置',
    component: 'Select',
    required: true,
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '是', value: '0' },
        { label: '否', value: '1' }
      ]
    },
    colProps:{ span: 12 }
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    required: true,
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '禁用', value: '1' }
      ]
    },
    colProps:{ span: 12 }
  },
  {
    field: 'remarks',
    label: '备注',
    component: 'InputTextArea',
    componentProps: {
      rows: 6
    },
    colProps: {
      span: 24
    }
  }
];
