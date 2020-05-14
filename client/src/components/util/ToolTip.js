import React, { useState } from 'react';

const ToolTip = ({content, children, time, positionClass}) => {
  let [timer, setTimer] = useState(null),
    [displayClass, setDisplayClass] = useState('hidden');

  if (time === undefined) time = 500;

  const mouseOverHandler = e => {
    if (displayClass === 'hidden' && timer == null) {
      setTimer(setTimeout(() => {
        setDisplayClass('visible');
        timer = null;
      }, time));
    }
  }

  const mouseOutHandler = e => {
    if (timer !== null) {
      setDisplayClass('hidden');
      clearTimeout(timer);
      setTimer(null);
    }
  }


  return (
    <div
      className="tooltipped-icon"
    >
      <div
        onMouseOut={mouseOutHandler}
        onMouseOver={mouseOverHandler}
      >
        {children}
      </div>
      <div className={`${displayClass} ${positionClass || 'tooltip-container'}`}>
        <div className="tooltip">{content}</div>
        <div className={`${positionClass && positionClass + '-tail' || 'tooltip-tail'}`}></div>
      </div>
    </div>
  );
};

export default ToolTip;
