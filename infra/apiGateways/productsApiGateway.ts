import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export interface ProductsApiGatewayProperties {
  readonly createProductLambda: IFunction;
  readonly getProductLambda: IFunction;
  readonly getProductsLambda: IFunction;
  readonly updateProductLambda: IFunction;
  readonly deleteProductLambda: IFunction;
}

export class ProductsApiGateway extends Construct {
  constructor(scope: Construct, properties: ProductsApiGatewayProperties) {
    super(scope, 'ProductsApiGateway');

    const restApi = new RestApi(this, 'ProductsApiGateway', {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    });

    const products = restApi.root.addResource('products');

    products.addMethod('POST', new LambdaIntegration(properties.createProductLambda));
    products.addMethod('GET', new LambdaIntegration(properties.getProductsLambda));

    const product = products.addResource('{id}');

    product.addMethod('GET', new LambdaIntegration(properties.getProductLambda));
    product.addMethod('PUT', new LambdaIntegration(properties.updateProductLambda));
    product.addMethod('DELETE', new LambdaIntegration(properties.deleteProductLambda));
  }
}
