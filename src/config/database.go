package config

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect(connectionString string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(connectionString), &gorm.Config{})

	if err != nil {
		return nil, fmt.Errorf("[POSTGRES] Error connecting to database: %w", err)
	}

	return db, nil
}

func ConnectWithEnv() (*gorm.DB, error) {
	host := GetEnvOr("DB_HOST", "localhost")
	port := GetEnvOr("DB_PORT", "5432")
	user := GetEnvOr("DB_USER", "admin")
	password := GetEnvOr("DB_PASSWORD", "password")
	dbname := GetEnvOr("DB_NAME", "authorizationdb")
	sslmode := GetEnvOr("DB_SSLMODE", "disable")

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbname, sslmode)

	return Connect(dsn)
}
