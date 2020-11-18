import { Badge, IconButton, TextField } from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MusicNote from "@material-ui/icons/MusicNote";
import React, { useEffect, useState } from "react";
import recordGreen from "../images/record-green.png";
import recordingRed from "../images/recording-red.png";
import { diffDateToDuration } from "../utils/date";
import { useMobile } from "../utils/hooks";
import { css } from "../utils/layout";
import { recordAudio, Recorder } from "../utils/recorder";

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

  const recordAriaLabel = recording ? "Terminar" : "Empezar";

  return (
    <div className="flex-column flex-grow">
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
      <div className="text-center margin-16">
        {recorder && (
          <IconButton
            aria-label={recordAriaLabel}
            color={recording ? "secondary" : undefined}
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
          >
            <img
              alt={recordAriaLabel}
              className={css(recording && "infinite-spin")}
              src={recording ? recordingRed : recordGreen}
            />
          </IconButton>
        )}
      </div>
      {recording && <TimeCounter className="text-center" start={start} />}
    </div>
  );
}

interface TimeCounterProps {
  className: string;
  start: Date;
}

function TimeCounter({ className, start }: TimeCounterProps) {
  const [text, setText] = useState("-:-");

  useEffect(
    function () {
      const intervalId = setInterval(function () {
        setText(diffDateToDuration(start, new Date()));
      }, 500);
      return () => clearInterval(intervalId);
    },
    [start],
  );

  return <div className={className}>{text}</div>;
}

interface RecordingListProps {
  records: PlayRecord[];
}

function RecordingList({ records }: RecordingListProps) {
  return (
    <div className="rhythm-v-16">
      {records.map((record, index) => (
        <div className="flex-column" key={index}>
          <div className="flex-row rhythm-h-8">
            <Badge
              badgeContent={index + 1}
              color="primary"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <MusicNote />
            </Badge>
            <span></span>
            <span className="flex-grow">{record.title}</span>
            <span>{diffDateToDuration(record.start, record.end)}</span>
          </div>

          <audio controls>
            <source
              src={URL.createObjectURL(record.audioBlob)}
              type="audio/mpeg"
            />
          </audio>
        </div>
      ))}
    </div>
  );
}
