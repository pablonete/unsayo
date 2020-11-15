import React, { useEffect, useState } from "react";
import { diffDateToDuration } from "../utils/date";
import { playAudio, recordAudio, Recorder } from "../utils/recorder";

interface PlayRecord {
  title: string;
  start: Date;
  end: Date;
  audioBlob: Blob;
}

export function SessionPage() {
  const [title, setTitle] = useState("<untitled>");
  const [start, setStart] = useState<Date>(new Date());
  const [recording, setRecording] = useState(false);
  const [records, setRecords] = useState<PlayRecord[]>([]);
  const [recorder, setRecorder] = useState<Recorder | undefined>(undefined);

  useEffect(function () {
    recordAudio().then(setRecorder);
  }, []);

  return (
    <div className="flex-column">
      <h1>Sesión de hoy</h1>
      <div className="flex-row rhythm-h-16">
        <div className="flex-column flex-grow">
          <label>Título</label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            value={title}
          />
          <div>
            {recorder && (
              <button
                onClick={async () => {
                  if (!recording) {
                    setStart(new Date());
                    recorder.start();
                  } else {
                    const audioBlob = await recorder.stop();
                    setRecords([
                      ...records,
                      { start, end: new Date(), title, audioBlob },
                    ]);
                  }

                  setRecording(!recording);
                }}
              >
                {recording ? "Terminar" : "Empezar"}
              </button>
            )}
          </div>
        </div>
        <div className="flex-column flex-grow">
          <h3>Interpretaciones</h3>
          {records.map((record) => (
            <div className="flex-row" key={record.start.toUTCString()}>
              {record.title}&nbsp;hora&nbsp;{record.start.toLocaleTimeString()}
              &nbsp;duración&nbsp;
              {diffDateToDuration(record.start, record.end)}
              <button onClick={() => playAudio(record.audioBlob)}>
                Escuchar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
