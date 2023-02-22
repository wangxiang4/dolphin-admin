<template>
  <BasicModal v-bind="$attrs"
              width="720px"
              @ok="handleSubmit"
              @register="registerModal"
  >
    <BasicForm @register="registerForm"/>
  </BasicModal>
</template>
<script lang="ts">
  /**
   * 提供模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
   * 采用vben-动态表格表单封装组件编写,不采用 setup 写法
   * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
   * author entfrm开发团队-王翔
   */
  import { defineComponent, reactive, toRaw } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { userFormSchema } from './user.data';
  import { listDept } from '/@/api/platform/system/controller/dept';
  import { addUser, editUserRole, getUser } from '/@/api/platform/system/controller/user';
  import { listToTree } from '/@/utils/helper/treeHelper';
  import { ModalProps } from '/@/components/Modal';
  import { findListNameById } from '/@/utils';
  import { TreeItem } from '/@/components/Tree';
  import { useMessage } from '/@/hooks/web/useMessage';

  /** 类型规范统一声明定义区域 */
  interface WindowState {
    tag: string;
    deptTree: TreeItem[];
  }

  export default defineComponent({
    name: 'UserModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(props, { emit }) {

      /** 通用变量统一声明区域 */
      const state = reactive<WindowState>({
        // 操作标签
        tag: '',
        // 部门树形数据
        deptTree: []
      });
      const { createMessage } = useMessage();
      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate, clearValidate }] = useForm({
        labelWidth: 100,
        schemas: userFormSchema,
        showActionButtonGroup: false,
        actionColOptions: { span: 24 }
      });
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data: WindowInnerData = { _tag: '' }) => {
        // 处理清除脏数据
        await resetFields();
        await clearValidate();
        // 处理设置数据
        state.tag = data._tag;
        state.deptTree = listToTree(await listDept());
        const userId = data.record?.id;
        const props: Partial<ModalProps> = { confirmLoading: false };
        await updateSchema([
          {
            field: 'deptId',
            componentProps: { treeData: toRaw(state.deptTree) }
          },
          {
            field: 'password',
            ifShow: state.tag == 'add'
          }
        ]);
        // 采用tag标签区分操作
        switch (state.tag) {
          case 'add':
            props.title = '新增用户';
            break;
          case 'edit':
            props.title = '编辑用户';
            const result = await getUser(userId);
            await setFieldsValue(result.result);
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
          formData.deptName = findListNameById(formData.deptId, toRaw(state.deptTree), { idField: 'deptId' });
          if (!formData.deptName) return createMessage.error('部门名称数据为空,请重试!');
          // 采用tag标签区分操作
          switch (state.tag) {
            case 'add':
              await addUser(formData);
              break;
            case 'edit':
              await editUserRole(formData);
              break;
          }
          // 处理提交完成之后逻辑
          closeModal();
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        registerModal,
        registerForm,
        handleSubmit
      };
    }
  });
</script>
