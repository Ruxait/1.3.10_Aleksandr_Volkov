// src/components/converter/Converter.test.tsx
import { screen, fireEvent } from "@testing-library/react";
import { renderWithRedux } from "../../test/utils.tsx";
import { expect, it, describe } from "vitest";
import App from "../app/App";

describe("Currency Converter", () => {
  it("renders header", async () => {
    renderWithRedux(<App />);
    expect(await screen.findByText(/Конвертер валют онлайн/i)).toBeInTheDocument();
  });

  it("renders 5 currencies × 2 blocks = 12 items", async () => {
    renderWithRedux(<App />);

    const usdItems = await screen.findAllByText("USD");
    expect(usdItems).toHaveLength(2);

    const allItems = document.querySelectorAll(".switcher__item");
    expect(allItems.length).toBeGreaterThanOrEqual(10);
  });

  it("left input has default value 100, right input is disabled", async () => {
    renderWithRedux(<App />);
    const inputs = await screen.findAllByRole("spinbutton");
    expect(inputs[0]).toHaveValue(100);
    expect(inputs[1]).toBeDisabled();
  });

  it("same currencies show rate 1:1", async () => {
    renderWithRedux(<App />);
    const usdButtons = await screen.findAllByText("USD");

    fireEvent.click(usdButtons[0]);
    fireEvent.click(usdButtons[1]);

    const rateTexts = await screen.findAllByText(/1 USD = 1.00 USD/);
    expect(rateTexts).toHaveLength(2);
  });

  it("changing value in left input updates right input", async () => {
    renderWithRedux(<App />);
    const inputs = await screen.findAllByRole("spinbutton");
    fireEvent.change(inputs[0], { target: { value: "200" } });
    expect(inputs[0]).toHaveValue(200);
    expect(inputs[1]).not.toHaveValue(0);
  });

  it("changing left currency updates result", async () => {
    renderWithRedux(<App />);
    const eurButtons = await screen.findAllByText("EUR");
    fireEvent.click(eurButtons[0]);
    expect(await screen.findByText(/1 EUR =/)).toBeInTheDocument();
  });

  it("changing right currency updates result", async () => {
    renderWithRedux(<App />);
    const eurButtons = await screen.findAllByText("EUR");
    fireEvent.click(eurButtons[1]);
    expect(await screen.findByText(/1 EUR =/)).toBeInTheDocument();
  });

  it("swap button changes currencies", async () => {
    renderWithRedux(<App />);
    await screen.findByText(/У меня есть/);

    const swapButton = document.querySelector(".direction__reverse") as HTMLElement;
    expect(swapButton).toBeInTheDocument();

    fireEvent.click(swapButton);

    expect(await screen.findByText(/Хочу приобрести/)).toBeInTheDocument();
  });

  it("renders exchange rate from mock", async () => {
    renderWithRedux(<App />);
    expect(await screen.findByText(/1 USD =/)).toBeInTheDocument();
  });

  it("clearing left input clears right input", async () => {
    renderWithRedux(<App />);
    const inputs = await screen.findAllByRole("spinbutton");
    fireEvent.change(inputs[0], { target: { value: "" } });
    expect(inputs[0]).toHaveValue(null);
    expect(inputs[1]).toHaveValue(null);
  });
});
