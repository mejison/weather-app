<script setup>
    import api from '../api'
    import { ref, reactive, watch } from "vue"
    
    const props = defineProps({
        modelValue: {},
        placeholder: {
            default: "Please type here ..."
        },
        disabled: {
            default: false,
            type: Boolean,
        }
    })

    const loader = reactive({
        show: false
    })

    const emit = defineEmits([
        'update:modelValue'
    ])

    const dropdown = reactive({
        show: false,
        results: [],
        selected: props.modelValue ?? null,
    })

    watch(() => props.modelValue, () => {
        dropdown.selected = props.modelValue
        field = props.modelValue
    });

    let field = ref(props.modelValue ?? null)

    const onFieldFocus = () => {
        dropdown.show = true
    }

    const onFieldBlur = () => {
        dropdown.show = false
    }

    const onFieldInput = (event) => {
        const value = event.target.value
        loader.show = true
        api.searchCity({
            name: value,
            limit: 5,
        }).then(data => {
            dropdown.results = data
        }).finally(() => {
            loader.show = false
        })
    }

    const onClickItem = (item) => {
        field = item.name
        dropdown.selected = item
        dropdown.results = []
        emit('update:modelValue', item)
    }

    const onClickClear = () => {
        dropdown.results = []
        dropdown.selected = null
        field = null
    }
</script>

<template>
    <div class="autocomplete">
        {{ value }}
        <span class="loader-wrapper" v-if="loader.show">
            <span class="loader"></span>
        </span>
        <input 
            :placeholder="placeholder" 
            class="search-field"
            :class="{'open': dropdown.results.length && ! selected}"
            v-model="field"
            @blur="onFieldBlur"
            @focus="onFieldFocus"
            @input="onFieldInput"
            :readonly="dropdown.selected"
        />
        <a 
            href="#" 
            class="clear"
            @click.prevent="onClickClear"
            v-if="dropdown.selected && ! disabled"
            >
            &times;
        </a>
        <div 
            class="dropdown"
            :class="{
                'show': dropdown.results.length && ! selected
            }"
            >
            <a 
                class="dropdown-item"
                v-for="(result, index) in dropdown.results"
                @click.prevent="onClickItem(result)"
                :key="index"
                href="#"
                >
                {{ result.name }}
            </a>
        </div>
    </div>
</template>

<style lang="scss">
    .autocomplete {
        position: relative;
        min-width: 300px;

        .search-field {
            width: 100%;
            background-color: #fff;
            border-radius: 6px;
            border: 2px solid #333;
            padding: 5px 7px;
            color: #000;
            font-size: 14px;

            &:focus {
                outline: none;
            }

            &.open {
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
            }
        }

        .clear {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #646cff;
            font-weight: bold;
        }

        .dropdown {
            position: absolute;
            z-index: 999;
            left: 0;
            top: 94%;
            background: #fff;
            width: 100%;
            display: none;
            flex-direction: column;
            box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
            border: 2px solid #333;
            padding: 10px;
            font-size: 14px;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;

            &.show {
                display: flex;
            }
        
            .dropdown-item {
                color: #000;
            }
        }
    }

    .loader-wrapper {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 10px;
        
        .loader {
            width: 15px;
            height: 15px;
            border: 2px solid #000;
            border-bottom-color: transparent;
            border-radius: 50%;
            display: inline-block;
            box-sizing: border-box;
            animation: rotation 1s linear infinite;
        }
    }
    
    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @media (max-width: 768px) {
        .autocomplete {
            min-width: auto;
            padding-right: 30px;

            .clear {
                right: 40px;
            }
        }
    }
</style>