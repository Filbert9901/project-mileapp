<template>
  <div class="bg-gray-500">
    <div class="bg-white text-black p-6 rounded shadow-md w-96">
      <h2 class="text-2xl font-bold mb-4">Login</h2>
      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <input v-model="email" type="email" placeholder="Email" class="border px-2 py-1 rounded" required />
        <input v-model="password" type="password" placeholder="Password" class="border px-2 py-1 rounded" required />
        <button type="submit" class="bg-blue-500 text-white px-3 py-1 rounded">Login</button>
      </form>
      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    handleLogin() {
      const MOCK_USER = { email: "user@example.com", password: "123456" };
      if (this.email === MOCK_USER.email && this.password === MOCK_USER.password) {
        const token = "mock-token-123456";
        localStorage.setItem("authToken", token);
        this.$router.push("/tasks");
      } else {
        this.error = "Invalid email or password";
      }
    },
  },
};
</script>
