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

    if (!last)
        last = 1;

    $("orderNumber").value =
        "DAYYHU-" + String(last).padStart(4, "0");

    // Default Tracking

    generateTracking();

    // Initial Preview

    updatePreview();

}


/* ---------------------------
   Inputs
--------------------------- */

const inputs = document.querySelectorAll("input, textarea");

inputs.forEach(input => {

    input.addEventListener("input", () => {

        calculateTotals();

        updatePreview();

    });

});


document.querySelectorAll("input[name='payment']").forEach(radio => {

    radio.addEventListener("change", updatePreview);

});


/* ---------------------------
   Pricing
--------------------------- */

function calculateTotals(){

    let original =
        Number($("originalTotal").value) || 0;

    let discount =
        Number($("discount").value) || 0;

    let delivery =
        Number($("delivery").value) || 0;

    let subtotal =
        original - discount;

    let total =
        subtotal + delivery;

    $("subtotal").value = subtotal;

    $("totalAmount").value = total;

}


/* ---------------------------
   Tracking
--------------------------- */

function generateTracking(){

    let tracking =
        $("trackingNumber").value;

    $("trackingLink").value =
        "https://leopardsfulfillment.leopardscourier.com/Track/Index?Cn=" +
        tracking;

}


$("trackingNumber").addEventListener("input",()=>{

    generateTracking();

    updatePreview();

});


$("generateTracking").addEventListener("click",(e)=>{

    e.preventDefault();

    generateTracking();

});


/* ---------------------------
   Live Preview
--------------------------- */

function updatePreview(){

    $("pCustomerName").innerText =
        $("customerName").value || "Customer";

    $("pOrderNumber").innerText =
        $("orderNumber").value;

    $("pOrderDate").innerText =
        $("orderDate").value;

    $("pOriginal").innerText =
        "Rs. " + ($("originalTotal").value || 0);

    $("pDiscount").innerText =
        "- Rs. " + ($("discount").value || 0);

    $("pSubtotal").innerText =
        "Rs. " + ($("subtotal").value || 0);

    $("pDelivery").innerText =
        "Rs. " + ($("delivery").value || 0);

    $("pTotal").innerText =
        "Rs. " + ($("totalAmount").value || 0);

    $("pTracking").innerText =
        $("trackingNumber").value;

    $("pAddress").innerHTML =
        $("shippingAddress").value.replace(/\n/g,"<br>");

    $("pTrackingLink").href =
        $("trackingLink").value;

    const payment =
        document.querySelector("input[name='payment']:checked").value;

    if(payment==="Prepaid"){

        $("pPayment").innerHTML =
        "✅ Prepaid";

    }

    else{

        $("pPayment").innerHTML =
        "💵 Cash on Delivery";

    }

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

    const html = $("emailPreview").innerHTML;

    try{

        const blob = new Blob([html], {type:"text/html"});

        const data = [
            new ClipboardItem({
                "text/html": blob
            })
        ];

        await navigator.clipboard.write(data);

        alert("Email copied. Open Gmail and press Ctrl + V.");

    }

    catch(err){

        alert("Your browser doesn't support rich HTML clipboard. Use Chrome or Edge.");

    }

});


/* ===========================
   Download HTML
=========================== */

$("downloadHTML").addEventListener("click", () => {

    const html =
`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Order Confirmation</title>
</head>
<body style="margin:0;">
${$("emailPreview").innerHTML}
</body>
</html>`;

    const blob =
        new Blob([html],{type:"text/html"});

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        $("orderNumber").value + ".html";

    a.click();

    URL.revokeObjectURL(url);

});


/* ===========================
   Save Order
=========================== */

$("saveOrder").addEventListener("click",()=>{

    const order = {

        customerName:
            $("customerName").value,

        orderNumber:
            $("orderNumber").value,

        orderDate:
            $("orderDate").value,

        originalTotal:
            $("originalTotal").value,

        discount:
            $("discount").value,

        subtotal:
            $("subtotal").value,

        delivery:
            $("delivery").value,

        total:
            $("totalAmount").value,

        trackingNumber:
            $("trackingNumber").value,

        trackingLink:
            $("trackingLink").value,

        shippingAddress:
            $("shippingAddress").value,

        payment:
            document.querySelector("input[name='payment']:checked").value

    };

    const blob =
        new Blob(
            [JSON.stringify(order,null,4)],
            {type:"application/json"}
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        order.orderNumber + ".json";

    a.click();

    URL.revokeObjectURL(url);

    /* Increment Order Number */

    let current =
        parseInt(order.orderNumber.replace("DAYYHU-",""));

    current++;

    localStorage.setItem("lastOrder",current);

});


/* ===========================
   Load Order
=========================== */

$("loadOrder").addEventListener("click",()=>{

    const input =
        document.createElement("input");

    input.type="file";

    input.accept=".json";

    input.onchange = e=>{

        const file =
            e.target.files[0];

        const reader =
            new FileReader();

        reader.onload = ()=>{

            const order =
                JSON.parse(reader.result);

            $("customerName").value =
                order.customerName;

            $("orderNumber").value =
                order.orderNumber;

            $("orderDate").value =
                order.orderDate;

            $("originalTotal").value =
                order.originalTotal;

            $("discount").value =
                order.discount;

            $("subtotal").value =
                order.subtotal;

            $("delivery").value =
                order.delivery;

            $("totalAmount").value =
                order.total;

            $("trackingNumber").value =
                order.trackingNumber;

            $("trackingLink").value =
                order.trackingLink;

            $("shippingAddress").value =
                order.shippingAddress;

            document.querySelector(
                `input[name='payment'][value='${order.payment}']`
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

$("resetForm").addEventListener("click",()=>{

    if(!confirm("Reset this order?"))
        return;

    document.querySelectorAll("input[type='text'], input[type='number'], textarea")
    .forEach(i=>{

        if(i.id==="orderNumber")
            return;

        if(i.id==="trackingLink")
            return;

        i.value="";

    });

    $("discount").value=0;

    $("delivery").value=399;

    $("originalTotal").value="";

    const today =
        new Date().toISOString().split("T")[0];

    $("orderDate").value=today;

    document.querySelector("input[value='Cash on Delivery']").checked=true;

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
    "shippingAddress"
];

function saveDraft(){

    const draft = {};

    fields.forEach(id=>{
        draft[id] = $(id).value;
    });

    draft.payment =
        document.querySelector("input[name='payment']:checked").value;

    localStorage.setItem(
        "dayyhuDraft",
        JSON.stringify(draft)
    );

}


/* ===========================
   Restore Draft
=========================== */

function loadDraft(){

    const draft =
        localStorage.getItem("dayyhuDraft");

    if(!draft)
        return;

    const data =
        JSON.parse(draft);

    fields.forEach(id=>{

        if(data[id]!==undefined){

            $(id).value = data[id];

        }

    });

    document.querySelector(
        `input[name='payment'][value='${data.payment}']`
    )?.click();

    calculateTotals();

    generateTracking();

    updatePreview();

}

loadDraft();

setInterval(saveDraft,1000);


/* ===========================
   Next Order Number
=========================== */

function generateNextOrder(){

    let last =
        Number(localStorage.getItem("lastOrder")) || 1;

    $("orderNumber").value =
        "DAYYHU-" +
        String(last).padStart(5,"0");

}

generateNextOrder();

$("saveOrder").addEventListener("click",()=>{

    let last =
        Number(localStorage.getItem("lastOrder")) || 1;

    last++;

    localStorage.setItem(
        "lastOrder",
        last
    );

    generateNextOrder();

});


/* ===========================
   Ctrl + S
=========================== */

document.addEventListener("keydown",e=>{

    if(e.ctrlKey && e.key==="s"){

        e.preventDefault();

        $("downloadHTML").click();

    }

});


/* ===========================
   Live Preview
=========================== */

setInterval(()=>{

    calculateTotals();

    updatePreview();

},500);


/* ===========================
   Clear Draft after Save
=========================== */

$("saveOrder").addEventListener("click",()=>{

    localStorage.removeItem("dayyhuDraft");

});