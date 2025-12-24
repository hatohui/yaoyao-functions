package cmd

import (
	"log"
	"yaoyao-functions/src/modules/account"
	"yaoyao-functions/src/modules/category"
	"yaoyao-functions/src/modules/category_translation"
	"yaoyao-functions/src/modules/language"
	"yaoyao-functions/src/modules/people"
	"yaoyao-functions/src/modules/table"

	"gorm.io/gorm"
)

func SeedInitialData(db *gorm.DB) error {
	log.Println("🌱 Seeding initial data...")

	// Seed Languages
	languages := []language.Language{
		{Code: "en", Name: "English", Direction: "LTR"},
		{Code: "zh", Name: "中文 (Chinese)", Direction: "LTR"},
		{Code: "ms", Name: "Bahasa Melayu", Direction: "LTR"},
		{Code: "ta", Name: "தமிழ் (Tamil)", Direction: "LTR"},
	}
	
	for _, lang := range languages {
		if err := db.FirstOrCreate(&lang, language.Language{Code: lang.Code}).Error; err != nil {
			return err
		}
	}
	log.Println("✓ Seeded: Languages")

	// Seed Categories
	categories := []category.Category{
		{ID: "cat-appetizers", Name: "Appetizers", Description: strPtr("Start your meal with these delicious starters")},
		{ID: "cat-main-course", Name: "Main Course", Description: strPtr("Our signature dishes")},
		{ID: "cat-desserts", Name: "Desserts", Description: strPtr("Sweet endings to your meal")},
		{ID: "cat-beverages", Name: "Beverages", Description: strPtr("Refreshing drinks")},
		{ID: "cat-soup", Name: "Soup", Description: strPtr("Warm and comforting soups")},
	}
	
	for _, cat := range categories {
		if err := db.FirstOrCreate(&cat, category.Category{ID: cat.ID}).Error; err != nil {
			return err
		}
	}
	log.Println("✓ Seeded: Categories")

	// Seed Category Translations
	categoryTranslations := []category_translation.CategoryTranslation{
		// Appetizers
		{CategoryID: "cat-appetizers", Language: "en", Name: "Appetizers", Description: strPtr("Start your meal with these delicious starters")},
		{CategoryID: "cat-appetizers", Language: "zh", Name: "开胃菜", Description: strPtr("美味的开胃菜")},
		{CategoryID: "cat-appetizers", Language: "ms", Name: "Pembuka Selera", Description: strPtr("Mulakan hidangan anda dengan hidangan pembuka yang lazat")},
		
		// Main Course
		{CategoryID: "cat-main-course", Language: "en", Name: "Main Course", Description: strPtr("Our signature dishes")},
		{CategoryID: "cat-main-course", Language: "zh", Name: "主菜", Description: strPtr("我们的招牌菜")},
		{CategoryID: "cat-main-course", Language: "ms", Name: "Hidangan Utama", Description: strPtr("Hidangan istimewa kami")},
		
		// Desserts
		{CategoryID: "cat-desserts", Language: "en", Name: "Desserts", Description: strPtr("Sweet endings to your meal")},
		{CategoryID: "cat-desserts", Language: "zh", Name: "甜点", Description: strPtr("甜蜜的结尾")},
		{CategoryID: "cat-desserts", Language: "ms", Name: "Pencuci Mulut", Description: strPtr("Pengakhiran manis untuk hidangan anda")},
		
		// Beverages
		{CategoryID: "cat-beverages", Language: "en", Name: "Beverages", Description: strPtr("Refreshing drinks")},
		{CategoryID: "cat-beverages", Language: "zh", Name: "饮料", Description: strPtr("清爽的饮品")},
		{CategoryID: "cat-beverages", Language: "ms", Name: "Minuman", Description: strPtr("Minuman yang menyegarkan")},
		
		// Soup
		{CategoryID: "cat-soup", Language: "en", Name: "Soup", Description: strPtr("Warm and comforting soups")},
		{CategoryID: "cat-soup", Language: "zh", Name: "汤", Description: strPtr("温暖舒适的汤")},
		{CategoryID: "cat-soup", Language: "ms", Name: "Sup", Description: strPtr("Sup yang hangat dan selesa")},
	}
	
	for _, ct := range categoryTranslations {
		if err := db.FirstOrCreate(&ct, category_translation.CategoryTranslation{
			CategoryID: ct.CategoryID,
			Language:   ct.Language,
		}).Error; err != nil {
			return err
		}
	}
	log.Println("✓ Seeded: Category Translations")

	// Seed Tables
	tables := []table.Table{
		{ID: "table-01", Name: "Table 1", Capacity: 4, IsStaging: false},
		{ID: "table-02", Name: "Table 2", Capacity: 2, IsStaging: false},
		{ID: "table-03", Name: "Table 3", Capacity: 6, IsStaging: false},
		{ID: "table-04", Name: "Table 4", Capacity: 4, IsStaging: false},
		{ID: "table-05", Name: "Table 5", Capacity: 8, IsStaging: false},
		{ID: "table-vip", Name: "VIP Room", Capacity: 10, IsStaging: false},
		{ID: "table-staging", Name: "Staging Area", Capacity: 1, IsStaging: true},
	}
	
	for _, tbl := range tables {
		if err := db.FirstOrCreate(&tbl, table.Table{ID: tbl.ID}).Error; err != nil {
			return err
		}
	}
	log.Println("✓ Seeded: Tables")

	// Seed Test Accounts
	accounts := []account.Account{
		{UserID: "admin-001", Username: "admin", Password: "$2a$10$YourHashedPasswordHere1"}, // In real app, use proper hashing
		{UserID: "staff-001", Username: "waiter1", Password: "$2a$10$YourHashedPasswordHere2"},
		{UserID: "staff-002", Username: "chef", Password: "$2a$10$YourHashedPasswordHere3"},
	}
	
	for _, acc := range accounts {
		if err := db.FirstOrCreate(&acc, account.Account{UserID: acc.UserID}).Error; err != nil {
			return err
		}
	}
	log.Println("✓ Seeded: Accounts")

	// Seed Sample People
	samplePeople := []people.People{
		{ID: "person-001", Name: "张伟", TableID: strPtr("table-01")},
		{ID: "person-002", Name: "王芳", TableID: strPtr("table-01")},
		{ID: "person-003", Name: "Ahmad", TableID: strPtr("table-02")},
		{ID: "person-004", Name: "Siti", TableID: strPtr("table-03")},
		{ID: "person-005", Name: "John Smith", TableID: strPtr("table-03")},
	}
	
	for _, p := range samplePeople {
		if err := db.FirstOrCreate(&p, people.People{ID: p.ID}).Error; err != nil {
			return err
		}
	}
	log.Println("✓ Seeded: People")

	log.Println("✅ Seeding completed!")
	return nil
}

// Helper function to create string pointers
func strPtr(s string) *string {
	return &s
}
