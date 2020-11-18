export function diffDateToDuration(start: Date, end: Date): string {
  const diff = end.valueOf() - start.valueOf();
  const seconds = Math.ceil(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const modSeconds = seconds - minutes * 60;
  return `${minutes}:${modSeconds.toFixed().padStart(2, "0")}`;
}
