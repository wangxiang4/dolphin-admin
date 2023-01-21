/**
 * @program: dolphin-admin
 * @description: 应用配置定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/10
 */

import { MenuTypeEnum, MenuModeEnum, TriggerEnum, MixSidebarTriggerEnum } from '/@/enums/menuEnum';
import {
  ContentEnum,
  ThemeEnum,
  RouterTransitionEnum,
  SettingButtonPositionEnum,
  SessionTimeoutProcessingEnum,
} from '/@/enums/appEnum';

import { CacheTypeEnum } from '/@/enums/cacheEnum';

export type LocaleType = 'zh_CN' | 'en' | 'ru' | 'ja' | 'ko';

export interface MenuSetting {
  bgColor: string;
  fixed: boolean;
  collapsed: boolean;
  canDrag: boolean;
  show: boolean;
  hidden: boolean;
  split: boolean;
  menuWidth: number;
  mode: MenuModeEnum;
  type: MenuTypeEnum;
  theme: ThemeEnum;
  topMenuAlign: 'start' | 'center' | 'end';
  trigger: TriggerEnum;
  accordion: boolean;
  closeMixSidebarOnChange: boolean;
  collapsedShowTitle: boolean;
  mixSideTrigger: MixSidebarTriggerEnum;
  mixSideFixed: boolean;
}

export interface MultiTabsSetting {
  cache: boolean;
  show: boolean;
  showQuick: boolean;
  canDrag: boolean;
  showRedo: boolean;
  showFold: boolean;
}

export interface HeaderSetting {
  bgColor: string;
  fixed: boolean;
  show: boolean;
  theme: ThemeEnum;
  // 开启全屏
  showFullScreen: boolean;
  // 是否显示锁屏
  useLockPage: boolean;
  // 显示消息中心按钮
  showNotice: boolean;
  showSearch: boolean;
}

export interface LocaleSetting {
  showPicker: boolean;
  // 当前语言
  locale: LocaleType;
  // 默认语言
  fallback: LocaleType;
  // 可用的语言环境
  availableLocales: LocaleType[];
}

export interface TransitionSetting {
  //  是否开启页面切换动画
  enable: boolean;
  // 路由基本切换动画
  basicTransition: RouterTransitionEnum;
  // 是否开启页面切换加载
  openPageLoading: boolean;
  // 是否打开顶部进度条
  openNProgress: boolean;
}

export interface ProjectConfig {
  // 权限相关信息的存储位置
  permissionCacheType: CacheTypeEnum;
  // 是否显示配置按钮
  showSettingButton: boolean;
  // 是否显示主题切换按钮
  showDarkModeToggle: boolean;
  // 配置按钮的显示位置
  settingButtonPosition: SettingButtonPositionEnum;
  // 会话超时处理
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum;
  // 网站灰色模式，打开可能的哀悼日期
  grayMode: boolean;
  // 是否开启色弱模式
  colorWeak: boolean;
  // 主题颜色
  themeColor: string;
  // 主界面全屏显示，菜单不显示，顶部
  fullContent: boolean;
  // 内容宽度
  contentMode: ContentEnum;
  // 是否显示标志
  showLogo: boolean;
  // 是否显示全局页脚
  showFooter: boolean;
  // 菜单类型：菜单类型枚举
  headerSetting: HeaderSetting;
  // 菜单设置
  menuSetting: MenuSetting;
  // 多标签设置
  multiTabsSetting: MultiTabsSetting;
  // 动画配置
  transitionSetting: TransitionSetting;
  // pageLayout是否开启keep-alive
  openKeepAlive: boolean;
  // 锁屏时间
  lockTime: number;
  // 显示面包屑
  showBreadCrumb: boolean;
  // 显示面包屑图标
  showBreadCrumbIcon: boolean;
  // 使用错误处理程序插件
  useErrorHandle: boolean;
  // 是否打开回到顶部
  useOpenBackTop: boolean;
  // 是否可以嵌入 iframe 页面
  canEmbedIFramePage: boolean;
  // 切换界面时是否删除未关闭的消息并通知
  closeMessageOnSwitch: boolean;
  // 切换接口时是否取消已经发送但没有响应的http请求
  removeAllHttpPending: boolean;
}

export interface GlobConfig {
  // 网站标题
  title: string;
  // 服务接口地址
  apiUrl: string;
  // 上传网址
  uploadUrl?: string;
  // 服务接口url前缀
  urlPrefix?: string;
  // 项目缩写
  shortName: string;
  // client
  clientId: string;
  // clientSecret
  clientSecret: string;
  // 网关ase密码解密密钥,保持跟后端密钥一致,必须要有否则登录会失败的
  gatewayAseEncodeSecret: string;
}

export interface GlobEnvConfig {
  // 网站标题
  VITE_GLOB_APP_TITLE: string;
  // 服务接口地址
  VITE_GLOB_API_URL: string;
  // 服务接口url前缀
  VITE_GLOB_API_URL_PREFIX?: string;
  // 项目缩写
  VITE_GLOB_APP_SHORT_NAME: string;
  // 上传网址
  VITE_GLOB_UPLOAD_URL?: string;
  // client
  VITE_GLOB_CLIENT_ID: string;
  // clientSecret
  VITE_GLOB_CLIENT_SECRET: string;
  // 网关ase密码解密密钥,保持跟后端密钥一致,必须要有否则登录会失败的
  VITE_GLOB_GATEWAY_ASE_ENCODE_SECRET: string;
  // api转发代理
  VITE_PROXY: string[];
}
