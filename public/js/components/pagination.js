class Pagination {
  constructor(config) {
    this.currentPage = 1;
    this.pageSize = config.pageSize || 10;
    this.totalItems = 0;
    this.maxVisiblePages = config.maxVisiblePages || 5;

    // Required config
    this.containerId = config.containerId;
    this.onPageChange = config.onPageChange;

    // Optional config
    this.pageSizeOptions = config.pageSizeOptions || [5, 10, 25, 50];
    this.showPageSize = config.showPageSize !== false;
    this.containerClass =
      config.containerClass ||
      "px-6 py-4 flex items-center justify-between border-t";
    this.buttonClass =
      config.buttonClass || "px-3 py-1 rounded border hover:bg-gray-100";
    this.activeButtonClass =
      config.activeButtonClass || "bg-indigo-600 text-white";
    this.disabledButtonClass =
      config.disabledButtonClass || "opacity-50 cursor-not-allowed";

    this.initialize();
  }

  initialize() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      throw new Error(`Container with id '${this.containerId}' not found`);
    }

    container.className = this.containerClass;
    this.render();
  }

  createPageSizeSelector() {
    if (!this.showPageSize) return "";

    const options = this.pageSizeOptions
      .map(
        (size) =>
          `<option value="${size}" ${
            size === this.pageSize ? "selected" : ""
          }>${size}</option>`
      )
      .join("");

    return `
        <div class="flex items-center">
          <label for="pageSize-${this.containerId}" class="mr-2 text-sm text-gray-600">Tampilkan:</label>
          <select id="pageSize-${this.containerId}" class="border rounded px-2 py-1 text-sm">
            ${options}
          </select>
          <span class="ml-2 text-sm text-gray-600">data per halaman</span>
        </div>
      `;
  }

  createPageNumbers() {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    let html = "";

    let startPage = Math.max(
      1,
      this.currentPage - Math.floor(this.maxVisiblePages / 2)
    );
    let endPage = Math.min(totalPages, startPage + this.maxVisiblePages - 1);

    if (endPage - startPage + 1 < this.maxVisiblePages) {
      startPage = Math.max(1, endPage - this.maxVisiblePages + 1);
    }

    if (startPage > 1) {
      html += `
          <button type="button" class="${
            this.buttonClass
          }" data-page="1">1</button>
          ${startPage > 2 ? '<span class="px-2">...</span>' : ""}
        `;
    }

    for (let i = startPage; i <= endPage; i++) {
      const isActive = i === this.currentPage;
      html += `
          <button type="button" class="${this.buttonClass} ${
        isActive ? this.activeButtonClass : ""
      }" 
            data-page="${i}">${i}</button>
        `;
    }

    if (endPage < totalPages) {
      html += `
          ${endPage < totalPages - 1 ? '<span class="px-2">...</span>' : ""}
          <button type="button" class="${
            this.buttonClass
          }" data-page="${totalPages}">${totalPages}</button>
        `;
    }

    return html;
  }

  render() {
    const container = document.getElementById(this.containerId);
    const startIndex =
      this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
    const endIndex = Math.min(
      this.currentPage * this.pageSize,
      this.totalItems
    );
    const totalPages = Math.ceil(this.totalItems / this.pageSize);

    container.innerHTML = `
        ${this.showPageSize ? this.createPageSizeSelector() : ""}
        <div class="text-sm text-gray-600">
          Menampilkan ${startIndex} - ${endIndex} dari ${this.totalItems} data
        </div>
        <div class="flex space-x-2">
          <button type="button" id="prevPage-${this.containerId}" class="${
      this.buttonClass
    } ${this.currentPage === 1 ? this.disabledButtonClass : ""}">
            Previous
          </button>
          <div id="pageNumbers-${this.containerId}" class="flex space-x-1">
            ${this.createPageNumbers()}
          </div>
          <button type="button" id="nextPage-${this.containerId}" class="${
      this.buttonClass
    } ${this.currentPage === totalPages ? this.disabledButtonClass : ""}">
            Next
          </button>
        </div>
      `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const container = document.getElementById(this.containerId);

    // Event delegation for page number buttons
    container.addEventListener("click", (e) => {
      const button = e.target.closest("button");
      if (!button) return;

      if (button.hasAttribute("data-page")) {
        const page = parseInt(button.dataset.page);
        if (page !== this.currentPage) {
          this.goToPage(page);
        }
      } else if (button.id === `prevPage-${this.containerId}`) {
        if (this.currentPage > 1) {
          this.goToPage(this.currentPage - 1);
        }
      } else if (button.id === `nextPage-${this.containerId}`) {
        const totalPages = Math.ceil(this.totalItems / this.pageSize);
        if (this.currentPage < totalPages) {
          this.goToPage(this.currentPage + 1);
        }
      }
    });

    // Page size selector
    const pageSizeSelect = container.querySelector(
      `#pageSize-${this.containerId}`
    );
    if (pageSizeSelect) {
      pageSizeSelect.addEventListener("change", (e) => {
        const newPageSize = parseInt(e.target.value);
        if (newPageSize !== this.pageSize) {
          this.pageSize = newPageSize;
          this.currentPage = 1; // Reset to first page
          this.onPageChange(this.currentPage, this.pageSize);
          this.render();
        }
      });
    }
  }

  goToPage(page) {
    if (page !== this.currentPage) {
      this.currentPage = page;
      this.onPageChange(this.currentPage, this.pageSize);
      this.render();
    }
  }

  updateTotalItems(total) {
    if (total !== this.totalItems) {
      this.totalItems = total;
      this.render();
    }
  }
}

// Make Pagination available globally
window.Pagination = Pagination;
