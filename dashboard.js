document.addEventListener("DOMContentLoaded", async () => {
  // Check authentication
  if (!checkAuth()) return;
  updateHeaderUser();

  const statTotalTasks = document.getElementById("statTotalTasks");
  const statPendingTasks = document.getElementById("statPendingTasks");
  const statCompletedTasks = document.getElementById("statCompletedTasks");
  const recentTasksBody = document.getElementById("recentTasksBody");

  try {
    const tasks = await api.fetchTasks();
    updateDashboardStats(tasks);
    renderRecentTasks(tasks);
  } catch (err) {
    console.error(err);
    showToast("Failed to load tasks.", ToastKind.ERROR);
  }

  function updateDashboardStats(tasks) {
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === "pending").length;
    const completed = tasks.filter((t) => t.status === "completed").length;

    if (statTotalTasks) statTotalTasks.textContent = String(total);
    if (statPendingTasks) statPendingTasks.textContent = String(pending);
    if (statCompletedTasks) statCompletedTasks.textContent = String(completed);
  }

  function renderRecentTasks(tasks) {
    if (!recentTasksBody) return;
    recentTasksBody.innerHTML = "";

    const sorted = [...tasks].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    const recent = sorted.slice(0, 5);

    if (recent.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 4;
      cell.textContent = "No tasks yet.";
      cell.style.color = "var(--text-muted)";
      row.appendChild(cell);
      recentTasksBody.appendChild(row);
      return;
    }

    recent.forEach((task) => {
      const row = document.createElement("tr");

      const titleCell = document.createElement("td");
      titleCell.textContent = task.title;
      row.appendChild(titleCell);

      const statusCell = document.createElement("td");
      statusCell.appendChild(createStatusBadge(task.status));
      row.appendChild(statusCell);

      const priorityCell = document.createElement("td");
      priorityCell.appendChild(createPriorityBadge(task.priority));
      row.appendChild(priorityCell);

      const dueCell = document.createElement("td");
      dueCell.textContent = formatDate(task.due_date);
      row.appendChild(dueCell);

      recentTasksBody.appendChild(row);
    });
  }
});
