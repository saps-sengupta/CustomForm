const ExtensionCommandType = {
    ReloadCheckout: "EXTENSION:RELOAD_CHECKOUT",
    ShowLoadingIndicator: "EXTENSION:SHOW_LOADING_INDICATOR",
    SetIframeStyle: "EXTENSION:SET_IFRAME_STYLE",
};

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function showLoadingIndicator() {
    extensionService.post({
        type: ExtensionCommandType.ShowLoadingIndicator,
        payload: { show: true },
    });
}

function hideLoadingIndicator() {
    extensionService.post({
        type: ExtensionCommandType.ShowLoadingIndicator,
        payload: { show: false },
    });
}

const checkoutKitLoader = {
    load: async function (extension) {
        return checkoutKitLoader.load(extension).then(async function (module) {
            // console.log("Checkout loader - extension");
            const params = new URL(document.location).searchParams;

            // console.log("params: ", params);

            const extensionId = params.get("extensionId");
            // console.log("this is exctention id: ", extensionId);
            cartId = params.get("cartId");

            async function fetchData() {
                try {
                    const response = await fetch(`http://localhost:3000/getCartMetafields/${cartId}`);

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    //  console.log(data); // Process the data received from the API
                    if (data?.data[0]?.value) {
                        metafields = JSON.parse(data?.data[0]?.value);
                    }

                    //  console.log('this is metafields',metafields);
                    setFlag(prev => !prev);
                } catch (error) {
                    console.error('There was a problem with the fetch operation:', error);
                }
            }

            // Call the function to fetch the data
            fetchData();



            //console.log("this is card id: ", cartId);
            setCheckoutid(cartId);

            const parentOrigin = params.get("parentOrigin");
            //  console.log("this is parentOrigin: ", parentOrigin);

            extensionService = await module.initializeExtensionService({
                extensionId,
                parentOrigin,
                taggedElementId: "container",
            });

            // console.log("extentionService: ", extensionService);

            extensionService.addListener(
                "EXTENSION:CONSIGNMENTS_CHANGED",
                async (data) => {
                    console.log("inside consignments chnaged listener");
                    showLoadingIndicator();

                    //console.log(data?.payload?.consignments,data?.payload?.previousConsignments);

                    //post message to parent window - hide continue button
                    window.top.postMessage(
                        "hide-checkout-shipping-continue",
                        "https://vivacommerce-b2b-demo-i9.mybigcommerce.com"
                    );



                    const priceUpdateNeeded = compareConsignments(
                        data?.payload?.consignments,
                        data?.payload?.previousConsignments
                    );
                    if (priceUpdateNeeded) {
                        console.log("Consignment updated, need to trigger price update.");
                        consignmentUpdateTriggered(extensionService, cartId, data);
                        console.log("reload checkout with updated price.");
                        extensionService.post({
                            type: ExtensionCommandType.ReloadCheckout,
                        });

                    } else {
                        console.log(
                            "Key Consignment fields(country, state, shipping option) not updated, no need to trigger price update."
                        );



                    }
                    await sleep(1000);
                    hideLoadingIndicator();
                    window.top.postMessage(
                        "show-checkout-shipping-continue",
                        "https://vivacommerce-b2b-demo-i9.mybigcommerce.com"
                    );

                }
            );
        });

    }
}

export default checkoutKitLoader;