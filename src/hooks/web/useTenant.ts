/**
 * @program: dolphin-admin
 * @description: 多租户相关操作
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */
import { useUserStore } from '/@/store/modules/user';
import { changeTenant, resetTenant } from '/@/api/platform/system/controller/user';

export function useTenant() {
  const userStore = useUserStore();

  // 切换多租户会改变当前系统中的数据环境
  async function changeTenantEnv(tenantIds: string[], reload = true) {
    // 更改当前后端系统中的全局多租户数据
    await changeTenant(tenantIds);
    // 更改当前前端系统中的全局多租户数据
    const userInfo = userStore.getUserInfo;
    userInfo.tenantIds = tenantIds;
    userInfo.tenantId = tenantIds.join(',');
    userStore.setUserInfo(userInfo);
    reload && location.reload();
    return tenantIds;
  }

  // 重置多租户信息
  async function resetTenantEnv(reload = true) {
    // 更改当前后端系统中的全局多租户数据
    await resetTenant();
    // 更改当前前端系统中的全局多租户数据
    await userStore.getUserInfoAction();
    reload && location.reload();
  }

  return {
    userStore,
    changeTenantEnv,
    resetTenantEnv
  };
}
