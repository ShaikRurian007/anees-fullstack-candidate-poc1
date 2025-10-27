export type Candidate = {
  id: number;
  name: string;
  email: string;
  experience: number;
  skills: string[];
};

export type ScoreResponse = {
  overallScore: number;
  skills: { name: string; score: number }[];
  gaps: string[];
  recommendations: string[];
  meta: { generatedAt: string; model: string };
};

export type FeedbackResponse = {
  codeSnippet: string;
  summary: string;
  suggestions: string[];
  meta: { generatedAt: string; model: string };
};
