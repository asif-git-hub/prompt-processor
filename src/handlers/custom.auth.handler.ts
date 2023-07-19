import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
} from "aws-lambda"
import { SSMClient } from "../aws/ssm.client"
import { getEnvVar } from "../utils/common.utils"

const ssmClient = new SSMClient()

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  try {
    console.log(event)

    const authorizationToken = event.authorizationToken

    if (!authorizationToken) {
      // If the token is missing, deny access
      return generatePolicy("user", "Deny", event.methodArn)
    }

    // Extract the token value
    const token = authorizationToken.split(" ")[1]

    // Perform token validation or verification
    const ssmToken = await ssmClient.getParameter(getEnvVar("TOKEN_SSM"))

    if (token === ssmToken) {
      // If the token is valid, generate an IAM policy
      console.log("[SUCCESS]: Token valid")
      return generatePolicy("user", "Allow", event.methodArn)
    } else {
        console.log("[DENIED]: Token Invalid")
      // If the token is invalid, deny access
      return generatePolicy("user", "Deny", event.methodArn)
    }
  } catch (error) {
    // If there's an error during authorization, deny access
    console.log("[ERROR]: Denied access due to error")
    return generatePolicy("user", "Deny", event.methodArn)
  }
}

// Helper function to generate the IAM policy
const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string
): APIGatewayAuthorizerResult => {
  const authResponse: APIGatewayAuthorizerResult = {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  }

  return authResponse
}
