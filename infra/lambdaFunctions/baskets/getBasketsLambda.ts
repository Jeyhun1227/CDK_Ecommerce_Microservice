import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

export interface GetBasketsLambdaProperties {
  readonly basketsTable: ITable;
}

export class GetBasketsLambda extends Construct {
  public readonly instance: NodejsFunction;

  constructor(scope: Construct, properties: GetBasketsLambdaProperties) {
    super(scope, 'GetBasketsLambdaFunction');

    const getBasketsFunction = new NodejsFunction(this, 'GetBasketsLambdaFunction', {
      bundling: {
        externalModules: ['aws-sdk'],
      },
      environment: {
        DB_TABLE_NAME: properties.basketsTable.tableName,
      },
      runtime: Runtime.NODEJS_16_X,
      entry: join(__dirname, '/../../../app/baskets/controllers/getBaskets.ts'),
    });

    properties.basketsTable.grantReadWriteData(getBasketsFunction);

    this.instance = getBasketsFunction;
  }
}
