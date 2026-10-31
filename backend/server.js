
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenAI } = require('@google/genai');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

app.use(cors());
app.use(express.json());

// Check API key
if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is missing from backend/.env');
  process.exit(1);
}

// Initialize Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Gemini model
const MODEL = 'gemini-3.8-flash';

// Delay function for retry
const delay = (ms) =>
  new Promise(resolve => setTimeout(resolve, ms));

// Common Gemini function with automatic retry
async function generateWithRetry(prompt) {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Gemini request: attempt ${attempt}`);

      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt
      });

      if (!response.text) {
        throw new Error('Gemini returned an empty response.');
      }

      return response;

    } catch (error) {
      const errorDetails = [
        error.message,
        error.status,
        error.code
      ].join(' ');

      const isTemporaryError =
        /503|UNAVAILABLE|429|RESOURCE_EXHAUSTED|500|INTERNAL|502|504/i
          .test(errorDetails);

      console.error(`Gemini attempt ${attempt} failed:`, error.message);

      if (!isTemporaryError || attempt === maxAttempts) {
        throw error;
      }

      const waitTime = 1000 * Math.pow(2, attempt - 1);

      console.log(`Retrying in ${waitTime / 1000} seconds...`);

      await delay(waitTime);
    }
  }
}

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to StudyPilot AI Backend! 🚀');
});


// ==========================================
// 1. AI TOPIC EXPLAINER
// ==========================================

app.post('/api/explain', async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({
        error: 'Please enter a topic.'
      });
    }

    const prompt = `
      Explain the following topic in simple and student-friendly language.

      Topic: ${topic}

      Include:
      1. Introduction
      2. Important points
      3. Simple examples
      4. Short conclusion

      Make the explanation easy to understand.
    `;

    const response = await generateWithRetry(prompt);

    res.json({
      topic,
      explanation: response.text
    });

  } catch (error) {
    console.error('Gemini Explain Error:', error.message);

    res.status(503).json({
      error: 'AI Tutor is temporarily unavailable. Please try again shortly.',
      details: error.message
    });
  }
});


// ==========================================
// 2. QUIZ GENERATOR
// ==========================================

app.post('/api/quiz', async (req, res) => {
  try {
    const { topic, numberOfQuestions } = req.body;

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({
        error: 'Please enter a quiz topic.'
      });
    }

    const totalQuestions = Math.min(
      Math.max(Number(numberOfQuestions) || 5, 1),
      10
    );

    const prompt = `
      Create exactly ${totalQuestions} multiple-choice questions
      about the topic: ${topic}.

      Return ONLY valid JSON.
      Do not include markdown or code fences.

      Use this exact JSON structure:

      {
        "questions": [
          {
            "question": "Question text",
            "options": [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            "answer": "Correct option",
            "explanation": "Short explanation"
          }
        ]
      }
    `;

    const response = await generateWithRetry(prompt);

    let result = response.text.trim();

    // Remove markdown code fences
    result = result
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '');

    const quizData = JSON.parse(result);

    if (
      !quizData ||
      !Array.isArray(quizData.questions) ||
      quizData.questions.length === 0
    ) {
      throw new Error('Invalid quiz format received from Gemini.');
    }

    res.json({
      questions: quizData.questions
    });

  } catch (error) {
    console.error('Quiz Generator Error:', error.message);

    res.status(503).json({
      error: 'Quiz Generator is temporarily unavailable. Please try again shortly.',
      details: error.message
    });
  }
});


// ==========================================
// 3. SMART STUDY PLANNER
// ==========================================

app.post('/api/study-plan', async (req, res) => {
  try {
    const { subjects, examDate, dailyHours } = req.body;

    if (!subjects || typeof subjects !== 'string' || !subjects.trim()) {
      return res.status(400).json({
        error: 'Please enter your subjects.'
      });
    }

    if (!examDate || !dailyHours) {
      return res.status(400).json({
        error: 'Please enter your exam date and daily study hours.'
      });
    }

    const hours = Math.min(
      Math.max(Number(dailyHours) || 1, 1),
      12
    );

    const prompt = `
      Create a practical and easy-to-follow study timetable
      for a student.

      Subjects: ${subjects}
      Exam Date: ${examDate}
      Available study hours per day: ${hours}

      Include:
      1. A daily study schedule.
      2. Time allocation for each subject.
      3. Short breaks between study sessions.
      4. Revision sessions.
      5. Practice questions and mock tests.
      6. Final revision before the exam.

      Make the plan realistic and student-friendly.
      Use clear headings and a day-wise format.
    `;

    const response = await generateWithRetry(prompt);

    res.json({
      studyPlan: response.text
    });

  } catch (error) {
    console.error('Study Planner Error:', error.message);

    res.status(503).json({
      error: 'Study Planner is temporarily unavailable. Please try again shortly.',
      details: error.message
    });
  }
});
app.post('/api/evaluate', async (req, res) => {
  try {
    const { question, answer, totalMarks } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        error: 'Question and answer are required.'
      });
    }

    const prompt = `
You are an experienced and fair school teacher.

Evaluate the student's answer carefully.

Question: ${question}

Student's Answer: ${answer}

Maximum Marks: ${totalMarks || 10}

Please provide:
1. Marks awarded out of the maximum marks.
2. What the student did correctly.
3. Mistakes or missing points.
4. A corrected and improved answer.
5. Suggestions for improvement.

Be encouraging, clear and educational.
Award marks fairly based on accuracy and completeness.
Do not award full marks if the answer is incomplete.

Present the evaluation in a clear, well-organized format.
`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt
    });

    res.json({
      evaluation: response.text
    });

  } catch (error) {
    console.error('Gemini Evaluation Error:', error);

    res.status(500).json({
      error: error.message || 'Unable to evaluate the answer.'
    });
  }
});

// ==========================================
// 4. API NOT FOUND HANDLER
// ==========================================

app.use('/api', (req, res) => {
  res.status(404).json({
    error: 'API route not found.'
  });
});


// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`StudyPilot AI server running on http://localhost:${PORT}`);
});
