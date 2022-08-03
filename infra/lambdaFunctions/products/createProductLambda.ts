import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

export interface CreateProductLambdaProperties {
  readonly productsTable: ITable;
}

export class CreateProductLambda extends Construct {
  public readonly instance: NodejsFunction;

  constructor(scope: Construct, properties: CreateProductLambdaProperties) {
    super(scope, 'CreateProductLambdaFunction');

    const createProductFunction = new NodejsFunction(this, 'CreateProductLambdaFunction', {
      bundling: {
        externalModules: ['aws-sdk'],
      },
      environment: {
        DB_TABLE_NAME: properties.productsTable.tableName,
      },
      runtime: Runtime.NODEJS_16_X,
      entry: join(__dirname, '/../../../app/products/controllers/createProduct.ts'),
    });

    properties.productsTable.grantReadWriteData(createProductFunction);

    this.instance = createProductFunction;
  }
}
