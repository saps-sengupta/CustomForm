import React from "react";
import { render, screen, within } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import CustomForm from "./CustomForm";
import CheckoutLoader from "./checkoutLoader";
import extensionServiceModule from "./extensionModule";

// jest.mock("./checkoutLoader");

jest.mock("./checkoutLoader", () => () => {
    return <mock-checkout data-testid="checkout"/>;
  });

jest.mock("./extensionModule", () => ({
    post: jest.fn(),
}));

describe(CustomForm, () => {
    it("WhoPaysShipping Dropdown and default ShippertoUse Dropdown is displayed", async () => {
        extensionServiceModule.post.mockResolvedValue("");
        render(<CustomForm />);
        expect(
            within(await screen.findByTestId("whoPaysShipping")).getByRole("combobox"),
        ).toBeInTheDocument();
        expect(
            within(await screen.findByTestId("shipperToUse1")).getByRole("combobox"),
        ).toBeInTheDocument();
        expect(screen.getByText("Special Instructions")).toBeInTheDocument();
    });
    it("WhoPaysShipping Dropdown options are visible", async () => {
        extensionServiceModule.post.mockResolvedValue("");
        render(<CustomForm />);
        const dropdown = within(await screen.findByTestId("whoPaysShipping")).getByRole("combobox");
        await userEvent.click(dropdown);
        expect(
            await screen.findByRole("option", { name: "Sellars Pays Freight" }),
        ).toBeInTheDocument();
        expect(
            await screen.findByRole("option", { name: "Customer Pays Freight" }),
        ).toBeInTheDocument();
    });
    it("WhoPaysShipping Dropdown should show selected value", async () => {
        extensionServiceModule.post.mockResolvedValue("");
        render(<CustomForm />);
        const dropdown = within(await screen.findByTestId("whoPaysShipping")).getByRole("combobox");
        await userEvent.click(dropdown);
        await userEvent.click(await screen.findByRole("option", { name: "Customer Pays Freight" }))
        expect(screen.getByText("Customer Pays Freight")).toBeInTheDocument();
        await userEvent.click(dropdown);
        await userEvent.click(await screen.findByRole("option", { name: "Sellars Pays Freight" }))
        expect(screen.getByText("Sellars Pays Freight")).toBeInTheDocument();
    });
    it("ShipperToUse Dropdown default options are visible when Sellars pays freight", async () => {
        extensionServiceModule.post.mockResolvedValue("");
        render(<CustomForm />);
        const dropdown = within(await screen.findByTestId("shipperToUse1")).getByRole("combobox");
        await userEvent.click(dropdown);
        expect(
            await screen.findByRole("option", { name: "Prepaid Truckload" }),
        ).toBeInTheDocument();
        expect(
            await screen.findByRole("option", { name: "Prepaid LTL" }),
        ).toBeInTheDocument();
    });
    it("ShipperToUse Dropdown should show selected value", async () => {
        extensionServiceModule.post.mockResolvedValue("");
        render(<CustomForm />);
        const dropdown = within(await screen.findByTestId("shipperToUse1")).getByRole("combobox");
        await userEvent.click(dropdown);
        await userEvent.click(await screen.findByRole("option", { name: "Prepaid LTL" }))
        expect(screen.getByText("Prepaid LTL")).toBeInTheDocument();    
        await userEvent.click(dropdown);
        await userEvent.click(await screen.findByRole("option", { name: "Prepaid Truckload" }))
        expect(screen.getByText("Prepaid Truckload")).toBeInTheDocument();
    });
    it("ShipperToUse dropdown options should change when whoPaysShipping is Customer", async () => {
        extensionServiceModule.post.mockResolvedValue("");
        render(<CustomForm />);
        const whoPaysDropdown = within(await screen.findByTestId("whoPaysShipping")).getByRole("combobox");
        await userEvent.click(whoPaysDropdown);
        await userEvent.click(await screen.findByRole("option", { name: "Customer Pays Freight" }));
        const shipperDropdown = within(await screen.findByTestId("shipperToUse2")).getByRole("combobox");
        expect(shipperDropdown).toBeInTheDocument();
        expect(screen.getByText("Special Instructions")).toBeInTheDocument();
    });
    it("Should show AccountNumber field and other forms when whoPaysShipping is Customer and MyFedEx account is Yes", async () => {
        extensionServiceModule.post.mockResolvedValue("");
        render(<CustomForm />);
        const whoPaysDropdown = within(await screen.findByTestId("whoPaysShipping")).getByRole("combobox");
        await userEvent.click(whoPaysDropdown);
        await userEvent.click(await screen.findByRole("option", { name: "Customer Pays Freight" }));
        const myFedEx = within(await screen.findByTestId("myFedEx")).getByRole("combobox");
        await userEvent.click(myFedEx);
        await userEvent.click(await screen.findByRole("option", { name: "Yes" }));
        expect(screen.getByText("Account Number")).toBeInTheDocument();
        expect(screen.getByText("Ground")).toBeInTheDocument();
        expect(screen.getByText("1 Day Freight")).toBeInTheDocument();
        expect(screen.getByText("2 Day Freight")).toBeInTheDocument();
        expect(screen.getByText("3 Day Freight")).toBeInTheDocument();
        expect(screen.getByText("Express Saver")).toBeInTheDocument();
        expect(screen.getByText("First Overnight")).toBeInTheDocument();
        expect(screen.getByText("Ground Home Delivery")).toBeInTheDocument();
        expect(screen.getByText("Priority Overnight")).toBeInTheDocument();
        expect(screen.getByText("Standard Overnight")).toBeInTheDocument();
    });
    it("FedEx forms should be visible and not accountNumber when MyFedEx account is No", async () => {
        extensionServiceModule.post.mockResolvedValue("");
        render(<CustomForm />);
        const whoPaysDropdown = within(await screen.findByTestId("whoPaysShipping")).getByRole("combobox");
        await userEvent.click(whoPaysDropdown);
        await userEvent.click(await screen.findByRole("option", { name: "Customer Pays Freight" }));
        const myFedEx = within(await screen.findByTestId("myFedEx")).getByRole("combobox");
        await userEvent.click(myFedEx);
        await userEvent.click(await screen.findByRole("option", { name: "No" }));
        expect(screen.queryByText("Account Number")).toBeNull();
        expect(screen.getByText("Ground")).toBeInTheDocument();
        expect(screen.getByText("1 Day Freight")).toBeInTheDocument();
        expect(screen.getByText("2 Day Freight")).toBeInTheDocument();
        expect(screen.getByText("3 Day Freight")).toBeInTheDocument();
        expect(screen.getByText("Express Saver")).toBeInTheDocument();
        expect(screen.getByText("First Overnight")).toBeInTheDocument();
        expect(screen.getByText("Ground Home Delivery")).toBeInTheDocument();
        expect(screen.getByText("Priority Overnight")).toBeInTheDocument();
        expect(screen.getByText("Standard Overnight")).toBeInTheDocument();
    });
    it("Should show form for Customer Prefered Carrier", async () => {
        extensionServiceModule.post.mockResolvedValue("");
        render(<CustomForm />);
        const whoPaysDropdown = within(await screen.findByTestId("whoPaysShipping")).getByRole("combobox");
        await userEvent.click(whoPaysDropdown);
        await userEvent.click(await screen.findByRole("option", { name: "Customer Pays Freight" }));
        const shipperDropdown = within(await screen.findByTestId("shipperToUse2")).getByRole("combobox");
        await userEvent.click(shipperDropdown);
        await userEvent.click(await screen.findByRole("option", { name: "Customer Preferred Carrier" }));
        expect(screen.getByText("Account Number")).toBeInTheDocument();
        expect(screen.getByText("CarrierName")).toBeInTheDocument();
        expect(screen.getByText("ContactName")).toBeInTheDocument();
        expect(screen.getByText("ContactPhone")).toBeInTheDocument();
        expect(screen.getByText("Zip")).toBeInTheDocument();
        expect(screen.getByText("Select a Country")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Address1")).toBeInTheDocument();
        // expect(screen.getByText("Address2")).toBeInTheDocument();
        expect(screen.getByText("Select a State")).toBeInTheDocument();
        expect(screen.getByText("City")).toBeInTheDocument();
        
    });
    it("Should show form for UPS", async () => {
        extensionServiceModule.post.mockResolvedValue("");
        render(<CustomForm />);
        const whoPaysDropdown = within(await screen.findByTestId("whoPaysShipping")).getByRole("combobox");
        await userEvent.click(whoPaysDropdown);
        await userEvent.click(await screen.findByRole("option", { name: "Customer Pays Freight" }));
        const shipperDropdown = within(await screen.findByTestId("shipperToUse2")).getByRole("combobox");
        await userEvent.click(shipperDropdown);
        await userEvent.click(await screen.findByRole("option", { name: "UPS" }));
        expect(screen.getByText("Ground")).toBeInTheDocument();
        expect(screen.getByText("2nd Day Air")).toBeInTheDocument();
        expect(screen.getByText("2nd Day Air AM")).toBeInTheDocument();
        expect(screen.getByText("3 Day Select")).toBeInTheDocument();
        expect(screen.getByText("Next Day Air")).toBeInTheDocument();
        expect(screen.getByText("Next Day Air AM")).toBeInTheDocument();
        expect(screen.getByText("Next Day Air Saver")).toBeInTheDocument();
    });
    it("Should show form for Will Call", async () => {
        extensionServiceModule.post.mockResolvedValue("");
        render(<CustomForm />);
        const whoPaysDropdown = within(await screen.findByTestId("whoPaysShipping")).getByRole("combobox");
        await userEvent.click(whoPaysDropdown);
        await userEvent.click(await screen.findByRole("option", { name: "Customer Pays Freight" }));
        const shipperDropdown = within(await screen.findByTestId("shipperToUse2")).getByRole("combobox");
        await userEvent.click(shipperDropdown);
        await userEvent.click(await screen.findByRole("option", { name: "Will Call" }));
        expect(screen.getByText("ContactName")).toBeInTheDocument();
        // expect(screen.getByText("ContactEmail")).toBeInTheDocument();
        expect(screen.getByText("ContactPhone")).toBeInTheDocument();
    });
});