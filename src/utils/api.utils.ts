import { APIGatewayProxyResult } from "aws-lambda"

export function createSuccessResponse<T>(response: T): APIGatewayProxyResult {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  }
}

export function createBadRequest(): APIGatewayProxyResult {
  return {
    statusCode: 400,
    body: "BAD REQUEST",
  }
}

export function createInternalError(): APIGatewayProxyResult {
  return {
    statusCode: 500,
    body: "Internal Error",
  }
}

export function createNotFoundError(): APIGatewayProxyResult {
  return {
    statusCode: 404,
    body: "NOT FOUND",
  }
}
