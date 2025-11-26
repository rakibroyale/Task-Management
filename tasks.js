document.addEventListener("DOMContentLoaded", async () => {
  if (!checkAuth()) return;
  updateHeaderUser();

  const tasksSearch = document.getElementById("tasksSearch");
  const tasksStatusFilter = document.getElementById("tasksStatusFilter");
  const tasksPriorityFilter = document.getElementById("tasksPriorityFilter");
  const tasksTableBody = document.getElementById("tasksTableBody");

  let allTasks = [];
  let filteredTasks = [];

  try {
    allTasks = await api.fetchTasks();
    applyTaskFilters();
  } catch (err) {
    console.error(err);
    showToast("Failed to load tasks.", ToastKind.ERROR);
  }

  tasksSearch.addEventListener("input", () => applyTaskFilters());
  tasksStatusFilter.addEventListener("change", () => applyTaskFilters());
  tasksPriorityFilter.addEventListener("change", () => applyTaskFilters());

  function applyTaskFilters() {
    const searchValue = tasksSearch.value.trim().toLowerCase();
    const status = tasksStatusFilter.value;
    const priority = tasksPriorityFilter.value;

    filteredTasks = [...allTasks];

    if (searchValue) {
      filteredTasks = filteredTasks.filter((task) =>
        task.title.toLowerCase().includes(searchValue)
      );
    }
    if (status !== "all") {
      filteredTasks = filteredTasks.filter((task) => task.status === status);
    }
    if (priority !== "all") {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === priority
      );
    }

    renderTasksTable();
  }

  function renderTasksTable() {
    if (!tasksTableBody) return;
    tasksTableBody.innerHTML = "";

    if (filteredTasks.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 6;
      cell.textContent = "No tasks match your filters.";
      cell.style.color = "var(--text-muted)";
      row.appendChild(cell);
      tasksTableBody.appendChild(row);
      return;
    }

    filteredTasks.forEach((task) => {
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

      const categoryCell = document.createElement("td");
      categoryCell.textContent = task.category || "—";
      row.appendChild(categoryCell);

      const dueCell = document.createElement("td");
      dueCell.textContent = formatDate(task.due_date);
      row.appendChild(dueCell);

      const actionsCell = document.createElement("td");
      const actions = document.createElement("div");
      actions.className = "table-actions";

      const toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
      toggleBtn.className = "btn btn-sm btn-secondary";
      toggleBtn.textContent =
        task.status === "pending" ? "Mark done" : "Mark pending";
      toggleBtn.addEventListener("click", () => handleToggleStatus(task));
      actions.appendChild(toggleBtn);

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "btn btn-sm btn-secondary";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => openEditTask(task));
      actions.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "btn btn-sm btn-danger";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => handleDeleteTask(task));
      actions.appendChild(deleteBtn);

      actionsCell.appendChild(actions);
      row.appendChild(actionsCell);

      tasksTableBody.appendChild(row);
    });
  }

  async function handleToggleStatus(task) {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    try {
      await api.updateTask(task.id, { status: newStatus });
      showToast("Task updated.", ToastKind.SUCCESS);
      // Reload tasks
      allTasks = await api.fetchTasks();
      applyTaskFilters();
    } catch (err) {
      console.error(err);
      showToast("Could not update task.", ToastKind.ERROR);
    }
  }

  function openEditTask(task) {
    // Store task in session storage for edit page
    sessionStorage.setItem("editTask", JSON.stringify(task));
    window.location.href = "edit-task.html";
  }

  async function handleDeleteTask(task) {
    const confirmDelete = window.confirm(
      `Delete task "${task.title}"? This cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      await api.deleteTask(task.id);
      showToast("Task deleted.", ToastKind.INFO);
      // Reload tasks
      allTasks = await api.fetchTasks();
      applyTaskFilters();
    } catch (err) {
      console.error(err);
      showToast("Could not delete task.", ToastKind.ERROR);
    }
  }
});
