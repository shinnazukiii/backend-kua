<template>
     <v-container fluid class="login-container">
          <v-row class="fill-height" align="center" justify="center">
               <v-col cols="12" sm="8" md="4">
                    <v-card class="pa-6 rounded-lg elevation-10 mx-auto" color="green lighten-5">
                         <v-card-title class="text-h4 text-center font-weight-bold"> 🔒 Login KUA </v-card-title>
                         <v-card-text>
                              <v-form ref="loginForm" @submit.prevent="handleLogin">
                                   <v-text-field v-model="username" label="Username" prepend-icon="mdi-account" outlined dense required></v-text-field>

                                   <v-text-field v-model="password" label="Password" type="password" prepend-icon="mdi-lock" outlined dense required></v-text-field>

                                   <v-btn type="submit" color="green darken-2" class="mt-4" block elevation="2"> Login </v-btn>
                                   <v-btn type="button" color="blue darken-2" class="mt-2" block elevation="2" @click="goToSuperadmin"> Login sebagai Superadmin </v-btn>
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
     name: "LoginPage",
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
                    console.log('Attempting login', { username: username.value })
                    const res = await axios.post("http://localhost:3000/api/users/login", {
                         username: username.value,
                         password: password.value,
                    });

                    console.log('Login response', res.status, res.data)
                    // Server should only allow pegawai here; add defensive check
                    if (res.data.user?.role !== 'pegawai') {
                         alert('Akses ditolak: silakan gunakan halaman login yang sesuai')
                         return
                    }
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                    router.push('/dashboard')
               } catch (err: any) {
                    console.error('Login error', err)
                    const msg = err.response?.data?.message || err.message || 'Login gagal'
                    alert(msg)
               }
          };

          const goToSuperadmin = () => {
               router.push('/superadmin-login')
          }

          return { username, password, handleLogin, goToSuperadmin };
     },
});
</script>

<style scoped>
.login-container {
     min-height: 100vh;
     background: linear-gradient(135deg, #43a047, #a5d6a7);
}
</style>
