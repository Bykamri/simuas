class Dialog {
  constructor(options = {}) {
    this.options = {
      title: options.title || "Confirmation",
      message: options.message || "Are you sure?",
      confirmText: options.confirmText || "Confirm",
      cancelText: options.cancelText || "Cancel",
      confirmButtonClass:
        options.confirmButtonClass || "bg-red-600 hover:bg-red-700",
      cancelButtonClass:
        options.cancelButtonClass || "bg-white hover:bg-gray-50",
      icon:
        options.icon ||
        `<svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>`,
      iconClass: options.iconClass || "bg-red-100",
    };

    this.onConfirm = options.onConfirm || (() => {});
    this.onCancel = options.onCancel || (() => {});
    this.createDialog();
  }

  createDialog() {
    const template = `
      <div class="dialog-container hidden fixed inset-0 z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        
        <div class="fixed inset-0 z-10 flex items-center justify-center p-4">
          <div class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-lg">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${this.options.iconClass} sm:mx-0 sm:h-10 sm:w-10">
                  ${this.options.icon}
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                    ${this.options.title}
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      ${this.options.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="button" class="dialog-confirm w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${this.options.confirmButtonClass} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                ${this.options.confirmText}
              </button>
              <button type="button" class="dialog-cancel mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 ${this.options.cancelButtonClass} text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                ${this.options.cancelText}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add dialog to document
    const dialogElement = document.createElement("div");
    dialogElement.innerHTML = template;
    this.dialog = dialogElement.firstElementChild;
    document.body.appendChild(this.dialog);

    // Add event listeners
    this.dialog
      .querySelector(".dialog-confirm")
      .addEventListener("click", () => {
        this.onConfirm();
        this.hide();
      });

    this.dialog
      .querySelector(".dialog-cancel")
      .addEventListener("click", () => {
        this.onCancel();
        this.hide();
      });

    // Close on click outside
    this.dialog.addEventListener("click", (e) => {
      if (e.target === this.dialog) {
        this.hide();
      }
    });
  }

  show() {
    this.dialog.classList.remove("hidden");
  }

  hide() {
    this.dialog.classList.add("hidden");
  }

  destroy() {
    this.dialog.remove();
  }

  setContent(options = {}) {
    Object.assign(this.options, options);
    const titleElement = this.dialog.querySelector("#modal-title");
    const messageElement = this.dialog.querySelector(".text-gray-500");
    const confirmButton = this.dialog.querySelector(".dialog-confirm");
    const cancelButton = this.dialog.querySelector(".dialog-cancel");

    if (titleElement) titleElement.textContent = this.options.title;
    if (messageElement) messageElement.textContent = this.options.message;
    if (confirmButton) confirmButton.textContent = this.options.confirmText;
    if (cancelButton) cancelButton.textContent = this.options.cancelText;
  }
}
