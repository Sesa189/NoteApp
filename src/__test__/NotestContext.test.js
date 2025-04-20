import { renderHook, act } from "@testing-library/react";
import { NotesProvider, useNotes } from "../context/NotesContext";
import { BrowserRouter } from "react-router-dom";

test("può aggiungere una nota", () => {
  const wrapper = ({ children }) => (
    <BrowserRouter>
      <NotesProvider>{children}</NotesProvider>
    </BrowserRouter>
  );

  const { result } = renderHook(() => useNotes(), { wrapper });

  act(() => {
    result.current.addNote();
  });

  expect(result.current.notes.length).toBeGreaterThan(0);
});
