import { createRouter, createWebHistory } from "vue-router";

import LoginPage from "../pages/LoginPage.vue";
import SuperadminLoginPage from "../pages/SuperadminLoginPage.vue";
import DashboardPage from "../pages/DashboardPage.vue";
import SuperadminDashboardPage from "../pages/SuperadminDashboardPage.vue";
import RekomendasiPage from "../pages/RekomendasiPage.vue";
import LegalisirPage from "../pages/LegalisirPage.vue";
import PendaftaranNikahPage from "../pages/PendaftaranNikahPage.vue";
import AgendaSuratMasukPage from "../pages/AgendaSuratMasukPage.vue";
import AgendaSuratKeluarPage from "../pages/AgendaSuratKeluarPage.vue";
import KelolaUserPage from "../pages/KelolaUserPage.vue";
import LoginLogsPage from "../pages/LoginLogsPage.vue";

const routes = [
     {
          path: "/",
          redirect: "/login",
     },
     {
          path: "/login",
          name: "Login",
          component: LoginPage,
     },
     {
          path: "/dashboard",
          name: "Dashboard",
          component: DashboardPage,
     },
     {
          path: "/superadmin-login",
          name: "SuperadminLogin",
          component: SuperadminLoginPage,
     },
     {
          path: "/superadmin-dashboard",
          name: "SuperadminDashboard",
          component: SuperadminDashboardPage,
     },
     {
          path: "/rekomendasi",
          name: "Rekomendasi",
          component: RekomendasiPage,
     },
     {
          path: "/legalisir",
          name: "Legalisir",
          component: LegalisirPage,
     },
     {
          path: "/agenda-surat-masuk",
          name: "AgendaSuratMasuk",
          component: AgendaSuratMasukPage,
     },
     {
          path: "/agenda-surat-keluar",
          name: "AgendaSuratKeluar",
          component: AgendaSuratKeluarPage,
     },
     {
          path: "/pendaftaran-nikah",
          name: "PendaftaranNikah",
          component: PendaftaranNikahPage,
     },
     {
          path: "/superadmin/kelola",
          name: "SuperadminKelola",
          component: KelolaUserPage,
     },
     {
          path: "/superadmin/login-logs",
          name: "SuperadminLoginLogs",
          component: LoginLogsPage,
     },
];

const router = createRouter({
     history: createWebHistory(),
     routes,
});

// Navigation guards for superadmin routes
router.beforeEach((to, from, next) => {
     const user = JSON.parse(localStorage.getItem("user") || "null");
     const role = user?.role;

     // Protect any superadmin route except the login page
     if (to.path.startsWith('/superadmin') && to.path !== '/superadmin-login') {
          if (role === 'superadmin') return next();
          return next('/superadmin-login');
     }

     if (to.path === "/superadmin-login") {
          if (role === "superadmin") return next("/superadmin-dashboard");
          return next();
     }

     next();
});

export default router;
