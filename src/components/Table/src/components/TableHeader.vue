<template>
  <div style="width: 100%">
    <div v-if="$slots.headerTop" style="margin: 5px">
      <slot name="headerTop"/>
    </div>
    <div class="flex items-center">
      <slot v-if="$slots.tableTitle" name="tableTitle"/>
      <TableTitle
        v-if="!$slots.tableTitle && title"
        :helpMessage="titleHelpMessage"
        :title="title"
      />
      <div :class="`${prefixCls}__toolbar`">
        <slot name="toolbar"/>
        <Divider v-if="$slots.toolbar && showTableSetting" type="vertical"/>
        <TableSetting
          v-if="showTableSetting"
          :setting="tableSetting"
          @columns-change="handleColumnChange"
        />
      </div>
    </div>

    <!------------------------------------二次封装扩展------------------------------------->
    <!--扩展table顶部插槽-->
    <div style="margin:-2px 0 -2px;padding-top: 5px;">
      <slot name="tableTop">
        <Alert v-if="openRowSelection!=null"
               type="info"
               show-icon
               class="alert"
        >
          <template #message>
            <template v-if="selectRowKeys.length > 0">
              <span>已选中 {{ selectRowKeys.length }} 条记录(可跨页)</span>
              <Divider type="vertical"/>
              <a @click="setSelectedRowKeys([])">清空</a>
              <slot name="alertAfter"/>
            </template>
            <template v-else>
              <span>未选中任何数据</span>
            </template>
          </template>
        </Alert>
      </slot>
    </div>
    <!--扩展table顶部插槽-->

  </div>
</template>
<script lang="ts">
  import type { TableSetting, ColumnChangeParam } from '../types/table';
  import type { PropType } from 'vue';
  import { defineComponent, computed } from 'vue';
  import { Divider, Alert } from 'ant-design-vue';
  import TableSettingComponent from './settings/index.vue';
  import TableTitle from './TableTitle.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useTableContext } from '../hooks/useTableContext';

  export default defineComponent({
    name: 'BasicTableHeader',
    components: {
      Alert,
      Divider,
      TableTitle,
      TableSetting: TableSettingComponent,
    },
    props: {
      title: {
        type: [Function, String] as PropType<string | ((data: Recordable) => string)>,
      },
      tableSetting: {
        type: Object as PropType<TableSetting>,
      },
      showTableSetting: {
        type: Boolean,
      },
      titleHelpMessage: {
        type: [String, Array] as PropType<string | string[]>,
        default: '',
      },
    },
    emits: ['columns-change'],
    setup(_, { emit }) {
      const { prefixCls } = useDesign('basic-table-header');
      function handleColumnChange(data: ColumnChangeParam[]) {
        emit('columns-change', data);
      }

      const { getSelectRowKeys, setSelectedRowKeys, getRowSelection } = useTableContext();
      const selectRowKeys = computed(() => getSelectRowKeys());
      const openRowSelection = computed(() => getRowSelection());

      return {
        prefixCls,
        handleColumnChange,
        selectRowKeys,
        setSelectedRowKeys,
        openRowSelection
      };
    },
  });
</script>
