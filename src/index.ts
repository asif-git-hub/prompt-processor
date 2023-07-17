import { validateApiPromptRequestBody } from "./validtor/request.validator"

const req = {
  model: "asdad",
}

validateApiPromptRequestBody(JSON.stringify(req))
