import { useState } from "react";
import axios from "axios";

export default function Createquiz() {

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: [{ text: "" }, { text: "" }], correctOptions: [] },
  ]);
  const [msg, setMsg] = useState("");

  const addQuestion = () =>
    setQuestions([
      ...questions,
      { question: "", options: [{ text: "" }, { text: "" }], correctOptions: [] },
    ]);

  const addOption = (qIdx) => {
    const qs = [...questions];
    qs[qIdx].options.push({ text: "" });
    setQuestions(qs);
  };

  const updateQuestion = (qIdx, val) => {
    const qs = [...questions];
    qs[qIdx].question = val;
    setQuestions(qs);
  };

  const updateOption = (qIdx, oIdx, val) => {
    const qs = [...questions];
    qs[qIdx].options[oIdx].text = val;
    setQuestions(qs);
  };

  const toggleCorrect = (qIdx, text) => {
    const qs = [...questions];
    const idx = qs[qIdx].correctOptions.indexOf(text);
    idx >= 0
      ? qs[qIdx].correctOptions.splice(idx, 1)
      : qs[qIdx].correctOptions.push(text);
    setQuestions(qs);
  };

  const submitQuiz = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:9000/admin/quiz",
        { title, questions },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setMsg("Quiz created");
    } catch (err) {
      console.error(err);
      setMsg(
        `${err.response?.data?.message || err.response?.data?.error || err.message}`
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create Quiz</h2>
      <form onSubmit={submitQuiz} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {questions.map((q, qIdx) => (
          <div
            key={qIdx}
            className="border p-4 rounded space-y-2 bg-gray-50 shadow"
          >
            <input
              className="w-full p-2 border rounded"
              type="text"
              placeholder={`Question ${qIdx + 1}`}
              value={q.question}
              onChange={(e) => updateQuestion(qIdx, e.target.value)}
              required
            />
            <div className="space-y-2">
              {q.options.map((opt, oIdx) => (
                <div key={oIdx} className="flex items-center space-x-2">
                  <input
                    className="flex-1 p-2 border rounded"
                    type="text"
                    placeholder={`Option ${oIdx + 1}`}
                    value={opt.text}
                    onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                    required
                  />
                  <input
                    type="checkbox"
                    checked={q.correctOptions.includes(opt.text)}
                    onChange={() => toggleCorrect(qIdx, opt.text)}
                  />
                  <span className="text-sm">Correct</span>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(qIdx)}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                + Add Option
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Add Question
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Submit Quiz
        </button>
      </form>

      {msg && <p className="mt-4 text-center font-medium">{msg}</p>}
    </div>
  );
}
