import { Button, IconButton, TextField } from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import React, { useEffect, useState } from "react";
import { diffDateToDuration } from "../utils/date";
import { useMobile } from "../utils/hooks";
import { css } from "../utils/layout";
import { playAudio, recordAudio, Recorder } from "../utils/recorder";

interface PlayRecord {
  title: string;
  start: Date;
  end: Date;
  audioBlob: Blob;
}

export function SessionPage() {
  const [records, setRecords] = useState<PlayRecord[]>([]);
  const [isMobile] = useMobile();
  const [isRecorderVisible, showRecorderView] = useState(false);

  return (
    <div className="flex-column">
      <h1>Sesión de hoy</h1>
      <div className="flex-row rhythm-h-16">
        <div
          className={css(
            "flex-column flex-grow",
            isMobile && !isRecorderVisible && "hidden",
          )}
        >
          <RecorderView
            onNewRecord={(r) => {
              setRecords([...records, r]);
              showRecorderView(false);
            }}
            onDismiss={isMobile ? () => showRecorderView(false) : undefined}
          />
        </div>
        {(!isMobile || !isRecorderVisible) && (
          <div className="flex-column flex-grow">
            <div className="flex-row">
              <h3 className="flex-grow">Interpretaciones</h3>
              {isMobile && (
                <div className="margin-8">
                  <IconButton
                    aria-label="Grabar"
                    onClick={() => showRecorderView(true)}
                  >
                    <Add />
                  </IconButton>
                </div>
              )}
            </div>
            <RecordingList records={records} />
          </div>
        )}
      </div>
    </div>
  );
}

interface RecorderViewProps {
  onDismiss?(): void;
  onNewRecord(record: PlayRecord): void;
}

function RecorderView({ onDismiss, onNewRecord }: RecorderViewProps) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState<Date>(new Date());
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState<Recorder | undefined>(undefined);

  useEffect(function () {
    recordAudio().then(setRecorder);
  }, []);

  return (
    <div className="flex-column flex-grow rhythm-v-16">
      <div className="flex-row">
        {onDismiss && !recording && (
          <IconButton aria-label="volver" onClick={onDismiss}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <h3>Grabar</h3>
      </div>

      <TextField
        id="standard-basic"
        label="Título"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <div className="flex-row">
        {recorder && (
          <Button
            color="secondary"
            onClick={async () => {
              if (!recording) {
                setStart(new Date());
                recorder.start();
              } else {
                const audioBlob = await recorder.stop();
                onNewRecord({
                  start,
                  end: new Date(),
                  title: title || "Sin título",
                  audioBlob,
                });
              }

              setRecording(!recording);
            }}
            variant="contained"
          >
            {recording ? "Terminar" : "Empezar"}
          </Button>
        )}
      </div>
    </div>
  );
}

interface RecordingListProps {
  records: PlayRecord[];
}

function RecordingList({ records }: RecordingListProps) {
  return (
    <div className="flex-column">
      {records.map((record) => (
        <div className="flex-row flex-center" key={record.start.toUTCString()}>
          {record.title}&nbsp;hora&nbsp;{record.start.toLocaleTimeString()}
          &nbsp;duración&nbsp;
          {diffDateToDuration(record.start, record.end)}
          <IconButton
            aria-label="Escuchar"
            onClick={() => playAudio(record.audioBlob)}
          >
            <PlayCircleOutlineIcon />
          </IconButton>
        </div>
      ))}
    </div>
  );
}
