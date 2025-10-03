import { createRouter, createWebHistory } from "vue-router";
import TasksPage from "./pages/TasksPage.vue";
import LoginPage from "./pages/LoginPage.vue";

const routes = [
  { path: "/login", component: LoginPage },
  { 
    path: "/tasks", 
    component: TasksPage,
    meta: { requiresAuth: true },
  },
  { path: "/", redirect: "/login" }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("authToken");
  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
});

export default router;
