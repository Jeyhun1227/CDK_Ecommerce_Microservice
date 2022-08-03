import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

export interface GetProductLambdaProperties {
  readonly productsTable: ITable;
}

export class GetProductLambda extends Construct {
  public readonly instance: NodejsFunction;

  constructor(scope: Construct, properties: GetProductLambdaProperties) {
    super(scope, 'GetProductLambdaFunction');

    const getProductFunction = new NodejsFunction(this, 'GetProductLambdaFunction', {
      bundling: {
        externalModules: ['aws-sdk'],
      },
      environment: {
        DB_TABLE_NAME: properties.productsTable.tableName,
      },
      runtime: Runtime.NODEJS_16_X,
      entry: join(__dirname, '/../../../app/products/controllers/getProduct.ts'),
    });

    properties.productsTable.grantReadWriteData(getProductFunction);

    this.instance = getProductFunction;
  }
}
