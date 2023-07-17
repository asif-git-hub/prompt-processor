import { HttpClient } from "./http.client"
import { AxiosResponse, AxiosHeaders, AxiosError } from "axios"
import { PromptCompletionError } from "../errors/prompt.completion.error"
import { getEnvVar } from "../utils/common.utils"
import {
  ChatGPTCustomErrorType,
  ChatGPTMessageType,
  CustomChatGPTError,
} from "./types/chatgpt.client.types"
import { SSMClient } from "../aws/ssm.client"

export class ChatGPTClient {
  private httpClient: HttpClient
  private apiKey

  constructor() {
    this.httpClient = new HttpClient()
    this.apiKey = new SSMClient().getParameter("/openai/apikey")
  }

  async chat(
    messages: ChatGPTMessageType[],
    model = "gpt-3.5-turbo",
    maxTokens = 1500,
    randomness = 0.1
  ) {
    console.log("chat() called", messages)

    const body = {
      model,
      messages,
      max_tokens: maxTokens,
      temperature: randomness,
      n: 1,
      stream: false,
    }

    const apiKey = await this.apiKey

    const headers = new AxiosHeaders({
      Authorization: `Bearer ${apiKey}`,
    })

    const response = await this.httpClient.post(
      getEnvVar("OPENAI_CHAT_URL"),
      body,
      headers
    )

    return response.data?.choices[0]?.text
  }

  async chatWithErrorHandling(
    messages: ChatGPTMessageType[],
    model = "gpt-3.5-turbo",
    maxTokens = 1500,
    randomness = 0.1
  ): Promise<string> {
    try {
      console.log("chatWithErrorHandling() called", {
        messages,
        model,
        maxTokens,
        randomness,
      })

      const body = {
        model,
        messages,
        max_tokens: maxTokens,
        temperature: randomness,
        n: 1,
        stream: false,
      }

      const apiKey = await this.apiKey

      const headers = new AxiosHeaders({
        Authorization: `Bearer ${apiKey}`,
      })

      const response = await this.httpClient.post(
        getEnvVar("OPENAI_CHAT_URL"),
        body,
        headers
      )

      return response.data?.choices[0]?.text
    } catch (e) {
      return this.handleError(e)
    }
  }

  async complete(
    prompt: string,
    model = "text-davinci-003",
    maxTokens = 1500,
    randomness = 0.1
  ): Promise<AxiosResponse> {
    try {
      console.log("complete() called", prompt)

      const body = {
        model,
        prompt,
        max_tokens: maxTokens,
        temperature: randomness,
        n: 1,
        stream: false,
      }

      const apiKey = await this.apiKey

      const headers = new AxiosHeaders({
        Authorization: `Bearer ${apiKey}`,
      })

      return await this.httpClient.post(
        getEnvVar("OPENAI_COMPLETION_URL"),
        body,
        headers
      )
    } catch (e) {
      console.error("unable to execute complete() ", e)
      throw new PromptCompletionError("Unable to process prompt")
    }
  }

  async completeWithErrorHandling(
    prompt: string,
    model = "text-davinci-003",
    maxTokens = 1500,
    randomness = 0.1
  ): Promise<string> {
    try {
      console.log("completeWithErrorHandling() called", {
        prompt,
        model,
        maxTokens,
        randomness,
      })

      const body = {
        model,
        prompt,
        max_tokens: maxTokens,
        temperature: randomness,
        n: 1,
        stream: false,
      }

      const apiKey = await this.apiKey

      const headers = new AxiosHeaders({
        Authorization: `Bearer ${apiKey}`,
      })

      const response = await this.httpClient.post(
        getEnvVar("OPENAI_COMPLETION_URL"),
        body,
        headers
      )

      return response.data?.choices[0]?.text
    } catch (e) {
      return this.handleError(e)
    }
  }

  private handleError(e: unknown): string {
    let reason: string = CustomChatGPTError.UNKNOWN

    if (e instanceof AxiosError) {
      console.warn(
        `unable to perform complete, status code ${e.response?.statusText}: ${e.response?.status}`
      )

      if (e.response?.status === 400) {
        console.error(
          "Likely exceding model token size",
          JSON.stringify(e.response.data)
        )
        reason = `${CustomChatGPTError.TOKEN_LIMIT} - ${e.response.data.message}`
      }

      if (e.response?.status === 404) {
        console.error("Likely wrong model", JSON.stringify(e.response.data))
        reason = `${CustomChatGPTError.INVALID_MODEL} - ${e.response.data.message}`
      }

      if (e.response?.status === 429) {
        console.warn(
          "Rate limit reached! Skipping this request and wait for 10s before invoking next request",
          JSON.stringify(e.response.data)
        )
        reason = `${CustomChatGPTError.RATE_LIMIT} - ${e.response.data.message}`
      }
    } else {
      console.warn("unable to perform complete() due to non axios error: ", e)
      throw e
    }
    return reason
  }
}
