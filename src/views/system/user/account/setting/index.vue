<template>
  <ScrollContainer>
    <div class="account-setting">
      <Tabs tab-position="left"
            :animated="false"
            :tabBarStyle="tabBarStyle"
      >
        <template v-for="item in settingList" :key="item.key">
          <TabPane>
            <template #tab>
              <span>
                <Icon :icon="item.prefixIcon"/>
                {{ item.name }}
              </span>
            </template>
            <component :is="item.component"/>
          </TabPane>
        </template>
      </Tabs>
    </div>
  </ScrollContainer>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import { ScrollContainer } from '/@/components/Container/index';
  import { settingList } from './data';
  import UserInfo from './UserInfo.vue';
  import { Icon } from '/@/components/Icon';

  export default defineComponent({
    components: {
      ScrollContainer,
      Tabs,
      TabPane: Tabs.TabPane,
      UserInfo,
      Icon
    },
    setup() {
      return {
        settingList,
        tabBarStyle: {
          width: '220px',
          'margin-bottom': '200px'
        },
      };
    },
  });
</script>
<style lang="less" scoped>
  .account-setting {
    margin: 12px;

    ::v-deep(.ant-tabs-left) > .ant-tabs-left-bar {
      background-color: @component-background;
      height: 260px;

      .ant-tabs-tab {
        padding: 8px 24px;
        text-align: left;
      }

      .ant-tabs-tab-active {
        border-radius: 0 20px 20px 0;
        background-color: @primary-color !important;
        color: #fff!important;
      }

      .ant-tabs-nav {
        padding-top: 14px;
        padding-right: 14px;
        padding-bottom: 14px;
      }

      .ant-tabs-ink-bar {
        height: 0px !important;
      }
    }

    ::v-deep(.ant-tabs) > .ant-tabs-left-content {
      padding-left: 10px;
    }

  }
</style>
