import { diffDateToDuration } from "./date";

test("diffDateToDuration", () => {
  function validate(start: string, end: string, expected: string) {
    expect(3).toBe(3);
    expect(
      diffDateToDuration(
        new Date("2020-11-15 " + start),
        new Date("2020-11-15 " + end),
      ),
    ).toBe(expected);
  }

  validate("16:12:10", "16:12:16", "0:06");
  validate("16:12:10", "16:13:20", "1:10");
  validate("15:57:10", "16:13:20", "16:10");
  validate("15:57:10", "16:03:10.3", "6:01");
});
