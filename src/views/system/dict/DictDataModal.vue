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
  import { formSchema } from './dictdata.data';
  import { getDictData, addDictData, editDictData } from '/@/api/platform/system/controller/dictdata';
  import { BasicModal, ModalProps, useModalInner } from '/@/components/Modal';

  /** 通用变量统一声明区域 */
  const tag = ref<Nullable<string>>('');
  /** https://v3.cn.vuejs.org/api/options-data.html#emits */
  const emit = defineEmits(['success', 'register']);
  const [registerForm, { resetFields, setFieldsValue, validate, clearValidate }] = useForm({
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
    const dictType = data.dictType;
    const dictDataId = data.record?.id;
    const props: Partial<ModalProps> = { confirmLoading: false };
    // 采用tag标签区分操作
    switch (unref(tag)) {
      case 'add':
        props.title = '新增字典数据';
        await setFieldsValue({ dictType });
        break;
      case 'edit':
        props.title = '编辑字典数据';
        await setFieldsValue( Object.assign({}, { dictType },  await getDictData(dictDataId)));
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
          await addDictData(formData);
          break;
        case 'edit':
          await editDictData(formData);
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
