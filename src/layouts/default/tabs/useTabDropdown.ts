import type { TabContentProps } from './types';
import type { DropMenu } from '/@/components/Dropdown';
import type { ComputedRef } from 'vue';

import { computed, unref, reactive } from 'vue';
import { MenuEventEnum } from './types';
import { useMultipleTabStore } from '/@/store/modules/multipleTab';
import { RouteLocationNormalized, useRouter } from 'vue-router';
import { useTabs } from '/@/hooks/web/useTabs';
import { useI18n } from '/@/hooks/web/useI18n';

export function useTabDropdown(tabContentProps: TabContentProps, getIsTabs: ComputedRef<boolean>) {
  const state = reactive({
    current: null as Nullable<RouteLocationNormalized>,
    currentIndex: 0,
  });
  const { t } = useI18n();
  const tabStore = useMultipleTabStore();
  const { currentRoute } = useRouter();
  const { refreshPage, closeAll, close, closeLeft, closeOther, closeRight } = useTabs();
  const getTargetTab = computed((): RouteLocationNormalized => {
    return unref(getIsTabs) ? tabContentProps.tabItem : unref(currentRoute);
  });

  /**
   * 下拉列表
   */
  const getDropMenuList = computed(() => {
    if (!unref(getTargetTab)) {
      return;
    }
    const { meta } = unref(getTargetTab);
    const { path } = unref(currentRoute);

    // 刷新按钮
    const curItem = state.current;
    const index = state.currentIndex;
    const refreshDisabled = curItem ? curItem.path !== path : true;

    // 关闭左边
    const closeLeftDisabled = index === 0;
    const disabled = tabStore.getTabList.length === 1;

    // 关闭右边
    const closeRightDisabled =
      index === tabStore.getTabList.length - 1 && tabStore.getLastDragEndIndex >= 0;
    const dropMenuList: DropMenu[] = [
      {
        icon: 'ion:reload-sharp',
        event: MenuEventEnum.REFRESH_PAGE,
        text: t('layout.multipleTab.reload'),
        disabled: refreshDisabled,
      },
      {
        icon: 'clarity:close-line',
        event: MenuEventEnum.CLOSE_CURRENT,
        text: t('layout.multipleTab.close'),
        disabled: !!meta?.affix || disabled,
        divider: true,
      },
      {
        icon: 'line-md:arrow-close-left',
        event: MenuEventEnum.CLOSE_LEFT,
        text: t('layout.multipleTab.closeLeft'),
        disabled: closeLeftDisabled,
        divider: false,
      },
      {
        icon: 'line-md:arrow-close-right',
        event: MenuEventEnum.CLOSE_RIGHT,
        text: t('layout.multipleTab.closeRight'),
        disabled: closeRightDisabled,
        divider: true,
      },
      {
        icon: 'dashicons:align-center',
        event: MenuEventEnum.CLOSE_OTHER,
        text: t('layout.multipleTab.closeOther'),
        disabled: disabled,
      },
      {
        icon: 'clarity:minus-line',
        event: MenuEventEnum.CLOSE_ALL,
        text: t('layout.multipleTab.closeAll'),
        disabled: disabled,
      },
    ];

    return dropMenuList;
  });

  function handleContextMenu(tabItem: RouteLocationNormalized) {
    return (e: Event) => {
      if (!tabItem) {
        return;
      }
      e?.preventDefault();
      const index = tabStore.getTabList.findIndex((tab) => tab.path === tabItem.path);
      state.current = tabItem;
      state.currentIndex = index;
    };
  }

  // 处理右键事件
  function handleMenuEvent(menu: DropMenu): void {
    const { event } = menu;
    switch (event) {
      case MenuEventEnum.REFRESH_PAGE:
        // 刷新页面
        refreshPage();
        break;
      // 关闭当前
      case MenuEventEnum.CLOSE_CURRENT:
        close(tabContentProps.tabItem);
        break;
      // 左关闭
      case MenuEventEnum.CLOSE_LEFT:
        closeLeft();
        break;
      // 右关闭
      case MenuEventEnum.CLOSE_RIGHT:
        closeRight();
        break;
      // 关闭其他
      case MenuEventEnum.CLOSE_OTHER:
        closeOther();
        break;
      // 关闭所有
      case MenuEventEnum.CLOSE_ALL:
        closeAll();
        break;
    }
  }
  return { getDropMenuList, handleMenuEvent, handleContextMenu };
}
