<script setup>
import { reactive, ref } from 'vue'

const props = defineProps({
    labels: {
        type: Array,
        require: true,
    },
})

const defaultTab = 0

const activeTab = reactive({
    index: defaultTab,
    value: props.labels[defaultTab].slug
})

const onLabelClick = (label, index) => {
    activeTab.index = index
    activeTab.value = label.slug
}
</script>

<template>
    <div class="tabs">
        <div class="labels">
            <a 
                v-for="(label, index) in labels" 
                @click.prevent="onLabelClick(label, index)"
                :class="{ active: index == activeTab.index}"
                class="label"
                :key="index"
                href="#"
                >{{ label.label }}</a>
        </div>
        <slot :name="activeTab.value"></slot>
    </div>
</template>

<style lang="scss">
    .tabs {
        .labels {
            display: flex;
            padding: 5px;

            .label {
                margin-right: 1rem;

                &.active {
                    color: #fff;
                }
            }
        }
    }

</style>