import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Quizresults() {
  const { quizId } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:9000/user/result/${quizId}`, {
        headers: { Authorization: token },
      });
      setResult(res.data);
    };
    fetchResults();
  }, [quizId]);

  if (!result) return <p className="text-center mt-10">Loading results...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center">Quiz Results</h2>
      <p>Score: <span className="font-bold">{result.score}</span> / {result.totalQuestions}</p>
      <div className="space-y-2">
        {result.details.map((d, idx) => (
          <div key={idx} className="p-2 border rounded">
            <p className="font-medium">Q: {d.question}</p>
            <p>
              Your Answer: <span className={d.isCorrect ? "text-green-600" : "text-red-600"}>
                {d.chosenOption}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Quizresults;
