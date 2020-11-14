import React, { useState } from "react";

interface PlayRecord {
  title: string;
  start: Date;
  end: Date;
}

export function SessionPage() {
  const [title, setTitle] = useState("<untitled>");
  const [start, setStart] = useState<Date>(new Date());
  const [recording, setRecording] = useState(false);
  const [records, setRecords] = useState<PlayRecord[]>([]);

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
            <button
              onClick={() => {
                if (!recording) {
                  setStart(new Date());
                } else {
                  setRecords([...records, { start, end: new Date(), title }]);
                }

                setRecording(!recording);
              }}
            >
              {recording ? "Terminar" : "Empezar"}
            </button>
          </div>
        </div>
        <div className="flex-column flex-grow">
          <h3>Interpretaciones</h3>
          {records.map((record) => (
            <div>
              {record.title} at {record.start.toLocaleTimeString()} for 99s
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
