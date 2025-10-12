import { create } from 'zustand'
import api from '../api/axios'

const useUserStore = create((set) => ({
    user: [],
    loading: false,
    error: null,

    FetchUser: async () => {
        set({ loading: true })
        try {
            const res = await api.get('/data')
            set({ user: res.data, loading: false })
        } catch (err) {
            set({ error: err.message, loading: false })
        }
    },
}))

export default useUserStore
