<template>
  <v-app>
    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <Sidebar />

        <v-col cols="12" md="10" class="main-content">
  

          <h1 class="mb-2">Daftar Rekomendasi Nikah</h1>

          <v-card class="mb-4 pa-4">
            <div class="text-subtitle-1">
              Halaman ini digunakan untuk mengelola <strong>surat rekomendasi nikah</strong>.
              Anda dapat menambahkan, mengubah, atau menghapus data pengajuan rekomendasi nikah.
            </div>
            <div class="mt-2 text-body-2">
              Keterangan kolom:
              <ul>
                <li><strong>Nama Pemohon</strong>: Nama orang yang mengajukan rekomendasi.</li>
                <li><strong>Asal Kelurahan</strong>: Kelurahan asal pemohon.</li>
                <li><strong>Nomor Surat Lurah</strong>: Nomor surat pengantar dari kelurahan.</li>
                <li><strong>Tempat & Tanggal Lahir</strong>: Data pribadi pemohon.</li>
                <li><strong>Pekerjaan</strong>: Pekerjaan pemohon.</li>
                <li><strong>Alamat</strong>: Alamat pemohon.</li>
                <li><strong>Nama Pasangan</strong>: Pasangan yang akan dinikahi.</li>
                <li><strong>KUA Tujuan</strong> dan <strong>Provinsi Tujuan</strong>: Lokasi tujuan pernikahan.</li>
              </ul>
            </div>
          </v-card>

          <v-btn color="primary" class="mb-4" @click="openDialog()">Tambah Rekomendasi</v-btn>

          <v-data-table
            :headers="headers"
            :items="rekomendasiList"
            :loading="loading"
            item-key="id"
            class="elevation-1"
          >
            <template #item.actions="{ item }">
              <v-btn icon color="blue" @click="openDialog(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="red" @click="deleteRekomendasi(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <v-card-title>
                <span class="text-h6">{{ editedItem.id ? 'Edit' : 'Tambah' }} Rekomendasi</span>
              </v-card-title>

              <v-card-text>
                <v-text-field v-model="editedItem.nama_pemohon" label="Nama Pemohon" />
                <v-text-field v-model="editedItem.asal_kelurahan" label="Asal Kelurahan" />
                <v-text-field v-model="editedItem.nomor_surat_lurah" label="Nomor Surat Lurah" />
                <v-text-field v-model="editedItem.tempat_lahir" label="Tempat Lahir" />
                <v-text-field v-model="editedItem.tanggal_lahir" type="date" label="Tanggal Lahir" />
                <v-text-field v-model="editedItem.pekerjaan" label="Pekerjaan" />
                <v-text-field v-model="editedItem.alamat" label="Alamat" />
                <v-text-field v-model="editedItem.nama_pasangan" label="Nama Pasangan" />
                <v-text-field v-model="editedItem.kua_tujuan" label="KUA Tujuan" />
                <v-text-field v-model="editedItem.provinsi_tujuan" label="Provinsi Tujuan" />
              </v-card-text>

              <v-card-actions>
                <v-btn color="blue-darken-1" text @click="saveRekomendasi">Simpan</v-btn>
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
const BASE_URL = 'http://localhost:3000/api/rekomendasi/'

const rekomendasiList = ref([])
const loading = ref(false)
const dialog = ref(false)

const editedItem = ref({
  id: null,
  nama_pemohon: '',
  asal_kelurahan: '',
  nomor_surat_lurah: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  pekerjaan: '',
  alamat: '',
  nama_pasangan: '',
  kua_tujuan: '',
  provinsi_tujuan: ''
})

const headers = [
  { text: 'Nama Pemohon', value: 'nama_pemohon' },
  { text: 'Asal Kelurahan', value: 'asal_kelurahan' },
  { text: 'Nomor Surat Lurah', value: 'nomor_surat_lurah' },
  { text: 'Tempat Lahir', value: 'tempat_lahir' },
  { text: 'Tanggal Lahir', value: 'tanggal_lahir' },
  { text: 'Pekerjaan', value: 'pekerjaan' },
  { text: 'Alamat', value: 'alamat' },
  { text: 'Nama Pasangan', value: 'nama_pasangan' },
  { text: 'KUA Tujuan', value: 'kua_tujuan' },
  { text: 'Provinsi Tujuan', value: 'provinsi_tujuan' },
  { text: 'Aksi', value: 'actions', sortable: false }
]

const fetchRekomendasi = async () => {
  loading.value = true
  try {
    const res = await axios.get(BASE_URL)
    rekomendasiList.value = res.data.data || res.data
  } catch (err) {
    console.error('Gagal fetch rekomendasi:', err)
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
      nama_pemohon: '',
      asal_kelurahan: '',
      nomor_surat_lurah: '',
      tempat_lahir: '',
      tanggal_lahir: '',
      pekerjaan: '',
      alamat: '',
      nama_pasangan: '',
      kua_tujuan: '',
      provinsi_tujuan: ''
    }
  }
  dialog.value = true
}

const saveRekomendasi = async () => {
  try {
    if (editedItem.value.id) {
      await axios.put(`${BASE_URL}${editedItem.value.id}`, editedItem.value)
    } else {
      await axios.post(BASE_URL, editedItem.value)
    }
    dialog.value = false
    fetchRekomendasi()
  } catch (err) {
    console.error('Gagal simpan:', err)
  }
}

const deleteRekomendasi = async (id) => {
  if (!confirm('Yakin ingin menghapus data ini?')) return
  try {
    await axios.delete(`${BASE_URL}${id}`)
    fetchRekomendasi()
  } catch (err) {
    console.error('Gagal hapus:', err)
  }
}

onMounted(fetchRekomendasi)
</script>