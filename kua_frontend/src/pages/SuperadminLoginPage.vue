<template>
     <v-container fluid class="login-container">
          <v-row class="fill-height" align="center" justify="center">
               <v-col cols="12" sm="8" md="4">
                    <v-card class="pa-6 rounded-lg elevation-10 mx-auto" color="green lighten-5">
                         <v-card-title class="text-h4 text-center font-weight-bold"> 🔐 Login Superadmin </v-card-title>
                         <v-card-text>
                              <v-form ref="loginForm" @submit.prevent="handleLogin">
                                   <v-text-field v-model="username" label="Username" prepend-icon="mdi-account" outlined dense required></v-text-field>

                                   <v-text-field v-model="password" label="Password" type="password" prepend-icon="mdi-lock" outlined dense required></v-text-field>

                                   <v-btn type="submit" color="green darken-2" class="mt-4" block elevation="2"> Login Superadmin </v-btn>
                              </v-form>
                         </v-card-text>
                    </v-card>
               </v-col>
          </v-row>
     </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default defineComponent({
     name: "SuperadminLoginPage",
     setup() {
          const username = ref("");
          const password = ref("");
          const router = useRouter();

          const handleLogin = async () => {
               if (!username.value || !password.value) {
                    alert("Username dan password wajib diisi");
                    return;
               }

               try {
                    console.log('Attempting superadmin login', { username: username.value })
                    const res = await axios.post("http://localhost:3000/api/users/login/superadmin", {
                         username: username.value,
                         password: password.value,
                    });

                    console.log('Superadmin login response', res.status, res.data)
                    if (res.data.user?.role !== 'superadmin') {
                         alert('Akses ditolak: gunakan halaman login pegawai jika Anda bukan superadmin')
                         return
                    }
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                    router.push("/superadmin-dashboard");
               } catch (err: any) {
                    console.error('Superadmin login error', err)
                    console.error('Request URL:', err?.config?.url)
                    console.error('Response status:', err?.response?.status)
                    console.error('Response data:', err?.response?.data)
                    const msg = err.response?.data?.message || err.message || 'Login gagal'
                    alert(`${err?.response?.status || 'ERR'} - ${msg}`)
               }
          };

          // Redirect if already logged in as superadmin
          if (JSON.parse(localStorage.getItem("user") || "null")?.role === "superadmin") {
               router.push("/superadmin-dashboard");
          }

          return { username, password, handleLogin };
     },
});
</script>

<style scoped>
.login-container {
     min-height: 100vh;
     background: linear-gradient(135deg, #43a047, #a5d6a7);
}
</style>
