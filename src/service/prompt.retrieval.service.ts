import { PromptRecord, PromptRepository } from "../repository/prompt.repository"
import { ValidationError } from "../errors/validation.error"
import { NotFoundError } from "../errors/notfound.error"

export class PromptRetrievalService {
  private promptRepo: PromptRepository

  constructor() {
    this.promptRepo = new PromptRepository()
  }

  async getPrompt(id: string | undefined): Promise<PromptRecord> {
    console.log("getPrompt() called", { id })

    if (!id) {
      console.error("No id found in query parameter")
      throw new ValidationError("Missing parameter")
    }

    const record = await this.promptRepo.get(id)

    if (!record) {
      console.error("No record found for id")
      throw new NotFoundError("record not found")
    }

    console.log("getPrompt() completed", record)

    return record
  }
}
