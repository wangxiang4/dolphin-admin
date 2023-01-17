/**
 * @program: dolphin-admin
 * @description: 部门模块动态渲染配置
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
    title: '部门名称',
    dataIndex: 'name',
    align: 'left'
  },
  {
    title: '部门编码',
    dataIndex: 'code'
  },
  {
    title: '排序',
    dataIndex: 'sort'
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    customRender: ({record}) => {
      const status = record.status;
      // 采用二进制~~取反,只要为null或者0等等一些其他的空元素都会转为0
      // 第一次取反会运算为-1,在后一次取反会运算为0
      const enable = ~~status === 0;
      const color = enable ? 'green' : 'red';
      const text = enable ? '正常' : '停用';
      return h(Tag, { color: color }, () => text);
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime'
  }
];

/** 搜索表单配置 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '部门名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入部门名称'
    },
    colProps: {span: 8}
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
    colProps: { span: 7 }
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
    colProps: { span: 8 }
  }
];

/** 表单配置 */
export const formSchema: FormSchema[] = [
  {
    field: 'deptId',
    label: 'ID',
    component: 'Input',
    show: false
  },
  {
    field: 'parentId',
    label: '上级部门',
    component: 'TreeSelect',
    defaultValue: '0',
    componentProps: {
      replaceFields: {
        title: 'name',
        key: 'deptId',
        value: 'deptId',
      },
      getPopupContainer: () => document.body,
    }
  },
  {
    field: 'name',
    label: '部门名称',
    component: 'Input',
    required: true,
    colProps: {
      span: 12
    }
  },
  {
    field: 'code',
    label: '部门代码',
    component: 'Input',
    required: true,
    colProps: {
      span: 12
    }
  },
  {
    field: 'contacts',
    label: '联系人',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'phone',
    label: '联系人电话',
    component: 'Input',
    rules: [
      {
        pattern: new RegExp('^1[3|4|5|6|7|8|9][0-9]\\d{8}$'),
        message: '请输入正确的手机号码!',
        validateTrigger: 'change'
      }
    ],
    colProps: {
      span: 12
    }
  },
  {
    field: 'sort',
    label: '部门排序',
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
    field: 'email',
    label: '邮箱',
    component: 'Input',
    rules: [
      {
        type: 'email',
        message: '请输入正确的邮箱地址!',
        validateTrigger: 'change'
      }
    ],
    colProps: {
      span: 12
    }
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '正常', value: '0' },
        { label: '停用', value: '1' }
      ]
    },
    required: true,
    colProps: {
      span: 12
    }
  }
];
