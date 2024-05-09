import React from "react";
import { render, screen, within } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import CustomForm from "./CustomForm";
import checkoutKitLoader from "./checkoutLoader";
import extensionServiceModule from "./extensionModule";

jest.mock("./checkoutLoader");
jest.mock("./extensionModule", () => ({
    post: jest.fn(),
}));

describe(CustomForm, () => {
    it("WhoPaysShipping Dropdown and default ShippertoUse Dropdown is displayed", async () => {
        checkoutKitLoader.load.mockResolvedValue("CartId Updated");
        extensionServiceModule.post.mockResolvedValue("");
        render(<CustomForm />);
        expect(
            within(await screen.findByTestId("whoPaysShipping")).getByRole("combobox"),
        ).toBeInTheDocument();
        expect(
            within(await screen.findByTestId("shipperToUse1")).getByRole("combobox"),
        ).toBeInTheDocument();
    });
    it("WhoPaysShipping Dropdown options are visible", async () => {
        checkoutKitLoader.load.mockResolvedValue("CartId Updated");
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
        checkoutKitLoader.load.mockResolvedValue("CartId Updated");
        extensionServiceModule.post.mockResolvedValue("");
        render(<CustomForm />);
        const dropdown = within(await screen.findByTestId("whoPaysShipping")).getByRole("combobox");
        await userEvent.click(dropdown);
        await userEvent.click(await screen.findByRole("option", { name: "Customer Pays Freight" }))
        expect(screen.getByText("Customer Pays Freight")).toBeInTheDocument();
    });
    it("Should show dropdown for Customer preffered carried when whoPaysShipping is Customer", async () => {
        checkoutKitLoader.load.mockResolvedValue("CartId Updated");
        extensionServiceModule.post.mockResolvedValue("");
        render(<CustomForm />);
        const whoPaysDropdown = within(await screen.findByTestId("whoPaysShipping")).getByRole("combobox");
        await userEvent.click(whoPaysDropdown);
        await userEvent.click(await screen.findByRole("option", { name: "Customer Pays Freight" }));
        const shipperDropdown = within(await screen.findByTestId("shipperToUse2")).getByRole("combobox");
        expect(
            within(await screen.findByTestId("shipperToUse2")).getByRole("combobox"),
        ).toBeInTheDocument();
    });
});