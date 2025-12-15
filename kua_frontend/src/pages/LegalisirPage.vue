<template>
  <v-app>
    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <Sidebar />

        <v-col cols="12" md="10" class="main-content">
  

          <h1 class="mb-2">Daftar Legalisir</h1>

          <v-card class="mb-4 pa-4">
            <div class="text-subtitle-1">
              Halaman ini digunakan untuk mengelola <strong>legalisir dokumen</strong>.
              Anda dapat menambahkan, mengubah, atau menghapus data legalisir.
            </div>
            <div class="mt-2 text-body-2">
              Keterangan kolom:
              <ul>
                <li><strong>Nama Pemohon</strong>: Nama orang yang mengajukan legalisir.</li>
                <li><strong>Nomor Legalisir</strong>: Nomor dokumen legalisir.</li>
                <li><strong>Tanggal Legalisir</strong>: Tanggal penerbitan legalisir.</li>
              </ul>
            </div>
          </v-card>

          <v-btn color="primary" class="mb-4" @click="openDialog()">
            Tambah Legalisir
          </v-btn>

          <v-data-table
            :headers="headers"
            :items="legalisirList"
            :loading="loading"
            item-key="id"
            class="elevation-1"
          >
            <template #item.actions="{ item }">
              <v-btn icon color="blue" @click="openDialog(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="red" @click="deleteLegalisir(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <v-card-title>
                <span class="text-h6">{{ editedItem.id ? 'Edit' : 'Tambah' }} Legalisir</span>
              </v-card-title>

              <v-card-text>
                <v-text-field v-model="editedItem.nama" label="Nama Pemohon" />
                <v-text-field v-model="editedItem.nomor_legalisir" label="Nomor Legalisir" />
                <v-text-field v-model="editedItem.tanggal_legalisir" type="date" label="Tanggal Legalisir" />
              </v-card-text>

              <v-card-actions>
                <v-btn color="blue-darken-1" text @click="saveLegalisir">Simpan</v-btn>
                <v-btn color="grey" text @click="dialog = false">Batal</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Sidebar from '../components/Sidebar.vue' 
const BASE_URL = 'http://localhost:3000/api/legalisir/'

const legalisirList = ref([])
const loading = ref(false)
const dialog = ref(false)

const editedItem = ref({
  id: null,
  nama: '',
  nomor_legalisir: '',
  tanggal_legalisir: ''
})

const headers = [
  { text: 'Nama Pemohon', value: 'nama' },
  { text: 'Nomor Legalisir', value: 'nomor_legalisir' },
  { text: 'Tanggal Legalisir', value: 'tanggal_legalisir' },
  { text: 'Aksi', value: 'actions', sortable: false }
]

const fetchLegalisir = async () => {
  loading.value = true
  try {
    const res = await axios.get(BASE_URL)
    legalisirList.value = res.data.data || res.data
  } catch (err) {
    console.error('Gagal ambil data legalisir:', err)
  } finally {
    loading.value = false
  }
}

const openDialog = (item = null) => {
  if (item) {
    editedItem.value = { ...item }
  } else {
    editedItem.value = {
      id: null,
      nama: '',
      nomor_legalisir: '',
      tanggal_legalisir: ''
    }
  }
  dialog.value = true
}

const saveLegalisir = async () => {
  try {
    if (editedItem.value.id) {
      await axios.put(`${BASE_URL}${editedItem.value.id}`, editedItem.value)
    } else {
      await axios.post(BASE_URL, editedItem.value)
    }
    dialog.value = false
    fetchLegalisir()
  } catch (err) {
    console.error('Gagal simpan legalisir:', err.response?.data || err.message)
    alert('Gagal menyimpan data.')
  }
}

const deleteLegalisir = async (id) => {
  if (!confirm('Yakin ingin menghapus data ini?')) return
  try {
    await axios.delete(`${BASE_URL}${id}`)
    fetchLegalisir()
  } catch (err) {
    console.error('Gagal hapus legalisir:', err)
    alert('Gagal menghapus data.')
  }
}

onMounted(fetchLegalisir)
</script>