<template>
  <BasicModal v-bind="$attrs"
              width="720px"
              @register="registerModal"
              @ok="handleSubmit"
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
  import { ref, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './client.data';
  import { addClient, editClient, getClient, listClient } from '/@/api/platform/system/controller/client';
  import { BasicModal, ModalProps, useModalInner } from '/@/components/Modal';
  import { isEmpty } from '/@/utils/is';

  /** 通用变量统一声明区域 */
  const tag = ref<Nullable<string>>('');
  /** https://v3.cn.vuejs.org/api/options-data.html#emits */
  const emit = defineEmits(['success', 'register']);
  const [registerForm, { resetFields, setFieldsValue, validate, clearValidate, updateSchema }] = useForm({
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
    tag.value = data._tag;
    const clientId = data.record?.clientId;
    const props: Partial<ModalProps> = { confirmLoading: false };
    await updateSchema({
      field: 'clientId',
      componentProps: {
        disabled: unref(tag) != 'add'
      },
      rules: [
        {
          required: true,
          whitespace: true,
          message: '请输入客户端编码'
        },
        {
          validator: async (rule, value) => {
            if (!isEmpty(value)) {
              const result = await listClient({ clientId: value });
              const list = result.data?.filter(item => item.clientId != clientId);
              if(list?.length > 0) return Promise.reject('该客户端编码已存在');
            }
            return Promise.resolve();
          },
          validateTrigger: 'blur'
        }]
    });
    // 采用tag标签区分操作
    switch (unref(tag)) {
      case 'add':
        props.title = '新增客户端';
        break;
      case 'edit':
        props.title = '编辑客户端';
        await setFieldsValue(await getClient(clientId));
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
      switch (unref(tag)) {
        case 'add':
          await addClient(formData);
          break;
        case 'edit':
          await editClient(formData);
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
