import React, { useState, useEffect } from 'react';
import Stats from "./Stats";
import ErrorModal from './ErrorModal';
import ResultsModal from './ResultsModal';

export default ({me, ownStats, opponentStats}) => {
  const openTestResults = () => {
    setModalToOpen("results");
    setModalOpen(true);
  };

  const openErrorResults = () => {
    setModalToOpen("error");
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const statsProps = { openErrorResults, openTestResults };
  const [props, setProps] = useState({ handleModalClose });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalToOpen, setModalToOpen] = useState("results");

  useEffect(() => {
    // debugger
    if (ownStats && ownStats.lastSubmittedResult) {
        const parsed = JSON.parse(ownStats.lastSubmittedResult);
        if (parsed.error) {
          setModalToOpen("error");
          setProps({ error: parsed.error, handleModalClose });
        } else {
          setModalToOpen("results");
          setProps({ 
            test: parsed.checkedTests[parsed.checkedTests.length - 1],
            expected: parsed.expected,
            output: parsed.output,
            handleModalClose
          });
        }
        if (modalOpen === false) {
          setModalOpen(true);
        }
      }
  }, [ownStats && ownStats.lastSubmittedResult]);

  return (<>
    <div className="stats-wrapper">
      <div className="stats-players">
        <Stats 
          ownStats={ownStats} 
          title={"Own Stats"} 
          {...statsProps}
        />
      </div>
      <div className="stats-players">
        <Stats
          opponentStats={opponentStats}
          title={"Opponent Stats"}
          {...statsProps}
        />
      </div>
    </div>
    {modalOpen && 
      ((modalToOpen === "results" &&  
        <ResultsModal test={"test"} {...props} />) ||
      (modalToOpen === "error" &&  
        <ErrorModal {...props} />))
    }
  </>)
};
