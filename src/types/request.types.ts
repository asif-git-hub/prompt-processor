import { InferType } from "yup"
import {
  promptApiRequestBodySchema,
  promptRequestSchema,
} from "../validtor/schema/request.shema"

export type PromptRequest = InferType<typeof promptRequestSchema>

export type PromptRequestBody = InferType<typeof promptApiRequestBodySchema>
