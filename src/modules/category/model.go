package category

type Category struct {
	ID          string  `gorm:"primaryKey;type:varchar(255);not null" json:"id"`
	Name        string  `gorm:"type:varchar(255);uniqueIndex;not null" json:"name"`
	Description *string `gorm:"type:text" json:"description"`
}

func (Category) TableName() string {
	return "category"
}
