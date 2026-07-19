/* ===========================
   Art by Dayyhu
   Email Generator
=========================== */

const $ = (id) => document.getElementById(id);

/* ---------------------------
   Default Values
--------------------------- */

window.onload = () => {
  // Today's Date

  const today = new Date();
  $("orderDate").value = today.toISOString().split("T")[0];

  // Order Number

  let last = localStorage.getItem("lastOrder");

  if (!last) last = 1;

  $("orderNumber").value = "DAYYHU-" + String(last).padStart(4, "0");

  // Initial Preview

  updatePreview();
};

/* ---------------------------
   Inputs
--------------------------- */

const inputs = document.querySelectorAll("input, textarea");

inputs.forEach((input) => {
  input.addEventListener("input", () => {
    calculateTotals();

    updatePreview();
  });
});

document.querySelectorAll("input[name='payment']").forEach((radio) => {
  radio.addEventListener("change", updatePreview);
});

/* ---------------------------
   Pricing
--------------------------- */

$("addItem").addEventListener("click", () => {
  const div = document.createElement("div");

  div.className = "item";

  div.innerHTML = `

        <label>Item Name</label>
        <input type="text" class="itemName">

        <label>Original Price</label>
        <input type="number" class="itemOriginal">

        <label>Discounted Price</label>
        <input type="number" class="itemDiscounted">

        <button
            type="button"
            class="removeItem"
            style="margin-top:10px;background:#FFB7C5;color:white;border:none;padding:8px 14px;border-radius:8px;cursor:pointer;">

            Remove Item

        </button>

    `;

  $("itemsContainer").appendChild(div);

  div.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      calculateTotals();
      updatePreview();
    });
  });
});

document.querySelectorAll(".item input").forEach((input) => {
  input.addEventListener("input", () => {
    calculateTotals();
    updatePreview();
  });
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("removeItem")) {
    e.target.closest(".item").remove();

    calculateTotals();
    updatePreview();
  }
});

function calculateTotals() {
  const originals = document.querySelectorAll(".itemOriginal");
  const discounted = document.querySelectorAll(".itemDiscounted");

  let originalTotal = 0;
  let subtotal = 0;

  originals.forEach((input) => {
    originalTotal += Number(input.value) || 0;
  });

  discounted.forEach((input) => {
    subtotal += Number(input.value) || 0;
  });

  const discount = originalTotal - subtotal;

  const delivery = Number($("delivery").value) || 0;

  const total = subtotal + delivery;

  // Update preview
  $("pOriginal").innerText = "Rs. " + originalTotal.toLocaleString();

  $("pDiscount").innerText = "- Rs. " + discount.toLocaleString();

  $("pSubtotal").innerText = "Rs. " + subtotal.toLocaleString();

  if (delivery === 0) {
    $("pDelivery").innerText = "Free Shipping";
    $("pDelivery").style.color = "#FFB7C5";
    $("pDelivery").style.fontWeight = "bold";
  } else {
    $("pDelivery").innerText = "Rs. " + delivery.toLocaleString();

    $("pDelivery").style.color = "#555";
    $("pDelivery").style.fontWeight = "normal";
  }

  $("pTotal").innerText = "Rs. " + total.toLocaleString();
}

/* ---------------------------
   Live Preview
--------------------------- */

function updatePreview() {
  $("pCustomerName").innerText = $("customerName").value || "Customer Name";

  $("pOrderNumber").innerText = $("orderNumber").value || "DAYYHU-000";

  $("pOrderDate").innerText = $("orderDate").value || "";

  $("pTracking").innerText = $("trackingNumber").value || "";

  $("pAddress").innerText = $("shippingAddress").value || "";

  const payment = document.querySelector('input[name="payment"]:checked');

  $("pPayment").innerText =
    payment.value === "Prepaid" ? "💳 Prepaid" : "💵 Cash on Delivery";

  const names = document.querySelectorAll(".itemName");
  const originals = document.querySelectorAll(".itemOriginal");
  const discounted = document.querySelectorAll(".itemDiscounted");

  let html = "";

  console.log(names.length);
  console.log(names);

  for (let i = 0; i < names.length; i++) {
    const name = names[i].value.trim();

    const original = Number(originals[i].value) || 0;

    const sale = Number(discounted[i].value) || 0;

    if (name === "" && original === 0 && sale === 0) continue;

    html += `
        <tr>
            <td style="color:#555;padding-top:10px;">
                ${name}
            </td>

            <td align="right" style="color:#555;padding-top:10px;">
                <span style="text-decoration:line-through;color:#999;">
                    Rs. ${original.toLocaleString()}
                </span>
                <br>
                <strong style="color:#555;">
                    Rs. ${sale.toLocaleString()}
                </strong>
            </td>
        </tr>
    `;
  }

  $("pItems").innerHTML = html;
  console.log(html);

  console.log("updatePreview called");

  console.log($("customerName"));
  console.log($("orderNumber"));
  console.log($("orderDate"));
  console.log($("trackingNumber"));
  console.log($("shippingAddress"));
  console.log($("paymentMethod"));
}

/* ===========================
   Copy HTML
=========================== */

$("copyHTML").addEventListener("click", () => {
  const html = $("emailPreview").innerHTML;

  navigator.clipboard.writeText(html);

  alert("HTML copied to clipboard.");
});

/* ===========================
   Copy for Gmail
=========================== */

$("copyGmail").addEventListener("click", async () => {
  const preview = $("emailPreview");

  try {
    // Modern rich clipboard
    if (navigator.clipboard && window.ClipboardItem) {
      const htmlBlob = new Blob([preview.innerHTML], { type: "text/html" });

      const textBlob = new Blob([preview.innerText], { type: "text/plain" });

      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": htmlBlob,
          "text/plain": textBlob,
        }),
      ]);

      alert("Email copied. Paste into Gmail.");
      return;
    }
  } catch (e) {
    console.log("Clipboard API failed:", e);
  }

  // Mobile fallback
  const range = document.createRange();
  range.selectNodeContents(preview);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  document.execCommand("copy");

  selection.removeAllRanges();

  alert("Email copied. Paste into Gmail.");
});

/* ===========================
   Download HTML
=========================== */

$("downloadHTML").addEventListener("click", () => {
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Order Confirmation</title>
</head>
<body style="margin:0;">
${$("emailPreview").innerHTML}
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = $("orderNumber").value + ".html";

  a.click();

  URL.revokeObjectURL(url);
});

/* ===========================
   Save Order
=========================== */

$("saveOrder").addEventListener("click", () => {
  const order = {
    customerName: $("customerName").value,

    orderNumber: $("orderNumber").value,

    orderDate: $("orderDate").value,

    originalTotal: $("originalTotal").value,

    discount: $("discount").value,

    subtotal: $("subtotal").value,

    delivery: $("delivery").value,

    total: $("totalAmount").value,

    trackingNumber: $("trackingNumber").value,

    trackingLink: $("trackingLink").value,

    shippingAddress: $("shippingAddress").value,

    payment: document.querySelector("input[name='payment']:checked").value,
  };

  const blob = new Blob([JSON.stringify(order, null, 4)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = order.orderNumber + ".json";

  a.click();

  URL.revokeObjectURL(url);

  /* Increment Order Number */

  let current = parseInt(order.orderNumber.replace("DAYYHU-", ""));

  current++;

  localStorage.setItem("lastOrder", current);
});

/* ===========================
   Load Order
=========================== */

$("loadOrder").addEventListener("click", () => {
  const input = document.createElement("input");

  input.type = "file";

  input.accept = ".json";

  input.onchange = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      const order = JSON.parse(reader.result);

      $("customerName").value = order.customerName;

      $("orderNumber").value = order.orderNumber;

      $("orderDate").value = order.orderDate;

      $("originalTotal").value = order.originalTotal;

      $("discount").value = order.discount;

      $("subtotal").value = order.subtotal;

      $("delivery").value = order.delivery;

      $("totalAmount").value = order.total;

      $("trackingNumber").value = order.trackingNumber;

      $("trackingLink").value = order.trackingLink;

      $("shippingAddress").value = order.shippingAddress;

      document.querySelector(
        `input[name='payment'][value='${order.payment}']`,
      ).checked = true;

      calculateTotals();

      updatePreview();
    };

    reader.readAsText(file);
  };

  input.click();
});

/* ===========================
   Reset
=========================== */

$("resetForm").addEventListener("click", () => {
  if (!confirm("Reset this order?")) return;

  document
    .querySelectorAll("input[type='text'], input[type='number'], textarea")
    .forEach((i) => {
      if (i.id === "orderNumber") return;

      if (i.id === "trackingLink") return;

      i.value = "";
    });

  $("discount").value = 0;

  $("delivery").value = 399;

  $("originalTotal").value = "";

  const today = new Date().toISOString().split("T")[0];

  $("orderDate").value = today;

  document.querySelector("input[value='Cash on Delivery']").checked = true;

  calculateTotals();

  generateTracking();

  updatePreview();
});

/* ===========================
   Auto Save
=========================== */

const fields = [
  "customerName",
  "orderNumber",
  "orderDate",
  "originalTotal",
  "discount",
  "subtotal",
  "delivery",
  "totalAmount",
  "trackingNumber",
  "trackingLink",
  "shippingAddress",
];

function saveDraft() {
  const draft = {};

  fields.forEach((id) => {
    draft[id] = $(id).value;
  });

  draft.payment = document.querySelector("input[name='payment']:checked").value;

  localStorage.setItem("dayyhuDraft", JSON.stringify(draft));
}

/* ===========================
   Restore Draft
=========================== */

function loadDraft() {
  const draft = localStorage.getItem("dayyhuDraft");

  if (!draft) return;

  const data = JSON.parse(draft);

  fields.forEach((id) => {
    if (data[id] !== undefined) {
      $(id).value = data[id];
    }
  });

  document
    .querySelector(`input[name='payment'][value='${data.payment}']`)
    ?.click();

  calculateTotals();

  generateTracking();

  updatePreview();
}

loadDraft();

setInterval(saveDraft, 1000);

/* ===========================
   Next Order Number
=========================== */

function generateNextOrder() {
  let last = Number(localStorage.getItem("lastOrder")) || 1;

  $("orderNumber").value = "DAYYHU-" + String(last).padStart(5, "0");
}

generateNextOrder();

$("saveOrder").addEventListener("click", () => {
  let last = Number(localStorage.getItem("lastOrder")) || 1;

  last++;

  localStorage.setItem("lastOrder", last);

  generateNextOrder();
});

/* ===========================
   Ctrl + S
=========================== */

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();

    $("downloadHTML").click();
  }
});

/* ===========================
   Live Preview
=========================== */

setInterval(() => {
  calculateTotals();

  updatePreview();
}, 500);

/* ===========================
   Clear Draft after Save
=========================== */

$("saveOrder").addEventListener("click", () => {
  localStorage.removeItem("dayyhuDraft");
});
