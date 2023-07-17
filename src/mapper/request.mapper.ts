import { PromptRequest, PromptRequestBody } from "../types/request.types"

export function mapRequestToSQSPayload(
  requestBody: PromptRequestBody,
  apiRequestId: string
): PromptRequest {
  return {
    id: apiRequestId,
    ...requestBody,
  }
}
