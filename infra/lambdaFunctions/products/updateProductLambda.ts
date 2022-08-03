import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

export interface UpdateProductLambdaProperties {
  readonly productsTable: ITable;
}

export class UpdateProductLambda extends Construct {
  public readonly instance: NodejsFunction;

  constructor(scope: Construct, properties: UpdateProductLambdaProperties) {
    super(scope, 'UpdateProductLambdaFunction');

    const updateProductFunction = new NodejsFunction(this, 'UpdateProductLambdaFunction', {
      bundling: {
        externalModules: ['aws-sdk'],
      },
      environment: {
        DB_TABLE_NAME: properties.productsTable.tableName,
      },
      runtime: Runtime.NODEJS_16_X,
      entry: join(__dirname, '/../../../app/products/controllers/updateProduct.ts'),
    });

    properties.productsTable.grantReadWriteData(updateProductFunction);

    this.instance = updateProductFunction;
  }
}
