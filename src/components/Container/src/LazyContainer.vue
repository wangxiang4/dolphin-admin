<template>
  <transition-group
    v-bind="$attrs"
    ref="elRef"
    class="h-full w-full"
    :name="transitionName"
    :tag="tag"
    mode="out-in"
  >
    <div v-if="isInit" key="component">
      <slot :loading="loading"/>
    </div>
    <div v-else key="skeleton">
      <slot v-if="$slots.skeleton" name="skeleton"/>
      <Skeleton v-else/>
    </div>
  </transition-group>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import {defineComponent, reactive, onMounted, ref, toRef, toRefs, Ref} from 'vue';
  import { Skeleton } from 'ant-design-vue';
  import { useTimeoutFn } from '/@/hooks/core/useTimeout';
  import { useIntersectionObserver } from '/@/hooks/event/useIntersectionObserver';

  interface State {
    isInit: boolean;
    loading: boolean;
    intersectionObserverInstance: IntersectionObserver | null;
  }

  const props = {
    /**
     * 等待时间，如果指定时间，无论是否可见，都会在指定时间后自动加载
     */
    timeout: { type: Number },
    /**
     * 组件所在的视口。
     * 如果组件在页面容器中滚动，则视口就是容器
     */
    viewport: {
      type: (typeof window !== 'undefined' ? window.HTMLElement : Object) as PropType<HTMLElement>,
      default: () => null,
    },
    /**
     * 预加载阈值，css单元
     */
    threshold: { type: String, default: '0px' },
    /**
     * 视口的滚动方向，垂直表示垂直方向，水平表示水平方向
     */
    direction: {
      type: String,
      default: 'vertical',
      validator: (v) => ['vertical', 'horizontal'].includes(v),
    },
    /**
     * 包装组件的外部容器的标签名称
     */
    tag: { type: String, default: 'div' },
    maxWaitingTime: { type: Number, default: 80 },
    /**
     * 过渡的名字
     */
    transitionName: { type: String, default: 'lazy-container' },
  };

  export default defineComponent({
    name: 'LazyContainer',
    components: { Skeleton },
    inheritAttrs: false,
    props,
    emits: ['init'],
    setup(props, { emit }) {
      const elRef = ref();
      const state = reactive<State>({
        isInit: false,
        loading: false,
        intersectionObserverInstance: null,
      });

      onMounted(() => {
        immediateInit();
        initIntersectionObserver();
      });

      // 如果设置了延迟时间，则立即执行
      function immediateInit() {
        const { timeout } = props;
        timeout &&
          useTimeoutFn(() => {
            init();
          }, timeout);
      }

      function init() {
        state.loading = true;

        useTimeoutFn(() => {
          if (state.isInit) return;
          state.isInit = true;
          emit('init');
        }, props.maxWaitingTime || 80);
      }

      function initIntersectionObserver() {
        const { timeout, direction, threshold } = props;
        if (timeout) return;
        // 根据滚动方向构造视口边距，用于提前加载
        let rootMargin = '0px';
        switch (direction) {
          case 'vertical':
            rootMargin = `${threshold} 0px`;
            break;
          case 'horizontal':
            rootMargin = `0px ${threshold}`;
            break;
        }

        try {
          const { stop, observer } = useIntersectionObserver({
            rootMargin,
            target: toRef(elRef.value, '$el'),
            onIntersect: (entries: any[]) => {
              const isIntersecting = entries[0].isIntersecting || entries[0].intersectionRatio;
              if (isIntersecting) {
                init();
                if (observer) {
                  stop();
                }
              }
            },
            root: toRef(props, 'viewport') as Ref<Element>,
          });
        } catch (e) {
          init();
        }
      }
      return {
        elRef,
        ...toRefs(state),
      };
    },
  });
</script>
