<template>
  <div :class="prefixCls">
    <CollapseHeader v-bind="$props"
                    :prefixCls="prefixCls"
                    :show="show"
                    @expand="handleExpand"
    >
      <template #title>
        <slot name="title"/>
      </template>
      <template #action>
        <slot name="action"/>
      </template>
    </CollapseHeader>

    <div class="p-2">
      <CollapseTransition :enable="canExpan">
        <Skeleton v-if="loading" :active="loading"/>
        <div v-else v-show="show" :class="`${prefixCls}__body`">
          <slot/>
        </div>
      </CollapseTransition>
    </div>
    <div v-if="$slots.footer" :class="`${prefixCls}__footer`">
      <slot name="footer"/>
    </div>
  </div>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent, ref } from 'vue';
  // component
  import { Skeleton } from 'ant-design-vue';
  import { CollapseTransition } from '/@/components/Transition';
  import CollapseHeader from './CollapseHeader.vue';
  import { triggerWindowResize } from '/@/utils/event';
  // hook
  import { useTimeoutFn } from '/@/hooks/core/useTimeout';
  import { useDesign } from '/@/hooks/web/useDesign';

  const props = {
    title: { type: String, default: '' },
    loading: { type: Boolean },
    /**
     * 可以扩展吗
     */
    canExpan: { type: Boolean, default: true },
    /**
     * 标题右侧温馨提示
     */
    helpMessage: {
      type: [Array, String] as PropType<string[] | string>,
      default: '',
    },
    /**
     * 伸缩时是否触发window.resize，
     * 可以适应表格和表格，当表格缩小时，表格触发resize以适应高度
     */
    triggerWindowResize: { type: Boolean },
    /**
     * 延迟加载时间
     */
    lazyTime: { type: Number, default: 0 },
  };

  export default defineComponent({
    name: 'CollapseContainer',
    components: {
      Skeleton,
      CollapseHeader,
      CollapseTransition,
    },
    props,
    setup(props) {
      const show = ref(true);

      const { prefixCls } = useDesign('collapse-container');

      /**
       * 处理开发事件
       */
      function handleExpand() {
        show.value = !show.value;
        if (props.triggerWindowResize) {
          // 这里的200毫秒是因为扩展有动画
          useTimeoutFn(triggerWindowResize, 200);
        }
      }

      return {
        show,
        handleExpand,
        prefixCls,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-collapse-container';

  .@{prefix-cls} {
    background-color: @component-background;
    border-radius: 2px;
    transition: all 0.3s ease-in-out;

    &__header {
      display: flex;
      height: 32px;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid @border-color-light;
    }

    &__footer {
      border-top: 1px solid @border-color-light;
    }

    &__action {
      display: flex;
      text-align: right;
      flex: 1;
      align-items: center;
      justify-content: flex-end;
    }
  }
</style>
