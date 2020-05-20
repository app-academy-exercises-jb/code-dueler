import React from "react";

class GameTour extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: 1,
      seen: localStorage.getItem('lobby-seen') === 'true',
    };
    this.endTour = this.endTour.bind(this);
    this.tourNext = this.tourNext.bind(this);
    this.tourPrevious = this.tourPrevious.bind(this);
    this.game1 = React.createRef();
    this.game2 = React.createRef();
    this.game3 = React.createRef();
    this.game4 = React.createRef();
  }

  endTour() {
    localStorage.setItem('game-seen', 'true');
    this.setState({ seen: true });
  }

  tourNext() {
    if (this.state.idx < 4) {
      this[`game${this.state.idx + 1}`].current.classList.remove(
        "hidden"
      );
      this[`game${this.state.idx}`].current.classList.add("hidden");
      this.setState({ idx: this.state.idx + 1 });
    } else {
      this[`game${this.state.idx}`].current.classList.add("hidden");
      this.setState({ idx: this.state.idx + 1 });
      localStorage.setItem('game-seen', 'true');
    }
  }

  tourPrevious() {
    if (this.state.idx > 1) {
      this[`game${this.state.idx - 1}`].current.classList.remove(
        "hidden"
      );
      this[`game${this.state.idx}`].current.classList.add("hidden");
      this.setState({ idx: this.state.idx - 1 });
    }
  }

  render() {
    if (this.state.seen) return null;
    return (
      <div className="tour-wrapper">
        <div ref={this.game1} className="game-challenge">
          <div className="tour-text-wrapper">
            <div className="tour-text">
              This is the challenge question you will try to solve.
            </div>
            <div className="button-wrapper">
              <button onClick={this.endTour} className="tour-button">
                Close
              </button>
              <button onClick={this.tourNext} className="tour-button">
                Next
              </button>
            </div>
          </div>
          <i className="fas fa-arrow-right tour-arrow-right"></i>
        </div>
        <div ref={this.game2} className="game-editor hidden">
          <i className="fas fa-arrow-left tour-arrow-left"></i>
          <div className="tour-text-wrapper">
            <p className="tour-text">
              Here is the editor section where you can type your solution
            </p>
            <div className="button-wrapper">
              <button onClick={this.tourPrevious} className="tour-button">
                Previous
              </button>
              <button onClick={this.tourNext} className="tour-button">
                Next
              </button>
            </div>
          </div>
        </div>
        <div ref={this.game3} className="game-submit hidden">
          <i className="fas fa-arrow-left tour-arrow-left"></i>
          <div className="tour-text-wrapper">
            <p className="tour-text">
              Click here to submit your code. (It may take a few seconds)
            </p>
            <div className="button-wrapper">
              <button
                onClick={() => this.tourPrevious()}
                className="tour-button"
              >
                Previous
              </button>
              <button onClick={this.tourNext} className="tour-button">
                Next
              </button>
            </div>
          </div>
        </div>
        <div ref={this.game4} className="game-stats hidden">
          <div className="tour-text-wrapper">
            <p className="tour-text">
              You can view your own stats as well as your oponents with these
              buttons
            </p>
            <div className="button-wrapper">
              <button
                onClick={() => this.tourPrevious()}
                className="tour-button"
              >
                Previous
              </button>
              <button onClick={this.tourNext} className="tour-button">
                Close
              </button>
            </div>
          </div>
          <i className="fas fa-arrows-alt-h tour-arrow-left-right"></i>
        </div>
      </div>
    );
  }
}

export default GameTour;
