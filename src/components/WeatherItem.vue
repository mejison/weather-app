<script setup>
    import Autocomplete from './Autocomplete.vue';
    import TempChart from './TempChart.vue';
    import { useI18n } from 'vue-i18n'
    import { reactive } from 'vue';
    
    const { t } = useI18n({ useScope: "global" })

    const props = defineProps({
        city: {
            type: Object,
            default: ({})
        },
        mode: {
            type: String,
            default: 'day'
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    })

    const state = reactive({
        mode: props.mode ?? 'day'
    })

    const emit = defineEmits(['change', 'mode'])

    const onChangeCity = (city) => {
        emit('change', city)
    }

    const onClickSwitcher = (value) => {
        state.mode = value
        emit('mode', value)
    }
</script>

<template>
    <Autocomplete 
        v-model="city.city"
        :disabled="disabled"
        @update:model-value="onChangeCity($event)"
    />
    <TempChart 
        v-if="city.temperature.length"
        :value="city"
        :mode="state.mode"
        :key="index"
    />
    <div class="switcher">
        <a href="#" :class="{active: state.mode === 'day'}" @click.prevent="onClickSwitcher('day')">{{ t('Day') }}</a>
        <a href="#" :class="{active: state.mode === 'week'}" @click.prevent="onClickSwitcher('week')">{{ t('Week') }}</a>
    </div>
    <svg v-if=" ! city.temperature.length" class="empty" xmlns="http://www.w3.org/2000/svg" height="16" width="10" viewBox="0 0 320 512"><path d="M160 64c-26.5 0-48 21.5-48 48V276.5c0 17.3-7.1 31.9-15.3 42.5C86.2 332.6 80 349.5 80 368c0 44.2 35.8 80 80 80s80-35.8 80-80c0-18.5-6.2-35.4-16.7-48.9c-8.2-10.6-15.3-25.2-15.3-42.5V112c0-26.5-21.5-48-48-48zM48 112C48 50.2 98.1 0 160 0s112 50.1 112 112V276.5c0 .1 .1 .3 .2 .6c.2 .6 .8 1.6 1.7 2.8c18.9 24.4 30.1 55 30.1 88.1c0 79.5-64.5 144-144 144S16 447.5 16 368c0-33.2 11.2-63.8 30.1-88.1c.9-1.2 1.5-2.2 1.7-2.8c.1-.3 .2-.5 .2-.6V112zM208 368c0 26.5-21.5 48-48 48s-48-21.5-48-48c0-20.9 13.4-38.7 32-45.3V208c0-8.8 7.2-16 16-16s16 7.2 16 16V322.7c18.6 6.6 32 24.4 32 45.3z"/></svg>
</template>

<style lang="scss">
    .switcher {
        position: absolute;
        right: 15px;
        top: 25%;
        display: flex;
        flex-direction: row;
        border: 2px solid #646cff;
        border-radius: 6px;
        background-color: #646cff;
        writing-mode: vertical-rl;
        text-orientation: upright;
        
        a {
            color: #ffffff;
            font-size: 14px;
            padding: 10px 3px;
            border-radius: 6px;
            transition: background-color .3s;
            letter-spacing: -3px;

            &.active {
                background-color: #ffffff;
                color: #646cff;
            }

            &:last-child {
                margin-bottom: 0;
            }
        }
    }

    .empty {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 25%;
        width: 25%;
        fill: rgba(195, 198, 209, 0.5);
    }

    @media (max-width: 768px) {
        .switcher {
            right: unset;
            left: 50%;
            transform: translateX(-50%);
            top: unset;
            bottom: 10px;
            writing-mode: unset;
            text-orientation: unset;
            
            a {
                letter-spacing: unset;
                padding: 5px;
            }
        }
    }
</style>