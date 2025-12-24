package preset_menu_food

type PresetMenuFood struct {
	PresetID  string `gorm:"primaryKey;type:varchar(255);not null" json:"presetId"`
	VariantID string `gorm:"primaryKey;type:varchar(255);not null" json:"variantId"`
	Quantity  int    `gorm:"default:1;not null;check:quantity > 0" json:"quantity"`
}

func (PresetMenuFood) TableName() string {
	return "preset_menu_food"
}
