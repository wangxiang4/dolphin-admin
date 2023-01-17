/**
 * @program: dolphin-admin
 * @description: 国际化配置设置
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

import type { DropMenu } from '../components/Dropdown';
import type { LocaleSetting, LocaleType } from '/#/config';

export const LOCALE: { [key: string]: LocaleType } = {
  ZH_CN: 'zh_CN',
  EN_US: 'en',
};

export const localeSetting: LocaleSetting = {
  showPicker: true,
  // 语言环境
  locale: LOCALE.ZH_CN,
  // 默认语言环境
  fallback: LOCALE.ZH_CN,
  // 可用的语言环境
  availableLocales: [LOCALE.ZH_CN, LOCALE.EN_US],
};

/** 语言环境列表 */
export const localeList: DropMenu[] = [
  {
    text: '简体中文',
    event: LOCALE.ZH_CN,
  },
  {
    text: 'English',
    event: LOCALE.EN_US,
  },
];
