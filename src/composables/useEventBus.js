import { getCurrentInstance } from 'vue'

export default function useEventBus() {
    return  getCurrentInstance().appContext.config.globalProperties.$EventBus
}
