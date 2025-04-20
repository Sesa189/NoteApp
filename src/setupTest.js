import "@testing-library/jest-dom";

global.prompt = jest.fn(() => "TestCategoria");

beforeEach(() => {
  localStorage.clear();
});