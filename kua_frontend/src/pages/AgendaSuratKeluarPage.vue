<template>
  <v-app>
    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <Sidebar />

        <v-col cols="12" md="10" class="main-content">
          <h1 class="mb-2">Agenda Surat Keluar</h1>

          <v-card class="mb-4 pa-4">
            <div class="text-subtitle-1">
              Halaman ini digunakan untuk mengelola <strong>agenda surat keluar</strong>.
              Anda dapat menambahkan, mengubah, atau menghapus data surat keluar.
            </div>
            <div class="mt-2 text-body-2">
              Keterangan kolom:
              <ul>
                <li><strong>Tanggal Surat</strong>: Tanggal surat keluar diterbitkan.</li>
                <li><strong>Nomor Surat</strong>: Nomor surat keluar.</li>
                <li><strong>Tujuan Surat</strong>: Pihak/instansi tujuan surat keluar.</li>
                <li><strong>Keterangan</strong>: Keterangan tambahan terkait surat keluar.</li>
              </ul>
            </div>
          </v-card>

          <v-btn color="primary" class="mb-4" @click="openDialog()">
            Tambah Surat Keluar
          </v-btn>

          <v-data-table
            :headers="headers"
            :items="suratKeluarList"
            :loading="loading"
            item-key="id"
            class="elevation-1"
          >
            <template #item.actions="{ item }">
              <v-btn icon color="blue" @click="openDialog(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="red" @click="deleteSuratKeluar(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <v-card-title>
                <span class="text-h6">
                  {{ editedItem.id ? 'Edit' : 'Tambah' }} Surat Keluar
                </span>
              </v-card-title>

              <v-card-text>
                <v-text-field v-model="editedItem.tanggal_surat" type="date" label="Tanggal Surat" />
                <v-text-field v-model="editedItem.nomor_surat" label="Nomor Surat" />
                <v-text-field v-model="editedItem.tujuan_surat" label="Tujuan Surat" />
                <v-text-field v-model="editedItem.keterangan" label="Keterangan" />
              </v-card-text>

              <v-card-actions>
                <v-btn color="blue-darken-1" text @click="saveSuratKeluar">Simpan</v-btn>
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

const BASE_URL = 'http://localhost:3000/api/agenda-surat-keluar/'

const suratKeluarList = ref([])
const loading = ref(false)
const dialog = ref(false)

const editedItem = ref({
  id: null,
  tanggal_surat: '',
  nomor_surat: '',
  tujuan_surat: '',
  keterangan: ''
})

const headers = [
  { text: 'Tanggal Surat', value: 'tanggal_surat' },
  { text: 'Nomor Surat', value: 'nomor_surat' },
  { text: 'Tujuan Surat', value: 'tujuan_surat' },
  { text: 'Keterangan', value: 'keterangan' },
  { text: 'Aksi', value: 'actions', sortable: false }
]

const fetchSuratKeluar = async () => {
  loading.value = true
  try {
    const res = await axios.get(BASE_URL)
    suratKeluarList.value = res.data.data || res.data
  } catch (err) {
    console.error('Gagal fetch surat keluar:', err)
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
      tanggal_surat: '',
      nomor_surat: '',
      tujuan_surat: '',
      keterangan: ''
    }
  }
  dialog.value = true
}

const saveSuratKeluar = async () => {
  try {
    if (editedItem.value.id) {
      await axios.put(`${BASE_URL}${editedItem.value.id}`, editedItem.value)
    } else {
      await axios.post(BASE_URL, editedItem.value)
    }
    dialog.value = false
    fetchSuratKeluar()
  } catch (err) {
    console.error('Gagal simpan surat keluar:', err)
    alert('Gagal menyimpan surat keluar')
  }
}

const deleteSuratKeluar = async (id) => {
  if (!confirm('Yakin ingin menghapus surat keluar ini?')) return
  try {
    await axios.delete(`${BASE_URL}${id}`)
    fetchSuratKeluar()
  } catch (err) {
    console.error('Gagal hapus surat keluar:', err)
    alert('Gagal menghapus surat keluar')
  }
}

onMounted(fetchSuratKeluar)
</script>