import { ChatGPTMessageType } from "../clients/types/chatgpt.client.types"

export function mapPromptToGPTMessage(
  prompt: string,
  systemMsg?: string
): ChatGPTMessageType[] {
  let promptSysem: ChatGPTMessageType | undefined = undefined

  const promptmsg: ChatGPTMessageType[] = [
    {
      role: "user",
      content: prompt,
    },
  ]

  if (systemMsg) {
    promptSysem = {
      role: "system",
      content: systemMsg,
    }
    promptmsg.unshift(promptSysem)
  }

  return promptmsg
}
