<template>
  <Dropdown :class="[prefixCls]" :trigger="trigger" v-bind="$attrs">
    <span>
      <slot/>
    </span>
    <template #overlay>
      <Menu :class="`${prefixCls}--menu`" :selectedKeys="selectedKeys">
        <template v-for="item in dropMenuList" :key="`${item.event}`">
          <MenuItem
            v-bind="getAttr(item.event)"
            :disabled="item.disabled"
            @click="handleClickMenu(item)"
          >
            <Popconfirm
              v-if="popconfirm && item.popConfirm"
              v-bind="getPopConfirmAttrs(item.popConfirm)"
            >
              <template v-if="item.popConfirm.icon" #icon>
                <Icon :icon="item.popConfirm.icon"/>
              </template>
              <div>
                <Icon v-if="item.icon" :icon="item.icon"/>
                <span class="ml-1">{{ item.text }}</span>
              </div>
            </Popconfirm>
            <template v-else>
              <Icon v-if="item.icon" :icon="item.icon"/>
              <span class="ml-1">{{ item.text }}</span>
            </template>
          </MenuItem>
          <MenuDivider v-if="item.divider" :key="`d-${item.event}`"/>
        </template>
      </Menu>
    </template>
  </Dropdown>
</template>

<script lang="ts">
  import { computed, PropType } from 'vue';
  import type { DropMenu } from './typing';
  import { defineComponent } from 'vue';
  import { Dropdown, Menu, Popconfirm } from 'ant-design-vue';
  import { omit } from 'lodash-es';
  import { isFunction } from '/@/utils/is';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'BasicDropdown',
    components: {
      Dropdown,
      Menu,
      MenuItem: Menu.Item,
      MenuDivider: Menu.Divider,
      Icon: createAsyncComponent(() => import('/@/components/Icon')),
      Popconfirm,
    },
    props: {
      popconfirm: Boolean,
      /**
       * the trigger mode which executes the drop-down action
       * @default ['hover']
       * @type string[]
       */
      trigger: {
        type: [Array] as PropType<('contextmenu' | 'click' | 'hover')[]>,
        default: () => {
          return ['contextmenu'];
        },
      },
      dropMenuList: {
        type: Array as PropType<(DropMenu & Recordable)[]>,
        default: () => [],
      },
      selectedKeys: {
        type: Array as PropType<string[]>,
        default: () => [],
      },
    },
    emits: ['menuEvent'],
    setup(props, { emit }) {
      const { prefixCls } = useDesign('basic-dropdown');
      function handleClickMenu(item: DropMenu) {
        const { event } = item;
        const menu = props.dropMenuList.find((item) => `${item.event}` === `${event}`);
        emit('menuEvent', menu);
        item.onClick?.();
      }

      const getPopConfirmAttrs = computed(() => {
        return (attrs) => {
          const originAttrs = omit(attrs, ['confirm', 'cancel', 'icon']);
          if (!attrs.onConfirm && attrs.confirm && isFunction(attrs.confirm))
            originAttrs['onConfirm'] = attrs.confirm;
          if (!attrs.onCancel && attrs.cancel && isFunction(attrs.cancel))
            originAttrs['onCancel'] = attrs.cancel;
          return originAttrs;
        };
      });

      return {
        prefixCls,
        handleClickMenu,
        getPopConfirmAttrs,
        getAttr: (key: string | number) => ({ key }),
      };
    },
  });
</script>

<style lang="less">
@prefix-cls: ~'@{namespace}-basic-dropdown';
.@{prefix-cls} {
  &--menu{
    .ant-dropdown-menu-item {
      color: @primary-color;
    }
  }
}
</style>
