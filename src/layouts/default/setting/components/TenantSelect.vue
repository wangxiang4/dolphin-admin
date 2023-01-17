<template>
  <AForm ref="formElRef"
         :model="state.modelRef"
         :scrollToFirstError="true"
  >
    <AFormItem name="tenantIds"
               style="margin-bottom:0px"
               :rules="[{ required: true, message: '请至少选择一个多租户,否则会产生无租户数据!'}]"
    >
      <ASelect v-model:value="state.modelRef.tenantIds"
               :options="state.options"
               :filterOption="filterOption"
               mode="multiple"
               :maxTagCount="4"
               :maxTagTextLength="10"
               placeholder="请选择多租户"
               style="width:100%"
      />
    </AFormItem>
    <AFormItem style="margin-bottom:0px">
      <ARow>
        <ACol :span="12">
          <a-button type="primary"
                    block
                    @click="handleChangeTenant"
          >
            <Icon icon="fa-regular:save"/>保存
          </a-button>
        </ACol>
        <ACol :span="12">
          <a-button color="warning"
                    block
                    @click="handleResetTenantEnv"
          >
            <Icon icon="ant-design:redo-outlined"/>重置
          </a-button>
        </ACol>
      </ARow>
    </AFormItem>
  </AForm>
</template>
<script lang="ts" setup>
  import { reactive, onMounted, ref } from 'vue';
  import { currentUserTenantList } from '/@/api/platform/system/controller/tenant';
  import { useUserStore } from '/@/store/modules/user';
  import { Select, Row, Col, Form } from 'ant-design-vue';
  import { useTenant } from '/@/hooks/web/useTenant';
  import { Icon } from '/@/components/Icon';

  interface FormState {
    options: Recordable[];
    modelRef: {
      tenantIds: string[];
    };
  }

  const ASelect = Select;
  const ARow = Row;
  const ACol = Col;
  const AForm = Form;
  const AFormItem = Form.Item;

  const formElRef = ref();
  const { changeTenantEnv, resetTenantEnv } =  useTenant();
  const state = reactive<FormState>({
    options: [],
    modelRef: {
      tenantIds: []
    }
  });

  onMounted(async () => {
    const userStore = useUserStore();
    state.modelRef.tenantIds = userStore.getUserInfo.tenantIds;
    const tenantList = await currentUserTenantList();
    state.options = tenantList.map(tenant => ({
      value: tenant.code,
      label: tenant.name
    }));
  });

  /** 自定义搜索 */
  function filterOption(input: string, option: any) {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  /** 处理多租户更新 */
  async function handleChangeTenant() {
    const formData = await formElRef.value.validate();
    await changeTenantEnv(formData.tenantIds);
  }

  /** 处理重置多租户 */
  async function handleResetTenantEnv() {
    await resetTenantEnv();
  }

</script>
