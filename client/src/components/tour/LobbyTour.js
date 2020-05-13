import React from "react";

class LobbyTour extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: 1,
    };
    this.tourNext = this.tourNext.bind(this);
    this.tourPrevious = this.tourPrevious.bind(this);
    this.lobby1 = React.createRef();
    this.lobby2 = React.createRef();
    this.lobby3 = React.createRef();
    // this.lobby4 = React.createRef();
    // this.lobby5 = React.createRef();
    // this.lobby6 = React.createRef();
    // this.lobby7 = React.createRef();
    // this.lobby8 = React.createRef();
  }

  componentDidMount() {
    console.log(this.state.idx);
  }

  tourNext() {
    console.log("inside the thing");
    if (this.state.idx < 3) {
      this[`lobby${this.state.idx + 1}`].current.classList.remove(
        "tour-modal-hidden"
      );
      this[`lobby${this.state.idx}`].current.classList.add("tour-modal-hidden");
      this.setState({ idx: this.state.idx + 1 });
    } else {
      this[`lobby${this.state.idx}`].current.classList.add("tour-modal-hidden");
      this.setState({ idx: this.state.idx + 1 });
    }
  }

  tourPrevious() {
    console.log("inside the other");
    if (this.state.idx > 1) {
      this[`lobby${this.state.idx - 1}`].current.classList.remove(
        "tour-modal-hidden"
      );
      this[`lobby${this.state.idx}`].current.classList.add("tour-modal-hidden");
      this.setState({ idx: this.state.idx - 1 });
    }
  }

  render() {
    return (
      <>
        <div ref={this.lobby1} className="lobby-sidebar">
          <i className="fas fa-arrow-left tour-arrow-left"></i>
          <div className="tour-text-wrapper">
            <div className="tour-text">
              Click on a player's name to challenge them to a
              <p className="code-duel">CODE DUEL</p>
            </div>
            <div className="button-wrapper">
              <button onClick={this.tourNext} className="tour-button">
                Next
              </button>
            </div>
          </div>
        </div>
        <div ref={this.lobby2} className="lobby-chat tour-modal-hidden">
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
          <i className="fas fa-arrow-down tour-arrow-down"></i>
        </div>
        <div ref={this.lobby3} className="lobby-button tour-modal-hidden">
          <i className="fas fa-arrow-up tour-arrow-up"></i>
          <div className="tour-text-wrapper">
            <p className="tour-text">Click here to log out</p>
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
      </>
    );
  }
}

export default LobbyTour;
