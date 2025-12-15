<template>
  <v-app>
    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <v-col cols="12" md="2" class="sidebar">
          <div class="logout-container">
            <v-btn
              class="logout-shutdown"
              icon
              elevation="4"
              @click="logout"
            >
              <v-icon color="white" size="32">mdi-power</v-icon>
            </v-btn>
          </div>

          <div class="mt-10 text-center font-weight-bold text-h6">Menu</div>

          <v-list dense class="menu-list">
            <router-link
              v-for="item in menuItems"
              :key="item.title"
              :to="item.path"
              class="menu-item"
              style="text-decoration: none;"
            >
              <v-list-item>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </router-link>
          </v-list>
        </v-col>

        <v-col cols="12" md="10" class="main-content">
          <div class="dashboard-header text-h4 font-weight-bold mb-6">
            Dashboard
          </div>

          <div class="piechart-wrapper mb-8">
            <PieChartChart :chartData="chartData" :chartOptions="chartOptions" />
          </div>

          <v-row justify="center" class="mb-6">
            <v-col
              cols="12"
              md="3"
              v-for="card in summaryCards"
              :key="card.title"
            >
              <v-card>
                <v-card-title class="justify-center">{{ card.title }}</v-card-title>
                <v-card-text class="text-h4 text-center">
                  <v-progress-circular
                    v-if="loading"
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                  <span v-else>{{ card.count.toLocaleString() }}</span>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import PieChartChart from "../components/PieChartChart.vue";
import type { ChartData, ChartOptions } from "chart.js";

interface SummaryCard {
  title: string;
  count: number;
}

export default defineComponent({
  name: "DashboardPage",
  components: { PieChartChart },
  setup() {
    const router = useRouter();

    const menuItems = ref([
      { title: "Rekomendasi Nikah", path: "/rekomendasi" },
      { title: "Legalisir", path: "/legalisir" },
      { title: "Pendaftaran Nikah", path: "/pendaftaran-nikah" },
      { title: "Agenda Surat Masuk", path: "/agenda-surat-masuk" },
      { title: "Agenda Surat Keluar", path: "/agenda-surat-keluar" },
    ]);

    const summaryCards = ref<SummaryCard[]>([
      { title: "Rekomendasi Nikah", count: 0 },
      { title: "Legalisir", count: 0 },
      { title: "Pendaftaran Nikah", count: 0 },            
      { title: "Agenda Surat Masuk", count: 0 },
      { title: "Agenda Surat Keluar", count: 0 },
    ]);

    const loading = ref(true);

    const fetchSummary = async () => {
      try {
        const [rekom, legal, daftar, masuk, keluar] = await Promise.all([
          axios.get<any[]>("http://localhost:3000/api/rekomendasi"),
          axios.get<any[]>("http://localhost:3000/api/legalisir"),
          axios.get<any[]>("http://localhost:3000/api/pendaftaran-nikah"),
          axios.get<any[]>("http://localhost:3000/api/agenda-surat-masuk"),
          axios.get<any[]>("http://localhost:3000/api/agenda-surat-keluar"),
        ]);

        const dataArrays = [rekom.data, legal.data, daftar.data, masuk.data, keluar.data];
        dataArrays.forEach((data, index) => {
          summaryCards.value[index]!.count = data?.length ?? 0;
        });
      } catch (err) {
        console.error("Gagal fetch data summary:", err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchSummary);

    const chartData = ref<ChartData<"pie", number[], string>>({
      labels: summaryCards.value.map((c) => c.title),
      datasets: [
        {
          label: "Summary Data",
          data: summaryCards.value.map((c) => c.count),
          backgroundColor: ["#42A5F5", "#66BB6A", "#FF7043", "#FFA726", "#AB47BC"], // ✅ Tambahkan warna untuk pendaftaran
          borderWidth: 1,
        },
      ],
    });

    watch(
      summaryCards,
      (newVal) => {
        chartData.value.labels = newVal.map((c) => c.title);
        chartData.value.datasets[0].data = newVal.map((c) => c.count);
      },
      { deep: true }
    );

    const chartOptions = ref<ChartOptions<"pie">>({
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        title: { display: true, text: "Overview", font: { size: 20 } },
      },
    });

    const logout = () => {
      localStorage.removeItem("user");
      router.push("/login");
    };

    return { summaryCards, menuItems, loading, chartData, chartOptions, logout };
  },
});
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

.main-content {
  padding: 20px;
}

.dashboard-header {
  text-align: center;
}

.piechart-wrapper {
  display: flex;
  justify-content: center;
}
</style>