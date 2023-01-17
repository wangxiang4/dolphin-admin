<template>
  <BasicModal v-bind="$attrs"
              width="720px"
              :maskClosable="false"
              :destroyOnClose="true"
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
  import { reactive } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { regionFormSchema } from './region.data';
  import { BasicModal, ModalProps, useModalInner } from '/@/components/Modal';
  import { listRegion, addRegion, editRegion, getRegion } from '/@/api/platform/system/controller/region';

  /** 通用变量统一声明区域 */
  const state = reactive({
    tag: '',
    parentId: '',
    topRegion: [{ id: '0', name: '顶级区域', children: [] }]
  });
  /** https://v3.cn.vuejs.org/api/options-data.html#emits */
  const emit = defineEmits(['success', 'register']);
  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate, clearValidate }] = useForm({
    labelWidth: 100,
    schemas: regionFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 }
  });
  const [registerModal, { setModalProps, closeModal, changeLoading }] = useModalInner(async (data: WindowInnerData = { _tag: '' }) => {
    changeLoading(true);
    // 处理清除脏数据
    await resetFields();
    await clearValidate();
    // 处理设置数据
    state.tag = data._tag;
    await updateSchema({
      field: 'parentId',
      componentProps: {
        treeData: state.topRegion,
        onChange: (selectedRowKeys: string) => {
          selectedRowKeys && (state.parentId = selectedRowKeys);
        },
        loadData: (treeNode: any) => {
          const { id } = treeNode.dataRef;
          return listRegion({ parentId: id }).then(res => {
            treeNode.dataRef.children = (res || [])?.map(item => {
              if(item.hasOwnProperty('children')) {
                item.isLeaf = false;
              } else item.isLeaf = true;
              return item;
            });
          });
        }
      }
    });
    const regionId = data.record?.id;
    const props: Partial<ModalProps> = { confirmLoading: false };
    // 采用tag标签区分操作
    switch (state.tag) {
      case 'add':
        props.title = '新增区域';
        if(regionId) {
          state.parentId = regionId;
          await setFieldsValue({ parentId: data.record?.name });
        }
        break;
      case 'edit':
        props.title = '编辑区域';
        const result = await getRegion(regionId);
        const region = result.result;
        state.parentId = region.parentId;
        if (result?.extend) {
          region.parentId = result?.extend.name;
        }
        await setFieldsValue(region);
        break;
    }
    // 尾部:设置处理后的最终配置数据
    setModalProps(props);
    changeLoading(false);
  });

  /** 处理弹出框提交 */
  async function handleSubmit() {
    try {
      // 提取验证数据
      const formData = await validate();
      // 处理提交之前逻辑
      setModalProps({ confirmLoading: true });
      formData.parentId = state.parentId;
      // 采用tag标签区分操作
      switch (state.tag) {
        case 'add':
          await addRegion(formData);
          break;
        case 'edit':
          await editRegion(formData);
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
