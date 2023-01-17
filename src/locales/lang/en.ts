/**
 * @program: dolphin-admin
 * @description: 英文国际化配置
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

import { genMessage } from '../helper';
import antdLocale from 'ant-design-vue/es/locale/en_US';

const modules = import.meta.globEager('./en/**/*.ts');
export default {
  message: {
    ...genMessage(modules, 'en'),
    antdLocale,
  },
  momentLocale: null,
  momentLocaleName: 'en',
};
