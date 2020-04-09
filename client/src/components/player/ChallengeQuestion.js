import React from "react";

const ChallengeQuestion = (props) => {
  return (
    <div className="question-text-box">
      <h1>Challenge Question</h1>

      <p>
        Write a program that outputs the string representation of numbers from 1 to n.
      </p>

      <p>
        But for multiples of three it should output “Fizz” instead of the number and for the multiples of five output “Buzz”. For numbers which are multiples of both three and five output “FizzBuzz”.
      </p>

      <p>
        Example:
      </p>

      <pre>
        n = 15,
        
        Return:
        [
            "1",
            "2",
            "Fizz",
            "4",
            "Buzz",
            "Fizz",
            "7",
            "8",
            "Fizz",
            "Buzz",
            "11",
            "Fizz",
            "13",
            "14",
            "FizzBuzz"
        ]
      </pre>

    </div>
  );
};

export default ChallengeQuestion;
