import { ChatGPTClient } from "../clients/chatgpt.client"
import { ChatGPTCustomErrorType, CustomChatGPTError } from '../clients/types/chatgpt.client.types';
import { mapPromptToGPTMessage } from "../mapper/gpt.mapper"
import { PromptRequest } from "../types/request.types"
import { PromptRepository } from "../repository/prompt.repository"

export class PromptService {
  private gptClient: ChatGPTClient
  private promptRepo: PromptRepository

  constructor() {
    this.gptClient = new ChatGPTClient()
    this.promptRepo = new PromptRepository()
  }

  public async process(request: PromptRequest) {
    console.log("process() called ", request)

    try {
      let gptResponse: string | ChatGPTCustomErrorType = ""
      let processStatus: "SUCCESSFUL" | "ERROR" = "ERROR"
  
      if (request.type === "chat") {
        gptResponse = await this.processChat(
          request.model,
          request.prompt,
          request.maxToken,
          request.randomness,
          request.systemMsg
        )
      } else if (request.type === "completion") {
        gptResponse = await this.processCompletion(
          request.model,
          request.prompt,
          request.maxToken,
          request.randomness
        )
      } else {
        console.error(
          "Request type not defined or does not match expected parameter. Exiting"
        )
        return
      }
  
      console.log("gptResponse: ", gptResponse)
  
      if (typeof gptResponse === "string") {
        processStatus = "SUCCESSFUL"
      } else {
        processStatus = "ERROR"
        gptResponse = `${gptResponse.reason} ${
          gptResponse.response ? gptResponse : ""
        }`
      }
  
      await this.promptRepo.updateResponse(request.id, gptResponse, processStatus)
  
      console.log("process() finished", {
        id: request.id,
        gptResponse,
        processStatus,
      })

    } catch (e) {
      console.error("process() failed", e)
      await this.promptRepo.updateResponse(request.id, CustomChatGPTError.UNKNOWN, "ERROR")
      throw e;
    }

  }

  private async processChat(
    model: string,
    prompt: string,
    maxTokens?: number,
    randomness?: number,
    systemMsg?: string
  ): Promise<string | ChatGPTCustomErrorType> {
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
  ): Promise<string | ChatGPTCustomErrorType> {
    return await this.gptClient.completeWithErrorHandling(
      prompt,
      model,
      maxTokens,
      randomness
    )
  }
}
