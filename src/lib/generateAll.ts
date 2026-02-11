import type { TermsGeneratorInput, JoinKitResult } from "@/types";
import { generateTerms } from "./generateTerms";
import { generateFlow } from "./generateFlow";
import { generateSchema } from "./generateSchema";

export function generateAll(input: TermsGeneratorInput): JoinKitResult {
  return {
    input,
    terms: generateTerms(input),
    flow: generateFlow(input),
    schema: generateSchema(input),
  };
}
