<template>
  <span :class="getClass">
    <Icon icon="ion:chevron-forward" :style="$attrs.iconStyle"/>
  </span>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { useDesign } from '/@/hooks/web/useDesign';

  const props = {
    /**
     * 箭头展开状态
     */
    expand: { type: Boolean },
    /**
     * 默认向上箭头
     */
    up: { type: Boolean },
    /**
     * 默认向下箭头
     */
    down: { type: Boolean },
    /**
     * 取消内联的 paddingmargin
     */
    inset: { type: Boolean },
  };

  export default defineComponent({
    name: 'BasicArrow',
    components: { Icon },
    props,
    setup(props) {
      const { prefixCls } = useDesign('basic-arrow');

      // 获取组件类
      const getClass = computed(() => {
        const { expand, up, down, inset } = props;
        return [
          prefixCls,
          {
            [`${prefixCls}--active`]: expand,
            up,
            inset,
            down,
          },
        ];
      });

      return { getClass };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-basic-arrow';

  .@{prefix-cls} {
    display: inline-block;
    cursor: pointer;
    transform: rotate(0deg);
    transition: all 0.3s ease 0.1s;
    transform-origin: center center;

    &--active {
      transform: rotate(90deg);
    }

    &.inset {
      line-height: 0px;
    }

    &.up {
      transform: rotate(-90deg);
    }

    &.down {
      transform: rotate(90deg);
    }

    &.up.@{prefix-cls}--active {
      transform: rotate(90deg);
    }

    &.down.@{prefix-cls}--active {
      transform: rotate(-90deg);
    }
  }
</style>
