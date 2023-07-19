import { PromptRecord } from "../repository/prompt.repository"
import { PromptRequest } from "../types/request.types"

export function mapToPromptProcessingRecord(
  promptRequest: PromptRequest
): PromptRecord {
  return {
    id: promptRequest.id,
    model: promptRequest.model,
    processStatus: "PROCESSING",
    prompt: promptRequest.prompt,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
