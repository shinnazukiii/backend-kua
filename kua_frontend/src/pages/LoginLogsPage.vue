<template>
  <v-app>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <div class="text-h4 font-weight-bold mb-4">Riwayat Login</div>
        </v-col>

              <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
              <div>Riwayat Login</div>
              <div class="d-flex align-center">
                <v-text-field v-model="search" dense hide-details placeholder="Cari username atau IP" append-icon="mdi-magnify" class="mr-3" />
                <v-select v-model="filterStatus" :items="statusOptions" dense hide-details style="max-width:180px" label="Filter" />
                <v-btn icon @click="fetchLogs" title="Refresh">
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </div>
            </v-card-title>

            <v-data-table
              :headers="headers"
              :items="filteredLogs"
              :items-per-page="10"
              class="elevation-1"
              dense
            >
              <template #item.success="{ item }">
                <v-chip :color="item.success ? 'green' : 'red'" dark small>
                  {{ item.success ? 'Berhasil' : 'Gagal' }}
                </v-chip>
              </template>

              <template #item.created_at="{ item }">
                <div title="{{ formatFull(item.created_at) }}">{{ relativeTime(item.created_at) }}</div>
              </template>

              <template #no-data>
                <v-alert type="info">Tidak ada log ditemukan.</v-alert>
              </template>
            </v-data-table>

            <v-card-actions>
              <v-spacer />
              <div class="text-caption">Menampilkan {{ filteredLogs.length }} entri</div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import axios from 'axios'

export default defineComponent({
  name: 'LoginLogsPage',
  setup() {
    const logs = ref<any[]>([])
    const search = ref('')
    const filterStatus = ref<'all'|'success'|'failed'>('all')
    const statusOptions = ['all','success','failed']

    const getRoleHeader = () => {
      const user = JSON.parse(localStorage.getItem('user') || 'null')
      return user?.role || 'pegawai'
    }

    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/users/login-logs', { headers: { 'x-user-role': getRoleHeader() } })
        logs.value = res.data || []
      } catch (err) {
        console.error('Gagal fetch logs', err)
      }
    }

    const headers = [
      { text: 'ID', value: 'id', width: 60 },
      { text: 'Username', value: 'username' },
      { text: 'Hasil', value: 'success', width: 120 },
      { text: 'IP Address', value: 'ip_address' },
      { text: 'Waktu', value: 'created_at' },
    ]

    const filteredLogs = computed(() => {
      const q = search.value.trim().toLowerCase()
      return logs.value.filter((l: any) => {
        if (filterStatus.value === 'success' && !l.success) return false
        if (filterStatus.value === 'failed' && l.success) return false
        if (!q) return true
        return (l.username || '').toLowerCase().includes(q) || (l.ip_address || '').toLowerCase().includes(q)
      })
    })

    const relativeTime = (t: string) => {
      if (!t) return '-'
      const d = new Date(t)
      const diff = Date.now() - d.getTime()
      const sec = Math.floor(diff / 1000)
      if (sec < 60) return `${sec}s lalu`
      const min = Math.floor(sec / 60)
      if (min < 60) return `${min}m lalu`
      const hr = Math.floor(min / 60)
      if (hr < 24) return `${hr}j lalu`
      const day = Math.floor(hr / 24)
      return `${day} hari lalu`
    }

    const formatFull = (t: string) => {
      if (!t) return ''
      return new Date(t).toLocaleString()
    }

    onMounted(fetchLogs)

    return { logs, fetchLogs, headers, filteredLogs, search, statusOptions, filterStatus, relativeTime, formatFull }
  }
})
</script>

<style scoped>
/* styles for login logs page */
.sidebar {
  background-color: #1976d2;
  min-height: 100vh;
  color: white;
  padding-top: 20px;
  position: relative;
}

.v-data-table {
  font-size: 14px;
}

.login-logs-header {
  background: linear-gradient(90deg, #42a5f5, #66bb6a);
  color: white;
  padding: 12px 16px;
  border-radius: 6px;
}

.v-chip {
  font-weight: 600;
}

.v-card-title .v-text-field {
  max-width: 280px;
}

</style>