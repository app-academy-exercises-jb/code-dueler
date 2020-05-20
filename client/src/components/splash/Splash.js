import React from "react";
import { Link } from "react-router-dom";

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
    this.photo5 = React.createRef();
    this.photo6 = React.createRef();
    this.photo7 = React.createRef();
    this.photo8 = React.createRef();
  }

  moveRight() {
    if (this.state.idx < 8) {
      this[`photo${this.state.idx + 1}`].current.classList.add("card-in");
      this[`photo${this.state.idx}`].current.classList.remove("card-in");
      this[`photo${this.state.idx}`].current.classList.add("card-out");
      this.setState({ idx: this.state.idx + 1 });
    }
  }

  moveLeft() {
    if (this.state.idx > 1) {
      this[`photo${this.state.idx}`].current.classList.remove("card-in");
      this[`photo${this.state.idx - 1}`].current.classList.add("card-in");
      this[`photo${this.state.idx - 1}`].current.classList.remove("card-out");
      this.setState({ idx: this.state.idx - 1 });
    }
  }

  render() {
    let leftArrow = null;
    let rightArrow = null;
    if (this.state.idx === 1) {
      leftArrow = "button-none";
    } else if (this.state.idx === 8) {
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
                Hello and welcome to CodeDueler!
              </p>
              <p className="slide-text flex-start">
                Code Dueler is a competitive problem solving game where two
                players race to finish a coding challenge
              </p>
            </div>

            <div ref={this.photo3} className="card_part card_part-3">
              <p className="slide-text flex-start">
                When logging in, each player is entered in into the global
                lobby. To challenge a player simply click on their name.
              </p>
            </div>

            <div ref={this.photo4} className="card_part card_part-4"></div>

            <div ref={this.photo5} className="card_part card_part-5"></div>

            <div ref={this.photo6} className="card_part card_part-6">
              <p className="slide-text">
                Once in a game, the race is on! Problem solving is done in the
                code editor.
              </p>
            </div>

            <div ref={this.photo7} className="card_part card_part-7">
              <p className="slide-text">Smack talk is done in the chat!</p>
            </div>

            <div ref={this.photo8} className="card_part card_part-8">
              <p className="slide-text">
                When the game is over, both players are returned to the lobby
              </p>
              <p className="slide-text">Log in or sign up and have some fun!</p>
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
          <Link to={"/login"} className="splash-button">
            Login
          </Link>
          <Link to={"/signup"} className="splash-button">
            Sign Up
          </Link>
        </div>
      </div>
    );
  }
}

export default SplashComponent;
