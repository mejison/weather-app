import api from './api'
import _ from 'lodash'
import moment  from 'moment'

export default {
    getGroupByDays(list) {
        return _.groupBy(list.map(item => ({...item, dt_txt: item.dt_txt.replace(/\s*\d{2}:\d{2}:\d{2}/g, '')})), item => item.dt_txt)
    },
    get(key) {
        const store = localStorage.getItem('db') ?? "{}"
        return JSON.parse(store)[key]
    },
    set(key, value) {
        let store = localStorage.getItem('db') ?? "{}"
        store = JSON.parse(store)
        localStorage.setItem('db', JSON.stringify({ ...store, [key]: value}))
    },
    async getWeather(index, lat = 50.6223, lon = 26.2396, mode = 'day') {
        const methods = {
            getWeatherDay: async () => {
                return await api
                    .getWeather({
                        lat,
                        lon,
                        units: 'metric'
                    })
                    .then(({ list }) => {
                        const today = moment().format("YYYY-MM-DD")
                        const todayItems = list.filter(item => moment(item.dt_txt, "YYYY-MM-DD").diff(moment()) < 0)
                        // state.cities[index].labels = todayItems.map(item => item.dt_txt.replace(today, "").trim())
                        // state.cities[index].temperature =  todayItems.map(item => Math.ceil(item.main.temp))
                        return {
                            labels: todayItems.map(item => item.dt_txt.replace(today, "").trim()),
                            temperature: todayItems.map(item => Math.ceil(item.main.temp))
                        }
                    })
            },
            getWeatherWeek: async () => {
                return await api
                    .getWeather({
                        lat,
                        lon,
                        units: 'metric'
                    })
                    .then(({ list }) => {
                        const groupByDays = this.getGroupByDays(list)
                        const items = _.values(groupByDays).map((items) => {
                            return Math.ceil(_.sumBy(items, 'main.temp') / items.length)
                        })
                        
                        return {
                            labels: [],
                            temperature: items
                        }
                    })
            }
        }

        return await methods['getWeather' + mode[0].toUpperCase() + mode.slice(1)](index, lat, lon)
    }
}