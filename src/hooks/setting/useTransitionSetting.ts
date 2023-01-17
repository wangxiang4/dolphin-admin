/**
 * @program: dolphin-admin
 * @description: 动画设置工具
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/10
 */

import type { TransitionSetting } from '/#/config';
import { computed } from 'vue';
import { useAppStore } from '/@/store/modules/app';

export function useTransitionSetting() {
  const appStore = useAppStore();

  const getEnableTransition = computed(() => appStore.getTransitionSetting?.enable);

  const getOpenNProgress = computed(() => appStore.getTransitionSetting?.openNProgress);

  const getOpenPageLoading = computed((): boolean => {
    return !!appStore.getTransitionSetting?.openPageLoading;
  });

  const getBasicTransition = computed(() => appStore.getTransitionSetting?.basicTransition);

  function setTransitionSetting(transitionSetting: Partial<TransitionSetting>) {
    appStore.setProjectConfig({ transitionSetting });
  }
  return {
    setTransitionSetting,
    getEnableTransition,
    getOpenNProgress,
    getOpenPageLoading,
    getBasicTransition,
  };
}
