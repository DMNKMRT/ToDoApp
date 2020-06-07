import interpolate from "./template.js";

test("interpolate interpolate string", () => {
  const data = {
    firstName: "Erich",
    lastName: "Schneider",
  };

  const string = "<div>${firstName}</div><div>${lastName}</div>";
  const solution = `<div>${data.firstName}</div><div>${data.lastName}</div>`;

  expect(interpolate(string, data)).toEqual(solution);
});
