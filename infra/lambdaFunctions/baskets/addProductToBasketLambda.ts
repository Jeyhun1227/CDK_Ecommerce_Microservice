import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

export interface AddProductToBasketLambdaProperties {
  readonly basketsTable: ITable;
}

export class AddProductToBasketLambda extends Construct {
  public readonly instance: NodejsFunction;

  constructor(scope: Construct, properties: AddProductToBasketLambdaProperties) {
    super(scope, 'AddProductToBasketLambdaFunction');

    const addProductToBasketFunction = new NodejsFunction(this, 'AddProductToBasketLambdaFunction', {
      bundling: {
        externalModules: ['aws-sdk'],
      },
      environment: {
        DB_TABLE_NAME: properties.basketsTable.tableName,
      },
      runtime: Runtime.NODEJS_16_X,
      entry: join(__dirname, '/../../../app/baskets/controllers/addProductToBasket.ts'),
    });

    properties.basketsTable.grantReadWriteData(addProductToBasketFunction);

    this.instance = addProductToBasketFunction;
  }
}
