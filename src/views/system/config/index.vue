<template>
  <div ref="wrapRef" :class="[prefixCls, [`${prefixCls}-form-container`]]">
    <AForm ref="queryFormElRef"
           :model="state.queryParams"
           layout="inline"
           :colon="false"
           :labelCol="{ span: 6 }"
           :wrapperCol="{ style: { width: '260px', 'margin-bottom': '5px' } }"
    >
      <AFormItem label="参数名称" name="name">
        <a-input v-model:value="state.queryParams.name"
                 placeholder="请输入参数名称"
                 allowClear
        />
      </AFormItem>
      <AFormItem label="参数键" name="key">
        <a-input v-model:value="state.queryParams.key"
                 placeholder="请输入参数键"
                 allowClear
        />
      </AFormItem>
      <AFormItem label="系统内置" name="isSys">
        <ASelect v-model:value="state.queryParams.isSys"
                 placeholder="请选择"
                 allowClear
        >
          <ASelectOption key="0">是</ASelectOption>
          <ASelectOption key="1">否</ASelectOption>
        </ASelect>
      </AFormItem>
      <AFormItem label="创建时间">
        <ARangePicker v-model:value="state.dateRange"
                      style="width: 100%"
                      valueFormat="YYYY-MM-DD"
                      :placeholder="['开始日期', '结束日期']"
        />
      </AFormItem>
      <AFormItem>
        <a-button type="primary"
                  class="mr-2"
                  @click="handleQuery"
        >搜索</a-button>
        <a-button type="default"
                  class="mr-2"
                  @click="resetQuery"
        >重置</a-button>
      </AFormItem>
    </AForm>
    <ATable ref="tableElRef"
            v-bind="getBindValues"
            @change="handleTablePaginationChange"
    >
      <template #title>
        <div style="width: 100%">
          <div class="flex items-center">
            <BasicTitle>{{ '参数配置列表' }}</BasicTitle>
            <div :class="`${headerPrefixCls}__toolbar`">
              <a-button v-auth="['config_add']"
                        type="primary"
                        @click="handleAdd()"
              >新增参数</a-button>
              <a-button v-auth="['config_edit']"
                        type="primary"
                        :disabled="state.single"
                        @click="handleEdit()"
              >修改参数</a-button>
              <a-button v-auth="['config_del']"
                        type="primary"
                        :disabled="state.multiple"
                        @click="handleDel()"
              >删除参数</a-button>
              <ADivider type="vertical"/>
              <div class="table-settings">
                <!--重做-->
                <ATooltip placement="top">
                  <template #title>
                    <span>{{ t('common.redo') }}</span>
                  </template>
                  <RedoOutlined @click="handleQuery"/>
                </ATooltip>
                <!--尺寸-->
                <ATooltip placement="top">
                  <template #title>
                    <span>{{ t('component.table.settingDens') }}</span>
                  </template>
                  <ADropdown :trigger="['click']"
                             :getPopupContainer="getPopupContainer"
                             placement="bottomCenter"
                  >
                    <ColumnHeightOutlined/>
                    <template #overlay>
                      <AMenu v-model:selectedKeys="state.selectedKeys" selectable>
                        <AMenuItem key="default">
                          <span>{{ t('component.table.settingDensDefault') }}</span>
                        </AMenuItem>
                        <AMenuItem key="middle">
                          <span>{{ t('component.table.settingDensMiddle') }}</span>
                        </AMenuItem>
                        <AMenuItem key="small">
                          <span>{{ t('component.table.settingDensSmall') }}</span>
                        </AMenuItem>
                      </AMenu>
                    </template>
                  </ADropdown>
                </ATooltip>
                <!--全屏-->
                <ATooltip placement="top">
                  <template #title>
                    <span>{{ t('component.table.settingFullScreen') }}</span>
                  </template>
                  <FullscreenOutlined v-if="!isFullscreen" @click="toggle"/>
                  <FullscreenExitOutlined v-else @click="toggle"/>
                </ATooltip>
              </div>
            </div>
          </div>
          <div style="margin:-2px 0 -2px;padding-top: 5px;">
            <slot name="tableTop">
              <AAlert type="info" show-icon class="alert">
                <template #message>
                  <template v-if="getSelectRowKeys().length > 0">
                    <span>已选中 {{ getSelectRowKeys().length }} 条记录(可跨页)</span>
                    <ADivider type="vertical"/>
                    <a @click="setSelectedRowKeys([])">清空</a>
                  </template>
                  <template v-else>
                    <span>未选中任何数据</span>
                  </template>
                </template>
              </AAlert>
            </slot>
          </div>
        </div>
      </template>
      <template #action="{ record }">
        <div :class="[actionPrefixCls, 'center']">
          <a-button v-auth="['config_edit']"
                    type="link"
                    size="small"
                    @click="handleEdit(record)"
          ><Icon icon="fa6-regular:pen-to-square" :size="14"/>修改
          </a-button>
          <ADivider type="vertical" class="action-divider"/>
          <a-button v-auth="['config_del']"
                    type="link"
                    size="small"
                    color="error"
                    @click="handleDel(record)"
          ><Icon icon="ant-design:delete-outlined" :size="15"/>删除
          </a-button>
        </div>
      </template>
    </ATable>
    <!--弹出窗体区域-->
    <ConfigModal @register="registerModal" @success="handleRefreshTable"/>
  </div>
</template>
<script lang="ts" setup>
  /**
   * 提供模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
   * 采用ant-design-vue表格表单组件编写,采用 setup 写法
   * 当vben的BasicTable跟BasicForm组件不能满足一些特殊需求时,需要写原生ant-design-vue组件时,请严格参考此处代码
   * 当前原生ant-design-vue表格表单组件模板,目前已经与系统项目配置高度集成,系统配置发生修改时组件也会产生对应的变化
   * 目前是基于vben的BasicTable跟BasicForm组件重写出一套ant-design-vue原生表格表单组件模板
   * 注意:不会强依赖vben的BasicTable跟BasicForm组件,只会依赖一些简单容易逻辑不复杂的功能,复杂的功能不会依赖,降低耦合,提升此模板的可扩展性
   * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
   * author entfrm开发团队-王翔
   */
  import { BasicTitle } from '/@/components/Basic';
  import { RedoOutlined, ColumnHeightOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons-vue';
  import { ref, onMounted, computed, watch, reactive, toRaw, unref } from 'vue';
  import { Table, Form, Row, Col, Divider, Tooltip, Dropdown, Menu, Select, DatePicker, Alert } from 'ant-design-vue';
  import { BasicColumn, BasicTableProps, PaginationProps, SizeType } from '/@/components/Table';
  import { listConfig, delConfig } from '/@/api/platform/system/controller/config';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import ConfigModal from './ConfigModal.vue';
  import { columns } from './config.data';
  import { basicProps } from '/@/components/Table/src/props';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { convertDateRange } from '/@/utils/dateUtil';
  import { useFullscreen } from '@vueuse/core';
  import { getPopupContainer, noop } from '/@/utils';
  import { useTimeoutFn } from '/@/hooks/core/useTimeout';
  import { useRowSelection } from '/@/components/Table/src/hooks/useRowSelection';
  import { usePagination } from '/@/components/Table/src/hooks/usePagination';
  import { useTableStyle } from '/@/components/Table/src/hooks/useTableStyle';
  import { useTableScroll } from '/@/components/Table/src/hooks/useTableScroll';

  /** 类型规范统一声明定义区域 */
  interface TableState {
    single: boolean;
    multiple: boolean;
    tableInstance: ComponentRef;
    queryFormInstance: ComponentRef & any;
    selectedKeys: SizeType[];
    queryParams: {
      name: string;
      key: string;
      isSys: string;
    };
    dateRange: string[];
    tableProps: Recordable;
  }

  /** 通用变量统一声明区域 */
  const ATable = Table;
  const AForm = Form;
  const AMenu = Menu;
  const AFormItem = Form.Item;
  const AMenuItem = Menu.Item;
  const ADivider = Divider;
  const ATooltip = Tooltip;
  const ADropdown = Dropdown;
  const ARow = Row;
  const ACol = Col;
  const ASelect = Select;
  const AAlert = Alert;
  const ASelectOption = Select.Option;
  const ARangePicker = DatePicker.RangePicker;

  const wrapRef = ref(null);
  const tableElRef = ref(null);
  const queryFormElRef = ref(null);
  const { t } = useI18n();
  const { prefixCls } = useDesign('basic-table');
  const { prefixCls: headerPrefixCls } = useDesign('basic-table-header');
  const { prefixCls: actionPrefixCls } = useDesign('basic-table-action');
  const { createConfirm, createMessage } = useMessage();
  const { toggle, isFullscreen } = useFullscreen(wrapRef);
  const [registerModal, { openModal }] = useModal();
  const state = reactive<TableState>({
    // 非单个禁用
    single: true,
    // 非多个禁用
    multiple: true,
    // a-table表格实例
    tableInstance: null,
    // a-form表单实例
    queryFormInstance: null,
    // 尺寸大小选择
    selectedKeys: ['middle'],
    // 查询参数
    queryParams: {
      name: undefined!,
      key: undefined!,
      isSys: undefined!
    },
    // 日期范围
    dateRange: [],
    // 表格api
    tableProps: {
      // 表格ID
      rowKey: 'id',
      // 表格列
      columns,
      // 遮罩层
      loading: false,
      // 数据列表
      dataSource: [],
      // 表格行配置
      rowSelection: { type: 'checkbox' },
      // 是否展示外边框和列边框
      bordered: true,
      // 表格布局
      tableLayout: 'fixed'
    }
  });
  const defineBasicTableProps = defineProps(basicProps);
  const basicTableProps = computed(() => ({ ...toRaw(defineBasicTableProps), ...state.tableProps } as unknown as BasicTableProps));
  const dataSourceRef = computed(() => state.tableProps.dataSource);
  const columnsRef = computed<BasicColumn[]>(() => state.tableProps.columns);
  // 基于vben-table扩展rowSelection,实现勾选数据自主可控
  const {
    getRowSelection,
    getRowSelectionRef,
    getSelectRows,
    clearSelectedRowKeys,
    getSelectRowKeys,
    deleteSelectRowByKey,
    setSelectedRowKeys
  } = useRowSelection(basicTableProps, dataSourceRef, noop);
  // 基于vben-table扩展分页
  const {
    getPaginationInfo,
    getPagination,
    setPagination,
    setShowPagination,
    getShowPagination
  } = usePagination(basicTableProps);
  // 使用vben-table行斑马线
  const { getRowClassName } = useTableStyle(basicTableProps, prefixCls);
  // 使用vben-table自动计算表格高度跟在指定区域显示滚动条
  const { getScrollRef, redoHeight } = useTableScroll(basicTableProps, tableElRef, columnsRef, getRowSelectionRef, dataSourceRef);
  // 设置并绑定a-table属性
  const getBindValues = computed(() => {
    const propsData: Recordable = {
      ...state.tableProps,
      size: state.selectedKeys[0],
      scroll: unref(getScrollRef),
      rowClassName: unref(getRowClassName),
      rowSelection: unref(getRowSelectionRef),
      pagination: toRaw(unref(getPaginationInfo))
    };
    return propsData;
  });

  /** 生命周期钩子回调处理区域 */
  onMounted(() => {
    state.tableInstance = unref(tableElRef);
    state.queryFormInstance = unref(queryFormElRef);
    useTimeoutFn(() => getList() , 16);
  });
  watch(getRowSelectionRef, ()=> {
    handleSelectionChange(getSelectRowKeys());
  },{
    immediate: true,
    deep: true
  });

  /** 查询列表数据 */
  async function getList() {
    try {
      state.tableProps.loading = true;
      const { current = 1, pageSize = 10 } = getPagination() as PaginationProps;
      const result = await listConfig(convertDateRange({ ...state.queryParams, current, size: pageSize }, state.dateRange));
      if (result) {
        state.tableProps.dataSource = result.data;
        setPagination({ total: result.total });
      }
    } finally {
      state.tableProps.loading = false;
    }
  }

  /** 搜索按钮操作 */
  function handleQuery() {
    setPagination({ current: 1 });
    clearSelectedRowKeys();
    getList();
  }

  /** 重置按钮操作 */
  function resetQuery() {
    state.dateRange = [];
    state.queryFormInstance?.resetFields();
    handleQuery();
  }

  /** 处理多选框选中数据 */
  function handleSelectionChange(selectedRowKeys: string[]) {
    state.single = selectedRowKeys.length != 1;
    state.multiple = !selectedRowKeys.length;
  }

  /** 处理表格分页 */
  function handleTablePaginationChange(pagination: PaginationProps) {
    setPagination(pagination);
    getList();
  }

  /** 新增按钮操作,行内新增与工具栏局域新增通用 */
  function handleAdd() {
    openModal(true,{ _tag: 'add' });
  }

  /** 编辑按钮操作,行内编辑 */
  function handleEdit(record?: Recordable) {
    record = record || { id: toRaw(getSelectRowKeys()) };
    openModal(true, { _tag: 'edit', record });
  }

  /** 删除按钮操作,行内删除 */
  async function handleDel(record?: Recordable) {
    const ids = record?.id || toRaw(getSelectRowKeys());
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: `是否确认删除参数编号为${ids}参数吗?`,
      onOk: async () => {
        await delConfig(ids);
        createMessage.success('删除成功!');
        handleQuery();
      }
    });
  }

  /** 处理表格刷新 */
  function handleRefreshTable() {
    clearSelectedRowKeys();
    getList();
  }

</script>
