document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuth()) return;
  updateHeaderUser();

  const addTaskForm = document.getElementById("addTaskForm");
  const addTitle = document.getElementById("addTitle");
  const addDescription = document.getElementById("addDescription");
  const addStatus = document.getElementById("addStatus");
  const addPriority = document.getElementById("addPriority");
  const addCategory = document.getElementById("addCategory");
  const addDueDate = document.getElementById("addDueDate");
  const addRecurringInterval = document.getElementById("addRecurringInterval");

  addTaskForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    const payload = {
      title: addTitle.value,
      description: addDescription.value,
      status: addStatus.value,
      priority: addPriority.value,
      category: addCategory.value,
      due_date: addDueDate.value || null,
      recurring_interval: addRecurringInterval.value,
    };

    if (!payload.title.trim()) {
      showToast("Title is required.", ToastKind.ERROR);
      return;
    }

    try {
      await api.createTask(payload);
      showToast("Task created.", ToastKind.SUCCESS);
      setTimeout(() => {
        window.location.href = "tasks.html";
      }, 500);
    } catch (err) {
      console.error(err);
      showToast("Failed to create task.", ToastKind.ERROR);
    }
  });
});
