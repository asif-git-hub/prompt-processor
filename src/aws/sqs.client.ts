import { SQS } from "aws-sdk"

export class SQSClient {
  private sqsClient: SQS

  constructor() {
    this.sqsClient = new SQS()
  }

  public async publish(queueUrl: string, messageObject: string) {
    console.log("publish() called", { queueUrl, messageObject })

    await this.sqsClient
      .sendMessage({
        QueueUrl: queueUrl,
        MessageBody: messageObject,
      })
      .promise()
  }
}
