package preset_menu

type PresetMenu struct {
	ID    string  `gorm:"primaryKey;type:varchar(255);not null" json:"id"`
	Price float64 `gorm:"type:decimal(10,2);not null;default:1;check:price > 0" json:"price"`
}

func (PresetMenu) TableName() string {
	return "preset_menu"
}
