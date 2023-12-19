<script setup>
// components
import Tabs from './components/Tabs.vue'

// views
import Main from './views/Main.vue'
import Selected from './views/Selected.vue'

import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: "global" })

</script>

<template>
  <div class="header">
    <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    <div class="langs">
      <a href="#" @click.prevent="$i18n.locale = 'en'" :class="{ active: $i18n.locale === 'en' }">en</a>
      <a href="#" @click.prevent="$i18n.locale = 'ua'" :class="{ active: $i18n.locale === 'ua' }">ua</a>
    </div>
  </div>
  <Tabs :labels="[{label: $t('Main'),slug: 'main' }, {label: $t('Selected'),slug: 'selected'}]">
    <template #main>
      <Main />
    </template>
    <template #selected>
      <Selected  />
    </template>
  </Tabs>
</template>

<style scoped lang="scss">
  .header {
    display: flex;
    align-items: baseline;
    flex-direction: column;
    .langs {
      display: inline-flex;
      margin-left: auto;

      a {
        padding: 2px 5px;
        border-radius: 8px;
        &.active {
          background-color: #646cffaa;
          color: #fff;
        }
      }
    }
    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
      margin: 0 auto;
      width: 100%;
      object-fit: contain;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.vue:hover {
      filter: drop-shadow(0 0 2em #42b883aa);
    }
  }

</style>
