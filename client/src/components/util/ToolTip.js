import React, { useState } from 'react';

const ToolTip = ({content, children}) => {
  let [timer, setTimer] = useState(null),
    [displayClass, setDisplayClass] = useState('hidden');

  const mouseOverHandler = e => {
    if (timer === null) {
      setTimer(setTimeout(() => {
        setDisplayClass('visible');
        timer = null;
      }, 500));
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
      onMouseOut={mouseOutHandler}
      onMouseOver={mouseOverHandler}
    >
      {children}
      <div className={`${displayClass} tooltip-container`}>
        <div className="tooltip">{content}</div>
        <div className="tooltip-tail"></div>
      </div>
    </div>
  );
};

export default ToolTip;
