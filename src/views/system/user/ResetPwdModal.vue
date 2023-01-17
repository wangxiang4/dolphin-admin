<template>
  <BasicModal v-bind="$attrs"
              centered
              title="重置密码"
              minHeight="100px"
              @ok="handleSubmit"
              @register="registerModal"
  >
    <Form :model="modelRef" :rules="rulesRef">
      <FormItem name="newPassword" v-bind="validateInfos.newPassword">
        <StrengthMeter v-model:value="modelRef.newPassword" placeholder="请输入重置密码"/>
      </FormItem>
    </Form>
  </BasicModal>
</template>

<script lang="ts" setup>
  /**
   * 提供模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
   * 采用ant-design-vue原生组件编写表单,采用 setup 写法
   * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
   * author entfrm开发团队-王翔
   */
  import { reactive } from 'vue';
  import { BasicModal, ModalProps, useModalInner } from '/@/components/Modal';
  import { StrengthMeter } from '/@/components/StrengthMeter';
  import { Form } from 'ant-design-vue';
  import { resetPwd } from '/@/api/platform/system/controller/user';
  import { useMessage } from '/@/hooks/web/useMessage';

  /** 类型规范统一声明定义区域 */
  interface WindowState {
    id: string;
    newPassword: string;
  }

  /** 通用变量统一声明区域 */
  const { createMessage } = useMessage();
  /** https://v3.cn.vuejs.org/api/options-data.html#emits */
  const emit = defineEmits(['success', 'register']);
  const FormItem = Form.Item;
  const useForm = Form.useForm;
  const modelRef = reactive<WindowState>({
    id: '',
    newPassword: ''
  });
  const rulesRef = reactive({
    newPassword: [
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
  });
  const { resetFields, clearValidate, validate, validateInfos } = useForm(modelRef, rulesRef);
  const [registerModal, { setModalProps, closeModal }] = useModalInner( (data: WindowInnerData) => {
    // 处理清除脏数据
    resetFields();
    clearValidate();
    // 处理设置数据
    modelRef.id = data.record?.id;
    const props: Partial<ModalProps> = { confirmLoading: false };
    // 尾部:设置处理后的最终配置数据
    setModalProps(props);
  });

  /** 处理模态框提交 */
  async function handleSubmit() {
    try {
      // 验证数据
      await validate();
      // 处理提交之前逻辑
      setModalProps({ confirmLoading: true });
      if (!modelRef.id) return createMessage.error('用户编号ID不存在,请检查!');
      await resetPwd(modelRef);
      // 处理提交完成之后逻辑
      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

</script>
