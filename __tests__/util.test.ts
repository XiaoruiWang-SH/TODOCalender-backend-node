import { formatRes } from "../src/utils";

describe("formatRes", () => {
  it("Format empty data", () => {
    const expectResult = {
      result: true,
      message: "register successful",
      data: {},
    };
    expect(formatRes(true, "register successful", {})).toEqual(expectResult);
  });

  it("Format full data ", () => {
    const data = { a: 1, b: "2", c: { c1: "c1" } };
    const expectResult = {
      result: true,
      message: "register successful",
      data: data,
    };
    expect(formatRes(true, "register successful", data)).toEqual(expectResult);
  });
});

