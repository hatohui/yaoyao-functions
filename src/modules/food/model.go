package food

type Food struct {
	ID          string  `gorm:"primaryKey;type:varchar(255)" json:"id"`
	Name        string  `gorm:"type:varchar(255);not null" json:"name"`
	ImageURL    *string `gorm:"type:varchar(500)" json:"imageUrl"`
	Description *string `gorm:"type:text" json:"description"`
	CategoryID  string  `gorm:"type:varchar(255);not null" json:"categoryId"`
	IsAvailable bool    `gorm:"default:true" json:"isAvailable"`
	IsChecked   bool   `gorm:"default:true" json:"isChecked"`
}

func (Food) TableName() string {
	return "food"
}
