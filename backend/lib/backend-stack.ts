import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import path from "path";

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new cdk.aws_lambda_nodejs.NodejsFunction(this, "myFirstLambda", {
      entry: path.join(__dirname, "myFirstLambda", "handler.ts"),
      handler: "handler",
    });
  }
}
