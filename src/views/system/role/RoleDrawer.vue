<template>
  <BasicDrawer v-bind="$attrs"
               width="500px"
               showFooter
               @ok="handleSubmit"
               @register="registerDrawer"
               @visible-change="state.checkedKeys={}"
  >
    <BasicForm @register="registerForm">
      <template #menu="{ model, field }">
        <BasicTree v-model:value="model[field]"
                   title="菜单分配"
                   toolbar
                   checkable
                   :treeData="state.menuTree"
                   :replaceFields="{ title: 'name', key: 'id' }"
                   @check="handleHalfCheckedKeysMerge"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  /**
   * 提供模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
   * 采用vben-动态表格表单封装组件编写,采用 setup 写法
   * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
   * author entfrm开发团队-王翔
   */
  import {reactive, toRaw} from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './role.data';
  import { BasicDrawer, DrawerProps, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { listMenu, getRoleMenuIds } from '/@/api/platform/system/controller/menu';
  import { addRole, editRole, getRole } from '/@/api/platform/system/controller/role';
  import { listToTree } from '/@/utils/helper/treeHelper';

  /** 类型规范统一声明定义区域 */
  interface WindowState {
    tag: string;
    menuTree: TreeItem[];
    checkedKeys: Recordable;
  }

  /** 通用变量统一声明区域 */
  const state = reactive<WindowState>({
    // 操作标签
    tag: '',
    // 菜单树形数据
    menuTree: [],
    // 选中复选框的树节点
    checkedKeys: {},
  });
  /** https://v3.cn.vuejs.org/api/options-data.html#emits */
  const emit = defineEmits(['success', 'register']);
  const [registerForm, { resetFields, setFieldsValue, validate, clearValidate }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 }
  });
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data: WindowInnerData = { _tag: '' }) => {
    // 处理清除脏数据
    await resetFields();
    await clearValidate();
    // 处理设置数据
    state.tag = data._tag;
    state.menuTree = listToTree(await listMenu());
    const roleId = data.record?.id;
    const props: Partial<DrawerProps> = { confirmLoading: false };
    // 采用tag标签区分操作
    switch (state.tag) {
      case 'add':
        props.title = '新增角色';
        break;
      case 'edit':
        props.title = '编辑角色';
        const result = await getRoleMenuIds(roleId);
        const role  = await getRole(roleId);
        const checked = {
          checkedKeys: result.extend?.filter(item => item.checkeType == '1')?.map(item=> item.menuId),
          halfCheckedKeys: result.extend.filter(item => item.checkeType == '2')?.map(item=> item.menuId)
        };
        state.checkedKeys = checked;
        await setFieldsValue(Object.assign({}, role, { menuIds: checked.checkedKeys }));
        break;
    }
    // 尾部:设置处理后的最终配置数据
    setDrawerProps(props);
  });

  /** 处理选中的半复选框合并至勾选数据中 */
  function handleHalfCheckedKeysMerge (checkedKeys: string[], e) {
    state.checkedKeys = { checkedKeys, halfCheckedKeys: e.halfCheckedKeys };
  }

  /** 处理弹出框提交 */
  async function handleSubmit() {
    try {
      // 提取验证数据
      const formData = await validate();
      // 处理提交之前逻辑
      setDrawerProps({ confirmLoading: true });
      formData.menuIds = toRaw(state.checkedKeys);
      // 采用tag标签区分操作
      switch (state.tag) {
        case 'add':
          await addRole(formData);
          break;
        case 'edit':
          await editRole(formData);
          break;
      }
      // 处理提交完成之后逻辑
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }

</script>
