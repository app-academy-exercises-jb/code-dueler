import React from "react";

class SplashComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: 1,
    };
    this.photo1 = React.createRef();
    this.photo2 = React.createRef();
    this.photo3 = React.createRef();
    this.photo4 = React.createRef();
  }

  moveRight() {
    console.log(this.state.idx);
    if (this.state.idx < 4) {
      this[`photo${this.state.idx + 1}`].current.classList.add("card-in");
      this[`photo${this.state.idx}`].current.classList.remove("card-in");
      this[`photo${this.state.idx}`].current.classList.add("card-out");
    }
    if (this.state.idx < 4) {
      this.setState({ idx: this.state.idx + 1 });
    }
  }

  moveLeft() {
    console.log(this.state.idx);
    if (this.state.idx > 1) {
      this[`photo${this.state.idx}`].current.classList.remove("card-in");
      this[`photo${this.state.idx - 1}`].current.classList.add("card-in");
      this[`photo${this.state.idx - 1}`].current.classList.remove("card-out");
    }
    if (this.state.idx > 1) {
      this.setState({ idx: this.state.idx - 1 });
    }
  }

  render() {
    let leftArrow = null;
    let rightArrow = null;
    if (this.state.idx === 1) {
      leftArrow = "button-none";
    } else if (this.state.idx === 4) {
      rightArrow = "button-none";
    }
    return (
      <div className="splash">
        <div className="slideshow">
          <button
            className={`splash-arrow ${leftArrow}`}
            onClick={() => this.moveLeft()}
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="card">
            <div ref={this.photo1} className="card_part card_part-1 card-in">
              <p className="slide-text"></p>
            </div>

            <div ref={this.photo2} className="card_part card_part-2">
              <p className="slide-text flex-start">
                Hello and wecome to CodeDueler!
              </p>
              <p className="slide-text flex-start">
                Code Dueler is a competitive problem solving game where two
                players race to finish a coding challenge
              </p>
            </div>

            <div ref={this.photo3} className="card_part card_part-3">
              <p className="slide-text">
                When logging in, each player is entered in into the global
                lobby. To challenge a player simply click on their name.
              </p>
            </div>

            <div ref={this.photo4} className="card_part card_part-4">
              <p className="slide-text">
                Once in a game, the race is on! Problem solving is done in the
                code editor.
              </p>
              <p className="slide-text">Smack Talking is done in the chat!</p>
            </div>
          </div>
          <button
            onClick={() => this.moveRight()}
            className={`splash-arrow ${rightArrow}`}
          >
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
        <div className="splash-controls-bottom">
          <button className="splash-button">Login</button>
          <button className="splash-button">Sign Up</button>
        </div>
      </div>
    );
  }
}

export default SplashComponent;
