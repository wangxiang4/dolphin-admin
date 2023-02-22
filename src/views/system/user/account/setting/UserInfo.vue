<template>
  <div ref="wrapperRef"
       class="user-info"
       :style="getContentStyle"
  >
    <ARow :gutter="24">
      <ACol :span="14">
        <BasicForm @register="register"/>
      </ACol>
      <ACol :span="10">
        <div class="change-avatar">
          <CropperAvatar
            :uploadApi="commonUpload"
            :value="userInfoStore.avatar"
            btnText="更换头像"
            :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
            :width="150"
            @change="handleAvatarChange"
          />
        </div>
      </ACol>
    </ARow>
  </div>
</template>
<script lang="ts">
  import { Row, Col } from 'ant-design-vue';
  import { defineComponent, onMounted, computed, ref, CSSProperties, unref, reactive } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { CropperAvatar } from '/@/components/Cropper';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { editUser, getUser } from '/@/api/platform/system/controller/user';
  import { userFormSchema } from './data';
  import { useUserStore } from '/@/store/modules/user';
  import { commonUpload } from '/@/api/platform/core/controller/upload';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import { User } from '/@/api/platform/core/entity/user';
  import { isBase64image } from '/@/utils/is';

  interface State {
    baseInfoBtnLoading: boolean;
    userInfo: User | any;
  }
  export default defineComponent({
    components: {
      BasicForm,
      ARow: Row,
      ACol: Col,
      CropperAvatar,
    },
    setup() {
      const wrapperRef = ref(null);
      const { createMessage } = useMessage();
      const userStore = useUserStore();
      const userInfoStore = userStore.getUserInfo;
      const state = reactive<State>({
        baseInfoBtnLoading: false,
        userInfo: undefined
      });
      const [register, { setFieldsValue, validate }] = useForm({
        labelWidth: 120,
        schemas: userFormSchema,
        showSubmitButton: true,
        showResetButton: false,
        showAdvancedButton: false,
        submitButtonOptions: {
          text: '保存',
          preIcon: 'fa-regular:save',
          loading: state.baseInfoBtnLoading,
          onClick: handleSubmit
        },
        actionColOptions: { span: 24 }
      });

      onMounted(async () => {
        const result = await getUser(userInfoStore.id);
        state.userInfo = result.result;
        await setFieldsValue(result.result);
      });

      // 动态计算元素高度
      const { redoHeight, contentHeight } = useContentHeight(
        computed(() => true),
        wrapperRef,
        [],
        [],
        ref(30));

      const getContentStyle = computed((): CSSProperties => ({ minHeight: `${unref(contentHeight)}px` }));

      async function handleSubmit() {
        try {
          const formData = await validate();
          // 设置图片路径
          !isBase64image(state.userInfo.avatar) &&
          (formData.avatar = state.userInfo.avatar);
          state.baseInfoBtnLoading = true;
          await editUser(formData);
          createMessage.success('保存成功!');
          await userStore.getUserInfoAction();
        } finally {
          state.baseInfoBtnLoading = false;
        }
      }

      function handleAvatarChange({ src, data }) {
        state.userInfo.avatar = data.availablePath;
      }

      return {
        register,
        wrapperRef,
        userInfoStore,
        commonUpload,
        handleAvatarChange,
        getContentStyle,
        handleSubmit
      };
    }
  });
</script>

<style lang="less" scoped>
  .user-info {
    background: @component-background;

    > .ant-row:first-child {
      .ant-col {
        margin-top: 45px;
      }
    }

    .change-avatar {
      margin-top: 35px;
      text-align: center;
    }
  }
</style>
