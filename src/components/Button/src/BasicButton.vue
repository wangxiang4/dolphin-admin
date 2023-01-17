<template>
  <Button v-bind="getBindValue" :class="getButtonClass" @click="onClick">
    <template #default>
      <Icon v-if="preIcon" :icon="preIcon" :size="iconSize"/>
      <slot/>
      <Icon v-if="postIcon" :icon="postIcon" :size="iconSize"/>
    </template>
  </Button>
</template>
<script lang="ts">
  import { defineComponent, computed, unref } from 'vue';
  import { Button } from 'ant-design-vue';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { buttonProps } from './props';
  import { useAttrs } from '/@/hooks/core/useAttrs';

  export default defineComponent({
    name: 'AButton',
    components: { Button, Icon },
    inheritAttrs: false,
    props: buttonProps,
    setup(props) {
      // 获取组件类
      const attrs = useAttrs({ excludeDefaultKeys: false });
      const getButtonClass = computed(() => {
        const { color, disabled } = props;
        return [
          {
            [`ant-btn-${color}`]: !!color,
            ['is-disabled']: disabled,
          },
        ];
      });

      // 获取继承绑定值
      const getBindValue = computed(() => ({ ...unref(attrs), ...props }));

      return { getBindValue, getButtonClass };
    },
  });
</script>
