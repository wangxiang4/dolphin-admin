/**
 * @program: dolphin-admin
 * @description: 多租户模块动态渲染配置
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
    title: '多租户名称',
    dataIndex: 'name'
  },
  {
    title: '多租户编码',
    dataIndex: 'code'
  },
  {
    title: '开始时间',
    dataIndex: 'tenantStartTime',
    width: 200
  },
  {
    title: '结束时间',
    dataIndex: 'tenantEndTime',
    width: 200
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({record}) => {
      const status = record.status;
      const enable = ~~status === 0;
      const color = enable ? 'green' : 'red';
      const text = enable ? '启动' : '冻结';
      return h(Tag, { color: color }, () => text);
    }
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    width: 300,
    customRender: ({record}) => {
      return  record.remarks ||  h(Tag, { color: 'red' }, () => '暂无数据');
    }
  }
];

/** 搜索表单配置 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '多租户名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入多租户名称',
    },
    colProps: { span: 8 }
  },
  {
    field: 'code',
    label: '多租户编码',
    component: 'Input',
    componentProps: {
      placeholder: '请输入多租户编码',
    },
    colProps: { span: 7 }
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启动', value: '0' },
        { label: '冻结', value: '1' }
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
    label: '多租户名称',
    component: 'Input',
    required: true,
    colProps: {
      span: 12
    }
  },
  {
    field: 'code',
    label: '多租户编码',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'tenantStartTime',
    label: '开始时间',
    component: 'DatePicker',
    required: true,
    componentProps: {
      style: { width:'100%' },
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      placeholder: '请选择开始日期'
    },
    colProps: { span: 12 }
  },
  {
    field: 'tenantEndTime',
    label: '结束时间',
    component: 'DatePicker',
    required: true,
    componentProps: {
      style: { width:'100%' },
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      placeholder: '请选择开始日期'
    },
    colProps: { span: 12 }
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '启动', value: '0' },
        { label: '冻结', value: '1' }
      ]
    },
    colProps: {
      span: 12
    }
  },
  {
    label: '备注',
    field: 'remarks',
    component: 'InputTextArea',
    componentProps: {
      rows: 6
    },
    colProps: {
      span: 24
    }
  }
];
