document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginUsername = document.getElementById("loginUsername");
  const loginPassword = document.getElementById("loginPassword");

  // Redirect if already logged in
  const auth = localStorage.getItem("simple-task-flow:auth");
  if (auth) {
    window.location.href = "dashboard.html";
    return;
  }

  loginForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    try {
      const result = await api.login(username, password);
      localStorage.setItem(
        "simple-task-flow:auth",
        JSON.stringify({
          isAuthenticated: true,
          username: result.username,
        })
      );
      showToast("Logged in successfully.", ToastKind.SUCCESS);
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 500);
    } catch (err) {
      showToast(err.message || "Login failed.", ToastKind.ERROR);
    }
  });
});
