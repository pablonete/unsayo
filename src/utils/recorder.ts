export interface Recorder {
  start(): void;
  stop(): Promise<Blob>;
}

export function recordAudio() {
  return new Promise<Recorder>(async (resolve) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: Blob[] = [];

    mediaRecorder.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });

    const start = () => {
      if (audioChunks.length > 0) {
        audioChunks.splice(0, audioChunks.length);
      }

      mediaRecorder.start();
    };

    const stop = () =>
      new Promise<Blob>((resolve) => {
        mediaRecorder.addEventListener("stop", () => {
          resolve(new Blob(audioChunks));
        });

        mediaRecorder.stop();
      });

    resolve({ start, stop });
  });
}

export function playAudio(audioBlob: Blob) {
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
}
