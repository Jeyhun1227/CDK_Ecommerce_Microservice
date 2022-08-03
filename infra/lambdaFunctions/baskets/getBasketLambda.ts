import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

export interface GetBasketLambdaProperties {
  readonly basketsTable: ITable;
}

export class GetBasketLambda extends Construct {
  public readonly instance: NodejsFunction;

  constructor(scope: Construct, properties: GetBasketLambdaProperties) {
    super(scope, 'GetBasketLambdaFunction');

    const getBasketFunction = new NodejsFunction(this, 'GetBasketLambdaFunction', {
      bundling: {
        externalModules: ['aws-sdk'],
      },
      environment: {
        DB_TABLE_NAME: properties.basketsTable.tableName,
      },
      runtime: Runtime.NODEJS_16_X,
      entry: join(__dirname, '/../../../app/baskets/controllers/getBasket.ts'),
    });

    properties.basketsTable.grantReadWriteData(getBasketFunction);

    this.instance = getBasketFunction;
  }
}
