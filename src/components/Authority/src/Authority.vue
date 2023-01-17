<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent } from 'vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getSlot } from '/@/utils/helper/tsxHelper';

  export default defineComponent({
    name: 'Authority',
    props: {
      value: {
        type: [Number, Array, String] as PropType<string | string[]>,
        default: '',
      },
    },
    setup(props, { slots }) {
      const { hasPermission } = usePermission();

      /**
       * 渲染角色按钮
       */
      function renderAuth() {
        const { value } = props;
        if (!value) {
          return getSlot(slots);
        }
        return hasPermission(value) ? getSlot(slots) : null;
      }

      return () => {
        // 基于角色的价值控制
        return renderAuth();
      };
    },
  });
</script>
