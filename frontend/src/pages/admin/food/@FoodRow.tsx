import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Trash2, Plus } from 'lucide-react'
import type { FoodDetailDto, CategoryItemDto } from '@/api/model'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { TableRow, TableCell } from '@/components/ui/table'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { DebouncedInput } from '@/components/common/DebouncedInput'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { cn } from '@/utils/shadcn'

interface FoodRowProps {
	food: FoodDetailDto
	categories: CategoryItemDto[]
	selected: boolean
	onToggleSelect: () => void
	onUpdate: (patch: {
		name?: string
		categoryId?: string
		isAvailable?: boolean
		shouldCalculate?: boolean
	}) => void
	onDelete: () => void
	onAddVariant: (label: string, price: number) => void
	onUpdateVariant: (
		variantId: string,
		patch: { label?: string; price?: number; isAvailable?: boolean }
	) => void
	onRemoveVariant: (variantId: string) => void
}

export function FoodRow({
	food,
	categories,
	selected,
	onToggleSelect,
	onUpdate,
	onDelete,
	onAddVariant,
	onUpdateVariant,
	onRemoveVariant,
}: FoodRowProps) {
	const { t } = useTranslation()
	const [expanded, setExpanded] = useState(false)
	const [confirmOpen, setConfirmOpen] = useState(false)
	const [newVariantLabel, setNewVariantLabel] = useState('')
	const [newVariantPrice, setNewVariantPrice] = useState('')

	return (
		<>
			<TableRow>
				<TableCell>
					<Checkbox checked={selected} onCheckedChange={onToggleSelect} />
				</TableCell>
				<TableCell className='min-w-48'>
					<DebouncedInput
						value={food.name}
						onCommit={name => onUpdate({ name })}
						className='h-8 rounded-full'
					/>
				</TableCell>
				<TableCell className='min-w-36'>
					<Select
						value={food.categoryId ?? undefined}
						onValueChange={categoryId => onUpdate({ categoryId })}
					>
						<SelectTrigger className='h-8 w-full rounded-full'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{categories.map(c => (
								<SelectItem key={c.id} value={c.id}>
									{c.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</TableCell>
				<TableCell>
					<Switch
						checked={food.isAvailable}
						onCheckedChange={isAvailable => onUpdate({ isAvailable })}
					/>
				</TableCell>
				<TableCell>
					<Switch
						checked={food.shouldCalculate}
						onCheckedChange={shouldCalculate => onUpdate({ shouldCalculate })}
					/>
				</TableCell>
				<TableCell>
					<button
						type='button'
						onClick={() => setExpanded(v => !v)}
						className='flex items-center gap-1 rounded-full border border-border/60 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground'
					>
						{t('admin.food.variants_count', { count: food.variants.length })}
						<ChevronDown
							className={cn(
								'size-3.5 transition-transform',
								expanded && 'rotate-180'
							)}
						/>
					</button>
				</TableCell>
				<TableCell>
					<button
						type='button'
						onClick={() => setConfirmOpen(true)}
						aria-label={t('admin.food.delete')}
						className='rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive'
					>
						<Trash2 className='size-4' />
					</button>
				</TableCell>
			</TableRow>

			{expanded && (
				<TableRow>
					<TableCell colSpan={7} className='whitespace-normal bg-muted/40'>
						<div className='flex flex-col gap-2 py-1'>
							{food.variants.map(v => (
								<div key={v.id} className='flex flex-wrap items-center gap-2'>
									<DebouncedInput
										value={v.label}
										onCommit={label => onUpdateVariant(v.id, { label })}
										className='h-8 w-32 rounded-full'
									/>
									<DebouncedInput
										type='number'
										value={String(v.price ?? '')}
										onCommit={price =>
											onUpdateVariant(v.id, { price: Number(price) || 0 })
										}
										className='h-8 w-24 rounded-full'
									/>
									<span className='text-xs text-muted-foreground'>
										{v.currency}
									</span>
									<Switch
										checked={v.isAvailable}
										onCheckedChange={isAvailable =>
											onUpdateVariant(v.id, { isAvailable })
										}
									/>
									<button
										type='button'
										onClick={() => onRemoveVariant(v.id)}
										aria-label={t('admin.food.delete')}
										className='rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive'
									>
										<Trash2 className='size-3.5' />
									</button>
								</div>
							))}

							<div className='flex flex-wrap items-center gap-2 pt-1'>
								<input
									value={newVariantLabel}
									onChange={e => setNewVariantLabel(e.target.value)}
									placeholder={t('admin.food.variant_label_placeholder')}
									className='h-8 w-32 rounded-full border border-border/60 bg-card px-3 text-sm outline-none focus:border-ring'
								/>
								<input
									type='number'
									value={newVariantPrice}
									onChange={e => setNewVariantPrice(e.target.value)}
									placeholder={t('admin.food.variant_price_placeholder')}
									className='h-8 w-24 rounded-full border border-border/60 bg-card px-3 text-sm outline-none focus:border-ring'
								/>
								<Button
									size='sm'
									variant='outline'
									className='h-8 gap-1 rounded-full'
									disabled={!newVariantLabel.trim()}
									onClick={() => {
										onAddVariant(
											newVariantLabel.trim(),
											Number(newVariantPrice) || 0
										)
										setNewVariantLabel('')
										setNewVariantPrice('')
									}}
								>
									<Plus className='size-3.5' />
									{t('admin.food.add_variant')}
								</Button>
							</div>
						</div>
					</TableCell>
				</TableRow>
			)}

			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title={t('admin.food.delete_title', { name: food.name })}
				description={t('admin.food.delete_desc')}
				confirmLabel={t('admin.food.delete')}
				onConfirm={() => {
					onDelete()
					setConfirmOpen(false)
				}}
			/>
		</>
	)
}
