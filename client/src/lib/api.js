import axios from 'axios'

const configuredApiURL = import.meta.env.VITE_API_URL?.trim()
const baseURL = configuredApiURL
  ? `${configuredApiURL.replace(/\/+$/, '').replace(/\/api$/i, '')}/api`
  : import.meta.env.PROD
    ? 'https://real-estate-6q4b.onrender.com/api'
    : '/api'

const api = axios.create({
  baseURL,
  withCredentials: true,
})

export default api