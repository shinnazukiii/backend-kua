<template>
  <v-app>
    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <Sidebar />

        <v-col cols="12" md="10" class="main-content">


          <h1 class="mb-2">Agenda Surat Masuk</h1>

          <v-card class="mb-4 pa-4">
            <div class="text-subtitle-1">
              Halaman ini digunakan untuk mengelola <strong>agenda surat masuk</strong>.
              Anda dapat menambahkan, mengubah, atau menghapus data surat masuk.
            </div>
            <div class="mt-2 text-body-2">
              Keterangan kolom:
              <ul>
                <li><strong>Nama Pengirim</strong>: Instansi/perorangan pengirim surat.</li>
                <li><strong>Nomor Surat</strong>: Nomor surat masuk.</li>
                <li><strong>Tanggal Surat</strong>: Tanggal yang tertera pada surat.</li>
                <li><strong>Hal</strong>: Perihal surat masuk.</li>
              </ul>
            </div>
          </v-card>

          <v-btn color="primary" class="mb-4" @click="openDialog()">Tambah Surat Masuk</v-btn>

          <v-data-table
            :headers="headers"
            :items="suratMasukList"
            :loading="loading"
            item-key="id"
            class="elevation-1"
          >
            <template #item.actions="{ item }">
              <v-btn icon color="blue" @click="openDialog(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="red" @click="deleteSuratMasuk(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <v-card-title>
                <span class="text-h6">{{ editedItem.id ? 'Edit' : 'Tambah' }} Surat Masuk</span>
              </v-card-title>

              <v-card-text>
                <v-text-field v-model="editedItem.nama_pengirim" label="Nama Pengirim" />
                <v-text-field v-model="editedItem.nomor_surat" label="Nomor Surat" />
                <v-text-field v-model="editedItem.tanggal_surat" type="date" label="Tanggal Surat" />
                <v-text-field v-model="editedItem.hal" label="Hal" />
              </v-card-text>

              <v-card-actions>
                <v-btn color="blue-darken-1" text @click="saveSuratMasuk">Simpan</v-btn>
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
const BASE_URL = 'http://localhost:3000/api/agenda-surat-masuk/'

const suratMasukList = ref([])
const loading = ref(false)
const dialog = ref(false)

const editedItem = ref({
  id: null,
  nama_pengirim: '',
  nomor_surat: '',
  tanggal_surat: '',
  hal: ''
})

const headers = [
  { text: 'Nama Pemohon', value: 'nama_pengirim' },
  { text: 'Nomor Surat', value: 'nomor_surat' },
  { text: 'Tanggal Surat', value: 'tanggal_surat' },
  { text: 'Hal', value: 'hal' },
  { text: 'Aksi', value: 'actions', sortable: false }
]

const fetchSuratMasuk = async () => {
  loading.value = true
  try {
    const res = await axios.get(BASE_URL)
    suratMasukList.value = res.data.data || res.data
  } catch (err) {
    console.error('Gagal fetch surat masuk:', err)
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
      nama_pengirim: '',
      nomor_surat: '',
      tanggal_surat: '',
      hal: ''
    }
  }
  dialog.value = true
}

const saveSuratMasuk = async () => {
  try {
    if (editedItem.value.id) {
      await axios.put(`${BASE_URL}${editedItem.value.id}`, editedItem.value)
    } else {
      await axios.post(BASE_URL, editedItem.value)
    }
    dialog.value = false
    fetchSuratMasuk()
  } catch (err) {
    console.error('Gagal simpan surat masuk:', err)
  }
}

const deleteSuratMasuk = async (id) => {
  if (!confirm('Yakin ingin menghapus data ini?')) return
  try {
    await axios.delete(`${BASE_URL}${id}`)
    fetchSuratMasuk()
  } catch (err) {
    console.error('Gagal hapus surat masuk:', err)
  }
}

onMounted(fetchSuratMasuk)
</script>