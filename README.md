## 1. Set up S3 deployment bucket
Create a bucket in s3 to store deployment artifacts. 
You can name it "prompt-processor-assets". If you choose a different name, make sure you update the package.json deploy command.

## 2. Ensure you have the right IAM Role
Make sure you use the right IAM role with enough priviledges to deploy this stack

### 3. Build lambda packages
Run "npm run build"
This will build all the lambda packages

## 4. Deploy
Run "npm run deploy:dev" or "npm run deploy:prod"
This will deploy all the necessary infrastructure

## 5. Setting up Auth token
You should set up your openai token in SSM Parameter with name "/openai/apikey"
The api gateway token will be stored in a SSM parameter with name "/dev/resources/api/token" or "/prod/resources/api/token"
You can choose to replace the default token with a new token.

## 6. Testing the API
Get the api endpoint by:
1. Go to API Gateway
2. Click on the api created : dev-prompt-processor-api
3. From the left hand side menu, Click on Stages
4. Select the dev stage dropdown
5. There should be two methods with the same path, for example:
    a. POST: https://hbibhxq3ha.execute-api.ap-southeast-2.amazonaws.com/dev/gpt/prompt
    b. GET: https://hbibhxq3ha.execute-api.ap-southeast-2.amazonaws.com/dev/gpt/prompt

6. Use an api testing tool like Postman to send requests

## 7. Sending Prompts via API

The POST request body:

json```
{
    "type": "chat",
    "model": "gpt-3.5-turbo",
    "prompt": "What is a recipe for a tiramisu?",
    "systemMsg": "You are the best chef in the world",
    "randomness": 0.7,
    "maxToken": 1000
}
```

Optional fields: systemMsg, randomness, maxToken
The type has to be either chat or completion
Note: Before selecting a model, ensure it is valid by going to openai documentation

Once you receive a response, you can take the id and initiate a GET request:

https://hbibhxq3ha.execute-api.ap-southeast-2.amazonaws.com/dev/gpt/prompt?id=a59cb146-ccc8-4a49-aa7a-d2f11ca64566

This will return all the necessary contents.

## 8. Error handling

In dynamoDB if the processStatus is ERROR, you can check gptResponse for the cause. 
You can inspect Cloudwatch logs to drill down on specific errors too. 
The queue will retry a payload once before sending it to a Deadletter Queue.