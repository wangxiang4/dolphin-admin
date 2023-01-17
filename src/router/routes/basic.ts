/**
 * @program: dolphin-admin
 * @description: 基础路由配置
 * 系统中必不可少的配置
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

import type { AppRouteRecordRaw } from '/@/router/types';
import { REDIRECT_NAME, LAYOUT, EXCEPTION_COMPONENT, PAGE_NOT_FOUND_NAME } from '/@/router/constant';
import { PageEnum } from '/@/enums/pageEnum';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

/** 基础路由配置 */
export const basicRoute: AppRouteRecordRaw[] = [
  {
    path: PageEnum.ROOT_HOME,
    name: 'Root',
    redirect: PageEnum.BASE_HOME,
    meta: {
      title: 'Root',
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('/@/views/core/login/Login.vue'),
    meta: {
      title: t('routes.basic.login'),
    }
  },
  {
    path: '/:path(.*)*',
    name: PAGE_NOT_FOUND_NAME,
    component: LAYOUT,
    meta: {
      title: 'ErrorPage',
      hideBreadcrumb: true,
      hideMenu: true,
    },
    children: [
      {
        path: '/:path(.*)*',
        name: PAGE_NOT_FOUND_NAME,
        component: EXCEPTION_COMPONENT,
        meta: {
          title: 'ErrorPage',
          hideBreadcrumb: true,
          hideMenu: true,
        }
      }
    ]
  },
  {
    path: '/redirect',
    name: REDIRECT_NAME,
    component: LAYOUT,
    meta: {
      title: REDIRECT_NAME,
      hideBreadcrumb: true,
      hideMenu: true,
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        name: REDIRECT_NAME,
        component: () => import('/@/views/core/redirect/index.vue'),
        meta: {
          title: REDIRECT_NAME,
          hideBreadcrumb: true,
        }
      }
    ]
  }
];
