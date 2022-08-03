import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export interface BasketsApiGatewayProperties {
  readonly createBasketLambda: IFunction;
  readonly getBasketLambda: IFunction;
  readonly getBasketsLambda: IFunction;
  readonly deleteBasketLambda: IFunction;
  readonly checkoutBasketLambda: IFunction;
  readonly addProductToBasketLambda: IFunction;
  readonly deleteProductFromBasketLambda: IFunction;
  readonly getBasketProductsLambda: IFunction;
}

export class BasketsApiGateway extends Construct {
  constructor(scope: Construct, properties: BasketsApiGatewayProperties) {
    super(scope, 'BasketsApiGateway');

    const restApi = new RestApi(this, 'BasketsApiGateway', {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    });

    const baskets = restApi.root.addResource('baskets');

    baskets.addMethod('POST', new LambdaIntegration(properties.createBasketLambda));
    baskets.addMethod('GET', new LambdaIntegration(properties.getBasketsLambda));

    const basket = baskets.addResource('{id}');

    basket.addMethod('GET', new LambdaIntegration(properties.getBasketLambda));
    basket.addMethod('DELETE', new LambdaIntegration(properties.deleteBasketLambda));

    const basketProducts = basket.addResource('products');

    basketProducts.addMethod('POST', new LambdaIntegration(properties.addProductToBasketLambda));
    basketProducts.addMethod('GET', new LambdaIntegration(properties.getBasketProductsLambda));

    const basketProduct = basketProducts.addResource('{productId}');

    basketProduct.addMethod('DELETE', new LambdaIntegration(properties.deleteProductFromBasketLambda));

    const basketCheckout = baskets.addResource('checkout');

    basketCheckout.addMethod('POST', new LambdaIntegration(properties.checkoutBasketLambda));
  }
}
