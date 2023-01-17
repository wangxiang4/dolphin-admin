<template>
  <BasicModal v-bind="$attrs"
              :width="720"
              :height="500"
              @register="registerModal"
              @ok="handleSubmit"
  >
    <AForm ref="formElRef"
           :labelCol="{ style: { width: '120px' } }"
           :wrapperCol="{ style: { width: '100%' } }"
           :model="state.modelRef"
           :rules="state.rulesRef"
           :scrollToFirstError="true"
           @keypress.enter="handleSubmit"
    >
      <AFormItem name="id">
        <Input v-model:value="state.modelRef.id" :hidden="true"/>
      </AFormItem>
      <ARow justify="center">
        <ACol :span="12">
          <AFormItem label="参数名称" name="name">
            <a-input v-model:value="state.modelRef.name"
                     placeholder="请输入参数名称"
                     allowClear
            />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="参数键名" name="key">
            <a-input v-model:value="state.modelRef.key"
                     placeholder="请输入参数键名"
                     allowClear
            />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="参数键值" name="value">
            <a-input v-model:value="state.modelRef.value"
                     placeholder="请输入参数键值"
                     allowClear
            />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="系统内置" name="isSys">
            <ARadioGroup v-model:value="state.modelRef.isSys">
              <ARadio value="0">是</ARadio>
              <ARadio value="1">否</ARadio>
            </ARadioGroup>
          </AFormItem>
        </ACol>
        <ACol>
          <AFormItem label="备注" name="remarks">
            <ATextarea v-model:value="state.modelRef.remarks"
                       placeholder="请输入备注"
                       :rows="6"
                       allowClear
            />
          </AFormItem>
        </ACol>
      </ARow>
    </AForm>
  </BasicModal>
</template>
<script lang="ts" setup>
  /**
   * 提供模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
   * 采用ant-design-vue表格表单组件编写,采用 setup 写法
   * 当vben的BasicTable跟BasicForm组件不能满足一些特殊需求时,需要写原生ant-design-vue组件时,请严格参考此处代码
   * 当前原生ant-design-vue表格表单组件模板,目前已经与系统项目配置高度集成,系统配置发生修改时组件也会产生对应的变化
   * 目前是基于vben的BasicTable跟BasicForm组件重写出一套ant-design-vue原生表格表单组件模板
   * 注意:不会强依赖vben的BasicTable跟BasicForm组件,只会依赖一些简单容易逻辑不复杂的功能,复杂的功能不会依赖,降低耦合,提升此模板的可扩展性
   * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
   * author entfrm开发团队-王翔
   */
  import { reactive, ref } from 'vue';
  import { Form, Input, Radio, Row, Col } from 'ant-design-vue';
  import { BasicModal, ModalProps, useModalInner } from '/@/components/Modal';
  import { getConfig, addConfig, editConfig } from '/@/api/platform/system/controller/config';

  /** 类型规范统一声明定义区域 */
  interface WindowState {
    tag: string;
    modelRef: {
      id: string;
      name: string;
      key: string;
      value: string;
      isSys: string;
      remarks: string;
    };
    rulesRef: Recordable;
  }

  /** 通用变量统一声明区域 */
  const AForm = Form;
  const AFormItem = Form.Item;
  const ATextarea = Input.TextArea;
  const ARadio = Radio;
  const ARadioGroup = Radio.Group;
  const ARow = Row;
  const ACol = Col;

  const formElRef = ref();
  const state = reactive<WindowState>({
    tag: '',
    modelRef: {
      id: undefined!,
      name: undefined!,
      key: undefined!,
      value: undefined!,
      isSys: '0',
      remarks: undefined!
    },
    rulesRef: {
      name: [
        { required: true, whitespace: true, message: '参数名称不能为空', validateTrigger: 'blur' }
      ],
      key: [
        { required: true, whitespace: true, message: '参数键名不能为空', validateTrigger: 'blur' }
      ],
      value: [
        { required: true, whitespace: true, message: '参数键值不能为空', validateTrigger: 'blur' }
      ]
    }
  });
  /** https://v3.cn.vuejs.org/api/options-data.html#emits */
  const emit = defineEmits(['success', 'register']);
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data: WindowInnerData = { _tag: '' })=> {
    // 处理清除脏数据
    formElRef.value.resetFields();
    formElRef.value.clearValidate();
    // 处理设置数据
    state.tag = data._tag;
    const configId = data.record?.id;
    const props: Partial<ModalProps> = { confirmLoading: false };
    // 采用tag标签区分操作
    switch (state.tag) {
      case 'add':
        props.title = '新增配置参数';
        break;
      case 'edit':
        props.title = '编辑配置参数';
        const result = await getConfig(configId);
        state.modelRef = result;
        break;
    }
    // 尾部:设置处理后的最终配置数据
    setModalProps(props);
  });

  /** 处理弹出框提交 */
  async function handleSubmit() {
    try {
      // 提取验证数据
      const formData = await formElRef.value.validate();
      console.log(formData);
      // 处理提交之前逻辑
      setModalProps({ confirmLoading: true });
      // 采用tag标签区分操作
      switch (state.tag) {
        case 'add':
          await addConfig(formData);
          break;
        case 'edit':
          await editConfig(formData);
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
