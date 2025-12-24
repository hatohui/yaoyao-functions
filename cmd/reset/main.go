package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
	"yaoyao-functions/src/cmd"
	"yaoyao-functions/src/config"
	"yaoyao-functions/src/modules/account"
	"yaoyao-functions/src/modules/category"
	"yaoyao-functions/src/modules/category_translation"
	"yaoyao-functions/src/modules/feedback"
	"yaoyao-functions/src/modules/food"
	"yaoyao-functions/src/modules/food_translation"
	"yaoyao-functions/src/modules/food_variant"
	"yaoyao-functions/src/modules/language"
	"yaoyao-functions/src/modules/order"
	"yaoyao-functions/src/modules/people"
	"yaoyao-functions/src/modules/personal_note"
	"yaoyao-functions/src/modules/preset_menu"
	"yaoyao-functions/src/modules/preset_menu_food"
	"yaoyao-functions/src/modules/table"
)

func main() {
	config.LoadEnv()

	db, err := config.ConnectWithEnv()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("Failed to get database instance:", err)
	}
	defer sqlDB.Close()

	// Confirmation prompt
	fmt.Println("⚠️  WARNING: This will DROP ALL TABLES and DELETE ALL DATA!")
	fmt.Print("Are you sure you want to continue? (type 'yes' to confirm): ")
	
	reader := bufio.NewReader(os.Stdin)
	response, err := reader.ReadString('\n')
	if err != nil {
		log.Fatal("Failed to read input:", err)
	}
	
	response = strings.TrimSpace(strings.ToLower(response))
	if response != "yes" {
		log.Println("❌ Reset cancelled.")
		return
	}

	log.Println("🔥 Starting database reset...")

	// Drop tables in reverse order (to handle foreign key constraints)
	log.Println("Dropping all tables...")
	
	if err := db.Migrator().DropTable(
		&preset_menu_food.PresetMenuFood{},
		&preset_menu.PresetMenu{},
		&order.Order{},
	); err != nil {
		log.Printf("Warning: Failed to drop some tables: %v", err)
	}
	log.Println("✓ Dropped: Order, PresetMenu, PresetMenuFood")

	if err := db.Migrator().DropTable(
		&feedback.Feedback{},
		&personal_note.PersonalNote{},
		&category_translation.CategoryTranslation{},
		&food_translation.FoodTranslation{},
		&food_variant.FoodVariant{},
		&account.Account{},
	); err != nil {
		log.Printf("Warning: Failed to drop some tables: %v", err)
	}
	log.Println("✓ Dropped: Account, FoodVariant, FoodTranslation, CategoryTranslation, PersonalNote, Feedback")

	if err := db.Migrator().DropTable(
		&people.People{},
		&table.Table{},
		&food.Food{},
	); err != nil {
		log.Printf("Warning: Failed to drop some tables: %v", err)
	}
	log.Println("✓ Dropped: Food, Table, People")

	if err := db.Migrator().DropTable(
		&category.Category{},
		&language.Language{},
	); err != nil {
		log.Printf("Warning: Failed to drop some tables: %v", err)
	}
	log.Println("✓ Dropped: Language, Category")

	log.Println("✅ All tables dropped successfully!")

	// Re-run migrations and seeds
	log.Println("🔄 Running migrations and seeding data...")
	
	if err := cmd.MigrateAndSeed(db); err != nil {
		log.Fatal("[DATABASE] Failed to migrate database:", err)
	}

	log.Println("✅ Database reset completed successfully!")
}
