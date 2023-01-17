<template>
  <BasicModal v-bind="$attrs"
              width="720px"
              @ok="handleSubmit"
              @register="registerModal"
  >
    <BasicForm @register="registerForm"/>
  </BasicModal>
</template>
<script lang="ts" setup>
  /**
   * 提供模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
   * 采用vben-动态表格表单封装组件编写,采用 setup 写法
   * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
   * author entfrm开发团队-王翔
   */
  import { reactive, toRaw } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './menu.data';
  import { BasicModal, ModalProps, useModalInner } from '/@/components/Modal';
  import { listMenu, addMenu, editMenu, getMenu } from '/@/api/platform/system/controller/menu';
  import { listToTree, findPath } from '/@/utils/helper/treeHelper';

  /** 通用变量统一声明区域 */
  const state = reactive({
    tag: '',
    menuTree: []
  });
  /** https://v3.cn.vuejs.org/api/options-data.html#emits */
  const emit = defineEmits(['success', 'register']);
  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate, clearValidate }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 }
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data: WindowInnerData = { _tag: '' }) => {
    // 处理清除脏数据
    await resetFields();
    await clearValidate();
    // 处理设置数据
    state.tag = data._tag;
    const topMenu = { id: '0', name: '顶级菜单', children: [] };
    state.menuTree = listToTree(await listMenu());
    topMenu.children = state.menuTree;
    await updateSchema([{
      field: 'parentId',
      componentProps: {
        treeData: [topMenu]
      }
    }, {
      field: 'type',
      componentProps: {
        disabled: state.tag == 'edit'
      }
    }]);
    const menuId = data.record?.id;
    const props: Partial<ModalProps> = { confirmLoading: false };
    // 采用tag标签区分操作
    switch (state.tag) {
      case 'add':
        props.title = '新增菜单';
        menuId && await setFieldsValue({ parentId: menuId });
        break;
      case 'edit':
        props.title = '编辑菜单';
        await setFieldsValue(await getMenu(menuId));
        break;
    }
    // 尾部:设置处理后的最终配置数据
    setModalProps(props);
  });

  /** 处理弹出框提交 */
  async function handleSubmit() {
    try {
      // 提取验证数据
      const formData = await validate();
      // 处理提交之前逻辑
      setModalProps({ confirmLoading: true });
      // 采用tag标签区分操作
      switch (state.tag) {
        case 'add':
          // 处理拿取当前菜单所有父级进行修改角色模块的勾选类型
          const superMenus = findPath(toRaw(state.menuTree),(node) => node.id == formData?.parentId);
          formData.parentIds = (superMenus||[]).map(item => item.id);
          await addMenu(formData);
          break;
        case 'edit':
          await editMenu(formData);
          break;
      }
      // 处理提交完成之后逻辑
      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

</script>
