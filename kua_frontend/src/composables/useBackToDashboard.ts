import { useRouter } from 'vue-router'

export function useBackToDashboard() {
  const router = useRouter()
  const goBack = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (user?.role === 'superadmin') router.push('/superadmin-dashboard')
    else router.push('/dashboard')
  }
  return { goBack }
}
