// Toast notification system
class Toast {
  constructor() {
    this.init();
  }

  init() {
    // Remove any existing toast container
    const existingContainer = document.getElementById("toast-container");
    if (existingContainer) {
      existingContainer.remove();
    }

    // Create new toast container
    const container = document.createElement("div");
    container.id = "toast-container";
    container.className = "fixed bottom-4 right-4 z-50 flex flex-col gap-2";
    document.body.appendChild(container);
  }

  show(message, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");

    // Configure toast styles based on type
    const typeStyles = {
      success: "bg-green-500",
      error: "bg-red-500",
      warning: "bg-yellow-500",
      info: "bg-blue-500",
    };

    const baseClasses =
      "flex items-center justify-between px-6 py-3 rounded-md shadow-lg text-white min-w-[300px] transform transition-all duration-300";
    toast.className = `${baseClasses} ${
      typeStyles[type] || typeStyles.success
    }`;

    // Create message container
    const messageDiv = document.createElement("div");
    messageDiv.className = "flex-1 mr-3";
    messageDiv.textContent = message;

    // Create close button
    const closeButton = document.createElement("button");
    closeButton.className =
      "text-white hover:text-gray-200 focus:outline-none text-xl font-semibold";
    closeButton.innerHTML = "×";
    closeButton.onclick = () => this.dismiss(toast);

    // Assemble toast
    toast.appendChild(messageDiv);
    toast.appendChild(closeButton);

    // Add to container
    container.appendChild(toast);

    // Initial state
    toast.style.transform = "translateX(100%)";
    toast.style.opacity = "0";

    // Trigger animation
    requestAnimationFrame(() => {
      toast.style.transform = "translateX(0)";
      toast.style.opacity = "1";
    });

    // Auto dismiss
    setTimeout(() => {
      if (toast.parentElement) {
        this.dismiss(toast);
      }
    }, 3000);
  }

  dismiss(toast) {
    toast.style.transform = "translateX(100%)";
    toast.style.opacity = "0";

    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 300);
  }

  success(message) {
    this.show(message, "success");
  }

  error(message) {
    this.show(message, "error");
  }

  warning(message) {
    this.show(message, "warning");
  }

  info(message) {
    this.show(message, "info");
  }
}
