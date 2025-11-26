document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuth()) return;
  updateHeaderUser();

  const editTaskForm = document.getElementById("editTaskForm");
  const editId = document.getElementById("editId");
  const editTitle = document.getElementById("editTitle");
  const editDescription = document.getElementById("editDescription");
  const editStatus = document.getElementById("editStatus");
  const editPriority = document.getElementById("editPriority");
  const editCategory = document.getElementById("editCategory");
  const editDueDate = document.getElementById("editDueDate");
  const editRecurringInterval = document.getElementById(
    "editRecurringInterval"
  );

  // Get task data from session storage
  const taskData = sessionStorage.getItem("editTask");
  if (!taskData) {
    showToast("No task data found.", ToastKind.ERROR);
    setTimeout(() => {
      window.location.href = "tasks.html";
    }, 1000);
    return;
  }

  const task = JSON.parse(taskData);
  populateEditForm(task);

  editTaskForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    const id = editId.value;
    if (!id) return;

    const payload = {
      title: editTitle.value,
      description: editDescription.value,
      status: editStatus.value,
      priority: editPriority.value,
      category: editCategory.value,
      due_date: editDueDate.value || null,
      recurring_interval: editRecurringInterval.value,
    };

    if (!payload.title.trim()) {
      showToast("Title is required.", ToastKind.ERROR);
      return;
    }

    try {
      await api.updateTask(id, payload);
      showToast("Task updated.", ToastKind.SUCCESS);
      sessionStorage.removeItem("editTask");
      setTimeout(() => {
        window.location.href = "tasks.html";
      }, 500);
    } catch (err) {
      console.error(err);
      showToast("Failed to update task.", ToastKind.ERROR);
    }
  });

  function populateEditForm(task) {
    editId.value = task.id;
    editTitle.value = task.title;
    editDescription.value = task.description || "";
    editStatus.value = task.status;
    editPriority.value = task.priority;
    editCategory.value = task.category || "";
    editDueDate.value = task.due_date ? task.due_date.slice(0, 10) : "";
    editRecurringInterval.value = task.recurring_interval || "none";
  }
});
