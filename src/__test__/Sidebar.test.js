import { render, screen } from "@testing-library/react";
import { NotesProvider } from "../context/NotesContext";
import Sidebar from "../pages/Sidebar";

test("mostra intestazione Notes e bottone +", () => {
  render(
    <NotesProvider>
      <Sidebar />
    </NotesProvider>
  );

  expect(screen.getByText("Notes")).toBeInTheDocument();
  expect(screen.getByText("+")).toBeInTheDocument();
});
