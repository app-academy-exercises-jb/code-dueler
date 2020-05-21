import React from "react";

class LobbyTour extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: 1,
      seen: localStorage.getItem('lobby-seen') === 'true',
    };
    this.endTour = this.endTour.bind(this);
    this.tourNext = this.tourNext.bind(this);
    this.tourPrevious = this.tourPrevious.bind(this);
    this.lobby1 = React.createRef();
    this.lobby2 = React.createRef();
    this.lobby3 = React.createRef();
  }

  endTour() {
    localStorage.setItem('lobby-seen', 'true');
    this.setState({ seen: true });
  }

  tourNext() {
    if (this.state.idx < 3) {
      this[`lobby${this.state.idx + 1}`].current.classList.remove(
        "hidden"
      );
      this[`lobby${this.state.idx}`].current.classList.add("hidden");
      this.setState({ idx: this.state.idx + 1 });
    } else {
      this[`lobby${this.state.idx}`].current.classList.add("hidden");
      this.setState({ idx: this.state.idx + 1 });
      localStorage.setItem('lobby-seen', 'true');
    }
  }

  tourPrevious() {
    if (this.state.idx > 1) {
      this[`lobby${this.state.idx - 1}`].current.classList.remove(
        "hidden"
      );
      this[`lobby${this.state.idx}`].current.classList.add("hidden");
      this.setState({ idx: this.state.idx - 1 });
    }
  }

  render() {
    if (this.state.seen) return null;
    return (
      <div className="tour-wrapper">
        <div ref={this.lobby1} className="lobby-sidebar">
          <i className="fas arrow-left tour-arrow-left"></i>
          <div className="tour-text-wrapper">
            <div className="tour-text">
              If a player is in a
              <p className="code-duel">CODE DUEL</p>
              then click on their name to join
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
        </div>
        <div ref={this.lobby2} className="lobby-chat hidden">
          <div className="tour-text-wrapper">
            <p className="tour-text">
              Type here to chat with the other players who are not in a game
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
          <i className="fas arrow-down tour-arrow-down"></i>
        </div>
        <div ref={this.lobby3} className="lobby-button hidden">
          <i className="fas arrow-up tour-arrow-up"></i>
          <div className="tour-text-wrapper">
            <p className="tour-text">Here, you can create or join a game, log out, or see the credits page</p>
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
        </div>
      </div>
    );
  }
}

export default LobbyTour;
