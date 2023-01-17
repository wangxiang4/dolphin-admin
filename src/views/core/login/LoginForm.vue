<template>
  <LoginFormTitle v-show="getShow" class="enter-x"/>
  <Form v-show="getShow"
        ref="formRef"
        :model="formData"
        class="p-4 enter-x"
        :rules="getFormRules"
        @keypress.enter="handleLogin"
  >
    <FormItem name="realKey">
      <Input v-model:value="formData.realKey" size="large" :hidden="true"/>
    </FormItem>
    <FormItem name="account" class="enter-x">
      <Input v-model:value="formData.account"
             class="fix-auto-fill"
             size="large"
             :placeholder="t('sys.login.userName')"
      />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword v-model:value="formData.password"
                     size="large"
                     visibilityToggle
                     :placeholder="t('sys.login.password')"
      />
    </FormItem>
    <ARow class="enter-x">
      <ACol :span="16">
        <FormItem name="code">
          <Input v-model:value="formData.code"
                 size="large"
                 :placeholder="t('sys.login.captcha')"
                 style="min-width: 100px"
          />
        </FormItem>
      </ACol>
      <ACol :span="8">
        <FormItem :style="{ 'text-align':'right', 'margin-left':'20px' }">
          <img style="margin-top: 2px;" :src="codeUrl" @click="getCode">
        </FormItem>
      </ACol>
    </ARow>
    <ARow class="enter-x">
      <ACol :span="12">
        <FormItem>
          <!-- No logic, you need to deal with it yourself -->
          <Checkbox v-model:checked="rememberMe" size="small">{{
            t('sys.login.rememberMe')
          }}</Checkbox>
        </FormItem>
      </ACol>
      <ACol :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <!-- No logic, you need to deal with it yourself -->
          <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t('sys.login.forgetPassword') }}
          </Button>
        </FormItem>
      </ACol>
    </ARow>
    <FormItem class="enter-x">
      <Button type="primary"
              size="large"
              block
              :loading="loading"
              @click="handleLogin"
      >{{
        t('sys.login.loginButton')
      }}</Button>
    </FormItem>
    <ARow class="enter-x">
      <ACol :md="8" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.MOBILE)">{{
          t('sys.login.mobileSignInFormTitle')
        }}</Button>
      </ACol>
      <ACol :md="8" :xs="24" class="!my-2 !md:my-0 xs:mx-0 md:mx-2">
        <Button block @click="setLoginState(LoginStateEnum.QR_CODE)">{{
          t('sys.login.qrSignInFormTitle')
        }}</Button>
      </ACol>
      <ACol :md="7" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.REGISTER)">{{
          t('sys.login.registerButton')
        }}</Button>
      </ACol>
    </ARow>
    <Divider class="enter-x">{{ t('sys.login.otherSignIn') }}</Divider>
    <div class="flex justify-evenly enter-x" :class="`${prefixCls}-sign-in-way`">
      <GithubFilled/>
      <WechatFilled/>
      <AlipayCircleFilled/>
      <GoogleCircleFilled/>
      <TwitterCircleFilled/>
    </div>
  </Form>
</template>
<script lang="ts" setup>
  import { reactive, ref, toRaw, unref, computed, onMounted } from 'vue';
  import { Checkbox, Form, Input, Row, Col, Button, Divider } from 'ant-design-vue';
  import { GithubFilled, WechatFilled, AlipayCircleFilled, GoogleCircleFilled, TwitterCircleFilled } from '@ant-design/icons-vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getCaptcha } from '/@/api/platform/core/controller/user';
  import captchaDefImg from '/@/assets/images/captcha.jpg';

  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();
  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();
  const formRef = ref();
  const loading = ref(false);
  const rememberMe = ref(false);
  const codeUrl = ref();
  const { validForm } = useFormValid(formRef);
  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);
  const formData = reactive({
    account: 'admin',
    password: '123456',
    realKey: '',
    code: '',
  });

  onMounted(() => {
    getCode();
  });

  async function getCode() {
    try {
      const codeModel = await getCaptcha();
      codeUrl.value = codeModel.img ?? captchaDefImg;
      formData.realKey = codeModel.realKey;
    } catch(error) {
      codeUrl.value = captchaDefImg;
    }
  }

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login(toRaw({
          password: data.password,
          username: data.account,
          realKey: data.realKey,
          code: data.code,
        }));
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.nickName}`,
          duration: 3,
        });
      }
    } catch (error){
      formData.code='';
      formData.realKey='';
      await getCode();
    } finally {
      loading.value = false;
    }
  }
</script>
