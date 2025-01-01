// input-components.js

class FormComponents {
  static initializeInputs() {
    this.initializeTextInput();
    this.initializeNumberInput();
    this.initializeFileInput();
    this.initializeSelectInput();
    this.initializeTextArea();
    this.initializeCurrencyInput();
    this.initializeEmailInput(); // Add this line
  }

  static createInputGroup({
    label,
    id,
    type = "text",
    required = false,
    maxLength,
    options = {},
    containerClass = "",
  }) {
    const container = document.createElement("div");
    container.className = `input-group ${containerClass}`;

    // Create label
    const labelElement = document.createElement("label");
    labelElement.htmlFor = id;
    labelElement.className = "block text-sm font-medium text-gray-700";
    labelElement.textContent = label;

    // Create input
    const input = document.createElement(
      type === "textarea" ? "textarea" : "input"
    );
    input.id = id;
    input.name = id;
    input.required = required;

    if (type !== "textarea") {
      input.type = type;
    }

    if (maxLength) {
      input.maxLength = maxLength;
    }

    // Apply common classes
    input.className =
      "mt-1 px-4 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500";

    // Apply additional options
    Object.keys(options).forEach((key) => {
      input[key] = options[key];
    });

    container.appendChild(labelElement);
    container.appendChild(input);

    return container;
  }

  static initializeTextInput() {
    const createTextInput = ({
      label,
      id,
      required = false,
      maxLength,
      placeholder = "",
    }) => {
      return this.createInputGroup({
        label,
        id,
        type: "text",
        required,
        maxLength,
        options: { placeholder },
      });
    };

    window.createTextInput = createTextInput;
  }

  static initializeNumberInput() {
    const createNumberInput = ({
      label,
      id,
      required = false,
      min,
      max,
      step,
    }) => {
      return this.createInputGroup({
        label,
        id,
        type: "number",
        required,
        options: { min, max, step },
      });
    };

    window.createNumberInput = createNumberInput;
  }

  static initializeFileInput() {
    const createFileInput = ({
      label,
      id,
      accept,
      maxSize,
      previewContainerId,
      allowedTypes = [],
      onFileSelected = null,
    }) => {
      const container = document.createElement("div");
      container.className = "space-y-2";

      // Label
      const labelElement = document.createElement("label");
      labelElement.className = "block text-sm font-medium text-gray-700";
      labelElement.textContent = label;

      // File input container
      const inputContainer = document.createElement("div");
      inputContainer.className = "flex items-center space-x-2";

      // File input
      const input = document.createElement("input");
      input.type = "file";
      input.id = id;
      input.name = id;
      input.accept = accept;
      input.className =
        "mt-1 px-4 py-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100";

      // Clear button
      const clearButton = document.createElement("button");
      clearButton.type = "button";
      clearButton.className =
        "px-2 py-1 text-sm text-red-600 hover:text-red-800 hidden";
      clearButton.textContent = "Clear";
      clearButton.id = `clear_${id}`;

      // Preview container
      const previewContainer = document.createElement("div");
      previewContainer.id = previewContainerId;
      previewContainer.className = "mt-2 hidden";

      // File validation and preview
      input.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
          // Size validation
          if (maxSize && file.size > maxSize) {
            alert(`File size must be less than ${maxSize / 1024 / 1024}MB`);
            this.value = "";
            return;
          }

          // Type validation
          if (allowedTypes.length && !allowedTypes.includes(file.type)) {
            alert(`Only ${allowedTypes.join(", ")} files are allowed`);
            this.value = "";
            return;
          }

          clearButton.classList.remove("hidden");

          if (onFileSelected) {
            onFileSelected(file, previewContainer);
          }
        } else {
          clearButton.classList.add("hidden");
          previewContainer.classList.add("hidden");
        }
      });

      // Clear functionality
      clearButton.addEventListener("click", () => {
        input.value = "";
        clearButton.classList.add("hidden");
        previewContainer.classList.add("hidden");
      });

      inputContainer.appendChild(input);
      inputContainer.appendChild(clearButton);

      container.appendChild(labelElement);
      container.appendChild(inputContainer);
      container.appendChild(previewContainer);

      return container;
    };

    window.createFileInput = createFileInput;
  }

  static initializeSelectInput() {
    const createSelectInput = ({
      label,
      id,
      required = false,
      options = [],
    }) => {
      const container = this.createInputGroup({
        label,
        id,
        type: "select",
        required,
      });

      const select = document.createElement("select");
      select.id = id;
      select.name = id;
      select.required = required;
      select.className =
        "mt-1 px-4 py-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500";

      options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        select.appendChild(optionElement);
      });

      // Replace input with select
      container.replaceChild(select, container.lastChild);

      return container;
    };

    window.createSelectInput = createSelectInput;
  }

  static initializeTextArea() {
    const createTextArea = ({ label, id, required = false, rows = 3 }) => {
      return this.createInputGroup({
        label,
        id,
        type: "textarea",
        required,
        options: { rows },
      });
    };

    window.createTextArea = createTextArea;
  }

  static initializeCurrencyInput() {
    const createCurrencyInput = ({ label, id, required = false }) => {
      const container = this.createInputGroup({
        label,
        id,
        type: "text",
        required,
      });

      const input = container.querySelector("input");

      // Add currency formatting
      input.addEventListener("input", function () {
        let value = this.value.replace(/[^\d]/g, "");
        if (value) {
          this.value = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value);
        }
      });

      return container;
    };

    window.createCurrencyInput = createCurrencyInput;
  }

  static initializeEmailInput() {
    const createEmailInput = ({
      label,
      id,
      required = false,
      placeholder = "",
    }) => {
      return this.createInputGroup({
        label,
        id,
        type: "email",
        required,
        options: {
          placeholder,
          pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
        },
      });
    };

    window.createEmailInput = createEmailInput;
  }
}
// Helper function for formatting currency
function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
