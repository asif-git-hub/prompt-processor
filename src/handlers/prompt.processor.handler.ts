import { Context, SQSEvent } from "aws-lambda"
import { validateSQSPayload } from "../validtor/request.validator"
import { PromptService } from "../service/prompt.service"

const service = new PromptService()

export const handler = async (
  event: SQSEvent,
  _context: Context
): Promise<void> => {
  for (const record of event.Records) {
    console.log("Received record ", record.body)

    const payload = await validateSQSPayload(record.body)

    await service.process(payload)
  }
}
