import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import {
  createSuccessResponse,
  createBadRequest,
  createInternalError,
} from "../utils/api.utils"
import { ValidationError } from "../errors/validation.error"
import { validateApiPromptRequestBody } from "../validtor/request.validator"
import { mapRequestToSQSPayload } from "../mapper/request.mapper"
import { SQSClient } from "../aws/sqs.client"
import { getEnvVar } from "../utils/common.utils"
import { PromptRepository } from "../repository/prompt.repository"
import { mapToPromptProcessingRecord } from "../mapper/prompt.dto.mapper"

const sqsClient = new SQSClient()
const promptRepo = new PromptRepository()

export const handler = async (
  event: APIGatewayProxyEvent,
  _context: unknown
): Promise<APIGatewayProxyResult> => {
  console.log("Initiating api request", event)

  try {
    // Validate Body
    const requestBody = await validateApiPromptRequestBody(event.body)

    // Publish to Queue
    const promptRequest = mapRequestToSQSPayload(
      requestBody,
      event.requestContext.requestId
    )

    await sqsClient.publish(
      getEnvVar("PROMPT_REQUEST_QUEUE_ARN"),
      JSON.stringify(promptRequest)
    )

    // Save to Table
    await promptRepo.saveRecord(mapToPromptProcessingRecord(promptRequest))

    return createSuccessResponse(promptRequest)
  } catch (e) {
    if (e instanceof ValidationError) {
      return createBadRequest()
    }
    return createInternalError()
  }
}
