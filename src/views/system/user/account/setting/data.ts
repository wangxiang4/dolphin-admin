import { FormSchema } from '/@/components/Form/index';

export const settingList = [
  {
    key: '1',
    name: '个人信息',
    component: 'UserInfo',
    prefixIcon: 'fa:user'
  }
];

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
    required: true
  },
  {
    field: 'deptName',
    label: '归属机构',
    component: 'Input',
    required: true,
    componentProps: {
      disabled: true
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
    field: 'sex',
    label: '性别',
    component: 'RadioGroup',
    defaultValue: '0',
    required: true,
    componentProps: {
      options: [
        { label: '男', value: '0' },
        { label: '女', value: '1' }
      ]
    }
  },
  {
    label: '备注',
    field: 'remarks',
    component: 'InputTextArea',
    componentProps: {
      rows: 6
    }
  }
];
