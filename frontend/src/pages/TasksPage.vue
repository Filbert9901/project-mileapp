<template>
  <div>
    <h1>Tasks Page</h1>

    <button @click="openCreateModal" class="bg-blue-500 text-white px-4 py-2 rounded mt-4 mb-4">
      + Add Task
    </button>
    <button @click="logout" class="bg-blue-500 text-white px-4 py-2 rounded mt-4 mb-4 ml-4">
      Logout
    </button>

    <!-- Filter Bar -->
    <div class="flex items-end gap-4 mb-4">

      <!-- Filter Status -->
      <div>
        <label for="filterStatus" class="block mb-1 font-semibold">Status</label>
        <select id="filterStatus" v-model="filterStatus" @change="fetchTasks"
          class="border px-2 py-1 w-40 bg-white text-black">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>
      </div>

      <!-- Search -->
      <div>
        <label for="searchTask" class="block mb-1 font-semibold">Search</label>
        <input id="searchTask" v-model="searchQuery" type="text" placeholder="Search by title..."
          class="border px-2 py-1 w-64" />
      </div>

      <!-- Filter Date -->
      <div>
        <label for="filterDate" class="block mb-1 font-semibold">Date</label>
        <input id="filterDate" v-model="filterDate" @change="fetchTasks" type="date" class="border px-2 py-1" />
      </div>

    </div>

    <!-- Sort Bar -->
    <div class="flex gap-4 justify-center items-center mb-4">
      <!-- Sort Field -->
      <div>
        <label for="sortField" class="block text-sm font-medium">Sort By</label>
        <select id="sortField" v-model="sortField" @change="fetchTasks"
          class="border px-2 py-1 w-40 bg-white text-black">
          <option value="createdAt">Created At</option>
          <option value="title">Title</option>
          <option value="status">Status</option>
        </select>
      </div>

      <!-- Sort Order -->
      <div>
        <label for="sortOrder" class="block text-sm font-medium">Order</label>
        <select id="sortOrder" v-model="sortOrder" @change="fetchTasks"
          class="border px-2 py-1 w-40 bg-white text-black">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>

    <!-- Tabel Tasks -->
    <table class="min-w-full border border-gray-300 mt-4">
      <thead class="bg-gray-100">
        <tr class="bg-gray-200 text-black">
          <th class="border px-4 py-2 text-center">ID</th>
          <th class="border px-4 py-2 text-center">Title</th>
          <th class="border px-4 py-2 text-center">Status</th>
          <th class="border px-4 py-2 text-center">Created At</th>
          <th class="border px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id" class="hover:bg-gray-500">
          <td class="border px-4 py-2">{{ task.id }}</td>
          <td class="border px-4 py-2">{{ task.title }}</td>
          <td class="border px-4 py-2">
            <span
              :class="task.status === 'done' ? 'bg-green-200 text-green-800 px-2 py-1 rounded' : 'bg-yellow-200 text-yellow-800 px-2 py-1 rounded'">
              {{ task.status }}
            </span>
          </td>
          <td class="border px-4 py-2">{{ task.createdAt }}</td>
          <td class="border px-4 py-2">
            <button @click="openEditModal(task)" class="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
            <button @click="deleteTask(task.id)" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Pagination -->
    <div class="flex justify-between items-center mt-4">
      <button @click="currentPage--; fetchTasks()" :disabled="currentPage === 1"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
        Prev
      </button>

      <span>Page {{ currentPage }} of {{ meta.totalPages }}</span>

      <button @click="currentPage++; fetchTasks()" :disabled="currentPage >= meta.totalPages"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
        Next
      </button>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-gray p-6 rounded shadow-lg w-96">
        <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Edit Task' : 'Create Task' }}</h2>
        <input v-model="currentTask.title" type="text" placeholder="Task title"
          class="border bg-white text-black w-full px-2 py-1 mb-2" />
        <select v-model="currentTask.status" class="border w-full px-2 py-1 mb-4 bg-white text-black">
          <option disabled value="">-- Select status --</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>

        <div class="flex justify-end gap-2">
          <button @click="saveTask" class="bg-green-500 text-white px-3 py-1 rounded">
            {{ isEditing ? 'Update' : 'Create' }}
          </button>
          <button @click="showModal = false" class="bg-gray-300 px-3 py-1 rounded">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import debounce from "lodash.debounce";

export default {
  name: "TasksPage",
  data() {
    return {
      tasks: [],
      currentTask: {
        title: "", status: "",
      },
      showModal: false,
      isEditing: false,
      filterStatus: "",
      searchQuery: "",
      filterDate: "",
      sortField: "createdAt",
      sortOrder: "asc",
      currentPage: 1,
      pageSize: 5,
      totalCount: 0,
      meta: {
        totalCount: 0,
        pageSize: 5,
        currentPage: 1,
        totalPages: 0,
      },
    };
  },

  async created() {
    this.debouncedFetchTasks = debounce(this.fetchTasks, 250);
    this.fetchTasks();
  },
  watch: {
    searchQuery() {
      this.debouncedFetchTasks();
    },
  },
  methods: {
    async fetchTasks() {
      try {
        let url = "http://localhost:3001/tasks";
        const params = [];

        if (this.filterStatus) params.push(`status=${this.filterStatus}`);
        if (this.searchQuery && this.searchQuery.trim() !== "") params.push(`q=${this.searchQuery.trim()}`);
        if (this.filterDate) params.push(`createdAt=${this.filterDate}`);

        params.push(`_sort=${this.sortField}`);
        params.push(`_order=${this.sortOrder}`);
        params.push(`_page=${this.currentPage}`);
        params.push(`_limit=${this.pageSize}`);
        if (params.length) url += "?" + params.join("&");

        const res = await axios.get(url);
        this.meta.totalCount = parseInt(res.headers["x-total-count"] || 0);
        this.meta.currentPage = this.currentPage;
        this.meta.totalPages = Math.ceil((res.headers["x-total-count"] || 0) / this.pageSize);
        this.tasks = res.data;
      } catch (err) {
        console.error(err);
      }
    },

    async deleteTask(id) {
      try {
        await axios.delete(`http://localhost:3001/tasks/${id}`);
        this.tasks = this.tasks.filter(task => task.id !== id);
      } catch (err) {
        if (err.response) {
          console.error("Error status:", err.response.status);
          console.error("Error message:", err.response.data);
          alert(`Failed to delete task: ${err.response.status}`);
        } else {
          console.error("Error", err.message);
          alert("Error: " + err.message);
        }
      }
    },

    openCreateModal() {
      this.resetCurrentTask();
      this.showModal = true;
    },

    openEditModal(task) {
      this.currentTask = { ...task };
      this.isEditing = true;
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.resetCurrentTask();
      this.isEditing = false;
    },

    async handleCreateTask() {
      try {
        const res = await axios.post("http://localhost:3001/tasks", this.currentTask);
        this.tasks.push(res.data); // update list
        this.closeModal();
      } catch (err) {
        console.error(err);
      }
    },

    async handleUpdateTask() {
      try {
        const res = await axios.put(
          `http://localhost:3001/tasks/${this.currentTask.id}`,
          this.currentTask
        );
        const index = this.tasks.findIndex(t => t.id === this.currentTask.id);
        if (index !== -1) this.tasks[index] = res.data;
        this.closeModal();
      } catch (err) {
        console.error(err);
      }
    },

    async saveTask() {
      try {
        if (!this.currentTask.title.trim() || !this.currentTask.status.trim()) {
          throw new Error("Title and status are required");
        }
        if (this.isEditing) {
          this.currentTask = {
            ...this.currentTask,
            createdAt: new Date().toISOString().split("T")[0],
          };
          await this.handleUpdateTask();
        } else {
          await this.handleCreateTask();
        }
      } catch (err) {
        if (err.response) {
          console.error("Error status:", err.response.status);
          console.error("Error message:", err.response.data);
          alert(`Failed: ${err.response.status}`);
        } else {
          console.error("Error:", err.message);
          alert("Error: " + err.message);
        }
      }
    },
    
    resetCurrentTask() {
      this.currentTask = {
        title: "",
        status: "",
        createdAt: new Date().toISOString().split("T")[0],
      };
    },

     logout() {
    localStorage.removeItem("authToken");
    this.$router.push("/login");
  }

  }
};
</script>