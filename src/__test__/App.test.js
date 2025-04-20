import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

test("renderizza la sidebar e la route /notes", () => {
  render(
    <MemoryRouter initialEntries={["/notes"]}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText("Notes")).toBeInTheDocument();
});
