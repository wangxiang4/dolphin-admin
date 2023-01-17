/**
 * @program: dolphin-admin
 * @description: 路由配置信息定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */

export {};

declare module 'vue-router' {
  interface RouteMeta extends Record<string | number | symbol, unknown> {
    // 标题
    title: string;
    // 是否忽略权限
    ignoreAuth?: boolean;
    // 是否缓存
    keepAlive?: boolean;
    // 是否固定在选项卡上
    affix?: boolean;
    // 选项卡上的图标
    icon?: string;
    frameSrc?: string;
    // 当前页面转换
    transitionName?: string;
    // 路由是否动态添加
    hideBreadcrumb?: boolean;
    // 隐藏子菜单
    hideChildrenInMenu?: boolean;
    // 承载参数
    carryParam?: boolean;
    // 当前活动菜单
    currentActiveMenu?: string;
    // 从不显示在选项卡中
    hideTab?: boolean;
    // 从不显示在菜单中
    hideMenu?: boolean;
    // 只为构建菜单
    ignoreRoute?: boolean;
    // 为孩子隐藏路径
    hidePathForChildren?: boolean;
  }
}
