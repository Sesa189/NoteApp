import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NotesProvider } from "../context/NotesContext";
import Main from "../pages/Main";

test("visualizza messaggio quando nessuna nota è selezionata", () => {
  render(
    <MemoryRouter initialEntries={["/notes"]}>
      <NotesProvider>
        <Main />
      </NotesProvider>
    </MemoryRouter>
  );

  expect(screen.getByText(/No note selected/i)).toBeInTheDocument();
});
