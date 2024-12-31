class Navbar {
  constructor(options = {}) {
    this.options = {
      containerId: options.containerId || "navbar",
      title: options.title || "Student Management System",
      onLogout: options.onLogout || this.defaultLogout,
      apiUrl: options.apiUrl || "../api/auth.php",
    };
    this.toast = new Toast(); // Initialize Toast instance
    this.init();
    this.checkAuth();
  }

  init() {
    const navbar = document.createElement("div");
    navbar.className =
      "bg-white container mx-auto px-4 rounded-lg shadow-md top-4 left-80 fixed";
    navbar.id = this.options.containerId;

    navbar.innerHTML = `
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-4">
            <h1 class="text-xl font-bold text-gray-800">${this.options.title}</h1>
            <div class="flex items-center space-x-4">
              <span id="userGreeting" class="text-gray-600"></span>
              <button
                id="logoutBtn"
                class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      `;

    document.body.appendChild(navbar);
    this.setupEventListeners();
  }

  setupEventListeners() {
    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", () => this.handleLogout());
  }

  async checkAuth() {
    try {
      const response = await fetch(this.options.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "check_session",
        }),
      });

      const data = await response.json();
      if (!data.success) {
        window.location.href = "index.html";
      } else {
        document.getElementById(
          "userGreeting"
        ).textContent = `Selamat datang, ${data.user.username}!`;
      }
    } catch (error) {
      window.location.href = "../index.html";
    }
  }

  async handleLogout() {
    try {
      const response = await fetch(this.options.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "logout",
        }),
      });

      const data = await response.json();
      if (data.success) {
        if (typeof this.options.onLogout === "function") {
          this.options.onLogout();
        } else {
          this.toast.show("Logout successful", "success");
          setTimeout(() => {
            window.location.href = "../index.html";
          }, 1000);
        }
      }
    } catch (error) {
      this.toast.show("Error logging out", "error");
    }
  }

  defaultLogout() {
    window.location.href = "../index.html";
  }
}
