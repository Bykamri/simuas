class StatusLabel {
  static getStatusClass(status) {
    // Remove underscores and trim spaces
    const statusLower = status.toLowerCase().trim().replace(/_/g, " ");

    switch (statusLower) {
      case "aktif":
        return "bg-green-100 text-green-800";
      case "lulus":
        return "bg-blue-100 text-blue-800";
      case "mengundurkan diri":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  static render(status) {
    // Remove underscores from display text
    const cleanStatus = status.replace(/_/g, " ");
    const statusClass = this.getStatusClass(status);
    return `<p class="uppercase px-2 inline-flex text-sm leading-5 font-semibold rounded-full ${statusClass}">
        ${cleanStatus}
      </p>`;
  }
}
