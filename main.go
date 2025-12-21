package main

import (
	"context"
	"log"
	server "yaoyao-functions/src/cmd"
	"yaoyao-functions/src/common"
	"yaoyao-functions/src/config"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/gin-gonic/gin"
)

var ginLambda *ginadapter.GinLambda

func init() {
	gin.SetMode(gin.ReleaseMode)

	r := server.Start()
	ginLambda = ginadapter.New(r)
}

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	return ginLambda.ProxyWithContext(ctx, req)
}

func main() {
	if err := config.LoadEnv(); err != nil {
		log.Println("WARNING: Error loading .env file: %v", err)
	}

	_, err := config.ConnectWithEnv()
	log.Println("[INIT] Database connection established.")
	
	if err != nil {
		log.Fatalf("[INIT] Failed to connect to database: %v", err)
	}

	if config.GetEnvOr(common.LAMBDA_NAME_ENV, "") != "" {
		log.Println("[INIT] Lambda function started.")
		
		lambda.Start(Handler)
		return 
	}

	log.Println("[INIT] Server started in server mode.")
	server.Start().Run()
}