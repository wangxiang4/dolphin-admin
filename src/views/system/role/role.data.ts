/**
 * @program: dolphin-admin
 * @description: 角色模块动态渲染配置
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/21
 */

import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch, Tag } from 'ant-design-vue';
import { changeStatus } from '/@/api/platform/system/controller/role';
import { listTenant } from '/@/api/platform/system/controller/tenant';
import { useMessage } from '/@/hooks/web/useMessage';

/** 通用变量统一声明区域 */
const { createConfirm } = useMessage();

/** 表格列配置 */
export const columns: BasicColumn[] = [
  {
    title: '角色名称',
    dataIndex: 'name',
    width: 200
  },
  {
    title: '角色排序',
    dataIndex: 'sort',
    width: 200
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({ record }) => {
      // 设置请求加载状态标识
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(Switch, {
        checked: record.status === '0',
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          const text = checked ? '启用' : '停用';
          createConfirm({
            iconType: 'warning',
            title: '警告',
            content: `确认要"${text}${record.name}角色吗?`,
            onOk: async () => {
              record.pendingStatus = true;
              const newStatus = checked ? '0' : '1';
              const { createMessage } = useMessage();
              changeStatus(record.id, newStatus).then(() => {
                record.status = newStatus;
                createMessage.success(`${text}成功`);
              }).catch(() => {
                createMessage.error(`${text}失败`);
              }).finally(() => record.pendingStatus = false);
            }
          });
        }
      });
    }
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    customRender: ({record}) => {
      return  record.remarks ||  h(Tag, { color: 'red' }, () => '暂无数据');
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
    label: '角色名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入角色名称',
    },
    colProps: { span: 8 }
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启动', value: '0' },
        { label: '停用', value: '1' }
      ]
    },
    colProps: { span: 7 }
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
    label: '角色名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'sort',
    label: '角色排序',
    component: 'InputNumber',
    componentProps: {
      style: { width:'100%' },
      min: 0
    },
    required: true
  },
  {
    field: 'tenantIds',
    label: '多租户',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      mode: 'multiple',
      api: listTenant,
      labelField: 'name',
      valueField: 'id',
      resultField: 'data'
    }
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '停用', value: '1' },
      ],
    },
  },
  {
    label: '备注',
    field: 'remarks',
    component: 'InputTextArea',
  },
  {
    label: '',
    field: 'menuIds',
    slot: 'menu',
    component: 'Input',
  }
];
