import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { PromptRetrievalService } from "../service/prompt.retrieval.service"
import {
  createSuccessResponse,
  createBadRequest,
  createInternalError,
  createNotFoundError,
} from "../utils/api.utils"
import { ValidationError } from "../errors/validation.error"
import { NotFoundError } from "../errors/notfound.error"

const service = new PromptRetrievalService()

export const handler = async (
  event: APIGatewayProxyEvent,
  _context: unknown
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Initiating api request", event)

    const result = await service.getPrompt(event?.queryStringParameters?.["id"])

    return createSuccessResponse(result)
  } catch (e) {
    console.error(e)

    if (e instanceof ValidationError) {
      return createBadRequest()
    }
    if (e instanceof NotFoundError) {
      return createNotFoundError()
    }

    return createInternalError()
  }
}
