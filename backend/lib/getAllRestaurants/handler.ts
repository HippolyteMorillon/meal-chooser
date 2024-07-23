import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (): Promise<{
  statusCode: number;
  body: string;
}> => {
  const params = {
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: {
      ":pk": { S: "RESTAURANT" },
    },
    TableName: process.env.TABLE_NAME,
  };

  const { Items = [] as any } = await client.send(new QueryCommand(params));

  return {
    statusCode: 200,
    body: JSON.stringify({
      restaurants: Items,
    }),
  };
};
