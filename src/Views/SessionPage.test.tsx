import { render, screen } from "@testing-library/react";
import React from "react";
import { SessionPage } from "./SessionPage";

test("renders learn react link", () => {
  render(<SessionPage />);
  const linkElement = screen.getByText(/Empezar/i);
  expect(linkElement).toBeInTheDocument();
});
