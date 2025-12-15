<template>
  <v-app>
    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <Sidebar />

        <v-col cols="12" md="10" class="main-content">
  

          <h1 class="mb-2">Daftar Pendaftaran Nikah</h1>

          <v-card class="mb-4 pa-4">
            <div class="text-subtitle-1">
              Halaman ini digunakan untuk mengelola <strong>pendaftaran nikah</strong>.
              Anda dapat menambahkan, mengubah, atau menghapus data pendaftaran.
            </div>
            <div class="mt-2 text-body-2">
              Keterangan kolom:
              <ul>
                <li><strong>Nomor Pendaftaran</strong>: Nomor unik untuk setiap pendaftaran.</li>
                <li><strong>Nama Calon Suami / Istri</strong>: Nama pasangan yang akan menikah.</li>
                <li><strong>Tanggal Mendaftar</strong>: Tanggal saat pasangan mendaftar nikah.</li>
                <li><strong>Hari Pernikahan</strong>: Hari akad nikah yang direncanakan.</li>
                <li><strong>Tanggal Pernikahan</strong>: Tanggal resmi pelaksanaan akad nikah.</li>
                <li><strong>Alamat Akad Nikah</strong>: Tempat berlangsungnya akad nikah.</li>
                <li><strong>Tanggal Pemeriksaan</strong>: Tanggal pemeriksaan administrasi.</li>
              </ul>
            </div>
          </v-card>

          <v-btn color="primary" class="mb-4" @click="openDialog()">
            Tambah Pendaftaran
          </v-btn>

          <v-data-table
            :headers="headers"
            :items="pendaftaranList"
            :loading="loading"
            item-key="id"
            class="elevation-1"
          >
            <template #item.actions="{ item }">
              <v-btn icon color="blue" @click="openDialog(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="red" @click="deletePendaftaran(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <v-dialog v-model="dialog" max-width="700px">
            <v-card>
              <v-card-title>
                <span class="text-h6">
                  {{ editedItem.id ? 'Edit' : 'Tambah' }} Pendaftaran Nikah
                </span>
              </v-card-title>

              <v-card-text>
                <v-text-field v-model="editedItem.nomor_pendaftaran" label="Nomor Pendaftaran" />
                <v-text-field v-model="editedItem.nama_calon_suami" label="Nama Calon Suami" />
                <v-text-field v-model="editedItem.nama_calon_istri" label="Nama Calon Istri" />
                <v-text-field v-model="editedItem.tanggal_mendaftar" type="date" label="Tanggal Mendaftar" />
                <v-text-field v-model="editedItem.hari_pernikahan" label="Hari Pernikahan" />
                <v-text-field v-model="editedItem.tanggal_pernikahan" type="date" label="Tanggal Pernikahan" />
                <v-text-field v-model="editedItem.alamat_akad_nikah" label="Alamat Akad Nikah" />
                <v-text-field v-model="editedItem.tanggal_pemeriksaan" type="date" label="Tanggal Pemeriksaan" />
              </v-card-text>

              <v-card-actions>
                <v-btn color="blue-darken-1" text @click="savePendaftaran">Simpan</v-btn>
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
const BASE_URL = 'http://localhost:3000/api/pendaftaran-nikah/'

const pendaftaranList = ref([])
const loading = ref(false)
const dialog = ref(false)

const editedItem = ref({
  id: null,
  nomor_pendaftaran: '',
  nama_calon_suami: '',
  nama_calon_istri: '',
  tanggal_mendaftar: '',
  hari_pernikahan: '',
  tanggal_pernikahan: '',
  alamat_akad_nikah: '',
  tanggal_pemeriksaan: ''
})

const headers = [
  { text: 'Nomor Pendaftaran', value: 'nomor_pendaftaran' },
  { text: 'Nama Calon Suami', value: 'nama_calon_suami' },
  { text: 'Nama Calon Istri', value: 'nama_calon_istri' },
  { text: 'Tanggal Mendaftar', value: 'tanggal_mendaftar' },
  { text: 'Hari Pernikahan', value: 'hari_pernikahan' },
  { text: 'Tanggal Pernikahan', value: 'tanggal_pernikahan' },
  { text: 'Alamat Akad Nikah', value: 'alamat_akad_nikah' },
  { text: 'Tanggal Pemeriksaan', value: 'tanggal_pemeriksaan' },
  { text: 'Aksi', value: 'actions', sortable: false }
]

const fetchPendaftaran = async () => {
  loading.value = true
  try {
    const res = await axios.get(BASE_URL)
    pendaftaranList.value = res.data.data || res.data
  } catch (err) {
    console.error('Gagal ambil data pendaftaran nikah:', err)
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
      nomor_pendaftaran: '',
      nama_calon_suami: '',
      nama_calon_istri: '',
      tanggal_mendaftar: '',
      hari_pernikahan: '',
      tanggal_pernikahan: '',
      alamat_akad_nikah: '',
      tanggal_pemeriksaan: ''
    }
  }
  dialog.value = true
}

const savePendaftaran = async () => {
  try {
    if (editedItem.value.id) {
      await axios.put(`${BASE_URL}${editedItem.value.id}`, editedItem.value)
    } else {
      await axios.post(BASE_URL, editedItem.value)
    }
    dialog.value = false
    fetchPendaftaran()
  } catch (err) {
    console.error('Gagal simpan pendaftaran nikah:', err)
  }
}
const deletePendaftaran = async (id) => {
  if (!confirm('Yakin ingin menghapus data ini?')) return
  try {
    await axios.delete(`${BASE_URL}${id}`)
    fetchPendaftaran()
  } catch (err) {
    console.error('Gagal hapus pendaftaran nikah:', err)
  }
}

onMounted(fetchPendaftaran)
</script>