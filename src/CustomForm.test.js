import React from "react";
import { render, screen, within } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import CustomForm from "./CustomForm";

describe(CustomForm, () => {
    it("Who Pays Shipping Dropdown is displayed", async () => {
        render(<CustomForm />);
        expect(
            within(await screen.findByTestId("whoPaysShipping")).getByRole("combobox"),
          ).toBeInTheDocument();
    });
    it("Who Pays Shipping Dropdown options are visible", async () => {
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
    it("Who Pays Shipping Dropdown should show selected value", async () => {
        render(<CustomForm />);
        const dropdown = within(await screen.findByTestId("whoPaysShipping")).getByRole("combobox");
        await userEvent.click(dropdown);
        await userEvent.click(await screen.findByRole("option", { name: "Customer Pays Freight" }))
        expect(screen.getByText("Customer Pays Freight")).toBeInTheDocument();
    });
});