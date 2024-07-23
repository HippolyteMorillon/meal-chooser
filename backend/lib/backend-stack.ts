import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import path from "path";

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Rest Api
    const mealChooserApi = new cdk.aws_apigateway.RestApi(
      this,
      "mealChooserApi",
      {}
    );

    // restaurant ressource
    const restaurantResource = mealChooserApi.root.addResource("restaurant");
    const restaurantResourceWithRestaurantId =
      restaurantResource.addResource("{restaurantId}");

    // restaurant table
    const restaurantsTable = new cdk.aws_dynamodb.Table(
      this,
      "restaurantsTable",
      {
        partitionKey: {
          name: "PK",
          type: cdk.aws_dynamodb.AttributeType.STRING,
        },
        sortKey: {
          name: "SK",
          type: cdk.aws_dynamodb.AttributeType.STRING,
        },
        billingMode: cdk.aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      }
    );

    const getRestaurantFunction = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "getRestaurantFunction",
      {
        entry: path.join(__dirname, "getRestaurant", "handler.ts"),
        handler: "handler",
        environment: {
          TABLE_NAME: restaurantsTable.tableName,
        },
      }
    );
    restaurantsTable.grantReadData(getRestaurantFunction);
    restaurantResourceWithRestaurantId.addMethod(
      "GET",
      new cdk.aws_apigateway.LambdaIntegration(getRestaurantFunction)
    );

    const createRestaurantFunction = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "createRestaurantFunction",
      {
        entry: path.join(__dirname, "createRestaurant", "handler.ts"),
        handler: "handler",
        environment: {
          TABLE_NAME: restaurantsTable.tableName,
        },
      }
    );
    restaurantsTable.grantWriteData(createRestaurantFunction);
    restaurantResource.addMethod(
      "POST",
      new cdk.aws_apigateway.LambdaIntegration(createRestaurantFunction)
    );

    const getAllRestaurantsFunction = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "getAllRestaurantsFunction",
      {
        entry: path.join(__dirname, "getAllRestaurants", "handler.ts"),
        handler: "handler",
        environment: {
          TABLE_NAME: restaurantsTable.tableName,
        },
      }
    );
    restaurantsTable.grantReadData(getAllRestaurantsFunction);
    restaurantResource.addMethod(
      "GET",
      new cdk.aws_apigateway.LambdaIntegration(getAllRestaurantsFunction)
    );

    const deleteRestaurantFunction = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "deleteRestaurantFunction",
      {
        entry: path.join(__dirname, "deleteRestaurant", "handler.ts"),
        handler: "handler",
        environment: {
          TABLE_NAME: restaurantsTable.tableName,
        },
      }
    );
    restaurantsTable.grantWriteData(deleteRestaurantFunction);
    restaurantResourceWithRestaurantId.addMethod(
      "DELETE",
      new cdk.aws_apigateway.LambdaIntegration(deleteRestaurantFunction)
    );
  }
}
