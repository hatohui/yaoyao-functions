package food_variant

type FoodVariant struct {
	ID          string   `gorm:"primaryKey;type:varchar(255);not null" json:"id"`
	FoodID      string   `gorm:"type:varchar(255);not null;constraint:OnDelete:CASCADE" json:"foodId"`
	Label       string   `gorm:"type:varchar(255);not null" json:"label"`
	Price       *float64 `gorm:"type:decimal(10,2)" json:"price"`
	Currency    string   `gorm:"type:varchar(10);default:'RM'" json:"currency"`
	IsSeasonal  bool     `gorm:"default:false" json:"isSeasonal"`
	IsAvailable bool     `gorm:"default:false" json:"isAvailable"`
}

func (FoodVariant) TableName() string {
	return "food_variant"
}
