/**
 * @program: dolphin-admin
 * @description: 指示板路由默认配置
 * 当没有配置Dashboard菜单时,使用默认配置
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

/**
 * 项目首页默认基础路由组件配置,目前在后端数据库菜单中配置了,这边就不要配置了
 * 只有当后端数据库菜单中没有配置的时候,可以放开这段代码,不然前端跟后端都配置了
 * 创建路由时候会出路由冲突错误,从而导致进不去页面
 * 目前不删除此段代码的目的,给不知道如何配置静态路由的开发人员提供如下参考
 */
/*import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import {useI18n} from "/@/hooks/web/useI18n";
const { t } = useI18n();

const dashboard: AppRouteModule = {
  path: '/dashboard',
  name: 'Dashboard',
  component: LAYOUT,
  redirect: '/dashboard/analysis',
  meta: {
    icon: 'ion:grid-outline',
    title: t('routes.dashboard.dashboard'),
  },
  children: [
    {
      path: 'analysis',
      name: 'Analysis',
      component: () => import('/@/views/dashboard/analysis/index.vue'),
      meta: {
        title: t('routes.dashboard.analysis'),
      }
    },
    {
      path: 'workbench',
      name: 'Workbench',
      component: () => import('/@/views/dashboard/workbench/index.vue'),
      meta: {
        title: t('routes.dashboard.workbench'),
      }
    }
  ]
};

export default dashboard;*/
