import { DynamoDBClient } from "../aws/dynamodb.client"
import { getEnvVar } from "../utils/common.utils"

export type PromptRecord = {
  id: string
  prompt: string
  model: string
  gptResponse?: string
  processStatus: "PROCESSING" | "SUCCESSFUL" | "ERROR"
  createdAt: string
  updatedAt: string
}

export class PromptRepository {
  private dynamoDBClient: DynamoDBClient
  private tableName: string

  constructor() {
    this.dynamoDBClient = new DynamoDBClient()
    this.tableName = getEnvVar("PROMPT_TABLE")
  }

  public async saveRecord(item: PromptRecord) {
    await this.dynamoDBClient.put(this.tableName, item)
  }

  public async updateResponse(
    id: string,
    gptResponse: string,
    processStatus: "SUCCESSFUL" | "ERROR"
  ) {
    await this.dynamoDBClient.updateRecord(
      this.tableName,
      { id },
      { gptResponse, processStatus, updatedAt: new Date().toISOString() }
    )
  }

  public async get(id: string): Promise<PromptRecord> {
    return (await this.dynamoDBClient.getByHashKey(
      this.tableName,
      "id",
      id
    )) as PromptRecord
  }
}
