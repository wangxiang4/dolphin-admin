<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ t('component.table.settingColumn') }}</span>
    </template>
    <Popover
      placement="bottomLeft"
      trigger="click"
      :overlayClassName="`${prefixCls}__cloumn-list`"
      :getPopupContainer="getPopupContainer"
      @visibleChange="handleVisibleChange"
    >
      <template #title>
        <div :class="`${prefixCls}__popover-title`">
          <Checkbox
            v-model:checked="checkAll"
            :indeterminate="indeterminate"
            @change="onCheckAllChange"
          >
            {{ t('component.table.settingColumnShow') }}
          </Checkbox>

          <Checkbox v-model:checked="checkIndex" @change="handleIndexCheckChange">
            {{ t('component.table.settingIndexColumnShow') }}
          </Checkbox>

          <Checkbox
            v-model:checked="checkSelect"
            :disabled="!defaultRowSelection"
            @change="handleSelectCheckChange"
          >
            {{ t('component.table.settingSelectColumnShow') }}
          </Checkbox>

          <a-button size="small" type="link" @click="reset">
            {{ t('common.resetText') }}
          </a-button>
        </div>
      </template>

      <template #content>
        <ScrollContainer>
          <CheckboxGroup ref="columnListRef" v-model:value="checkedList" @change="onChange">
            <template v-for="item in plainOptions" :key="item.value">
              <div v-if="!('ifShow' in item && !item.ifShow)" :class="`${prefixCls}__check-item`">
                <DragOutlined class="table-coulmn-drag-icon"/>
                <Checkbox :value="item.value">
                  {{ item.label }}
                </Checkbox>

                <Tooltip
                  placement="bottomLeft"
                  :mouseLeaveDelay="0.4"
                  :getPopupContainer="getPopupContainer"
                >
                  <template #title>
                    {{ t('component.table.settingFixedLeft') }}
                  </template>
                  <Icon
                    icon="line-md:arrow-align-left"
                    :class="[
                      `${prefixCls}__fixed-left`,
                      {
                        active: item.fixed === 'left',
                        disabled: !checkedList.includes(item.value),
                      },
                    ]"
                    @click="handleColumnFixed(item, 'left')"
                  />
                </Tooltip>
                <Divider type="vertical"/>
                <Tooltip
                  placement="bottomLeft"
                  :mouseLeaveDelay="0.4"
                  :getPopupContainer="getPopupContainer"
                >
                  <template #title>
                    {{ t('component.table.settingFixedRight') }}
                  </template>
                  <Icon
                    icon="line-md:arrow-align-left"
                    :class="[
                      `${prefixCls}__fixed-right`,
                      {
                        active: item.fixed === 'right',
                        disabled: !checkedList.includes(item.value),
                      },
                    ]"
                    @click="handleColumnFixed(item, 'right')"
                  />
                </Tooltip>
              </div>
            </template>
          </CheckboxGroup>
        </ScrollContainer>
      </template>
      <SettingOutlined/>
    </Popover>
  </Tooltip>
</template>
<script lang="ts">
  import type { BasicColumn, ColumnChangeParam } from '../../types/table';
  import {
    defineComponent,
    ref,
    reactive,
    toRefs,
    watchEffect,
    nextTick,
    unref,
    computed,
  } from 'vue';
  import { Tooltip, Popover, Checkbox, Divider } from 'ant-design-vue';
  import { SettingOutlined, DragOutlined } from '@ant-design/icons-vue';
  import { Icon } from '/@/components/Icon';
  import { ScrollContainer } from '/@/components/Container';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTableContext } from '../../hooks/useTableContext';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useSortable } from '/@/hooks/web/useSortable';
  import { isFunction, isNullAndUnDef } from '/@/utils/is';
  import { getPopupContainer as getParentContainer } from '/@/utils';
  import { omit } from 'lodash-es';

  interface State {
    checkAll: boolean;
    checkedList: string[];
    defaultCheckList: string[];
  }

  interface Options {
    label: string;
    value: string;
    fixed?: boolean | 'left' | 'right';
  }

  export default defineComponent({
    name: 'ColumnSetting',
    components: {
      SettingOutlined,
      Popover,
      Tooltip,
      Checkbox,
      CheckboxGroup: Checkbox.Group,
      DragOutlined,
      ScrollContainer,
      Divider,
      Icon,
    },
    emits: ['columns-change'],

    setup(_, { emit, attrs }) {
      const { t } = useI18n();
      const table = useTableContext();

      const defaultRowSelection = omit(table.getRowSelection(), 'selectedRowKeys');
      let inited = false;

      const cachePlainOptions = ref<Options[]>([]);
      const plainOptions = ref<Options[]>([]);

      const plainSortOptions = ref<Options[]>([]);

      const columnListRef = ref<ComponentRef>(null);

      const state = reactive<State>({
        checkAll: true,
        checkedList: [],
        defaultCheckList: [],
      });

      const checkIndex = ref(false);
      const checkSelect = ref(false);

      const { prefixCls } = useDesign('basic-column-setting');

      const getValues = computed(() => {
        return unref(table?.getBindValues) || {};
      });

      watchEffect(() => {
        const columns = table.getColumns();
        if (columns.length) {
          init();
        }
      });

      watchEffect(() => {
        const values = unref(getValues);
        checkIndex.value = !!values.showIndexColumn;
        checkSelect.value = !!values.rowSelection;
      });

      function getColumns() {
        const ret: Options[] = [];
        table.getColumns({ ignoreIndex: true, ignoreAction: true }).forEach((item) => {
          ret.push({
            label: (item.title as string) || (item.customTitle as string),
            value: (item.dataIndex || item.title) as string,
            ...item,
          });
        });
        return ret;
      }

      function init() {
        const columns = getColumns();

        const checkList = table
          .getColumns({ ignoreAction: true })
          .map((item) => {
            if (item.defaultHidden) {
              return '';
            }
            return item.dataIndex || item.title;
          })
          .filter(Boolean) as string[];

        if (!plainOptions.value.length) {
          plainOptions.value = columns;
          plainSortOptions.value = columns;
          cachePlainOptions.value = columns;
          state.defaultCheckList = checkList;
        } else {
          unref(plainOptions).forEach((item: BasicColumn) => {
            const findItem = columns.find((col: BasicColumn) => col.dataIndex === item.dataIndex);
            if (findItem) {
              item.fixed = findItem.fixed;
            }
          });
        }
        state.checkedList = checkList;
      }

      // checkAll change
      function onCheckAllChange(e: ChangeEvent) {
        const checkList = plainOptions.value.map((item) => item.value);
        if (e.target.checked) {
          state.checkedList = checkList;
          setColumns(checkList);
        } else {
          state.checkedList = [];
          setColumns([]);
        }
      }

      const indeterminate = computed(() => {
        const len = plainOptions.value.length;
        let checkdedLen = state.checkedList.length;
        unref(checkIndex) && checkdedLen--;
        return checkdedLen > 0 && checkdedLen < len;
      });

      // Trigger when check/uncheck a column
      function onChange(checkedList: string[]) {
        const len = plainOptions.value.length;
        state.checkAll = checkedList.length === len;

        const sortList = unref(plainSortOptions).map((item) => item.value);
        checkedList.sort((prev, next) => {
          return sortList.indexOf(prev) - sortList.indexOf(next);
        });
        setColumns(checkedList);
      }

      // reset columns
      function reset() {
        state.checkedList = [...state.defaultCheckList];
        state.checkAll = true;
        plainOptions.value = unref(cachePlainOptions);
        plainSortOptions.value = unref(cachePlainOptions);
        setColumns(table.getCacheColumns());
      }

      // Open the pop-up window for drag and drop initialization
      function handleVisibleChange() {
        if (inited) return;
        nextTick(() => {
          const columnListEl = unref(columnListRef);
          if (!columnListEl) return;
          const el = columnListEl.$el as any;
          if (!el) return;
          // Drag and drop sort
          const { initSortable } = useSortable(el, {
            handle: '.table-coulmn-drag-icon ',
            onEnd: (evt) => {
              const { oldIndex, newIndex } = evt;
              if (isNullAndUnDef(oldIndex) || isNullAndUnDef(newIndex) || oldIndex === newIndex) {
                return;
              }
              // Sort column
              const columns = getColumns();

              if (oldIndex > newIndex) {
                columns.splice(newIndex, 0, columns[oldIndex]);
                columns.splice(oldIndex + 1, 1);
              } else {
                columns.splice(newIndex + 1, 0, columns[oldIndex]);
                columns.splice(oldIndex, 1);
              }

              plainSortOptions.value = columns;
              plainOptions.value = columns;
              setColumns(columns);
            },
          });
          initSortable();
          inited = true;
        });
      }

      // Control whether the serial number column is displayed
      function handleIndexCheckChange(e: ChangeEvent) {
        table.setProps({
          showIndexColumn: e.target.checked,
        });
      }

      // Control whether the checkbox is displayed
      function handleSelectCheckChange(e: ChangeEvent) {
        table.setProps({
          rowSelection: e.target.checked ? defaultRowSelection : undefined,
        });
      }

      function handleColumnFixed(item: BasicColumn, fixed?: 'left' | 'right') {
        if (!state.checkedList.includes(item.dataIndex as string)) return;

        const columns = getColumns() as BasicColumn[];
        const isFixed = item.fixed === fixed ? false : fixed;
        const index = columns.findIndex((col) => col.dataIndex === item.dataIndex);
        if (index !== -1) {
          columns[index].fixed = isFixed;
        }
        item.fixed = isFixed;

        if (isFixed && !item.width) {
          item.width = 100;
        }
        table.setCacheColumnsByField?.(item.dataIndex, { fixed: isFixed });
        setColumns(columns);
      }

      function setColumns(columns: BasicColumn[] | string[]) {
        table.setColumns(columns);
        const data: ColumnChangeParam[] = unref(plainOptions).map((col) => {
          const visible =
            columns.findIndex(
              (c: BasicColumn | string) =>
                c === col.value || (typeof c !== 'string' && c.dataIndex === col.value)
            ) !== -1;
          return { dataIndex: col.value, fixed: col.fixed, visible };
        });

        emit('columns-change', data);
      }

      function getPopupContainer() {
        return isFunction(attrs.getPopupContainer)
          ? attrs.getPopupContainer()
          : getParentContainer();
      }

      return {
        t,
        ...toRefs(state),
        indeterminate,
        onCheckAllChange,
        onChange,
        plainOptions,
        reset,
        prefixCls,
        columnListRef,
        handleVisibleChange,
        checkIndex,
        checkSelect,
        handleIndexCheckChange,
        handleSelectCheckChange,
        defaultRowSelection,
        handleColumnFixed,
        getPopupContainer,
      };
    },
  });
</script>
