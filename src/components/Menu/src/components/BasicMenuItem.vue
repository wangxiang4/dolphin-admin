<template>
  <MenuItem :key="item.path">
    <MenuItemContent v-bind="$props" :item="item"/>
  </MenuItem>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Menu } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { itemProps } from '../props';
  import MenuItemContent from './MenuItemContent.vue';

  export default defineComponent({
    name: 'BasicMenuItem',
    components: { MenuItem: Menu.Item, MenuItemContent },
    props: itemProps,
    setup() // props
    {
      const { prefixCls } = useDesign('basic-menu-item');
      return {
        prefixCls,
      };
    },
  });
</script>
