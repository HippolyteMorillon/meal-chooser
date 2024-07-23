import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event: {
  pathParameters: { restaurantId?: string };
}): Promise<{
  statusCode: number;
  body: string;
}> => {
  const { restaurantId } = event.pathParameters ?? {};

  if (restaurantId === undefined) {
    return {
      statusCode: 400,
      body: "bad request",
    };
  }

  const { Item } = await client.send(
    new GetItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: { S: "RESTAURANT" },
        SK: { S: restaurantId },
      },
    })
  );

  if (Item === undefined) {
    return {
      statusCode: 404,
      body: "not found",
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      id: restaurantId,
    }),
  };
};
