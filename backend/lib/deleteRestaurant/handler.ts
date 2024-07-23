import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

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
  const restaurantSortId = uuidv4();

  await client.send(
    new DeleteItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: { S: "RESTAURANT" },
        SK: { S: restaurantSortId },
      },
    })
  );

  return {
    statusCode: 200,
    body: "Restaurant deleted",
  };
};
