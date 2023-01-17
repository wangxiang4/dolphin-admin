/**
 * @program: dolphin-admin
 * @description: 状态码转换提示消息
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/7
 */

import type { ErrorMessageMode } from '/#/axios';
import { useMessage } from '/@/hooks/web/useMessage';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStoreWithOut } from '/@/store/modules/user';
import projectSetting from '/@/settings/projectSetting';
import { SessionTimeoutProcessingEnum } from '/@/enums/appEnum';

const { createMessage, createErrorModal } = useMessage();
const error = createMessage.error!;
const stp = projectSetting.sessionTimeoutProcessing;

export function checkStatus(status: number, msg: string, errorMessageMode: ErrorMessageMode = 'message'): boolean {
  const { t } = useI18n();
  const userStore = useUserStoreWithOut();
  let errMessage = '';

  switch (status) {
    case 400:
      errMessage = `${msg}`;
      break;
    case 401:
      errMessage = t('sys.api.errMsg401');
      break;
    case 403:
      errMessage = t('sys.api.errMsg403');
      break;
    // 404请求不存在
    case 404:
      errMessage = t('sys.api.errMsg404');
      break;
    case 405:
      errMessage = t('sys.api.errMsg405');
      break;
    case 408:
      errMessage = t('sys.api.errMsg408');
      break;
    case 424:
      // token 过期特殊处理返回 424 不是 401
      errMessage = t('sys.api.errMsg424');
      if (stp === SessionTimeoutProcessingEnum.PAGE_COVERAGE) {
        userStore.setAccessToken('');
        userStore.setRefreshToken('');
        userStore.setSessionTimeout(true);
      } else {
        userStore.logout(true);
      }
      break;
    case 426:
      errMessage = t('sys.api.errMsg426');
      break;
    case 428:
      errMessage = t('sys.api.errMsg428');
      break;
    case 429:
      errMessage = t('sys.api.errMsg429');
      break;
    case 500:
      errMessage = t('sys.api.errMsg500');
      break;
    case 501:
      errMessage = t('sys.api.errMsg501');
      break;
    case 502:
      errMessage = t('sys.api.errMsg502');
      break;
    case 503:
      errMessage = t('sys.api.errMsg503');
      break;
    case 504:
      errMessage = t('sys.api.errMsg504');
      break;
    case 505:
      errMessage = t('sys.api.errMsg505');
      break;
  }

  if (errMessage) {
    switch (errorMessageMode) {
      case 'modal':
        createErrorModal({ title: t('sys.api.errorTip'), content: errMessage });
        break;
      case 'message':
        error({ content: errMessage, key: `global_error_message_status_${status}` });
        break;
    }
    return true;
  }

  return false;
}
