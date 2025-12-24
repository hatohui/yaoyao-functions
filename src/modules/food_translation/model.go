package food_translation

type FoodTranslation struct {
	FoodID      string  `gorm:"primaryKey;type:varchar(255);not null;constraint:OnDelete:CASCADE" json:"foodId"`
	Language    string  `gorm:"primaryKey;type:varchar(10);not null;constraint:OnDelete:CASCADE" json:"language"`
	Name        string  `gorm:"type:varchar(255);not null" json:"name"`
	Description *string `gorm:"type:text" json:"description"`
}

func (FoodTranslation) TableName() string {
	return "food_translation"
}
