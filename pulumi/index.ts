import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';

// Get the default VPC
const defaultVpc = aws.ec2.getVpc({ default: true });

// Get subnets from the default VPC
const defaultSubnets = defaultVpc.then((vpc) =>
  aws.ec2.getSubnets({
    filters: [
      {
        name: 'vpc-id',
        values: [vpc.id],
      },
    ],
  })
);

// Create a Lambda function for hello-world
const lambdaRole = new aws.iam.Role('lambda-role', {
  assumeRolePolicy: JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: {
          Service: 'lambda.amazonaws.com',
        },
      },
    ],
  }),
});

// Attach basic execution policy to Lambda role
const lambdaRolePolicy = new aws.iam.RolePolicyAttachment(
  'lambda-role-policy',
  {
    role: lambdaRole.name,
    policyArn:
      'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
  }
);

// Create the hello-world Lambda function
const helloWorldLambda = new aws.lambda.Function('hello-world-lambda', {
  runtime: aws.lambda.Runtime.NodeJS18dX,
  code: new pulumi.asset.AssetArchive({
    'index.js': new pulumi.asset.StringAsset(`
exports.handler = async (event) => {
    console.log("Event: ", JSON.stringify(event, null, 2));
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: "Hello from FinanceApp Lambda!",
            timestamp: new Date().toISOString(),
            event: event
        }),
    };
};
        `),
  }),
  handler: 'index.handler',
  role: lambdaRole.arn,
  timeout: 30,
});

// Create API Gateway REST API
const api = new aws.apigateway.RestApi('finance-api', {
  name: 'finance-api',
  description: 'FinanceApp API Gateway',
});

// Create API Gateway resource
const apiResource = new aws.apigateway.Resource('hello-resource', {
  restApi: api.id,
  parentId: api.rootResourceId,
  pathPart: 'hello',
});

// Create API Gateway method
const apiMethod = new aws.apigateway.Method('hello-method', {
  restApi: api.id,
  resourceId: apiResource.id,
  httpMethod: 'GET',
  authorization: 'NONE',
});

// Create Lambda permission for API Gateway
const lambdaPermission = new aws.lambda.Permission('lambda-permission', {
  action: 'lambda:InvokeFunction',
  function: helloWorldLambda.name,
  principal: 'apigateway.amazonaws.com',
  sourceArn: pulumi.interpolate`${api.executionArn}/*`,
});

// Create API Gateway integration
const apiIntegration = new aws.apigateway.Integration('hello-integration', {
  restApi: api.id,
  resourceId: apiResource.id,
  httpMethod: apiMethod.httpMethod,
  integrationHttpMethod: 'POST',
  type: 'AWS_PROXY',
  uri: helloWorldLambda.invokeArn,
});

// Create API Gateway deployment
const apiDeployment = new aws.apigateway.Deployment(
  'api-deployment',
  {
    restApi: api.id,
    triggers: {
      redeployment: pulumi
        .all([apiResource.id, apiMethod.id, apiIntegration.id])
        .apply(([resourceId, methodId, integrationId]) =>
          JSON.stringify({
            resourceId,
            methodId,
            integrationId,
            timestamp: Date.now(),
          })
        ),
    },
  },
  {
    dependsOn: [apiMethod, apiIntegration, lambdaPermission],
  }
);

// Create API Gateway stage
const apiStage = new aws.apigateway.Stage('api-stage', {
  restApi: api.id,
  deployment: apiDeployment.id,
  stageName: 'dev',
});

// Create RDS subnet group for free tier PostgreSQL
const subnetGroup = new aws.rds.SubnetGroup('finance-db-subnet-group', {
  subnetIds: defaultSubnets.then((subnets) => subnets.ids.slice(0, 2)),
  tags: {
    Name: 'FinanceApp-DB-SubnetGroup',
  },
});

// Create security group for RDS
const dbSecurityGroup = new aws.ec2.SecurityGroup('finance-db-sg', {
  description: 'Security group for FinanceApp RDS instance',
  vpcId: defaultVpc.then((vpc) => vpc.id),
  ingress: [
    {
      protocol: 'tcp',
      fromPort: 5432,
      toPort: 5432,
      cidrBlocks: ['0.0.0.0/0'], // NOTE: Restrict this in production
    },
  ],
  egress: [
    {
      protocol: '-1',
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ['0.0.0.0/0'],
    },
  ],
  tags: {
    Name: 'FinanceApp-DB-SecurityGroup',
  },
});

// Create RDS PostgreSQL instance (Free Tier)
const dbInstance = new aws.rds.Instance('finance-db', {
  identifier: 'finance-app-db',
  engine: 'postgres',
  engineVersion: '16.4', // Using a valid version
  instanceClass: 'db.t3.micro', // Free tier eligible
  allocatedStorage: 20, // Free tier: up to 20GB
  storageType: 'gp2',

  dbName: 'financeapp',
  username: 'financeuser',
  password: 'temp-password-123', // TODO: Use AWS Secrets Manager

  vpcSecurityGroupIds: [dbSecurityGroup.id],
  dbSubnetGroupName: subnetGroup.name,

  backupRetentionPeriod: 7,
  backupWindow: '03:00-04:00',
  maintenanceWindow: 'sun:04:00-sun:05:00',

  skipFinalSnapshot: true, // For dev environment
  deletionProtection: false, // For dev environment

  tags: {
    Name: 'FinanceApp-Dev-DB',
    Environment: 'development',
  },
});

// Export important values
export const apiUrl = pulumi.interpolate`${api.id}.execute-api.${aws.getRegion().then((region) => region.name)}.amazonaws.com/${apiStage.stageName}`;
export const apiInvokeUrl = pulumi.interpolate`https://${api.id}.execute-api.${aws.getRegion().then((region) => region.name)}.amazonaws.com/${apiStage.stageName}`;
export const lambdaArn = helloWorldLambda.arn;
export const dbEndpoint = dbInstance.endpoint;
export const dbPort = dbInstance.port;
export const dbName = dbInstance.dbName;
