/**
 * @program: dolphin-admin
 * @description: 创建vue-i18n实例
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

import type { App } from 'vue';
import type { I18n, I18nOptions } from 'vue-i18n';
import { createI18n } from 'vue-i18n';
import { setHtmlPageLang, setLoadLocalePool } from './helper';
import { localeSetting } from '/@/settings/localeSetting';
import { useLocaleStoreWithOut } from '/@/store/modules/locale';
const { fallback, availableLocales } = localeSetting;
export let i18n: ReturnType<typeof createI18n>;

async function createI18nOptions(): Promise<I18nOptions> {
  const localeStore = useLocaleStoreWithOut();
  const locale = localeStore.getLocale;
  const defaultLocal = await import(`./lang/${locale}.ts`);
  const message = defaultLocal.default?.message ?? {};

  setHtmlPageLang(locale);
  setLoadLocalePool((loadLocalePool) => {
    loadLocalePool.push(locale);
  });

  return {
    legacy: false,
    locale,
    fallbackLocale: fallback,
    messages: {
      [locale]: message,
    },
    availableLocales: availableLocales,
    // 如果您不想从全局范围继承语言环境，则需要将 i18n 组件的同步选项设置为 false
    sync: true,
    // true关闭警告
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true,
  };
}

/** 使用全局设置 i18n 实例 */
export async function setupI18n(app: App) {
  const options = await createI18nOptions();
  i18n = createI18n(options) as I18n;
  app.use(i18n);
}
