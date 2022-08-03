import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

export interface GetOrdersLambdaProperties {
  readonly ordersTable: ITable;
}

export class GetOrdersLambda extends Construct {
  public readonly instance: NodejsFunction;

  constructor(scope: Construct, properties: GetOrdersLambdaProperties) {
    super(scope, 'GetOrdersLambdaFunction');

    const getOrdersFunction = new NodejsFunction(this, 'GetOrdersLambdaFunction', {
      bundling: {
        externalModules: ['aws-sdk'],
      },
      environment: {
        DB_TABLE_NAME: properties.ordersTable.tableName,
      },
      runtime: Runtime.NODEJS_16_X,
      entry: join(__dirname, '/../../../app/orders/controllers/getOrders.ts'),
    });

    properties.ordersTable.grantReadWriteData(getOrdersFunction);

    this.instance = getOrdersFunction;
  }
}
