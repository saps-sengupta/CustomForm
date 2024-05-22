import React, { useState, useEffect } from "react";
import "./CustomForm.css";
import { toast } from "react-toastify";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FormControl, InputLabel, MenuItem } from "@mui/material";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-20%, -20%)',
    width: 200,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const CustomerPreferred = {
    CarrierName: {
        label: "Carrier Name",
        type: "text",
        formName: "CustomerPreferredObj",

        required: true,
    },
    ContactName: {
        label: "Contact Name",
        type: "text",
        formName: "CustomerPreferredObj",

        required: true,
    },
    Name: {
        label: "Name",
        type: "text",
        formName: "CustomerPreferredObj",

        required: true,
    },
    ContactPhone: {
        label: "Contact Phone",
        type: "text",
        formName: "CustomerPreferredObj",

        required: true,
    },
    Address1: {
        label: "Address 1",
        type: "text",
        formName: "CustomerPreferredObj",

        required: true,
    },
    Address2: {
        label: "Address 2",
        type: "text",
        formName: "CustomerPreferredObj",

        required: false,
    },
    State: {
        label: "State",
        type: "dropdown",
        formName: "CustomerPreferredObj",
        required: true,

        fieldOptions: ["New York", "California", "Texas"],
    },
    City: {
        label: "City",
        type: "text",
        formName: "CustomerPreferredObj",

        required: true,
    },
    Zip: {
        label: "Zip",
        type: "text",
        formName: "CustomerPreferredObj",

        required: true,
    },
    Country: {
        label: "Country",
        type: "dropdown",
        formName: "CustomerPreferredObj",
        required: true,

        fieldOptions: ["United States"],
    },
};

const WillCall = {
    ContactName: {
        lable: "Contact Name",
        type: "text",
        formName: "WillCallObj",

        required: true,
    },
    ContactEmail: {
        lable: "Contact Email",
        type: "email",
        formName: "WillCallObj",

        required: true,
    },
    ContactPhone: {
        lable: "Contact Phone",
        type: "text",
        formName: "WillCallObj",

        required: true,
    },
};

const UPS = {
    Ground: {
        label: "Ground",
        type: "radio",
        formName: "UPSObj",
    },
    "2nd Day Air": {
        label: "2nd Day Air",
        type: "radio",
        formName: "UPSObj",
    },
    "2nd Day Air AM": {
        label: "2nd Day Air AM",
        type: "radio",
        formName: "UPSObj",
    },
    "3 Day Select": {
        label: "3 Day Select",
        type: "radio",
        formName: "UPSObj",
    },
    "Next Day Air": {
        label: "Next Day Air",
        type: "radio",
        formName: "UPSObj",
    },
    "Next Day Air AM": {
        label: "Next Day Air AM",
        type: "radio",
        formName: "UPSObj",
    },
    "Next Day Air Saver": {
        label: "Next Day Air Saver",
        type: "radio",
        formName: "UPSObj",
    },
};

const FedEx = {
    Ground: {
        label: "Ground",
        type: "radio",
        formName: "FedExObj",
    },
    "1DayFreight": {
        label: "1 Day Freight",
        type: "radio",
        formName: "FedExObj",
    },
    "2Day": {
        label: "2 Day",
        type: "radio",
        formName: "FedExObj",
    },
    "2DayFreight": {
        label: "2 Day Freight",
        type: "radio",
        formName: "FedExObj",
    },
    "3DayFreight": {
        label: "3 Day Freight",
        type: "radio",
        formName: "FedExObj",
    },
    ExpressSaver: {
        label: "Express Saver",
        type: "radio",
        formName: "FedExObj",
    },
    FirstOvernight: {
        label: "First Overnight",
        type: "radio",
        formName: "FedExObj",
    },
    GroundHomeDelivery: {
        label: "Ground Home Delivery",
        type: "radio",
        formName: "FedExObj",
    },
    PriorityOvernight: {
        label: "Priority Overnight",
        type: "radio",
        formName: "FedExObj",
    },
    StandardOvernight: {
        label: "Standard Overnight",
        type: "radio",
        formName: "FedExObj",
    },
};

let cartId;
let extensionService;
let payload = {};
let metafields;
let shouldRender = true;

const ExtensionCommandType = {
    ReloadCheckout: "EXTENSION:RELOAD_CHECKOUT",
    ShowLoadingIndicator: "EXTENSION:SHOW_LOADING_INDICATOR",
    SetIframeStyle: "EXTENSION:SET_IFRAME_STYLE",
};

async function sendMessage() {
    window.top.postMessage(
        "hide-checkout-shipping-continue",
        "https://vivacommerce-sb-v2-b8.mybigcommerce.com"
    );
}

const CustomForm = () => {
    // console.log('this is metafields after re-render: ',metafields);
    const [formData, setFormData] = useState({});
    const [flagForRender, setflagForRender] = useState(true); // Default to true

    const [flag, setFlag] = useState(false);

    const [specialInstructions, setSpecialInstructions] = useState("");
    const [accountNumber, setAccountNumber] = useState();
    //console.log('trying to assign to usestate: ', metafields?.whoPaysShippping);
    const initialwhoPaysShippping = metafields?.whoPaysShippping;
    // console.log('initialwhoPaysShippping: ', initialwhoPaysShippping);
    const [whoPaysShippping, setWhoPaysShipping] = useState(
        "Sellars Pays Freight"
    );

    useEffect(() => {
        if (initialwhoPaysShippping) {
            setWhoPaysShipping(initialwhoPaysShippping);
        }
    }, [initialwhoPaysShippping]);

    const initialuseFedExAccount = metafields?.useFedExAccount;
    const initialAccountNumber = metafields?.AccountNumber;

    useEffect(() => {
        if (initialuseFedExAccount === "Yes") {
            setIsUsingFedExAccount("Yes");
        }
    }, [initialuseFedExAccount]);

    useEffect(() => {
        if (initialAccountNumber) {
            setAccountNumber(initialAccountNumber);
        }
    }, [initialAccountNumber]);

    const [isDisplayingAccountNumber, setIsDisplayingAccountNumber] =
        useState("FedEx");
    const [isUsingFedExAccount, setIsUsingFedExAccount] = useState("No");

    const [FormFields, setFormFields] = useState(FedEx);

    const initialShipper = metafields?.shipper;
    const [selectedShipper, setSelectedShipper] = useState("FedEx");
    const [sellarsShipper, setSellarsShipper] = useState("Prepaid Truckload");

    function formDataUpdate(initialwhoPaysShippping, initialShipper) {
        if (initialwhoPaysShippping === "Sellars Pays Freight") {
        } else {
            const formData = metafields?.formData;

            if (formData) {
                if (initialShipper === "FedEx") {
                    setFedExObj(formData);
                } else if (initialShipper === "UPS") {
                    setUPSObj(formData);
                } else if (initialShipper === "Customer Preferred Carrier") {
                    setCustomerPreferredObj((prevState) => {
                        let newObj = {};
                        for (let key in formData) {
                            if (key in prevState) {
                                newObj[key] = formData[key];
                            }
                        }

                        return newObj;
                    });
                } else if (initialShipper === "Will Call") {
                    setWillCallObj((prevState) => {
                        let newObj = {};
                        for (let key in formData) {
                            if (key in prevState) {
                                newObj[key] = formData[key];
                            }
                        }

                        return newObj;
                    });
                }
            }
        }
    }

    useEffect(() => {
        //console.log(initialShipper,'asd');
        if (!initialShipper) return;
        // console.log(initialwhoPaysShippping,'in effec');
        if (initialwhoPaysShippping === "Sellars Pays Freight") {
            setSellarsShipper(initialShipper);
        } else {
            setSelectedShipper(initialShipper);
            formDataUpdate(initialwhoPaysShippping, initialShipper);
            if (initialShipper === "UPS") {
                setFormFields(UPS);
                setIsDisplayingAccountNumber("UPS");
            } else if (initialShipper === "Will Call") {
                setFormFields(WillCall);
                setIsDisplayingAccountNumber("WillCall");
            } else if (initialShipper === "FedEx") {
                setFormFields(FedEx);
                setIsDisplayingAccountNumber("FedEx");
            } else if (initialShipper === "Customer Preferred Carrier") {
                setFormFields(CustomerPreferred);
                setIsDisplayingAccountNumber("Customer Preferred Carrier");
            }
            //  console.log('dhekc sgipperL ',initialShipper);
        }
    }, [initialShipper]);

    const [checkoutid, setCheckoutid] = useState(0);

    const [customerPreferredObj, setCustomerPreferredObj] = useState({
        CarrierName: "",
        ContactName: "",
        Name: "",
        ContactPhone: "",
        Address1: "",
        Address2: "",
        State: "",
        City: "",
        Zip: "",
        Country: "",
    });

    const [WillCallObj, setWillCallObj] = useState({
        ContactName: "",
        ContactPhone: "",
        ContactEmail: "",
    });

    const [FedExObj, setFedExObj] = useState("Ground");
    const [UPSObj, setUPSObj] = useState("Ground");

    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setWhoPaysShipping("Sellars Pays Freight");
        setOpen(false);
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

    async function consignmentUpdateTriggered(extensionService, cartId, data) {
        //console.log("consignments changed", data);

        try {
            await UpdateCartPrice(cartId);
        } catch (e) {
            toast.error("update cart Price failed, Try again");
            console.log("Error in requestCartPriceUpdate");
        }

        //sleep for 3 seconds
        await sleep(1000);
    }

    function compareConsignments(consignments, previousConsignments) {
        let changed = false;
        consignments.forEach((consignment) => {
            const {
                id,
                shippingAddress: { country, stateOrProvinceCode },
            } = consignment;
            //const shippingOptionId = consignment?.selectedShippingOption?.id;

            if (previousConsignments.length === 0) {
                changed = true;
            } else {
                const prevConsignment = previousConsignments.find(
                    (prev) => prev.id === id
                );
                const previousCountry = prevConsignment.shippingAddress.country;
                const previousStateOrProvinceCode =
                    prevConsignment.shippingAddress.stateOrProvinceCode;
                //  const previousShippingOptionId = prevConsignment?.selectedShippingOption?.id;

                if (country !== previousCountry) {
                    //console.log(    `️🔄 Consignment #${id} shipping country change: ${previousCountry} -> ${country}.` );
                    changed = true;
                }
                if (stateOrProvinceCode !== previousStateOrProvinceCode) {
                    // console.log( `️🔄 Consignment #${id} shipping state change: ${previousStateOrProvinceCode} -> ${stateOrProvinceCode}.` );
                    changed = true;
                }
                // if (shippingOptionId !== previousShippingOptionId) {
                //   console.log(`️🔄 Consignment #${id} shipping option change: ${previousShippingOptionId} -> ${shippingOptionId}.`);
                //   changed = true;
                // }
            }
        });
        return changed;
    }

    const handleShippingChange = async (event) => {
        // console.log(event.target.value);
        if(event.target.value === "Customer Pays Freight")
            setOpen(true);
        else
            setOpen(false);

        setWhoPaysShipping(event.target.value);

        extensionService.post({
            type: ExtensionCommandType.ShowLoadingIndicator,
            payload: { show: true },
        });
        //post message to parent window - hide continue button
        window.top.postMessage(
            "hide-checkout-shipping-continue",
            "https://vivacommerce-sb-v2-b8.mybigcommerce.com"
        );

        //call azure function to update the product prices
        try {
            await UpdateCartPrice(cartId, event.target.value);
            extensionService.post({
                type: ExtensionCommandType.ReloadCheckout,
            });
        } catch (e) {
            toast.error("Error in updating the cart price, Try again!");
            console.log("Error in UpdateCartPrice", e);
        }

        await sleep(1000);
        hideLoadingIndicator();
        window.top.postMessage(
            "hide-checkout-shipping-continue",
            "https://vivacommerce-sb-v2-b8.mybigcommerce.com"
        );
        //  console.log(" reload checkout with updated price.");

        // window.top.postMessage(
        //   "show-checkout-shipping-continue",
        //   "https://vivacommerce-sb-v2-b8.mybigcommerce.com"
        // );
    };

    const handleSellersShipperChange = (e) => {
        setSellarsShipper(e.target.value);
        //sendMessage();
    };

    function handleWillCallChange(e) {
        setWillCallObj((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    }

    function handleFedExChange(e) {
        // console.log(e.target.value);
        setFedExObj(e.target.value);
    }

    function handleUPSChange(e) {
        setUPSObj(e.target.value);
    }

    function handleCustomerPreferredChange(e) {
        setCustomerPreferredObj((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    }

    const handleShipperChange = (event) => {
        const Shipper = event.target.value;
        // console.log("shipper to use: ", event.target.value);
        setSelectedShipper(Shipper);
        window.top.postMessage(
            "hide-checkout-shipping-continue",
            "https://vivacommerce-sb-v2-b8.mybigcommerce.com"
        );
        if (Shipper === "UPS") {
            setFormFields(UPS);
            setIsDisplayingAccountNumber("UPS");
        } else if (Shipper === "Will Call") {
            setFormFields(WillCall);
            setIsDisplayingAccountNumber("WillCall");
        } else if (Shipper === "FedEx") {
            setFormFields(FedEx);
            setIsDisplayingAccountNumber("FedEx");
        } else if (Shipper === "Customer Preferred Carrier") {
            setFormFields(CustomerPreferred);
            setIsDisplayingAccountNumber("Customer Preferred Carrier");
        }
        // sendMessage();
    };

    const renderFormField = (fieldName, fieldType, formName, fieldOptions) => {
        if (fieldType.type === "text") {
            return (
                <>
                    <TextField
                        fullWidth
                        label={fieldName}
                        variant="outlined"
                        name={fieldName}
                        required={fieldType.required}
                        value={
                            formName === "WillCallObj"
                                ? WillCallObj[fieldName]
                                : customerPreferredObj[fieldName]
                        }
                        onChange={(e) => {
                            if (formName === "FedExObj") {
                                handleFedExChange(e);
                            } else if (formName === "WillCallObj") {
                                handleWillCallChange(e);
                            } else if (formName === "UPSObj") {
                                handleUPSChange(e);
                            } else if (formName === "CustomerPreferredObj") {
                                handleCustomerPreferredChange(e);
                            }
                        }}
                    />
                </>
            );
        } else if (fieldType.type === "dropdown") {
            return (
                <FormControl fullWidth>
                    <InputLabel>Select a {fieldName}</InputLabel>
                    <Select
                        style={{ marginBottom: "20px" }}
                        name={fieldName}
                        value={
                            formName === "WillCallObj"
                                ? WillCallObj[fieldName]
                                : customerPreferredObj[fieldName]
                        }
                        label={`Select a ${fieldName}`}
                        required={fieldType.required}
                        onChange={(e) => {
                            if (formName === "FedExObj") {
                                handleFedExChange(e);
                            } else if (formName === "WillCallObj") {
                                handleWillCallChange(e);
                            } else if (formName === "UPSObj") {
                                handleUPSChange(e);
                            } else if (formName === "CustomerPreferredObj") {
                                handleCustomerPreferredChange(e);
                            }
                        }}
                    >
                        {fieldOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
        } else if (fieldType.type === "radio") {
            return (
                <div>
                    <FormControlLabel
                        name={fieldName}
                        value={fieldType.label}
                        control={<Radio />}
                        label={fieldType.label}
                        checked={
                            formName === "FedExObj"
                                ? FedExObj === fieldType.label
                                : UPSObj === fieldType.label
                        }
                        onChange={(e) => {
                            if (formName === "FedExObj") {
                                handleFedExChange(e);
                            } else if (formName === "UPSObj") {
                                handleUPSChange(e);
                            }
                        }}
                    />
                </div>
            );
        } else if (fieldType.type === "email") {
            return (
                <>
                    <TextField
                        fullWidth
                        variant="outlined"
                        id={fieldName}
                        type="email"
                        label={fieldName}
                        name={fieldName}
                        value={
                            formName === "WillCallObj"
                                ? WillCallObj[fieldName]
                                : customerPreferredObj[fieldName]
                        }
                        onChange={(e) => {
                            if (formName === "FedExObj") {
                                handleFedExChange(e);
                            } else if (formName === "WillCallObj") {
                                handleWillCallChange(e);
                            } else if (formName === "UPSObj") {
                                handleUPSChange(e);
                            } else if (formName === "CustomerPreferredObj") {
                                handleCustomerPreferredChange(e);
                            }
                        }}
                    />
                </>
            );
        }
    };

    const handleFedExAccountChange = (e) => {
        setIsUsingFedExAccount(e.target.value);
    };

    async function UpdateCartPrice(cartId, whoPaysFreightLocal) {
        let raw;
        //here fucntions second atturibute's name is similar to usestate varible so kindly do not get confused with 2nd parameter of function with state variable as both are different
        //  console.log('inside updateCartItems ..........');
        if (whoPaysFreightLocal) {
            if (whoPaysFreightLocal === "Customer Pays Freight") {
                if (
                    !payload?.shipper ||
                    payload.shipper === "Prepaid Truckload" ||
                    payload.shipper === "Prepaid LTL"
                ) {
                    payload.shipper = "FedEx";
                    payload.useFedExAccount = "No";
                    payload.specialInstructions = specialInstructions;
                    payload.formData = FedExObj;
                    payload.whoPaysShippping = "Customer Pays Freight";
                }
            } else {
                if (
                    !payload?.shipper ||
                    payload.shipper === "FedEx" ||
                    payload.shipper === "UPS" ||
                    payload.shipper === "Customer Preferred Carrier" ||
                    payload.shipper === "Will Call"
                ) {
                    payload = {};
                    // console.log('in');
                    payload.shipper = "Prepaid Truckload";
                    payload.specialInstructions = specialInstructions;
                    payload.whoPaysShippping = "Sellars Pays Freight";
                }
            }
            raw = JSON.stringify({
                checkoutId: cartId,
                whoPaysShipping:
                    whoPaysFreightLocal === "Customer Pays Freight"
                        ? "Customer Pays Freight"
                        : "Sellars Pays Freight",
                metafields: payload,
            });
        } else {
            if (whoPaysShippping === "Customer Pays Freight") {
                if (
                    !payload?.shipper ||
                    payload.shipper === "Prepaid Truckload" ||
                    payload.shipper === "Prepaid LTL"
                ) {
                    payload.shipper = "FedEx";
                    payload.useFedExAccount = "No";
                    payload.specialInstructions = specialInstructions;
                    payload.formData = FedExObj;
                    payload.whoPaysShippping = "Customer Pays Freight";
                }
            } else {
                if (
                    !payload?.shipper ||
                    payload.shipper === "FedEx" ||
                    payload.shipper === "UPS" ||
                    payload.shipper === "Customer Preferred Carrier" ||
                    payload.shipper === "Will Call"
                ) {
                    payload = {};
                    payload.shipper = "Prepaid Truckload";
                    payload.specialInstructions = specialInstructions;
                    payload.whoPaysShippping = "Sellars Pays Freight";
                }
            }
            raw = JSON.stringify({
                checkoutId: cartId,
                whoPaysShipping:
                    whoPaysShippping === "Customer Pays Freight"
                        ? "Customer Pays Freight"
                        : "Sellars Pays Freight",
                metafields: payload,
            });
        }

        // console.log( "inside UpdateCartPrice & this is the current checkoutid: ", checkoutid);

        const myHeaders = new Headers();

        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Access-Control-Allow-Origin", "*");

        try {
            //customerJWT();
            //https://sam-bc-sandbox.azurewebsites.net/api/updateproductprices
            // const res = await fetch(`https://5000/updateproductprices`, {
            //   method: "POST",
            //   headers: myHeaders,
            //   body: raw,
            //   redirect: "follow",
            // });


            // if (!res.ok) {
            //   throw new Error(`HTTP error! Status: ${res.status}`);
            // }

            //const data = await res.json();
            return { success: true };
            // console.log("updated cart prices and metafield data returned: ", data);
        } catch (error) {
            // Handle any errors that occur during the fetch or JSON parsing
            toast.error("Error in updating the cart Price, Try again!");
            window.top.postMessage(
                "hide-checkout-shipping-continue",
                "https://vivacommerce-sb-v2-b8.mybigcommerce.com"
            );
            console.error("Error updating cart prices:", error);
            return { success: false };
            // You may want to notify the user or take other appropriate actions here
        }
    }

    const handleModalSubmit = () => {
        setOpen(false);
        console.log(accountNumber+" "+selectedShipper);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (whoPaysShippping === "Sellars Pays Freight") {
            payload = {
                whoPaysShippping,
                shipper: sellarsShipper,
                specialInstructions,
            };
        } else if (whoPaysShippping === "Customer Pays Freight") {
            if (selectedShipper === "FedEx") {
                payload = {
                    whoPaysShippping,
                    shipper: selectedShipper,
                    useFedExAccount: isUsingFedExAccount,
                    specialInstructions,
                    formData: FedExObj,
                };
                if (isUsingFedExAccount === "Yes") {
                    payload.AccountNumber = accountNumber;
                }
            } else if (selectedShipper === "Customer Preferred Carrier") {
                payload = {
                    whoPaysShippping,
                    shipper: selectedShipper,
                    AccountNumber: accountNumber,
                    formData: customerPreferredObj,
                    specialInstructions,
                };
            } else if (selectedShipper === "UPS") {
                payload = {
                    whoPaysShippping,
                    shipper: selectedShipper,
                    AccountNumber: accountNumber,
                    formData: UPSObj,
                    specialInstructions,
                };
            } else if (selectedShipper === "Will Call") {
                payload = {
                    whoPaysShippping,
                    shipper: selectedShipper,
                    formData: WillCallObj,
                    specialInstructions,
                };
            }
        }
        // console.log(payload);
        showLoadingIndicator();
        //post message to parent window - hide continue button
        window.top.postMessage(
            "hide-checkout-shipping-continue",
            "https://vivacommerce-sb-v2-b8.mybigcommerce.com"
        );
        try {
            const result = await UpdateCartPrice(cartId);
            if (result.success) {
                extensionService.post({
                    type: ExtensionCommandType.ReloadCheckout,
                });
                window.top.postMessage(
                    "show-checkout-shipping-continue",
                    "https://vivacommerce-sb-v2-b8.mybigcommerce.com"
                );
            } else {
                //console.error('Failed to update cart price:');
                window.top.postMessage(
                    "hide-checkout-shipping-continue",
                    "https://vivacommerce-sb-v2-b8.mybigcommerce.com"
                );
            }
        } catch (e) {
            window.top.postMessage(
                "hide-checkout-shipping-continue",
                "https://vivacommerce-sb-v2-b8.mybigcommerce.com"
            );
            toast.error("UpdateCartPrice failed, Pls try later!");
            console.log("UpdateCartPrice failed", e);
        }

        await sleep(1000);
        hideLoadingIndicator();
        //console.log(" reload checkout with updated price.");

        // window.top.postMessage(
        //   "show-checkout-shipping-continue",
        //   "https://vivacommerce-sb-v2-b8.mybigcommerce.com"
        // );
    };

    useEffect(() => {
        checkoutKitLoader.load("extension").then(async function (module) {
            // console.log("Checkout loader - extension");
            const params = new URL(document.location).searchParams;

            // console.log("params: ", params);

            const extensionId = params.get("extensionId");
            // console.log("this is exctention id: ", extensionId);

            const parentOrigin = params.get("parentOrigin");

            cartId = params.get("cartId");
            let raw2 = JSON.stringify({
                cartId: cartId,
            });
            let referrer = document.referrer;
            //remove last trailing slash form referrer - https://vivacommerce-sb-v2-b8.mybigcommerce.com/
            referrer = referrer.slice(0, -1);
            // console.log("this is referrer: ", referrer);

            //parentOrigin: https://vivacommerce-sb-v2-b8.mybigcommerce.com
            //console.log("this is parentOrigin: ", parentOrigin);

            if (referrer !== parentOrigin) {
                shouldRender = false;
                setflagForRender(false);
                //alert("Access Denied");
                return;
            }
            //https://sellarspro.com
            // if(referrer!== 'https://vivacommerce-sb-v2-b8.mybigcommerce.com' || parentOrigin!=='https://vivacommerce-sb-v2-b8.mybigcommerce.com'){
            //   shouldRender = false;
            //   setflagForRender(false);
            //   //alert("Access Denied");
            //   return;
            // }

            async function fetchData() {
                let myHeaders2 = new Headers();

                myHeaders2.append("Content-Type", "application/json");
                myHeaders2.append("Access-Control-Allow-Origin", "*");
                try {
                    //https://sam-bc-sandbox.azurewebsites.net/api/getCartMetaFields
                    const response = await fetch(`https://5000/updateproductprices`, {
                        method: "POST",
                        headers: myHeaders2,
                        body: raw2,
                        redirect: "follow",
                    });
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }

                    const data = await response.json();
                    //  console.log(data); // Process the data received from the API
                    if (data?.success === true && data?.data?.data[0]?.value) {
                        let meta1 = JSON.parse(data?.data?.data[0]?.value);
                        metafields = meta1?.metafields;
                    }

                    // console.log('this is metafields from react:',metafields);
                    setFlag((prev) => !prev);
                } catch (error) {
                    //dnt do anything as it is getcart, dnt show error to users
                    console.error("There was a problem with the fetch operation:", error);
                }
            }

            // Call the function to fetch the data
            fetchData();

            //console.log("this is card id: ", cartId);
            setCheckoutid(cartId);

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
                    //console.log("inside consignments chnaged listener");
                    showLoadingIndicator();

                    //console.log(data?.payload?.consignments,data?.payload?.previousConsignments);

                    //post message to parent window - hide continue button
                    window.top.postMessage(
                        "hide-checkout-shipping-continue",
                        "https://vivacommerce-sb-v2-b8.mybigcommerce.com"
                    );

                    const priceUpdateNeeded = compareConsignments(
                        data?.payload?.consignments,
                        data?.payload?.previousConsignments
                    );
                    if (priceUpdateNeeded) {
                        // console.log("Consignment updated, need to trigger price update.");
                        //toast.info('Consignment updated, need to trigger price update');
                        consignmentUpdateTriggered(extensionService, cartId, data);
                        //console.log("reload checkout with updated price.");
                        extensionService.post({
                            type: ExtensionCommandType.ReloadCheckout,
                        });
                    } else {
                        //console.log("Key Consignment fields(country, state, shipping option) not updated, no need to trigger price update.");
                    }
                    await sleep(1000);
                    hideLoadingIndicator();
                    // window.top.postMessage(
                    //   "show-checkout-shipping-continue",
                    //   "https://vivacommerce-sb-v2-b8.mybigcommerce.com"
                    // );
                    window.top.postMessage(
                        "hide-checkout-shipping-continue",
                        "https://vivacommerce-sb-v2-b8.mybigcommerce.com"
                    );
                }
            );
        });

        //hide checkout at initial load
        window.top.postMessage(
            "hide-checkout-shipping-continue",
            "https://vivacommerce-sb-v2-b8.mybigcommerce.com"
        );

        // Cleanup function
        return () => {
            // Cleanup code if necessary
        };
    }, []);

    return (
        <>
            {shouldRender === false ? (
                <div className="error-container">
                    <p className="error-message">Access Denied</p>
                </div>
            ) : (
                <div id="container">
                    <div>
                        <form fullWidth onSubmit={handleSubmit}>
                            <div>
                                <div style={{ marginBottom: "5px" }}>Who Pays Shipping</div>
                                <Select
                                    fullWidth
                                    required
                                    style={{ marginBottom: "10px" }}
                                    value={whoPaysShippping}
                                    onChange={handleShippingChange}
                                    data-testid="whoPaysShipping"
                                >
                                    <MenuItem value="Sellars Pays Freight">
                                        Sellars Pays Freight
                                    </MenuItem>
                                    <MenuItem value="Customer Pays Freight">
                                        Customer Pays Freight
                                    </MenuItem>
                                </Select>
                            </div>

                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style}>
                                    <div>
                                        <div style={{ marginBottom: "5px" }}>Shipper To Use</div>
                                        <Select
                                            data-testid=""
                                            style={{ marginBottom: "20px" }}
                                            fullWidth
                                            value={selectedShipper}
                                            onChange={handleShipperChange}
                                        >
                                            <MenuItem value="FedEx">FedEx</MenuItem>
                                            {/* <MenuItem value="Customer Preferred Carrier">
                                        Customer Preferred Carrier
                                    </MenuItem> */}
                                            <MenuItem value="UPS">UPS</MenuItem>
                                            {/* <MenuItem value="Will Call">Will Call</MenuItem> */}
                                        </Select>
                                    </div>
                                    {/* {isDisplayingAccountNumber === "Customer Preferred Carrier" || */}
                                    {/* {isDisplayingAccountNumber === "UPS" ? ( */}
                                    <div style={{ marginBottom: "20px" }}>
                                        <TextField
                                            fullWidth
                                            label="Account Number"
                                            variant="outlined"
                                            required
                                            value={accountNumber}
                                            onChange={(e) => {
                                                setAccountNumber(e.target.value);
                                            }}
                                        />
                                    </div>
                                    {/* ) : null} */}
                                    {/* {isDisplayingAccountNumber === "FedEx" && (
                                <> */}
                                    {/* <div>
                                        <label htmlFor="useFedExAccount">
                                            Use My FedEx Account
                                        </label>
                                    </div>
                                    <div></div>
                                    <Select
                                        style={{ marginBottom: "20px" }}
                                        fullWidth
                                        value={isUsingFedExAccount}
                                        onChange={handleFedExAccountChange}
                                        name="useFedExAccount"
                                        id="useFedExAccount"
                                    >
                                        <MenuItem value="No">No</MenuItem>
                                        <MenuItem value="Yes">Yes</MenuItem>                                     
                                    </Select> */}
                                    {/* {isUsingFedExAccount === "Yes" && ( */}
                                    {/* <div style={{ marginBottom: "20px" }}>
                                        <TextField
                                            fullWidth
                                            label="Account Number"
                                            variant="outlined"
                                            required
                                            value={accountNumber}
                                            onChange={(e) => {
                                                setAccountNumber(e.target.value);
                                            }}
                                        />
                                    </div> */}
                                    {/* )} */}
                                    {/* </>
                            )} */}

                                    {/* <div></div>

                            <div>
                                <Grid container
                                    spacing={3}>
                                    {Object.entries(FormFields).map(([fieldName, fieldType]) => (
                                        <Grid item key={fieldName} fullWidth sm={6}>
                                            {renderFormField(
                                                fieldName,
                                                fieldType,
                                                fieldType?.formName,
                                                fieldType?.fieldOptions
                                            )}
                                        </Grid>
                                    ))}
                                </Grid>
                            </div> */}

                                    {/* <div>
                        <div style={{ marginTop: "10px" }}>
                            <label htmlFor="specialInstructions">Special Instructions</label>
                        </div>
                        <textarea
                            name="specialInstructions"
                            id="specialInstructions"
                            onChange={(e) => {
                                setSpecialInstructions(e.target.value);
                            }}
                            rows={4} // Set the number of visible text lines
                            cols={25} // Set the number of visible text columns
                        />
                    </div> */}
                                    <button
                                        id="checkout-submit"
                                        style={{
                                            backgroundColor: "black",
                                            color: "white",
                                            padding: "10px 30px",
                                            borderRadius: "5px",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                            marginTop: '15px'
                                        }}
                                        onClick={handleModalSubmit}
                                    >
                                        Submit Shipping Options
                                    </button>
                                </Box>
                            </Modal>

                            <button
                                id="checkout-submit"
                                style={{
                                    backgroundColor: "black",
                                    color: "white",
                                    padding: "10px 30px",
                                    borderRadius: "5px",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    marginTop: "15px",
                                }}
                                type="submit"
                            >
                                Submit Shipping Options
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default CustomForm;
