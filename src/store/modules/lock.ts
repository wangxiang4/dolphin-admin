/**
 * @program: dolphin-admin
 * @description: 锁屏信息存储中心
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

import type { LockInfo } from '/#/store';
import { defineStore } from 'pinia';
import { LOCK_INFO_KEY } from '/@/enums/cacheEnum';
import { Persistent } from '/@/utils/cache/persistent';
import { useUserStore } from './user';

interface LockState {
  lockInfo: Nullable<LockInfo>;
}

export const useLockStore = defineStore({
  id: 'app-lock',
  state: (): LockState => ({
    lockInfo: Persistent.getLocal(LOCK_INFO_KEY),
  }),
  getters: {
    getLockInfo(): Nullable<LockInfo> {
      return this.lockInfo;
    },
  },
  actions: {
    /** 设置锁屏 */
    setLockInfo(info: LockInfo) {
      this.lockInfo = Object.assign({}, this.lockInfo, info);
      Persistent.setLocal(LOCK_INFO_KEY, this.lockInfo, true);
    },
    /** 还原锁屏数据 */
    resetLockInfo() {
      Persistent.removeLocal(LOCK_INFO_KEY, true);
      this.lockInfo = null;
    },
    /** 解锁锁屏 */
    async unLock(password?: string) {
      const userStore = useUserStore();
      // 浏览器存在当前锁屏信息缓存,直接比对当前用户密码
      if (this.lockInfo?.pwd === password) {
        this.resetLockInfo();
        return true;
      }
      // 浏览器缓存已经清空,需要重新登录验证当前用户密码
      const tryLogin = async () => {
        try {
          const username = userStore.getUserInfo.userName;
          userStore.setAccessToken('');
          userStore.setRefreshToken('');
          const res = await userStore.login({
            username,
            password: password!,
            goHome: false,
            unLock: true
          });
          if (res) this.resetLockInfo();
          return res;
        } catch (error) {
          return false;
        }
      };
      return await tryLogin();
    }
  }
});
