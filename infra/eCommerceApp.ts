#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ECommerceAppStack } from './eCommerceAppStack';

const app = new cdk.App();
new ECommerceAppStack(app, 'ECommerceAppStack');
