import React from "react";
import {ReactComponent as Github} from "../../images/github.svg"
import AngelList from "../../images/angellist.png"
import {ReactComponent as StackOverflow} from "../../images/stackoverflow.svg"
import {ReactComponent as LinkedIn} from "../../images/linkedin.svg"
import {ReactComponent as Website} from "../../images/website.svg"

export default (props) => {
  return (
    <div className="credits">
      <div className="credits-inner">
        <h1 className="credits-header">Creators</h1>
        <div className="creators">
          <div className="creator">
            <p className="creator-name">Jorge Barreto</p>
            <div className="portrait-wrapper">
              <div className="jorge portrait"></div>
            </div>
            <div className="creator-links">
              <a href={`https://github.com/jorge-barreto`} alt="github">
                <i className="credits-icon">
                  <Github width="48px" height="48" fill="#d4f2d2"/>
                </i>
              </a>
              <a href={`https://stackoverflow.com/users/12104304/jbarreto`} alt="stackoverflow">
                <i className="credits-icon">
                  <StackOverflow width="48px" height="48" fill="#d4f2d2"/>
                </i>
              </a>
              <a
                href="https://www.linkedin.com/in/jorge-barreto-749232186"
                alt="linkedin"
              >
                <i className="credits-icon">
                  <LinkedIn fill="#d4f2d2" />
                </i>
              </a>
              <a href={`https://angel.co/u/jorge-barreto-2`}>
                <i className="credits-icon angellist">
                  <img src={AngelList} alt="angellist" />
                </i>
              </a>
              <a href={`https://jorgebarreto.dev`}>
                <Website width="48px" height="48" fill="#d4f2d2"/>
              </a>
            </div>
          </div>
          <div className="creator">
            <p className="creator-name">Jacob Meyer</p>
            <div className="portrait-wrapper">
              <div className="jacob portrait"></div>
            </div>
            <div className="creator-links">
              <a href={`https://github.com/jacobpmeyer/`} alt="github">
                <i className="credits-icon">
                  <Github width={48} height={48} fill="#d4f2d2"/>
                </i>
              </a>
              <a href={`https://stackoverflow.com/users/13444538/jacob-meyer`} alt="stackoverflow">
                <i className="credits-icon">
                  <StackOverflow width="48px" height="48" fill="#d4f2d2"/>
                </i>
              </a>
              <a
                href="https://www.linkedin.com/in/jacob-p-meyer/"
                alt="linkedin"
              >
                <i className="credits-icon">
                  <LinkedIn fill="#d4f2d2" />
                </i>
              </a>
              <a href={`https://angel.co/u/jacobpmeyer`}>
                <i className="credits-icon angellist">
                  <img src={AngelList} alt="angellist" />
                </i>
              </a>
              <a href={`https://jacobmeyer.dev`}>
                <Website className="portfolio" width="40px" height="48px" fill="#d4f2d2"/>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
