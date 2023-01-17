/**
 * @program: dolphin-admin
 * @description: 多租户模块动态渲染配置
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/21
 */

import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

/** 表格列配置 */
export const columns: BasicColumn[] = [
  {
    title: '客户端Id',
    dataIndex: 'clientId',
    width: 100
  },
  {
    title: '客户端密钥',
    dataIndex: 'clientSecret',
    width: 100
  },
  {
    title: '授权类型',
    dataIndex: 'authorizedGrantTypes',
    width: 130
  },
  {
    title: '授权范围',
    dataIndex: 'scope',
    width: 90
  },
  {
    title: '令牌过期秒数',
    dataIndex: 'accessTokenValidity',
    width: 130
  },
  {
    title: '令牌过期秒数',
    dataIndex: 'refreshTokenValidity',
    width: 130
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 100
  }
];

/** 搜索表单配置 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'clientId',
    label: '客户端编码',
    component: 'Input',
    componentProps: {
      placeholder: '请输入客户端编码',
    },
    colProps: { span: 8 },
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
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false
  },
  {
    field: 'clientId',
    label: '客户端Id',
    component: 'Input',
    required: true,
    colProps: {
      span: 12
    }
  },
  {
    field: 'clientSecret',
    label: '客户端密钥',
    component: 'Input',
    required: true,
    colProps: {
      span: 12
    }
  },
  {
    field: 'authorizedGrantTypes',
    label: '授权类型',
    component: 'InputTextArea',
    required:true,
    componentProps: {
      rows: 3
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'scope',
    label: '授权范围',
    component: 'Input',
    required:true,
    colProps: {
      span: 12
    }
  },
  {
    field: 'accessTokenValidity',
    label: '过期秒数',
    component: 'InputNumber',
    componentProps: {
      style: { width:'100%' },
      min: 0
    },
    colProps: {
      span: 12
    }
  },
  {
    field: 'refreshTokenValidity',
    label: '刷新秒数',
    component: 'InputNumber',
    componentProps: {
      style: { width:'100%' },
      min: 0
    },
    colProps: {
      span: 12
    }
  },
  {
    field: 'webServerRedirectUri',
    label: '回调地址',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'additionalInformation',
    label: '附加说明',
    component: 'InputTextArea',
    componentProps: {
      rows: 6
    },
    colProps: {
      span: 24
    }
  }
];
