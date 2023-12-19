const weather = {
    apiKey: "12d4efd5bc11c326086b84501457ea50",
    host: "https://api.openweathermap.org",
}

const location = {
    apiKey: "KjDJtFaaJ4QFtavFnWVjcg==JzixTqYKcFHqMiHE",
    host: "https://api.api-ninjas.com",
}

const ip = {
    host: "https://api.ipify.org"
}

const locationByIp = {
    host: "https://ip-api.com/json/"
}

const objectToQueryString = (object) => {
    return new URLSearchParams(object).toString()
}

export default {
    async getWeather(params = {}) {
        return (await fetch(weather.host + `/data/2.5/forecast?${objectToQueryString({ ...params, appid: weather.apiKey })}`))
                        .json()
    },
    async searchCity(params = {}) {
        return (await fetch(location.host + `/v1/city?${objectToQueryString(params)}`,
                            {
                                headers: {
                                    "X-Api-Key": location.apiKey,
                                }
                            })).json()
    },
    async getMyIp() {
        return (await fetch(ip.host + `/?format=json`)).json() 
    },
    async getMyLocationByIp(ip = '') {
        return (await fetch(locationByIp.host + ip)).json() 
    },
}