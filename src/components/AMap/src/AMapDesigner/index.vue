<template>
  <div class="amap-designer">
    <Toolbar v-show="toolbarControl"
             class="headToolbar"
             :default-zoom="mapState.defaultZoom"
             :toolbar="toolbar"
             @save="handleMapSave"
             @addTask="handleOpenMapTask"
             @point="handleOpenMapPoint"
             @zoomIn="handleMapZoomIn"
             @zoomOut="handleMapZoomOut"
             @reset="mapReset"
    />
    <div id="mapview" ref="mapview">
      <div v-show="navigatePanel" id="mapPanel" ref="mapPanel"/>
    </div>
    <div v-show="sidebarControl" class="operatePanel">
      <div class="operatePanel-arrow" @click="toggleOperatePanel()">
        <span title="展开">‹</span>
        <p title="隐藏">›</p>
      </div>
      <div class="operatePanel-form">
        <AForm ref="formElRef"
               :labelCol="{ style: { width: '80px' } }"
               :wrapperCol="{ style: { width: '100%', 'margin-right': '10px' } }"
               :scrollToFirstError="true"
        >
          <AFormItem label="名称">
            <a-input placeholder="请输入地图名称" allowClear/>
          </AFormItem>
          <AFormItem label="起点">
            <a-input placeholder="请输入起点" allowClear/>
          </AFormItem>
          <AFormItem label="终点">
            <a-input placeholder="请输入终点" allowClear/>
          </AFormItem>
        </AForm>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import AMapLoader from '@amap/amap-jsapi-loader';
  import {
    reactive,
    watchEffect,
    getCurrentInstance,
    onBeforeMount,
    onUnmounted,
    ref,
    PropType,
    nextTick,
  } from 'vue';
  import { Form } from 'ant-design-vue';
  import { propTypes } from '/@/utils/propTypes';
  import { useUserStore } from '/@/store/modules/user';
  import { split, divide, subtract, merge, isEmpty, cloneDeep, add, concat } from 'lodash-es';
  import componentSetting from '/@/settings/componentSetting';
  import Toolbar from '../components/Toolbar.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  /** 类型规范统一声明定义区域 */
  interface MapState {
    first: boolean;
    loading: boolean;
    defaultZoom: number;
    toggleOperatePanelClass: Recordable;
    toggleStatus: boolean;
    mapConfig: {
      amapKey: string;
      options: Recordable;
    };
  }

  const mapProps = defineProps({
    sidebarControl: propTypes.bool.def(true),
    siderWidth: propTypes.number.def(371),
    toolbar: {
      type: Array as PropType<string[]>,
      default: () => ['save', 'addTask', 'point', 'zoomIn', 'zoomOut', 'reset']
    },
    toolbarHeight: propTypes.number.def(48),
    toolbarControl: propTypes.bool.def(true),
    mapControl: {
      type: Array as PropType<string[]>,
      default: () => ['toolBar', 'controlBar', 'scale', 'mapType']
    },
    navigatePanel: propTypes.bool.def(true),
    isEdit: propTypes.bool.def(false),
  });

  let map;
  let orgMarkerCluster;
  let hospitalMarkerCluster;
  let courierUserMarkerCluster;
  let scanCourierUserCircleRange;
  let driving;
  let eventSource;
  const { t } = useI18n();
  const emit = defineEmits(['success']);
  const userStore = useUserStore();
  const instance = getCurrentInstance();
  const { mapDesigner } = componentSetting;
  const mapState = reactive<MapState>({
    /** 首次初始化 */
    first: false,
    /** 遮罩层状态 */
    loading: false,
    /** 默认缩放大小 */
    defaultZoom: 7,
    /** 面板类样式属性 */
    toggleOperatePanelClass: {
      span: 'none',
      p: 'block',
      siderWidth: 0,
      toolbarHeight: 0
    },
    /** 面板(显示/隐藏)状态 */
    toggleStatus: true,
    /** 地图配置数据 */
    mapConfig: {
      amapKey: 'f278d021a80dcf81f071aee5bff08804',
      options: {
        pitch:60,
        viewMode:'3D',
        resizeEnable: true,
        center: split(mapDesigner.mapCenter, ',', 2),
        zoom: mapDesigner.defaultZoom,
        keyboardEnable: true,
        zooms: [2, 20]
      }
    }
  });
  const AForm = Form;
  const AFormItem = Form.Item;
  const formElRef = ref();

  onBeforeMount(() => {
    if (!instance) return;
    mapState.loading = true;
    // 初始化高德地图组件
    AMapLoader.load({
      key: mapState.mapConfig.amapKey,
      version: '2.0',
      plugins: ['AMap.MarkerCluster', 'AMap.Driving']
    }).then(async AMap => {
      // 创建地图实例
      map = new AMap.Map(instance.refs.mapview, mapState.mapConfig.options);
      map.plugin(['AMap.ToolBar', 'AMap.MapType', 'AMap.ControlBar', 'AMap.Scale'], () => {
        if (mapProps.mapControl?.includes('toolBar')) {
          // 地图操作工具条插件
          map.addControl(new AMap.ToolBar());
        }
        if (mapProps.mapControl?.includes('controlBar')) {
          // 组合了旋转,倾斜,复位,缩放插件
          map.addControl(new AMap.ControlBar());
        }
        if (mapProps.mapControl?.includes('scale')) {
          // 比例尺插件
          const scale = new AMap.Scale();
          scale.show();
          map.addControl(scale);
        }
        if (mapProps.mapControl?.includes('mapType')) {
          // 地图类型切换插件
          map.addControl(
            new AMap.MapType({
              defaultType: 0,
              showRoad: true
            })
          );
        }
      });
      map.on('zoomchange', ctx => {
        mapState.defaultZoom = subtract(divide(map.getZoom(),2), 1);
      });

      // 构造路线导航类
      driving = new AMap.Driving({
        map: map,
        panel: instance.refs.mapPanel
      });

      // 加载完毕
      complete();
    }).catch(error => {
      mapState.loading = false;
      throw error;
    });
  });

  onUnmounted(() => {
    // 销毁地图实例
    map?.destroy() && map.clearEvents();
    // 关闭SSE
    eventSource?.close();
  });

  /** 地图创建完成(动画关闭) */
  function complete () {
    if (map) {
      mapState.loading = false;
      mapState.first = true;
    }
  }

  /** 监听内部响应式数据 */
  watchEffect(() => {
    mapState.toggleOperatePanelClass.siderWidth = mapProps.siderWidth;
    mapState.toggleOperatePanelClass.toolbarHeight = mapProps.toolbarHeight;
    if (!mapProps.sidebarControl) mapState.toggleOperatePanelClass.siderWidth = 0;
    if (!mapProps.toolbarControl) mapState.toggleOperatePanelClass.toolbarHeight = 0;
  });

  /** 处理切换操作面板 */
  function toggleOperatePanel() {
    mapState.toggleStatus = !mapState.toggleStatus;
    if (mapState.toggleStatus) {
      mapState.toggleOperatePanelClass.span='none';
      mapState.toggleOperatePanelClass.p = 'block';
      mapState.toggleOperatePanelClass.siderWidth = mapProps.siderWidth;
    } else {
      mapState.toggleOperatePanelClass.span='block';
      mapState.toggleOperatePanelClass.p = 'none';
      mapState.toggleOperatePanelClass.siderWidth = 0;
    }
  }

  /** 处理地图放大 */
  function handleMapZoomIn() {
    map.zoomIn();
  }

  /** 处理地图缩小 */
  function handleMapZoomOut() {
    map.zoomOut();
  }


  /** 处理地图保存并发布 */
  async function handleMapSave() {
    emit('success');
  }

  /** 处理地图重置 */
  function mapReset() {
    nextTick(()=> {
      // 清除地图
      map?.resize();
      map?.clearMap();
      // 清除表单数据
      formElRef.value?.resetFields();
      formElRef.value?.clearValidate();
      driving?.clear();
      // 重置地图画布
      map?.setZoomAndCenter(mapState.mapConfig.options.zoom, mapState.mapConfig.options.center);
    });
  }

  /** 对外提供Api */
  defineExpose({
    mapReset
  });
</script>
<style lang="less" scoped>

// 地图设计器总样式
.amap-designer {
  @toolbarHeight: v-bind('mapState.toggleOperatePanelClass.toolbarHeight + "px"');;
  @siderWidth: v-bind('mapState.toggleOperatePanelClass.siderWidth + "px"');
  @borderColor: #e0e0e0;

  #mapview {
    position: absolute;
    top: @toolbarHeight;
    left: 0;
    right: @siderWidth;
    bottom: 0;

    #mapPanel {
      position: absolute;
      background-color: white;
      max-height: 90%;
      overflow-y: auto;
      top: 130px;
      right: 18px;
      width: 260px;
      z-index: 1;
    }

    #mapPanel :deep(.amap-lib-driving) {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      overflow: hidden;
    }
  }

  .operatePanel {
    border: 1px solid @borderColor;
    width: @siderWidth;
    height: 100%;
    background-color: white;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;

    .operatePanel-arrow {
      width: 15px;
      height: 94px;
      margin: -48px 0 0 -15px;
      background: #0075ff;
      position: absolute;
      top: 50%;
      cursor: pointer;
      line-height: 88px;
      font-size: 36px;
      font-weight: 200;
      font-family: Times;
      text-align: center;
      border-radius: 4px 0 0 4px;
      color: #fff;
      visibility: visible;
      left: 0;
      box-shadow: 0 2px 10px rgba(0,0,0,.2);
      display: block;
      span {
        display: v-bind('mapState.toggleOperatePanelClass.span');
      }
      p {
        display: v-bind('mapState.toggleOperatePanelClass.p');
      }
    }

    .operatePanel-form {
      margin-top: 20px;
    }

    .operatePanel-list {
      overflow: hidden;
    }
  }

  .headToolbar {
    border: 1px solid @borderColor;
    right: @siderWidth;
  }
}

:deep(.amap-marker-label) {
  border: none !important;
}

:deep(.amap-logo) {
  display: none!important;
}

:deep(.amap-copyright) {
  bottom:-100px;
  display: none!important;
}

</style>
