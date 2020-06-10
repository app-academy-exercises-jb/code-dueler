import React, { useState, useEffect } from 'react';
import Stats from "./Stats";
import ErrorModal from './ErrorModal';
import ResultsModal from './ResultsModal';
import ReactModal from "react-modal";

export default ({ownStats, opponentStats, spectator}) => {
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const setResultsProps = parsed => {
    if (!parsed || (parsed && parsed.error !== undefined)) return;
    setProps({ 
      test: parsed.test,
      expected: parsed.expected,
      output: parsed.output,
      score: parsed.score,
      handleModalClose
    });
  }

  const setErrorProps = parsed => {
    if (!parsed) return;
    setProps({ error: parsed.error, handleModalClose });
  }
  
  const openTestResults = (stats) => {
    const parsed = stats === "own" ? ownParsed : opponentParsed;
    setResultsProps(parsed);
    setModalToOpen("results");
    setModalOpen(true);
  };

  const openErrorResults = (stats) => {
    const parsed = stats === "own" ? ownParsed : opponentParsed;
    setModalToOpen("error");
    setErrorProps(parsed);
    setModalOpen(true);
  };

  const statsProps = { openErrorResults, openTestResults };
  const [props, setProps] = useState({ handleModalClose });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalToOpen, setModalToOpen] = useState("results");
  const [ownParsed, setOwnParsed] = useState(null);
  const [opponentParsed, setOpponentParsed] = useState(null);

  const shouldUpdateOnLastOwnSubmitted = ownStats && ownStats.lastSubmittedResult;
  useEffect(() => {
    if (ownStats && ownStats.lastSubmittedResult && !spectator) {
      const parsed = JSON.parse(ownStats.lastSubmittedResult);
      setOwnParsed(parsed);
      
      if (parsed.error) {
        parsed.error = {
          snippet: parsed.error.substring(0, parsed.error.indexOf('\n')),
          stackTrace: parsed.error
        }
        setModalToOpen("error");
        setErrorProps(parsed);
      } else {
        setModalToOpen("results");
        setResultsProps(parsed);
      }

      if (modalOpen === false) {
        setModalOpen(true);
      }
    } else if (ownStats && ownStats.lastSubmittedResult && spectator) {
      const parsed = JSON.parse(ownStats.lastSubmittedResult);
      setOwnParsed(parsed);
    }
    return () => setModalOpen(false);
  }, [shouldUpdateOnLastOwnSubmitted]);

  const shouldUpdateOnLastOppSubmitted = opponentStats && opponentStats.lastSubmittedResult;
  useEffect(() => {
    if (opponentStats && opponentStats.lastSubmittedResult) {
        setOpponentParsed(JSON.parse(opponentStats.lastSubmittedResult));
      }
  }, [shouldUpdateOnLastOppSubmitted]);

  useEffect(() => setModalOpen(false), []);

  return (
    <>
      <div className="stats-players">
        <Stats 
          ownStats={ownStats} 
          ownParsed={ownParsed} 
          title={"Own Stats"} 
          {...statsProps}
        />
      </div>
      <div className="stats-players">
        <Stats
          opponentStats={opponentStats}
          opponentParsed={opponentParsed}
          title={"Opponent Stats"}
          {...statsProps}
        />
      </div>
      <ReactModal
        className="modal-overlay"
        isOpen={modalOpen}
        shouldCloseOnEsc={true}
        onRequestClose={() => {}}
      >
        {
          modalToOpen === "results"
            ? <ResultsModal {...props} />
            : <ErrorModal {...props} />
        }
      </ReactModal>
    </>
  )
};