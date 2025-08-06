import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Attendquiz() {
  const [quizId, setQuizId] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const loadQuiz = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:9000/user/quiz/${quizId}`, {
      headers: { Authorization: token },
    });
    setQuiz(res.data);
    setCurrentQ(0);
    setAnswers([]);
    setSubmitted(false);
  };

  const handleOption = (questionId, optionId) => {
    const updated = [...answers.filter(a => a.questionId !== questionId), { questionId, optionId }];
    setAnswers(updated);
  };

  const nextQuestion = () => {
    if (currentQ < quiz.questions.length - 1) setCurrentQ(currentQ + 1);
  };

  const submitQuiz = async () => {
    const token = localStorage.getItem("token");
    await axios.post(
      `http://localhost:9000/user/submit`,
      { quizId: quiz.id, answers },
      { headers: { Authorization: token } }
    );
    setSubmitted(true);
  };

  const viewResults = () => navigate(`/user/result/${quizId}`);

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      {!quiz && (
        <div className="space-y-4">
          <input
            className="border p-2 w-full rounded"
            placeholder="Enter Quiz ID"
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
          />
          <button
            onClick={loadQuiz}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Load Quiz
          </button>
        </div>
      )}

      {quiz && !submitted && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">{quiz.title}</h2>
          <div>
            <p className="mb-2">
              Q{currentQ + 1}: {quiz.questions[currentQ].question}
            </p>
            {quiz.questions[currentQ].options.map((opt) => (
              <div key={opt.id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`q-${currentQ}`}
                  checked={
                    answers.find(
                      (a) =>
                        a.questionId === quiz.questions[currentQ].id &&
                        a.optionId === opt.id
                    ) !== undefined
                  }
                  onChange={() =>
                    handleOption(quiz.questions[currentQ].id, opt.id)
                  }
                />
                <label>{opt.option}</label>
              </div>
            ))}
          </div>

          {currentQ < quiz.questions.length - 1 ? (
            <button
              onClick={nextQuestion}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Next
            </button>
          ) : (
            <button
              onClick={submitQuiz}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Submit Quiz
            </button>
          )}
        </div>
      )}

      {submitted && (
        <div className="text-center mt-6 space-y-2">
          <p className="text-green-600 font-medium">Quiz submitted!</p>
          <button
            onClick={viewResults}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Results
          </button>
        </div>
      )}
    </div>
  );
}

export default Attendquiz;
