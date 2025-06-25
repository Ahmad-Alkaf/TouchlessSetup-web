'use client';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {ScrollArea} from '@/components/ui/scroll-area';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import {Separator} from '@/components/ui/separator';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet';
import {
	Check,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Filter,
	Grid3X3,
	List,
	Search,
	X
} from 'lucide-react';
import {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import AppCard from './app-item/app-card';
import {WinGetApp} from '@/lib/type';
import {SelectedAppsContext} from '../../SelectedAppsContext';
import {Tooltip, TooltipContent} from '@/components/ui/tooltip';
import {TooltipTrigger} from '@radix-ui/react-tooltip';
import {AppListItem} from './app-item/app-list';
import Link from '@/components/ui/link';

type SortOption =
	| 'nameAscending'
	| 'nameDescending'
	// | 'releaseDateNewest'
	// | 'releaseDateOldest';

export default function WingetApps({apps}: {apps: WinGetApp[]}) {
	const {
		selectedApps,
		installSelected,
		isSelected,
		toggleAppSelection
	} = useContext(SelectedAppsContext);
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [sortBy, setSortBy] = useState<SortOption>('nameAscending');
	const [currentPage, setCurrentPage] = useState(1);
	//! Implement view mode later AFTER grid view is implemented
	// const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	// const [isFilterOpen, setIsFilterOpen] = useState(false);
	// const [selectedWinget, setSelectedWinget] = useState<WinGetApp[]>([]);
	const [itemsPerPage, setItemsPerPage] = useState<number>(20);

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchTerm);
			setCurrentPage(1); // Reset to first page on search
		}, 300);
		return () => clearTimeout(timer);
	}, [searchTerm]);

	// Get unique tags and publishers for filters
	const tags = useMemo(
		() => [...new Set(apps.flatMap(app => app.tags))].sort(),
		[]
	);

	const publishers = useMemo(
		() => [...new Set(apps.map(app => app.publisher))].sort(),
		[]
	);

	// Filter and sort apps
	const filteredAndSortedApps = useMemo<WinGetApp[]>(() => {
		const filtered = apps.filter(app => {
			const matchesSearch =
				app.name
					.toLowerCase()
					.includes(debouncedSearch.toLowerCase()) ||
				app.shortDescription
					.toLowerCase()
					.includes(debouncedSearch.toLowerCase()) ||
				app.publisher
					.toLowerCase()
					.includes(debouncedSearch.toLowerCase()) ||
				app.tags.some(tag =>
					tag.toLowerCase().includes(debouncedSearch.toLowerCase())
				);

			return matchesSearch;
		});

		// Sort results
		filtered.sort((a, b) => {
			switch (sortBy) {
				// case 'releaseDateNewest':
				// 	return a.releaseDate == undefined
				// 		? 1
				// 		: b.releaseDate == undefined
				// 		? -1
				// 		: b.releaseDate.getTime() - a.releaseDate.getTime();
				// case 'releaseDateOldest':
				// 	return b.releaseDate == undefined
				// 		? 1
				// 		: a.releaseDate == undefined
				// 		? -1
				// 		: a.releaseDate.getTime() - b.releaseDate.getTime();
				case 'nameDescending':
					return b.name.localeCompare(a.name);
				case 'nameAscending':
				default:
					return a.name.localeCompare(b.name);
			}
		});

		return filtered;
	}, [debouncedSearch, selectedTags, sortBy]);

	// Pagination
	const totalPages = Math.ceil(filteredAndSortedApps.length / itemsPerPage);
	const paginatedApps = useMemo<WinGetApp[]>(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return filteredAndSortedApps.slice(start, start + itemsPerPage);
	}, [filteredAndSortedApps, currentPage, itemsPerPage]);

	const toggleTag = useCallback((tag: string) => {
		setSelectedTags(prev =>
			prev.includes(tag) ? prev.filter(c => c !== tag) : [...prev, tag]
		);
	}, []);

	const clearFilters = useCallback(() => {
		setSelectedTags([]);
		setSearchTerm('');
	}, []);

	// Reset to first page when items per page changes
	useEffect(() => {
		setCurrentPage(1);
	}, [itemsPerPage]);

	// Pagination Component
	const Pagination = () => (
		<div className="flex items-center w-full justify-between">
			<div className="flex items-center gap-2">
				{/* Items per page selector */}
				<Select
					value={String(itemsPerPage)}
					onValueChange={value =>
						setItemsPerPage(Math.max(parseInt(value, 10), 20))
					}>
					<SelectTrigger className="w-32">
						<SelectValue placeholder="Per page" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="20">20 / page</SelectItem>
						<SelectItem value="50">50 / page</SelectItem>
						<SelectItem value="100">100 / page</SelectItem>
						{/* <SelectItem value="1000">1000 / page</SelectItem>
						<SelectItem value="100000">All / page</SelectItem> */}
					</SelectContent>
				</Select>

				<div className="text-sm text-muted-foreground">
					Showing {(currentPage - 1) * itemsPerPage + (totalPages > 0 ? 1 : 0)} to{' '}
					{Math.min(
						currentPage * itemsPerPage,
						filteredAndSortedApps.length
					)}{' '}
					of {filteredAndSortedApps.length} apps
				</div>
			</div>
			<div className="flex items-center space-x-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => setCurrentPage(1)}
					disabled={currentPage === 1}>
					<ChevronsLeft className="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() =>
						setCurrentPage(prev => Math.max(1, prev - 1))
					}
					disabled={currentPage === 1}>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<span className="text-sm">
					Page {totalPages > 0 ? currentPage : 0} of {totalPages}
				</span>
				<Button
					variant="outline"
					size="sm"
					onClick={() =>
						setCurrentPage(prev => Math.min(totalPages, prev + 1))
					}
					disabled={currentPage === totalPages || totalPages === 0}>
					<ChevronRight className="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => setCurrentPage(totalPages)}
					disabled={currentPage === totalPages || totalPages === 0}>
					<ChevronsRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);

	return (
		<div className="w-full p-6 space-y-6">
			{/* Header */}
			<div className="space-y-4">
				{/* 
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">App Directory</h1>
						<p className="text-muted-foreground">
							Browse and select from{' '}
							{apps.length.toLocaleString()} available
							applications
						</p>
					</div> 
					<div className="flex items-center gap-2"></div>
				</div>
					*/}

				{/* Search and Filters */}
				<div className="flex gap-4">
					<div className="flex-1 relative">
						<Search className="absolute pointer-events-none left-3 top-3 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search for app, publisher, tag, or description..."
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
					<Select
						value={sortBy}
						onValueChange={(value: SortOption) => setSortBy(value)}>
						<SelectTrigger className="w-48">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="nameAscending">
								Name (Ascending)
							</SelectItem>
							<SelectItem value="nameDescending">
								Name (Descending)
							</SelectItem>
							{/* <SelectItem value="releaseDateNewest">
								Release Date (Newest First)
							</SelectItem>
							<SelectItem value="releaseDateOldest">
								Release Date (Oldest First)
							</SelectItem> */}
						</SelectContent>
					</Select>
					{/* <Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									setViewMode(
										viewMode === 'grid' ? 'list' : 'grid'
									)
								}>
								{viewMode === 'grid' ? (
									<List className="h-4 w-4" />
								) : (
									<Grid3X3 className="h-4 w-4" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							{viewMode === 'grid' ? 'List View' : 'Grid View'}
						</TooltipContent>
					</Tooltip> */}
					{/* <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
						<SheetTrigger asChild>
							<Button variant="outline">
								<Filter className="h-4 w-4 mr-2" />
								Filters
								{selectedTags.length > 0 && (
									<Badge variant="secondary" className="ml-2">
										{selectedTags.length}
									</Badge>
								)}
							</Button>
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<SheetTitle>Filter Apps</SheetTitle>
								<SheetDescription>
									Narrow down your search with these filters
								</SheetDescription>
							</SheetHeader>
							<div className="space-y-6 mt-6">
								<div>
									<Label className="text-sm font-medium">
										Tags
									</Label>
									<ScrollArea className="h-48 mt-2">
										<div className="space-y-2">
											{tags.map(tag => (
												<Label
													key={tag}
													className="flex items-center space-x-2 cursor-pointer">
													<Checkbox
														checked={selectedTags.includes(
															tag
														)}
														onCheckedChange={() =>
															toggleTag(tag)
														}
													/>
													<span className="text-sm">
														{tag}
													</span>
												</Label>
											))}
										</div>
									</ScrollArea>
								</div>

								<Separator />

								<Button
									variant="outline"
									onClick={clearFilters}
									className="w-full">
									Clear All Filters
								</Button>
							</div>
						</SheetContent>
					</Sheet> */}
				</div>

				{/* Selection Summary */}
				<div className="flex items-center justify-between px-4 min-h-10 bg-muted/50 rounded-lg">
					<div className="flex items-center gap-4">
						<span className="text-sm">
							<strong>{selectedApps.length}</strong> apps selected
						</span>
					</div>
					<div className="flex items-center gap-2">
						{selectedApps.length > 0 && (
							<Button size="sm" onClick={installSelected}>
								<Check className="h-4 w-4 mr-1" />
								Install Selected ({selectedApps.length})
							</Button>
						)}
					</div>
				</div>
			</div>

			{/* Results */}
			<div className="space-y-4">
				{filteredAndSortedApps.length === 0 ? (
					<div className="text-center py-12 w-full">
						<p className="text-muted-foreground">
							Did not find an app? Submit a issue to <Link href="https://github.com/microsoft/winget-pkgs/issues/new?template=package_request.yml" target="_blank" >Winget</Link>
						</p>
						<Button
							variant="outline"
							onClick={clearFilters}
							className="mt-4 mb-4">
							Clear Filters
						</Button>
					</div>
				) : (
					<>
						{/* {viewMode === 'grid' ? ( */}
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
							{paginatedApps.map(app => (
								<AppCard
									key={app.id}
									app={app}
									selected={isSelected(app)}
									onToggle={toggleAppSelection}
								/>
							))}
						</div>
						{/* ) : (
							<div className="flex flex-col gap-2">
								{paginatedApps.map(app => (
									<AppListItem key={app.id} app={app} />
								))}
							</div>
						 )} */}
					</>
				)}
				<Pagination />
			</div>
		</div>
	);
}
