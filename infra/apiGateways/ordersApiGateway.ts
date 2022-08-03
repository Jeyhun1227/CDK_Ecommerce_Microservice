import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export interface OrdersApiGatewayProperties {
  readonly getOrdersLambda: IFunction;
}

export class OrdersApiGateway extends Construct {
  constructor(scope: Construct, properties: OrdersApiGatewayProperties) {
    super(scope, 'OrdersApiGateway');

    const restApi = new RestApi(this, 'OrdersApiGateway', {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    });

    const orders = restApi.root.addResource('orders');

    orders.addMethod('GET', new LambdaIntegration(properties.getOrdersLambda));
  }
}
