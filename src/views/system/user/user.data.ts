/**
 * @program: dolphin-admin
 * @description: 用户模块动态渲染配置
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/21
 */

import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { listRole } from '/@/api/platform/system/controller/role';
import { changeStatus } from '/@/api/platform/system/controller/user';
import { useMessage } from '/@/hooks/web/useMessage';

/** 通用变量统一声明区域 */
const { createConfirm } = useMessage();

/** 表格列配置 */
export const columns: BasicColumn[] = [
  {
    title: '用户名称',
    dataIndex: 'userName',
    width: 120
  },
  {
    title: '用户昵称',
    dataIndex: 'nickName',
    width: 120
  },
  {
    title: '机构名称',
    dataIndex: 'deptName',
    width: 200
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
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
            content: `确认要"${text}${record.userName}用户吗?`,
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
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180
  }
];

/** 搜索表单配置 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'userName',
    label: '用户名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入用户名称',
    },
    colProps: { span: 8 }
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

/** 用户表单配置 */
export const userFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false
  },
  {
    field: 'nickName',
    label: '用户昵称',
    component: 'Input',
    required: true,
    colProps: {
      span: 12
    }
  },
  {
    field: 'deptId',
    label: '归属机构',
    component: 'TreeSelect',
    componentProps: {
      replaceFields: {
        title: 'name',
        key: 'deptId',
        value: 'deptId'
      },
      getPopupContainer: () => document.body
    },
    required: true,
    colProps: {
      span: 12
    }
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input',
    rules: [
      {
        required: true,
        message: '请输入手机号！',
      },
      {
        pattern: new RegExp('^1[3|4|5|6|7|8|9][0-9]\\d{8}$'),
        message: '请输入正确的手机号码!',
        validateTrigger: 'blur'
      }
    ]
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'Input',
    rules: [
      {
        required: true,
        message: '请输入邮箱！',
      },
      {
        type: 'email',
        message: '请输入正确的邮箱地址!',
        validateTrigger: ['blur', 'change']
      }
    ]
  },
  {
    field: 'userName',
    label: '用户名',
    component: 'Input',
    required: true,
    colProps: {
      span: 12
    }
  },
  {
    field: 'password',
    label: '密码',
    component: 'InputPassword',
    colProps: {
      span: 12
    },
    rules: [
      {
        required: true,
        whitespace: true,
        message: '请输入密码！',
      },
      {
        pattern: new RegExp('[^\\u4e00-\\u9fa5]+'),
        type: 'string',
        message: '密码不能输入汉字！',
      },
      {
        min: 6,
        max: 32,
        message: '长度必需在6-32之间！',
      }
    ]
  },
  {
    field: 'sex',
    label: '性别',
    component: 'Select',
    required: true,
    componentProps: {
      options: [
        { label: '男', value: '0' },
        { label: '女', value: '1' }
      ]
    },
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
    colProps: {
      span: 12
    }
  },
  {
    field: 'roleIds',
    label: '授权角色',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      mode: 'multiple',
      api: listRole,
      labelField: 'name',
      valueField: 'id',
      resultField: 'data'
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
