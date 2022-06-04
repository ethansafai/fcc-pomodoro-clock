import { useEffect, useRef, useState } from "react";
import {
  ArrowCircleDownIcon,
  ArrowCircleUpIcon,
  PlayIcon,
  PauseIcon,
  RefreshIcon,
} from "@heroicons/react/outline";

const Controls = ({ playing, name, minutes, setMinutes }) => {
  const CapitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="flex flex-col justify-center items-center">
      <p className="text-lg sm:text-xl text-center font-medium">
        <span id={`${name}-label`}>{CapitalizeFirstLetter(name)} Length</span>
        {": "}
        <span id={`${name}-length`}>{minutes}</span>
      </p>
      <div className="flex justify-center items-center space-x-2">
        <ArrowCircleDownIcon
          id={`${name}-decrement`}
          className="arrow down-arrow"
          onClick={() =>
            !playing && minutes > 1 && setMinutes((prev) => prev - 1)
          }
        />
        <ArrowCircleUpIcon
          id={`${name}-increment`}
          className="arrow up-arrow"
          onClick={() => {
            if (!playing) {
              let ok = true;
              if (name === "break") {
                if (minutes === 60) {
                  ok = false;
                }
              }
              if (ok) {
                setMinutes((prev) => prev + 1);
              }
            }
          }}
        />
      </div>
    </div>
  );
};

const Clock = () => {
  const audioRef = useRef(null);

  const [breakMinutes, setBreakMinutes] = useState(5);
  const [sessionMinutes, setSessionMinutes] = useState(25);
  const [playing, setPlaying] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const [minutes, setMinutes] = useState(sessionMinutes);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setMinutes(sessionMinutes);
    setSeconds(0);
  }, [sessionMinutes]);

  useEffect(() => {
    if (playing) {
      console.log("timer started");
      const timeout = setTimeout(() => {
        if (isBreak && minutes === 0 && seconds === 0) {
          setIsBreak(false);
          setMinutes(sessionMinutes);
          audioRef.current.play();
        } else if (minutes === 0 && seconds === 0) {
          setIsBreak(true);
          setMinutes(breakMinutes);
          audioRef.current.play();
        } else {
          if (seconds === 0) {
            setSeconds(59);
            setMinutes((prev) => prev - 1);
          } else {
            setSeconds((prev) => prev - 1);
          }
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [playing, seconds, minutes, isBreak, breakMinutes, sessionMinutes]);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-10 sm:gap-16">
      <p className="text-3xl text-center font-medium">25 + 5 Clock</p>
      <div
        id="start_stop"
        className="flex justify-center items-center space-x-[-1.05rem] group border-2 border-blue-900 rounded-lg w-min hover:bg-gray-200"
        onClick={() => {
          setPlaying((prev) => !prev);
        }}
      >
        <PlayIcon className="control-icon" />
        <PauseIcon className="control-icon" />
      </div>
      <p className="p-4 border-2 border-gray-500 w-min rounded-2xl text-center text-5xl">
        <span id="timer-label">Session</span>:&nbsp;
        <span id="time-left">{`${minutes}:${
          seconds < 10 ? "0" + seconds : seconds
        }`}</span>
      </p>
      <div className="flex max-w-sm mx-auto justify-around w-full">
        <Controls
          name="break"
          minutes={breakMinutes}
          setMinutes={setBreakMinutes}
          playing={playing}
        />
        <Controls
          name="session"
          minutes={sessionMinutes}
          setMinutes={setSessionMinutes}
          playing={playing}
        />
      </div>
      <RefreshIcon
        id="reset"
        className="control-icon"
        onClick={() => {
          setBreakMinutes(5);
          setSessionMinutes(25);
          setMinutes(sessionMinutes);
          setSeconds(0);
          setIsBreak(false);
          setPlaying(false);
        }}
      />
      <audio
        ref={audioRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
};

export default Clock;
