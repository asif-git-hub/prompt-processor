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

const sqsClient = new SQSClient()

export const handler = async (
  event: APIGatewayProxyEvent,
  _context: unknown
): Promise<APIGatewayProxyResult> => {
  console.log("Initiating retrieval", event)

  try {
    const requestBody = await validateApiPromptRequestBody(event.body)

    const promptRequest = mapRequestToSQSPayload(
      requestBody,
      event.requestContext.requestId
    )

    await sqsClient.publish(
      getEnvVar("PROMPT_REQUEST_QUEUE_ARN"),
      JSON.stringify(promptRequest)
    )

    return createSuccessResponse(promptRequest)
  } catch (e) {
    if (e instanceof ValidationError) {
      return createBadRequest()
    }
    return createInternalError()
  }
}
