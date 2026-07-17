import 'react-i18next'

declare module 'react-i18next' {
	interface CustomTypeOptions {
		defaultNS: 'translation'
		resources: {
			translation: {
				config: { select_language: string }
				errors: Record<string, string>
				common: { back: string; confirm: string; cancel: string }
				nav: { menu: string; dev: string; tables: string }
				access: {
					back: string
					enter_pin: string
					subtitle: string
					unlock: string
					unlocking: string
					invalid_pin: string
					saved_note: string
				}
				tables: {
					find_title: string
					search_placeholder: string
					all_tables: string
					full: string
					load_error: string
					none_found: string
				}
				roster: {
					people_here: string
					empty: string
					host: string
					remove: string
					add_placeholder: string
					remove_title: string
					remove_desc: string
					link_copied: string
					share: string
					not_found: string
					add_failed: string
					remove_failed: string
				}
				menu: {
					our_menu: string
					restaurant_name: string
					restaurant_en: string
					restaurant_location: string
					tagline: string
					dishes_available: string
					search_placeholder: string
					all_categories: string
					no_dishes_title: string
					no_dishes_desc: string
					menu_empty_title: string
					menu_empty_desc: string
					clear_filters: string
					error_title: string
					error_desc: string
					try_again: string
					showing: string
					verified: string
					unavailable: string
					popular: string
				}
				health: Record<string, string>
				dev: Record<string, unknown>
			}
		}
	}
}
