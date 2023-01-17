/**
 * @program: dolphin-admin
 * @description: 路由常量
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

export const REDIRECT_NAME = 'Redirect';

export const PARENT_LAYOUT_NAME = 'ParentLayout';

export const PAGE_NOT_FOUND_NAME = 'PageNotFound';

export const EXCEPTION_COMPONENT = () => import('../views/core/exception/Exception.vue');

/** 默认布局 */
export const LAYOUT = () => import('/@/layouts/default/index.vue');

/** 多级菜单父布局定义,定义一个空组件什么都没有只有一个组件名称充当父布局,不让没有组件的时候报找不到组件的错误 */
export const getParentLayout = (_name?: string) => () => new Promise((resolve) => resolve({ name: PARENT_LAYOUT_NAME }));
