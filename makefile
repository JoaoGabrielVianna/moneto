run-user-service:
	clear
	@cd services/user/ && go run cmd/main.go

run-income-service:
	clear
	@cd services/income/ && go run cmd/main.go
	
run-expense-service:
	clear
	@cd services/expense-service/ && go run cmd/main.go
	
run-category-service:
	clear
	@cd services/category-service/ && go run cmd/main.go


docs:
	@cd services/user-service && swag init -g cmd/main.go -o services/user-service/internal/docs/
	@cd services/income-service && swag init -g cmd/main.go -o services/income-service/internal/docs/
	
	@echo "✅ Documentação Swagger gerada com sucesso em services/user-service/internal/docs/"