<template>
  <v-col cols="12" md="2" class="sidebar">
    <div class="logout-container">
      <v-btn class="logout-shutdown" icon elevation="4" @click="logout">
        <v-icon color="white" size="32">mdi-power</v-icon>
      </v-btn>
    </div>

    <div class="mt-10 text-center font-weight-bold text-h6">Menu</div>

    <v-list dense class="menu-list">
      <router-link v-for="item in menuItems" :key="item.title" :to="item.path" class="menu-item" style="text-decoration: none;">
        <v-list-item>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </router-link>
    </v-list>
  </v-col>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const baseMenu = [
  { title: 'Rekomendasi Nikah', path: '/rekomendasi' },
  { title: 'Legalisir', path: '/legalisir' },
  { title: 'Pendaftaran Nikah', path: '/pendaftaran-nikah' },
  { title: 'Agenda Surat Masuk', path: '/agenda-surat-masuk' },
  { title: 'Agenda Surat Keluar', path: '/agenda-surat-keluar' },
]

const superadminExtra = [
  { title: 'Kelola User', path: '/superadmin/kelola' },
  { title: 'Riwayat Login', path: '/superadmin/login-logs' },
]

const role = JSON.parse(localStorage.getItem('user') || 'null')?.role

const menuItems = computed(() => {
  const dashboardItem = { title: 'Dashboard', path: role === 'superadmin' ? '/superadmin-dashboard' : '/dashboard' }
  const items = [dashboardItem, ...baseMenu]
  return role === 'superadmin' ? [...items, ...superadminExtra] : items
})

const logout = () => {
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  background-color: #1976d2;
  min-height: 100vh;
  color: white;
  padding-top: 20px;
  position: relative;
}

/* Tombol Shutdown */
.logout-container {
  position: absolute;
  top: 15px;
  left: 15px;
}

.logout-shutdown {
  background-color: #d32f2f;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  transition: background-color 0.3s, transform 0.2s;
}

.logout-shutdown:hover {
  background-color: #b71c1c;
  transform: scale(1.1);
}

.menu-list {
  margin-top: 100px;
}

.menu-item {
  display: block;
  background-color: #1565c0;
  margin-bottom: 4px;
  border-radius: 4px;
  color: white;
  padding: 8px;
}

.menu-item:hover {
  background-color: #0d47a1;
}
</style>