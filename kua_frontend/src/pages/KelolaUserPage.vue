<template>
  <v-app>
    <v-container fluid class="pa-0">
      <v-row no-gutters>
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

        <v-col cols="12" md="10" class="main-content">
          <div class="text-h4 font-weight-bold mb-4">Kelola User</div>

          <v-card>
            <v-card-text>
              <v-form @submit.prevent="createUser">
                <v-text-field v-model="form.username" label="Username" required></v-text-field>
                <v-text-field v-model="form.password" :required="!form.id" label="Password"></v-text-field>
                <v-select v-model="form.role" :items="['pegawai','superadmin']" label="Role" required></v-select>
                <v-btn type="submit" color="primary" class="mt-3">{{ form.id ? 'Update' : 'Buat' }}</v-btn>
                <v-btn color="grey" class="mt-3 ml-2" @click="resetForm">Reset</v-btn>
              </v-form>

              <v-divider class="my-4"></v-divider>

              <v-list>
                <v-list-item v-for="u in users" :key="u.id">
                  <v-list-item-content>
                    <v-list-item-title>{{ u.username }} <small>({{ u.role }})</small></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn small @click="editUser(u)">Edit</v-btn>
                    <v-btn small color="red" @click="deleteUser(u.id)">Hapus</v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'KelolaUserPage',
  setup() {
    const router = useRouter()
    const users = ref<any[]>([])
    const form = reactive({ id: null as number | null, username: '', password: '', role: 'pegawai' })

    const menuItems = ref([
      { title: 'Rekomendasi Nikah', path: '/rekomendasi' },
      { title: 'Legalisir', path: '/legalisir' },
      { title: 'Pendaftaran Nikah', path: '/pendaftaran-nikah' },
      { title: 'Agenda Surat Masuk', path: '/agenda-surat-masuk' },
      { title: 'Agenda Surat Keluar', path: '/agenda-surat-keluar' },
      { title: 'Kelola', path: '/superadmin/kelola' },
      { title: 'Riwayat Login', path: '/superadmin/login-logs' },
    ])

    const getRoleHeader = () => {
      const user = JSON.parse(localStorage.getItem('user') || 'null')
      return user?.role || 'pegawai'
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/users', { headers: { 'x-user-role': getRoleHeader() } })
        users.value = res.data
      } catch (err) {
        console.error('Gagal fetch users', err)
      }
    }

    const createUser = async () => {
      try {
        if (!form.username || (!form.password && !form.id)) {
          alert('Username dan password wajib')
          return
        }

        if (form.id) {
          await axios.put(`http://localhost:3000/api/users/${form.id}`, { username: form.username, password: form.password, role: form.role }, { headers: { 'x-user-role': getRoleHeader() } })
          alert('User diupdate')
        } else {
          await axios.post('http://localhost:3000/api/users', { username: form.username, password: form.password, role: form.role }, { headers: { 'x-user-role': getRoleHeader() } })
          alert('User dibuat')
        }
        resetForm()
        fetchUsers()
      } catch (err: any) {
        alert(err.response?.data?.message || 'Gagal menyimpan user')
      }
    }

    const editUser = (u: any) => {
      form.id = u.id
      form.username = u.username
      form.password = ''
      form.role = u.role
    }

    const deleteUser = async (id: number) => {
      if (!confirm('Yakin ingin menghapus user ini?')) return
      try {
        await axios.delete(`http://localhost:3000/api/users/${id}`, { headers: { 'x-user-role': getRoleHeader() } })
        fetchUsers()
      } catch (err) {
        alert('Gagal menghapus user')
      }
    }

    const resetForm = () => { form.id = null; form.username = ''; form.password = ''; form.role = 'pegawai' }

    const logout = () => { localStorage.removeItem('user'); router.push('/login') }

    onMounted(fetchUsers)

    return { users, form, createUser, editUser, deleteUser, resetForm, menuItems, logout }
  }
})
</script>

<style scoped>
/* copy of dashboard sidebar styles for consistent look */
.sidebar {
  background-color: #1976d2;
  min-height: 100vh;
  color: white;
  padding-top: 20px;
  position: relative;
}
</style>