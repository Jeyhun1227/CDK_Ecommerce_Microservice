import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

export interface CreateBasketLambdaProperties {
  readonly basketsTable: ITable;
}

export class CreateBasketLambda extends Construct {
  public readonly instance: NodejsFunction;

  constructor(scope: Construct, properties: CreateBasketLambdaProperties) {
    super(scope, 'CreateBasketLambdaFunction');

    const createBasketFunction = new NodejsFunction(this, 'CreateBasketLambdaFunction', {
      bundling: {
        externalModules: ['aws-sdk'],
      },
      environment: {
        DB_TABLE_NAME: properties.basketsTable.tableName,
      },
      runtime: Runtime.NODEJS_16_X,
      entry: join(__dirname, '/../../../app/baskets/controllers/createBasket.ts'),
    });

    properties.basketsTable.grantReadWriteData(createBasketFunction);

    this.instance = createBasketFunction;
  }
}
