<template>
  <span :class="getClass">
    <slot/>
    <BasicHelp v-if="helpMessage" :class="`${prefixCls}-help`" :text="helpMessage"/>
  </span>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent, computed } from 'vue';
  import BasicHelp from './BasicHelp.vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  const props = {
    /**
     * 帮助文本列表或字符串
     */
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
      default: '',
    },
    /**
     * 标题左侧是否有色块
     * @default: false
     */
    span: { type: Boolean },
    /**
     * 是否默认文字，即不加粗
     * @default: false
     */
    normal: { type: Boolean },
  };

  export default defineComponent({
    name: 'BasicTitle',
    components: { BasicHelp },
    props,
    setup(props, { slots }) {
      const { prefixCls } = useDesign('basic-title');

      const getClass = computed(() => [
        prefixCls,
        { [`${prefixCls}-show-span`]: props.span && slots.default },
        { [`${prefixCls}-normal`]: props.normal },
      ]);

      return { prefixCls, getClass };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-basic-title';

  .@{prefix-cls} {
    position: relative;
    display: flex;
    padding-left: 7px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: @text-color-base;
    cursor: pointer;
    user-select: none;

    &-normal {
      font-size: 14px;
      font-weight: 500;
    }

    &-show-span::before {
      position: absolute;
      top: 4px;
      left: 0;
      width: 3px;
      height: 16px;
      margin-right: 4px;
      background-color: @primary-color;
      content: '';
    }

    &-help {
      margin-left: 10px;
    }
  }
</style>
