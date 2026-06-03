import a, { type AxiosRequestConfig } from 'axios'
import { API_URL } from './app'

const ApiUrl = API_URL

const axios = a.create({
	baseURL: ApiUrl,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
})

axios.interceptors.response.use(
	response => response,
	error => {
		if (error.response?.data?.message) {
			error.message = error.response.data.message
		}
		return Promise.reject(error)
	}
)

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> =>
	axios(config).then(res => res.data)

export default axios
