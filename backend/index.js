const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { signUpInput, signInInput, quizData ,userSubmitInput } = require("./zodParser");
const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());
const secret = "123random";

function Authenticate(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    res.json({ message: "Unauthorised" });
  } else {
    const currentuser = jwt.verify(token, secret);
    req.userid = currentuser.id;
    req.role = currentuser.role;
    next();
  }
}

app.post("/signup", async (req, res) => {
  try {
    const response = signUpInput.safeParse(req.body);
    if (!response.success) {
      return res.status(400).json({ message: "Incorrect inputs" });
    }
    const { name, email, password, role } = response.data;
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (user) {
      return res.status(400).json({ message: "Duplicate account" });
    }

    const newuser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
        role: role,
      },
    });
    res.status(200).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/signin", async (req, res) => {
  try {
    const response = signInInput.safeParse(req.body);

    if (!response.success) {
      return res.status(400).json({ message: "Incorrect inputs" });
    }

    const { email, password } = response.data;

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(400).json({ message: "Unauthorised" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, secret);

    res.status(200).json({ token: token, message: "Signin successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/profile",Authenticate,async(req,res)=>{
  try{
    const userid = req.userid;
    const user = await prisma.user.findUnique({
      where: {
        id: userid
      }
    })
    if(!user)
    {
      res.status(400).json({message: "User not found"});
    }
    else{
      res.status(200).json(user);
    }
  }
  catch(err)
  {
    res.status(500).json({message: err.message})
  }
})

app.post("/quiz", Authenticate, async (req, res) => {
  try {
    if (req.role !== "ADMIN") {
      return res.status(400).json({ message: "Not an admin" });
    }

    const parsed = quizData.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid quiz data" });
    }

    const { title, questions } = parsed.data;

    const quiz = await prisma.quiz.create({
      data: {
        title,
        userId: req.userid,
        questions: {
          create: questions.map((q) => ({
            title: q.title,
            options: {
              create: [
                { option: q.option1 },
                { option: q.option2 },
                { option: q.option3 },
                { option: q.option4 },
              ],
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    for (const [i, q] of quiz.questions.entries()) {
      const correct = questions[i].answer;

      let correctOption;
      if (typeof correct === "number") {
        correctOption = q.options[correct - 1];
      } else {
        correctOption = q.options.find(
          (o) => o.option === correct || o.id === correct
        );
      }

      if (!correctOption) throw new Error("Correct option not found");

      await prisma.answer.create({
        data: {
          questionId: q.id,
          optionId: correctOption.id,
        },
      });
    }

    res.status(200).json({ quizId: quiz.id, message: "Quiz created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

app.get("/quiz/:quizId", Authenticate, async (req, res) => {
  try {
    const userid = req.userid;
    const user = await prisma.user.findUnique({
      where: {
        id: userid,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const quizid = req.params.quizId;
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizid,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
    if (!quiz) {
      return res.status(400).json({ message: "Quiz not found" });
    }

    const response = {
      id: quiz.id,
      title: quiz.title,
      questions: quiz.questions.map((q) => {
        const opts = q.options;
        return {
          id: q.id,
          title: q.title,
          option1: opts[0]?.option || "",
          option2: opts[1]?.option || "",
          option3: opts[2]?.option || "",
          option4: opts[3]?.option || "",
        };
      }),
    };

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/quiz/:quizId/submit", Authenticate, async (req, res) => {
  try {
    const userid = req.userid;
    const user = prisma.user.findUnique({
      where: {
        id: userid,
      },
    });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    const parsed = userSubmitInput.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid submission data" });
    }

    const { answers } = parsed.data;
    const quizId = req.params.quizId;

    let score = 0;
    const total = answers.length;

    for (const ans of answers) {
      const correct = await prisma.answer.findFirst({
        where: {
          questionId: ans.questionId,
          optionId: ans.selectedOption,
        },
      });

      const isCorrect = Boolean(correct);

      if (isCorrect) score++;

      await prisma.userSubmission.create({
        data: {
          userId: req.userid,
          quizId,
          questionId: ans.questionId,
          optionId: ans.selectedOption,
          isCorrect,
        },
      });
    }

    await prisma.quizResult.upsert({
      where: { userId_quizId: { userId: req.userid, quizId } },
      update: { score },
      create: { userId: req.userid, quizId, score },
    });

    res.json({ score, total, message: "Submission evaluated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/result/:quizId", Authenticate, async (req, res) => {
  try {
    const userid = req.userid;
    const user = prisma.user.findUnique({
      where: {
        id: userid,
      },
    });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    const quizId = req.params.quizId;

    const results = await prisma.quizResult.findMany({
      where: { quizId },
      include: {
        user: true,
      },
    });

    const totalQuestions = await prisma.question.count({ where: { quizId } });

    res.json({
      results: results.map((r) => ({
        userId: r.userId,
        name: r.user.name,
        score: r.score,
        totalQuestions,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(9000, () => {
  console.log("Server started at http://localhost:9000");
});

