
const checkoutIdLatest = "{{checkout.id}}";

async function updateCartPrice(metafieldsPrev) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    checkoutId: checkoutIdLatest,
    whoPaysShipping: "Sellars Pays Freight",
    metafields: metafieldsPrev !== undefined ? metafieldsPrev : { whoPaysShipping: "Sellars Pays Freight", shipper: "Prepaid Truckload" },
  });

  console.log(raw, "raw");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch("https://sam-bc-sandbox.azurewebsites.net/api/updateproductprices", requestOptions);
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error("Error updating cart price:", error);
  }
}

async function getMetafields() {
  const myHeaders2 = new Headers();
  myHeaders2.append("Content-Type", "application/json");

  const raw2 = JSON.stringify({ cartId: checkoutIdLatest });

  try {
    const response = await fetch("https://sam-bc-sandbox.azurewebsites.net/api/getCartMetaFields", {
      method: "POST",
      headers: myHeaders2,
      body: raw2,
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("from script manager", data);

    if (data?.success === true && data?.data?.data[0]?.value) {
      const meta1 = JSON.parse(data.data.data[0].value);
      const metafields = meta1.metafields;
      console.log("this is metafields from script manager API call: ", metafields);
      await updateCartPrice(metafields);
    } else {
      await updateCartPrice();
    }
  } catch (error) {
    await updateCartPrice();
    console.error("There was a problem with the fetch operation:", error);
  }
}

getMetafields();

