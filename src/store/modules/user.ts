/**
 * @program: dolphin-admin
 * @description: 当前用户信息存储中心
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

import { defineStore } from 'pinia';
import { store } from '/@/store';
import { PageEnum } from '/@/enums/pageEnum';
import { ACCESS_TOKEN_KEY, PERMISSIONS_KEY, REFRESH_TOKEN_KEY, ROLE_IDS_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { User, LoginParams } from '/@/api/platform/core/entity/user';
import { logout, getUserInfo, login } from '/@/api/platform/core/controller/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import defaultAvatar from '/@/assets/images/defaultAvatar.svg';

interface UserState {
  userInfo: Nullable<User>;
  sessionTimeout: boolean;
  roleIds: string[];
  permissions: string[];
  access_token?: string;
  refresh_token?: string;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // 用户信息
    userInfo: getAuthCache<User>(USER_INFO_KEY),
    // 登录是否过期
    sessionTimeout: false,
    // 角色ID用于权限校验
    roleIds: getAuthCache<string[]>(ROLE_IDS_KEY),
    // 按钮权限标识用于权限校验
    permissions: getAuthCache<string[]>(PERMISSIONS_KEY),
    // 访问令牌
    access_token: getAuthCache<string>(ACCESS_TOKEN_KEY),
    // 刷新令牌
    refresh_token: getAuthCache<string>(REFRESH_TOKEN_KEY),
  }),
  getters: {
    getUserInfo(): User {
      return this.userInfo! || {};
    },
    getAccessToken(): string {
      return this.access_token!;
    },
    getRefreshToken(): string {
      return this.refresh_token!;
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getRoleIds(): string[] {
      return this.roleIds;
    },
    getPermissions(): string[] {
      return this.permissions;
    },
  },
  actions: {
    setRoleIds(roleIds: string[]) {
      this.roleIds = roleIds;
      setAuthCache(ROLE_IDS_KEY, roleIds);
    },
    setPermissions(permissions: string[]) {
      this.permissions = permissions;
      setAuthCache(PERMISSIONS_KEY, permissions);
    },
    setAccessToken(accessToken: string) {
      this.access_token = accessToken;
      setAuthCache(ACCESS_TOKEN_KEY, accessToken);
    },
    setRefreshToken(refreshToken: string) {
      this.refresh_token = refreshToken;
      setAuthCache(REFRESH_TOKEN_KEY, refreshToken);
    },
    setUserInfo(userInfo: Nullable<User>) {
      this.userInfo = userInfo;
      setAuthCache(USER_INFO_KEY, userInfo);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState(): void {
      this.setUserInfo(null);
      this.setSessionTimeout(false);
      this.setAccessToken('');
      this.setRefreshToken('');
      this.setRoleIds([]);
      this.setPermissions([]);
    },
    /** 登录 */
    async login(params: LoginParams): Promise<User | null> {
      try {
        const { goHome = true, unLock = false, ...loginParams } = params;
        const data = await login(loginParams, unLock && {
          // 使用微服务提供的锁屏专属客户端不需要写验证码进行登录
          clientId: 'dolphin_lock',
          clientSecret: 'dolphin_lock'
        });
        const { access_token, refresh_token } = data;
        this.setAccessToken(access_token);
        this.setRefreshToken(refresh_token);
        // 获取用户信息
        const userInfo = await this.getUserInfoAction();
        const sessionTimeout = this.sessionTimeout;
        if (sessionTimeout) {
          this.setSessionTimeout(false);
        } else if (goHome) {
          // 处理路由与菜单的构建,并且进行缓存
          const permissionStore = usePermissionStore();
          // 使用isDynamicAddedRoute字段做菜单路由缓存功能
          if (!permissionStore.isDynamicAddedRoute) {
            const routes = await permissionStore.buildRoutesAction();
            routes.forEach((route) => {
              router.addRoute(route as unknown as RouteRecordRaw);
            });
            permissionStore.setDynamicAddedRoute(true);
          }
          await router.replace(userInfo.homePath || PageEnum.BASE_HOME);
        }
        return userInfo;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /** 获取用户信息 */
    async getUserInfoAction(): Promise<User> {
      const userInfo = await getUserInfo().catch(()=> this.resetState());
      userInfo.avatar || (userInfo.avatar = defaultAvatar);
      userInfo.tenantIds = String(userInfo.tenantId).split(',');
      // 存储用户扩展信息,便于鉴权
      this.setUserInfo(userInfo);
      this.setRoleIds(userInfo.roleIds);
      this.setPermissions(userInfo.permissions);
      return userInfo;
    },
    /** 登出 */
    async logout(goLogin = false) {
      try {
        await logout();
      } catch {
        console.log('注销Token失败');
      }
      this.resetState();
      goLogin && await router.push(PageEnum.BASE_LOGIN);
    },
    /** 退出前确认 */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: t('sys.app.logoutTip'),
        content: t('sys.app.logoutMessage'),
        onOk: async () => {
          await this.logout(true);
        }
      });
    }
  }
});

// 需要在设置之外使用
export function useUserStoreWithOut() {
  return useUserStore(store);
}
