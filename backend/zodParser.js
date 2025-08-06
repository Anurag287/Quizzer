const zod = require("zod");

const answerSchema = zod.union([
  zod.string().min(1).max(50),      
  zod.number().int().min(1).max(4), 
  zod.string().uuid()               
]);

const questionSchema = zod.object({
  title: zod.string().min(10).max(100),
  option1: zod.string().min(1).max(50),
  option2: zod.string().min(1).max(50),
  option3: zod.string().min(1).max(50),
  option4: zod.string().min(1).max(50),
  answer: answerSchema
});

const quizData = zod.object({
  title: zod.string().min(5).max(50),
  questions: zod.array(questionSchema).min(1),
});

const userSubmitInput = zod.object({
  answers: zod.array(
    zod.object({
      questionId: zod.string().cuid(),
      selectedOption: zod.string().cuid()
    })
  )
});

const signUpInput = zod.object({
  name: zod.string().min(3).max(20),
  email: zod.string().email(),
  password: zod.string().min(5).max(20),
  role: zod.string().min(4).max(5).toUpperCase()
});

const signInInput = zod.object({
  email: zod.string().email(),
  password: zod.string().min(5).max(20)
});

module.exports = {
  signUpInput,
  signInInput,
  quizData,
  userSubmitInput
};
