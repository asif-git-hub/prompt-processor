import { PromptRequestBody, PromptRequest } from "../types/request.types"
import { ValidationError } from "../errors/validation.error"
import {
  promptApiRequestBodySchema,
  promptRequestSchema,
} from "./schema/request.shema"

export async function validateApiPromptRequestBody(
  body: string | undefined | null
): Promise<PromptRequestBody> {
  if (!body) {
    throw new ValidationError("Missing request body")
  }

  try {
    const parsedBody = JSON.parse(body)

    return await promptApiRequestBodySchema.validate(parsedBody)
  } catch (e) {
    console.error(
      "VALIDATION_ERROR : Request body malformed or missing parameters"
    )
    throw new ValidationError("Request body malformed or missing parameters")
  }
}

export async function validateSQSPayload(
  msg: string | undefined | null
): Promise<PromptRequest> {
  if (!msg) {
    throw new ValidationError("Missing request msg")
  }

  try {
    const parsedBody = JSON.parse(msg)

    return await promptRequestSchema.validate(parsedBody)
  } catch (e) {
    console.error(
      "VALIDATION_ERROR : SQS Payload malformed or missing mandatory parameters"
    )
    throw new ValidationError(
      "SQS Payload malformed or missing mandatory parameters"
    )
  }
}
