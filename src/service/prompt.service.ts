import { ChatGPTClient } from "../clients/chatgpt.client"
import { mapPromptToGPTMessage } from "../mapper/gpt.mapper"
import { PromptRequest } from "../types/request.types"

export class PromptService {
  private gptClient: ChatGPTClient

  constructor() {
    this.gptClient = new ChatGPTClient()
  }

  public async process(request: PromptRequest) {
    console.log("process() called ", request)
    let response: string = ""

    if (request.type === "chat") {
      response = await this.processChat(
        request.model,
        request.prompt,
        request.maxToken,
        request.randomness
      )
    } else if (request.type === "completion") {
      response = await this.processCompletion(
        request.model,
        request.prompt,
        request.maxToken,
        request.randomness
      )
    } else {
      console.error(
        "Request type not defined or does not match expected parameter. Exiting"
      )
    }

    // Save to database
  }

  private async processChat(
    model: string,
    prompt: string,
    maxTokens?: number,
    randomness?: number,
    systemMsg?: string
  ) {
    const chatPromptMsg = mapPromptToGPTMessage(prompt, systemMsg)

    return await this.gptClient.chatWithErrorHandling(
      chatPromptMsg,
      model,
      maxTokens,
      randomness
    )
  }

  private async processCompletion(
    model: string,
    prompt: string,
    maxTokens?: number,
    randomness?: number
  ): Promise<string> {
    return await this.gptClient.completeWithErrorHandling(
      prompt,
      model,
      maxTokens,
      randomness
    )
  }
}
