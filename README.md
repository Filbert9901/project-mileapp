# Mileapp Tasks Module

## Overview
This project is a simple **Task CRUD module** built with **Vue 3** and **Tailwind**on the frontend and **JSON Server / MongoDB** as a mock backend.  
It supports full CRUD operations on tasks with additional features such as:

- Server-side filtering by status and created date
- Search by task title
- Sorting by `createdAt`, `title`, or `status`
- Pagination with meta info
- Token-based login with protected routes

---

## Design Decisions

- **Frontend (Vue 3 + Tailwind CSS)**
  - Used Tailwind CSS for quick, responsive styling.
  - Implemented `TasksPage` with:
    - Modal for create/edit tasks
    - Table layout for easy reading
    - Debounced search (250ms) for better performance
    - Filter, sort, and pagination for real-world use cases

- **Backend (JSON Server)**
  - Used JSON Server for a mock REST API.
  - Protected routes implemented via mock token-based auth stored in `localStorage`.
  - Meta info returned alongside data to support pagination.

---

## Strengths of the Module

- Fully functional CRUD for tasks.
- Server-side filtering, sorting, and pagination
- Token-based authentication ensures that routes are protected.
- Debounced search prevents unnecessary API calls.
- Clean and maintainable code.


## Database Indexes

Indexes were created in MongoDB to optimize query performance for the most frequently used operations:

```js
const tasks = db.collection("tasks");
tasks.createIndex({ title: "text" }); // for text search / partial match
tasks.createIndex({ title: 1 });      // for exact match or sorting by title
tasks.createIndex({ createdAt: 1 });  // for filtering and sorting by date
tasks.createIndex({ status: 1 });     // for filtering and sorting by task status

````
## Deployment

This project is deployed with **Vercel** (frontend) and **Railway** (mock API backend).
  - UI : [https://project-mileapp-git-main-filbert9901s-projects.vercel.app/login](https://project-mileapp-git-main-filbert9901s-projects.vercel.app/login)
  - API : [https://mileapp-test-production.up.railway.app/](https://mileapp-test-production.up.railway.app/)

