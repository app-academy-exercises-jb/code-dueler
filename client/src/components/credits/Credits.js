import React from "react";

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
                <i className="fab fa-github"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/jorge-barreto-749232186"
                alt="linkedin"
              >
                <i className="fab fa-linkedin"></i>
              </a>
              <a href={`https://angel.co/u/jorge-barreto-2`}>
                <i class="fab fa-angellist" alt="angel list"></i>
              </a>
              <a href={`https://jorgebarreto.dev`}>
                <i className="fas fa-portrait" alt="portfolio"></i>
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
                <i className="fab fa-github"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/jacob-p-meyer/"
                alt="linkedin"
              >
                <i className="fab fa-linkedin"></i>
              </a>
              <a href={`https://angel.co/u/jacobpmeyer`}>
                <i class="fab fa-angellist" alt="angel list"></i>
              </a>
              <a href={`https://jacobmeyer.dev`}>
                <i className="fas fa-portrait" alt="portfolio"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
