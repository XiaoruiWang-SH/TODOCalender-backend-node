import { formatRes, shouldFilter } from "../src/utils";

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

describe("shouldFilter", () => {
  it("validate register url", () => {
    const path = "/api/auth/register";
    expect(shouldFilter(path)).toEqual(true);
  });

  it("validate login url", () => {
    const path = "/api/auth/login";
    expect(shouldFilter(path)).toEqual(true);
  });

  it("validate oauth url", () => {
    const path = "/api/oauth2/google";
    expect(shouldFilter(path)).toEqual(true);
  });

  it("validate logout url", () => {
    const path = "/api/auth/logout";
    expect(shouldFilter(path)).toEqual(false);
  });
  it("validate user url", () => {
    const path = "/api/user/aaa";
    expect(shouldFilter(path)).toEqual(false);
  });
});
