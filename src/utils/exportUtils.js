export const exportToCSV = (data, filename) => {
  if (!data || !data.length) {
    alert("No data to export");
    return;
  }
  const headers = Object.keys(data[0]);
    const csvRows = [
            headers.join(","),
            ...data.map(row =>
            headers.map(header => {
            let value = row[header];
            // ✅ Handle items array
            if (header === "items" && Array.isArray(value)) {
                value = value
                .map(item =>
                    `${item.productName} (Qty:${item.quantity}, Price:${item.price})`
                )
                .join(" | ");
            }
            // Fallback for objects
            if (typeof value === "object" && value !== null) {
                value = JSON.stringify(value);
            }
            const escapedValue = ('' + (value ?? '')).replace(/"/g, '""');
            return `"${escapedValue}"`;
            }).join(",")
        )
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    window.URL.revokeObjectURL(url);
};
