const tasks = db.collection("tasks");
tasks.createIndex({ title: "text" });
tasks.createIndex({ title: 1 });
tasks.createIndex({ createdAt: 1 });
tasks.createIndex({ status: 1 });
