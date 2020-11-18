export function css(...classNames: unknown[]) {
  let className = "";
  let separator = "";

  for (const text of classNames) {
    if (text) {
      className += separator + text;
      separator = " ";
    }
  }

  return className;
}
