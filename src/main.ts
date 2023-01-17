import '/@/assets/styles/index.less';

// 注册windi
import 'virtual:windi.css';
// 注册svg图标精灵
import 'virtual:svg-icons-register';
import App from './App.vue';
import { createApp } from 'vue';
import { initAppConfigStore } from '/@/logics/initAppConfig';
import { router, setupRouter } from '/@/router';
import { setupRouterGuard } from '/@/router/guard';
import { setupStore } from '/@/store';
import { setupGlobDirectives } from '/@/directives';
import { setupI18n } from '/@/locales/setupI18n';
import { registerGlobComp } from '/@/components';

// 引入表格功能相对比较齐全的组件vxeTable
import XEUtils from 'xe-utils';
// 按需导入 vxeTable
import {
  // 核心
  VXETable,

  // 功能模块
  Icon,
  Filter,
  Menu,
  Edit,
  Export,
  Keyboard,
  Validator,
  Footer,

  // 可选组件
  Column,
  Colgroup,
  Grid,
  Toolbar,
  Pager,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  RadioButton,
  Input,
  Textarea,
  Button,
  Modal,
  Tooltip,
  Form,
  FormItem,
  FormGather,
  Select,
  Optgroup,
  Option,
  Switch,
  List,
  Pulldown,

  // 表格
  Table
} from 'vxe-table';
import zhCN from 'vxe-table/lib/locale/lang/zh-CN';

// 在本地开发中不引入按需？
// 在按需引入的本地开发中，浏览器请求的数量将增加 20% 左右。
// 这可能会减慢浏览器的刷新速度。
// 所以都是在本地开发中引入，生产环境中才按需引入
if (import.meta.env.DEV) {
  import('ant-design-vue/dist/antd.less');
  import('vxe-table/lib/style.css');
}

async function bootstrap() {
  const app = createApp(App);

  // 配置 store
  setupStore(app);

  // 初始化内部系统配置
  initAppConfigStore();

  // 注册antd全局组件
  registerGlobComp(app);

  // 多语言配置
  await setupI18n(app);

  // 配置路由
  setupRouter(app);

  // 路由器保护
  setupRouterGuard(router);

  // 注册全局指令
  setupGlobDirectives(app);

  // 路线准备好时挂载: https://next.router.vuejs.org/api/#isready
  await router.isReady();

  app.mount('#app', true);

  // 高德地图安全配置
  // @ts-ignore
  window._AMapSecurityConfig = {
    securityJsCode: 'ea9d5e2fb6383665de6c3c7b4e53c289'
  };

  // 按需加载的方式默认是不带国际化的，自定义国际化需要自行解析占位符 '{0}'，例如：
  VXETable.setup({
    size: 'medium', // set default size
    i18n: (key, args) => XEUtils.toFormatString(XEUtils.get(zhCN, key), args)
  });

  // 表格功能
  app.use(Footer)
    .use(Icon)
    .use(Filter)
    .use(Edit)
    .use(Menu)
    .use(Export)
    .use(Keyboard)
    .use(Validator)

    // 可选组件
    .use(Column)
    .use(Colgroup)
    .use(Grid)
    .use(Toolbar)
    .use(Pager)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(Radio)
    .use(RadioGroup)
    .use(RadioButton)
    .use(Input)
    .use(Textarea)
    .use(Button)
    .use(Modal)
    .use(Tooltip)
    .use(Form)
    .use(FormItem)
    .use(FormGather)
    .use(Select)
    .use(Optgroup)
    .use(Option)
    .use(Switch)
    .use(List)
    .use(Pulldown)

    // 安装表格
    .use(Table);
}

void bootstrap();
