import { number, object, string } from "yup"

export const promptApiRequestBodySchema = object({
  model: string().required(),
  prompt: string().required(),
  type: string().required().oneOf(["chat", "completion"]),
  systemMsg: string().optional(),
  maxToken: number().optional().positive().integer(),
  randomness: number().optional().positive(),
})

export const promptRequestSchema = promptApiRequestBodySchema.shape({
  id: string().required(),
})
