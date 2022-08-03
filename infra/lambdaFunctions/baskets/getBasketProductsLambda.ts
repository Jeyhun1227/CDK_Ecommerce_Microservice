import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

export interface GetBasketProductsLambdaProperties {
  readonly basketsTable: ITable;
}

export class GetBasketProductsLambda extends Construct {
  public readonly instance: NodejsFunction;

  constructor(scope: Construct, properties: GetBasketProductsLambdaProperties) {
    super(scope, 'GetBasketProductsLambdaFunction');

    const getBasketProductsFunction = new NodejsFunction(this, 'GetBasketProductsLambdaFunction', {
      bundling: {
        externalModules: ['aws-sdk'],
      },
      environment: {
        DB_TABLE_NAME: properties.basketsTable.tableName,
      },
      runtime: Runtime.NODEJS_16_X,
      entry: join(__dirname, '/../../../app/baskets/controllers/getBasketProducts.ts'),
    });

    properties.basketsTable.grantReadWriteData(getBasketProductsFunction);

    this.instance = getBasketProductsFunction;
  }
}
