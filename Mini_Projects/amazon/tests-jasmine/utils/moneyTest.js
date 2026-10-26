import formatCurrency, {
  formatCurrency as namedFormatCurrency,
} from "../../scripts/utils/money.js";

describe("test suite: formatCurrency", () => {
  it("converts cents into dollars", () => {
    expect(formatCurrency(2095)).toEqual("20.95");
  });

  it("works with 0", () => {
    expect(formatCurrency(0)).toEqual("0.00");
  });

  it("rounds up to the nearest cent", () => {
    expect(formatCurrency(2000.5)).toEqual("20.01");
  });

  it("rounds down to the nearest cent", () => {
    expect(formatCurrency(2000.4)).toEqual("20.00");
  });

  it("formats negative amounts", () => {
    expect(formatCurrency(-1050)).toEqual("-10.50");
  });

  it("always keeps two decimal places", () => {
    expect(formatCurrency(5)).toEqual("0.05");
    expect(formatCurrency(50)).toEqual("0.50");
    expect(formatCurrency(500)).toEqual("5.00");
  });

  it("handles large amounts", () => {
    expect(formatCurrency(123456789)).toEqual("1234567.89");
  });

  it("exports the same function as the default export", () => {
    expect(formatCurrency).toBe(namedFormatCurrency);
  });
});
