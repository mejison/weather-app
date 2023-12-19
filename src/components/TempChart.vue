<script setup>
    import moment from 'moment'
    import _ from 'lodash'
    import {
        Chart as ChartJS,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    } from 'chart.js'
    import { computed, reactive, ref, watch } from 'vue'
    import { Line } from 'vue-chartjs'

    const props = defineProps({
        value: {
            default: [],
            type: Array,
        },
        mode: {
            default: 'day',
            type: String,
        }
    })

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    )

    const options = ref({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        }
    })

    const getLastFiveDays = () => {
        const daysAgo = {}
        for(let day = 0; day < 5; day ++) {
            daysAgo[day] = moment().add(day, 'days').format("DD/MM/YYYY")
        }
        return daysAgo
    }
    
    const data = computed(() => {
        const labelsByMode = {
            day: (props.value.labels ?? [
                    '00:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00',
                    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00',
                ]),
            week: [
               ..._.values(getLastFiveDays())
            ]
        }
        
        return {
                labels: labelsByMode[props.mode],
                datasets: [
                    {
                        backgroundColor: '#f87979',
                        data: [...props.value.temperature]
                    }
                ]
            }
    })
</script>

<template>
   <div class="chart">
        <Line 
            :data="data" 
            :options="options"
        />
   </div>
</template>

<style>
    .chart {
        height: 300px;
        margin-top: 10px;
    }
</style>