<script setup>
    import { onMounted, reactive, ref } from 'vue';
    import WeatherItem from '../components/WeatherItem.vue'
    import { useI18n } from 'vue-i18n'
    const { t } = useI18n({ useScope: "global" })
    import _ from 'lodash'
    import api from '../api'
    import moment from 'moment'
    import utils from '../helpers'

    const config = {
        limit: 5,
    }

    const state = reactive({
        cities: [
            {
                mode: 'week',
                lat: 50.6223,
                lon: 26.2396,
                city: null,
                labels: [],
                temperature: [],
            }
        ],
        selected: {},
    })
    
    onMounted(() => {
        const defaultIndex = 0
        api
            .getMyIp().then(data => {
            api.getMyLocationByIp(data?.ip)
                .then(({ cityName, latitude, longitude }) => {
                    state.cities[defaultIndex].city = cityName
                    state.cities[defaultIndex].lat = latitude
                    state.cities[defaultIndex].lon = longitude
                    utils.getWeather(defaultIndex, latitude, longitude, state.cities[defaultIndex].mode).then(({ labels, temperature }) => {
                        state.cities[defaultIndex].labels = labels
                        state.cities[defaultIndex].temperature =  temperature
                        updateLocalState()
                    })
                })
        })
    })

    const onClickAdd = () => {
        if (state.cities.length < config.limit) {
            state.cities = [
                ...state.cities,
                {
                    city: null,
                    temperature: []
                }
            ]
        }
    }

    const updateLocalState = () => {
        const selected = utils.get('selected') ?? {}
        state.selected = selected
    }

    const onClickSelect = (city) => {
        const selected = utils.get('selected') ?? {}
        const name = city.city + '/' + city.lat + '/' + city.lon

        
        if( ! selected[name]) {
            if (_.values(selected).length < config.limit) {
                utils.set('selected', {...selected, [name]: city})
                updateLocalState()
            } else {
                alert(t('To add remove the city because the maximum is') + config.limit)
            }
            return;
        }
        delete selected[name]
        utils.set('selected', {...selected})
        updateLocalState()
    }

    const onChangeCity = ({ index, city }) => {
        state.cities[index].city = city.name
        state.cities[index].lat = city.latitude
        state.cities[index].lon = city.longitude
        utils.getWeather(index, city.latitude, city.longitude, state.cities[index].mode).then(({ labels, temperature }) => {
            state.cities[index].labels = labels
            state.cities[index].temperature =  temperature
            updateLocalState()
        })
    }

    const onChangeMode = ({ index, mode }) => {
        state.cities[index].mode = mode
        utils.getWeather(index, state.cities[index].lat, state.cities[index].lon, mode).then(({ labels, temperature }) => {
            state.cities[index].labels = labels
            state.cities[index].temperature =  temperature
            updateLocalState()
        })
    }

    const onClickRemove = (removeIndex) => {
        if(confirm(t("Are your sure?"))) {
            state.cities = state.cities.filter((city, index) => {
                return index != removeIndex
            })
        }
    }
</script>

<template>
    <div>
        <div 
            class="card"
            v-for="(city, index) in state.cities"
            :key="`city-${index}`">
            <WeatherItem 
                :city="city"
                :mode="city.mode"
                @change="onChangeCity({ index, city: $event })"
                @mode="onChangeMode({ index, mode: $event })"
            />
            <a href="#" class="remove" v-if="state.cities.length > 1" @click.prevent="onClickRemove(index)">
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
            </a>
            <a href="#" 
                v-if="city.city" 
                class="select" 
                @click.prevent="onClickSelect(city)">
                <svg v-if=" ! state.selected[city.city + '/' + city.lat + '/' + city.lon]" height="16" width="16" viewBox="0 0 512 512"><path  d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
            </a>
        </div>

        <a href="#" v-if="state.cities.length < config.limit" class="add" @click.prevent="onClickAdd">
            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
        </a>
    </div>
</template>

<style lang="scss">
    .add {
        display: inline-flex;
        justify-content: center;
        width: 100%;
        background-color: #646cff;
        padding: 15px 0;
        border-radius: 8px;
        fill: #fff;
    }
</style>