import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '区域名称',
    dataIndex: 'name',
    align: 'left'
  },
  {
    title: '区域编码',
    dataIndex: 'code'
  },
  {
    title: '区域排序',
    dataIndex: 'sort'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width:200
  },
  {
    title: '备注',
    dataIndex: 'remarks'
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '区域名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入区域名称',
    },
    colProps: { span: 8 }
  },
  {
    field:'code',
    label:'区域编码',
    component:'Input',
    componentProps:{
      placeholder:'请输入区域编码',
    },
    colProps:{ span:7 }
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

export const regionFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false
  },
  {
    field: 'parentId',
    label: '上级区域',
    component: 'TreeSelect',
    defaultValue: '0',
    componentProps: {
      replaceFields: {
        title: 'name',
        key: 'id',
        value: 'id'
      },
      getPopupContainer: () => document.body,
    }
  },
  {
    field: 'name',
    label: '区域名称',
    component: 'Input',
    required: true,
    colProps: {
      span: 12
    }
  },
  {
    field: 'code',
    label: '区域编码',
    component: 'Input',
    colProps: {
      span: 12
    }
  },
  {
    field: 'sort',
    label: '区域排序',
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
    label: '备注',
    field: 'remarks',
    component: 'InputTextArea',
  }
];
