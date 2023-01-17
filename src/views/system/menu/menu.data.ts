/**
 * @program: dolphin-admin
 * @description: 菜单模块动态渲染配置
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/21
 */

import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { Icon } from '/@/components/Icon';
import { getMenu } from '/@/api/platform/system/controller/menu';

/** 通用变量统一声明区域 */
const isModule = (type: string) => type === 'M';
const isMenu = (type: string) => type === 'C';
const isButton = (type: string) => type === 'F';

/** 表格列配置 */
export const columns: BasicColumn[] = [
  {
    title: '菜单名称',
    dataIndex: 'name',
    align: 'left'
  },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 100,
    customRender: ({ record }) => {
      return record.icon ? h(Icon, { icon: record.icon }) : h(Tag, { color: 'red' }, () => '暂无图标');
    }
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 80
  },
  {
    title: '权限标识',
    dataIndex: 'permission',
    customRender: ({record}) => {
      return  record.permission ||  h(Tag, { color: 'red' }, () => '暂无数据');
    }
  },
  {
    title: '组件',
    dataIndex: 'component',
    customRender: ({record}) => {
      return  record.component ||  h(Tag, { color: 'red' }, () => '暂无数据');
    }
  },
  {
    title: '是否隐藏',
    dataIndex: 'hideMenu',
    width: 80,
    customRender: ({ record }) => {
      const hideMenu = record.hideMenu;
      // 采用二进制~~取反,只要为null或者0等等一些其他的空元素都会转为0
      // 第一次取反会运算为-1,在后一次取反会运算为0
      const enable = ~~hideMenu === 0;
      const color = enable ? 'green' : 'red';
      const text = enable ? '显示' : '隐藏';
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
    label: '菜单名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入菜单名称'
    },
    colProps: { span: 8 }
  },
  {
    field: 'hideMenu',
    label: '是否隐藏',
    component: 'Select',
    componentProps: {
      options: [
        { label: '显示', value: '0' },
        { label: '隐藏', value: '1' }
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
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false
  },
  {
    field: 'parentId',
    label: '上级菜单',
    component: 'TreeSelect',
    defaultValue: '0',
    required: true,
    componentProps: {
      allowClear: false,
      replaceFields: {
        title: 'name',
        key: 'id',
        value: 'id'
      },
      getPopupContainer: () => document.body
    }
  },
  {
    field: 'type',
    label: '菜单类型',
    component: 'RadioButtonGroup',
    defaultValue: 'M',
    componentProps: {
      options: [
        { label: '目录', value: 'M' },
        { label: '菜单', value: 'C' },
        { label: '按钮', value: 'F' }
      ]
    },
    dynamicRules: ({ model }) => {
      return [{
        validator: async (rule, value) => {
          if (~~model?.parentId != 0) {
            const menu = await getMenu(model.parentId);
            switch (menu?.type) {
              case 'M':
                if (value == 'F') return Promise.reject('检测到上级菜单为目录类型子项不允许选择按钮类型!');
                break;
              case 'C':
                if (value != 'F') return Promise.reject('检测到上级菜单为菜单类型子项只允许选择按钮类型!');
                break;
            }
          } else {
            if (value == 'F') return Promise.reject('根级菜单子项不允许选择按钮类型!');
          }
          return Promise.resolve();
        },
        validateTrigger: 'change'
      }];
    }
  },
  {
    field: 'icon',
    label: '菜单图标',
    component: 'IconPicker',
    ifShow: ({ values }) => !isButton(values.type),
  },
  {
    field: 'name',
    label: '菜单名称',
    component: 'Input',
    required: true,
    colProps: {
      span: 12
    }
  },
  {
    field: 'path',
    label: '路由地址',
    component: 'Input',
    colProps: {
      span: 12
    },
    ifShow: ({ values }) => !isButton(values.type)
  },
  {
    field: 'component',
    label: '组件路径',
    component: 'Input',
    colProps: {
      span: 12
    },
    ifShow: ({ values }) => isMenu(values.type)
  },
  {
    field: 'permission',
    label: '权限标识',
    component: 'Input',
    required: true,
    colProps: {
      span: 12
    },
    ifShow: ({ values }) => isButton(values.type)
  },
  {
    field: 'sort',
    label: '菜单排序',
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
    field: 'keepalive',
    label: '是否缓存',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '否', value: '0' },
        { label: '是', value: '1' },
      ],
    },
    colProps: {
      span: 12
    },
    ifShow: ({ values }) => isMenu(values.type)
  },
  {
    field: 'hideMenu',
    label: '是否隐藏',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '否', value: '0' },
        { label: '是', value: '1' },
      ]
    },
    colProps: {
      span: 12
    },
    ifShow: ({ values }) => !isButton(values.type)
  },
  {
    field: 'hideChildrenMenu',
    label: '是否隐藏子菜单',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '否', value: '0' },
        { label: '是', value: '1' },
      ]
    },
    colProps: {
      span: 12
    },
    ifShow: ({ values }) => isModule(values.type)
  }
];
