export function diffDateToDuration(start: Date, end: Date): string {
  const diff = end.valueOf() - start.valueOf();
  const seconds = Math.round(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  if (minutes >= 1) {
    const modSeconds = seconds - minutes * 60;
    if (modSeconds === 0) {
      return `${minutes}m`;
    } else {
      return `${minutes}m ${modSeconds}s`;
    }
  } else {
    return `${seconds}s`;
  }
}
