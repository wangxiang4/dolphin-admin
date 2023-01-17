/**
 * @program: dolphin-admin
 * @description: 元素交叉监听工具
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/10
 */

import { Ref, watchEffect, ref } from 'vue';

interface IntersectionObserverProps {
  target: Ref<Element | null | undefined>;
  root?: Ref<Element | null | undefined>;
  onIntersect: IntersectionObserverCallback;
  rootMargin?: string;
  threshold?: number;
}

export function useIntersectionObserver({
  target,
  root,
  onIntersect,
  rootMargin = '0px',
  threshold = 0.1,
}: IntersectionObserverProps) {
  let cleanup = () => {};
  const observer: Ref<Nullable<IntersectionObserver>> = ref(null);
  const stopEffect = watchEffect(() => {
    cleanup();

    observer.value = new IntersectionObserver(onIntersect, {
      root: root ? root.value : null,
      rootMargin,
      threshold,
    });

    const current = target.value;

    current && observer.value.observe(current);

    cleanup = () => {
      if (observer.value) {
        observer.value.disconnect();
        target.value && observer.value.unobserve(target.value);
      }
    };
  });

  return {
    observer,
    stop: () => {
      cleanup();
      stopEffect();
    },
  };
}
