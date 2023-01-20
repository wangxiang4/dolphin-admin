<template>
  <div class="headToolbar">
    <ATooltip v-if="toolbar.includes('save')"
              title="保存并发布"
              placement="bottom"
              :arrowPointAtCenter="true"
    >
      <a-button type="primary" @click="emit('save')">
        <Icon icon="fa6-regular:floppy-disk" size="13"/>保存
      </a-button>
    </ATooltip>
    <ATooltip v-if="toolbar.includes('zoomIn')"
              title="放大"
              placement="bottom"
              :arrowPointAtCenter="true"
    >
      <a-button :disabled="defaultZoom >= 9" @click="emit('zoomIn')">
        <Icon icon="fa6-solid:magnifying-glass-plus" size="13"/>
      </a-button>
    </ATooltip>
    <a-button>
      {{ Math.ceil(defaultZoom * 10 * 1.1) + "%" }}
    </a-button>
    <ATooltip v-if="toolbar.includes('zoomOut')"
              title="缩小"
              placement="bottom"
              :arrowPointAtCenter="true"
    >
      <a-button :disabled="defaultZoom <= 0" @click="emit('zoomOut')">
        <Icon icon="fa6-solid:magnifying-glass-minus" size="13"/>
      </a-button>
    </ATooltip>
    <ATooltip v-if="toolbar.includes('reset')"
              title="重置"
              placement="bottom"
              :arrowPointAtCenter="true"
    >
      <a-button @click="emit('reset')">
        <Icon icon="fa-solid:broom" size="13"/>
      </a-button>
    </ATooltip>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { propTypes } from '/@/utils/propTypes';
  import { Tooltip } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';

  /** 通用变量统一声明区域 */
  const toolbarProps = defineProps({
    defaultZoom: propTypes.number.def(1),
    toolbar: {
      type: Array as PropType<string[]>,
      default: () => ['save', 'zoomIn', 'zoomOut', 'reset']
    },
  });
  const emit = defineEmits(['save', 'zoomIn', 'zoomOut', 'reset']);
  const ATooltip = Tooltip;

</script>

<style lang="less" scoped>

  .headToolbar {
    padding: 0 20px;
    background-color: white;
    border: 1px solid #e0e0e0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: left;
    line-height: 50px!important;
    height: 50px !important;

    .ant-btn  {
      font-size: 13px;
      margin-right: 1px;
    }
  }

</style>
