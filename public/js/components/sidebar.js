class Sidebar {
  constructor(options = {}) {
    this.options = {
      containerId: options.containerId || "sidebar",
      activeClass: options.activeClass || "bg-indigo-900 text-white",
      menuItems: [
        { name: "Home", icon: "home", path: "/uas/view/index.html" },
        {
          name: "Mahasiswa",
          icon: "student",
          path: "/uas/view/mahasiswa.html",
        },
        { name: "Dosen", icon: "teacher", path: "/uas/view/dosen.html" },
        {
          name: "Matakuliah",
          icon: "course",
          path: "/uas/view/matakuliah.html",
        },
        { name: "Grafik", icon: "chart", path: "/uas/view/grafik.html" },
        { name: "Laporan", icon: "report", path: "/uas/view/laporan.html" },
      ],
    };
    this.init();
  }

  init() {
    const sidebar = document.createElement("aside");
    sidebar.className = "bg-white w-[17rem] min-h-screen top-0 fixed p-5";
    sidebar.id = this.options.containerId;

    sidebar.innerHTML = `
        <div class="flex items-center gap-4 justify-center">
          <img class="h-12" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company">
          <h1 class="text-center text-3xl tracking-wide font-bold tracking-tight text-gray-800">SIMUAS</h1>
        </div>
        <hr class="border-[1px] mt-4">
        <ul class="mt-5">
          ${this.options.menuItems
            .map((item) => this.createMenuItem(item))
            .join("")}
        </ul>
      `;

    document.body.appendChild(sidebar);
    this.setInitialActive();
  }

  createMenuItem(item) {
    const isActive = window.location.pathname === item.path;
    const activeClasses = isActive
      ? this.options.activeClass
      : "text-indigo-600";
    const iconColorClass = isActive ? "fill-white" : "fill-indigo-600";

    return `
        <li class="my-3">
          <a href="${
            item.path
          }" class="flex gap-3 group hover:bg-indigo-600 ${activeClasses} rounded-md px-4 py-2 items-center">
            ${this.getIcon(item.icon, iconColorClass)}
            <span class="text-lg font-medium group-hover:text-white">${
              item.name
            }</span>
          </a>
        </li>
      `;
  }

  getIcon(iconName, colorClass) {
    const icons = {
      home: `<svg class="w-7 h-7 group-hover:fill-white ${colorClass}" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>`,
      student: `<svg class="w-7 h-7 group-hover:fill-white ${colorClass}" viewBox="0 0 24 24">
          <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
        </svg>`,
      teacher: `<svg class="w-7 h-7 group-hover:fill-white ${colorClass}" viewBox="0 0 24 24">
          <path d="M20 17a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H9.46c.35.61.54 1.29.54 2h10v11h-9v2h9zM4 20a2 2 0 0 0 2 2h12v-2H6V9H4v11zm2-13v2h6V7H6zm0 4v2h6v-2H6zm0 4v2h6v-2H6z"/>
        </svg>`,
      course: `<svg class="w-7 h-7 group-hover:fill-white ${colorClass}" viewBox="0 0 24 24">
          <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 4h2v5l-1-.75L9 9V4zm9 16H6V4h1v9l3-2.25L13 13V4h5v16z"/>
        </svg>`,
      chart: `<svg class="w-7 h-7 group-hover:fill-white ${colorClass}" viewBox="0 0 24 24">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
        </svg>`,
      report: `<svg class="w-7 h-7 group-hover:fill-white ${colorClass}" viewBox="0 0 24 24">
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
        </svg>`,
    };
    return icons[iconName] || icons.home;
  }

  setInitialActive() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll(`#${this.options.containerId} a`);
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === currentPath) {
        link.classList.add(...this.options.activeClass.split(" "));
        link.classList.remove("text-indigo-600");
        const icon = link.querySelector("svg");
        if (icon) {
          icon.classList.remove("fill-indigo-600");
          icon.classList.add("fill-white");
        }
      }
    });
  }
}
