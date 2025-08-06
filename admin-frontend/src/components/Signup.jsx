import axios from "axios";
import { useState } from "react";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function signup() {
    axios
      .post("http://localhost:9000/admin/signup", {
        username: username,
        password: password,
      })
      .then(() => {
        window.location = "/admin/signin";
      });
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4 mt-10">
      <input
        className="border p-2 rounded w-64"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="border p-2 rounded w-64"
        placeholder="Enter your password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={signup}
      >
        Signup
      </button>
    </div>
  );
}

export default Signup;
