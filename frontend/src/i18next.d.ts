import 'react-i18next'

declare module 'react-i18next' {
	interface CustomTypeOptions {
		defaultNS: 'translation'
		resources: {
			translation: {
				config: { select_language: string }
				errors: Record<string, string>
				common: {
					back: string
					confirm: string
					cancel: string
					save: string
					loading: string
				}
				nav: { menu: string; dev: string; tables: string; feedback: string }
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
					restaurant_name: string
					restaurant_en: string
					restaurant_location: string
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
					unavailable: string
					popular: string
					select_item: string
					selected_count: string
					clear_selection: string
					add_to_order: string
					adding: string
					open_your_table: string
					added_to_order: string
					add_failed: string
				}
				food_detail: {
					back_to_menu: string
					variants: string
					add_to_order: string
					not_found: string
				}
				tabs: { people: string; orders: string; your_split: string }
				orders: {
					shared: string
					personal: string
					split_n: string
					remove: string
					remove_title: string
					remove_desc: string
					empty: string
					total: string
					update_failed: string
					remove_failed: string
				}
				split: {
					title: string
					just_me: string
					whole_table: string
					choose_people: string
					who_are_you: string
					viewing_as: string
					not_you: string
					empty: string
					your_total: string
				}
				notes: { title: string; placeholder: string; empty: string }
				feedback: {
					title: string
					name_placeholder: string
					content_placeholder: string
					post: string
					post_failed: string
					anonymous: string
					sort_recent: string
					sort_top: string
					empty: string
				}
				floor_plan: { title: string; view_map: string; empty: string }
				health: Record<string, string>
				dev: Record<string, unknown>
			}
		}
	}
}
