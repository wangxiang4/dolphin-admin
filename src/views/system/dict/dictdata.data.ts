/**
 * @program: dolphin-admin
 * @description: 字典数据模块动态渲染配置
 * @author: entfrm开发团队-王翔
 * @create: 2022/5/8
 */

import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

/** 表格列配置 */
export const columns: BasicColumn[] = [
  {
    title: '字典数据类型',
    dataIndex: 'dictType'
  },
  {
    title: '字典数据标签',
    dataIndex: 'label'
  },
  {
    title: '字典数据键值',
    dataIndex: 'value',
    width: 120
  },
  {
    title: '字典数据排序',
    dataIndex: 'sort',
    width: 120
  }
];

/** 搜索表单配置 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'dictType',
    label: '字典数据类型',
    component: 'Input',
    componentProps: {
      placeholder: '请输入字典数据类型'
    },
    colProps: { span: 12 }
  },
  {
    field: 'label',
    label: '字典数据标签',
    component: 'Input',
    componentProps: {
      placeholder: '请输入字典数据标签'
    },
    colProps: { span: 12 }
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
    field: 'dictType',
    label: '字典类型',
    component: 'Input',
    required: true,
    componentProps: { disabled: true },
    colProps:{ span: 12 }
  },
  {
    field: 'label',
    label: '字典标签',
    component: 'Input',
    required: true,
    colProps:{ span: 12 }
  },
  {
    field: 'value',
    label: '字典键值',
    component: 'Input',
    required: true,
    colProps:{ span: 12 }
  },
  {
    field: 'sort',
    label: '排序',
    component: 'InputNumber',
    componentProps: {
      style: { width:'100%' },
      min: 0
    },
    required: true,
    colProps: {
      span: 12
    }
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
