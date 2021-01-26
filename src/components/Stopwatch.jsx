import React, { useEffect, useState } from "react";
import { fromEvent, interval } from 'rxjs';
import { buffer, debounceTime, filter, map, scan, startWith, share } from 'rxjs/operators';

const formatDate = (time) => 
  new Date(time * 1000).toISOString().substr(11, 8);

const Stopwatch = () => {
  const [seconds, setSeconds] = useState(0);
  const [interval$] = useState(interval(1000));
  const [start, setStart] = useState(false);

  useEffect(() => {
    const loop = interval$.pipe(
      startWith(seconds),
      scan(seconds => seconds + 1),
      share(),
    )
    .subscribe(x => 
      start && setSeconds(x));

    return () => loop.unsubscribe();
  },[seconds, start, interval$]) 

  const handleStart = () => {
    setStart(true);
  };

  const handleStop = () => {
    setStart(false);
    setSeconds(0);
  };

  const handleWait = (e) => {
    const clickTarget = fromEvent(e.target, e.type);

    return clickTarget.pipe(
      buffer(clickTarget.pipe(debounceTime(300))),
      map(mouseClick => mouseClick.length),
      filter(length => length === 2)
      )
      .subscribe(() => setStart(false));
  }

  const handleReset = () => setSeconds(0);

  return(
    <div className="stopwatch">
      <p className="stopwatch_time">{formatDate(seconds)}</p>
      <div className="button-section">
        <button className="start"
          onClick={handleStart}
        >
          start
        </button>
        <button className="stop"
          onClick={handleStop}
        >
          stop
        </button>
        <button className="wait"
          onClick={(e) => handleWait(e)}
        >
          wait
        </button>
        <button className="reset"
          onClick={handleReset}
        >
          reset
        </button>
      </div>
    </div>
  );
};

export default Stopwatch;