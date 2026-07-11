export interface IdeaScores {
  marketSize?: number;
  painPoint?: number;
  viral?: number;
  techFeasibility?: number;
  differentiation?: number;
  monetization?: number;
  executionDifficulty?: number;
  [key: string]: number | undefined;
}

export interface IdeaFeature {
  name: string;
  desc: string;
}

export interface Idea {
  id: number;
  slug: string;
  title: string;
  pitch?: string;
  category: string;
  tier?: number;
  scores?: IdeaScores | null;
  overall?: number | null;
  verdict?: string | null;
  features?: IdeaFeature[];
  sourceDir?: string;
  filePath?: string;
}

export interface IdeasData {
  generatedAt?: string;
  totalIdeas: number;
  scoredIdeas: number;
  tier1: Idea[];
  tier2?: Idea[];
  categories: string[];
  ideas: Idea[];
}

export type ScoredIdea = Idea & {
  overall: number;
};
