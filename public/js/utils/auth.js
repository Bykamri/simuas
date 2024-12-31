// auth.js

class AuthService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.redirectUrl = "../index.html";
  }

  setRedirectUrl(url) {
    this.redirectUrl = url;
  }

  async checkAuth() {
    try {
      const response = await fetch(this.apiUrl, {
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
        window.location.href = this.redirectUrl;
        return null;
      }

      return data.user;
    } catch (error) {
      console.error("Auth check failed:", error);
      window.location.href = this.redirectUrl;
      return null;
    }
  }

  startAuthCheck(intervalMinutes = 5) {
    // Initial check
    this.checkAuth();

    // Set up periodic checks
    setInterval(() => {
      this.checkAuth();
    }, intervalMinutes * 60 * 1000);
  }

  updateUserGreeting(user) {
    const greetingElement = document.getElementById("userGreeting");
    if (greetingElement && user) {
      greetingElement.textContent = `Selamat datang, ${user.username}!`;
    }
  }
}
