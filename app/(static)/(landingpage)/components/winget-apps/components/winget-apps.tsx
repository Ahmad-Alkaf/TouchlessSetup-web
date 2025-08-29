'use client';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import {Check, Search, X} from 'lucide-react';
import {useCallback, useContext, useEffect, useState} from 'react';
import AppCard from './components/app-item/app-card';
import {WinGetApp} from '@/lib/type';
import {SelectedAppsContext} from '../../context';
import Link from '@/components/ui/link';
import Pagination from './components/pagination';
import {SortOption} from '@/actions/load-winget-apps';
import Loading from '@/app/(static)/loading';
import GenerateInstallerBtn from '../../selected-apps-actions/generate-installer-btn';

export default function WingetApps({apps}: {apps: WinGetApp[]}) {
	const {
		selectedApps,
		installSelected,
		isSelected,
		toggleAppSelection,
		take,
		skip,
		setTake,
		setSkip,
		sortBy,
		setSortBy,
		totalFilteredApps,
		isLoading,
		setSearchTerm: setDebounceSearchTerm
	} = useContext(SelectedAppsContext);
	const [search, setSearch] = useState('');
	// const [selectedTags, setSelectedTags] = useState<string[]>([]);
	//! Implement view mode later AFTER grid view is implemented
	// const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	// const [isFilterOpen, setIsFilterOpen] = useState(false);
	// const [selectedWinget, setSelectedWinget] = useState<WinGetApp[]>([]);

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebounceSearchTerm(search);
			setSkip(0); // Reset skip to 0 on search
		}, 400);
		return () => clearTimeout(timer);
	}, [search, setSkip, setTake]);

	// Pagination
	const totalPages = Math.ceil(totalFilteredApps / take);
	const currentPage = Math.floor(skip / take) + 1;

	const clearFilters = useCallback(() => {
		// setSelectedTags([]);
		setSearch('');
		setSkip(0); // Reset pagination when clearing filters
	}, [setSkip]);

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
				<div className="md:flex grid gap-4">
					<div className="md:flex-1 w-full relative">
						<Search className="absolute pointer-events-none left-3 top-3 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search for app, publisher, tag, or description..."
							value={search}
							onChange={e => setSearch(e.target.value)}
							className="pl-10"
						/>
					</div>
					{/* <Select
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
							</SelectItem> */}
					{/* <SelectItem value="releaseDateNewest">
								Release Date (Newest First)
							</SelectItem>
							<SelectItem value="releaseDateOldest">
								Release Date (Oldest First)
							</SelectItem> */}
					{/* </SelectContent>
					</Select> */}
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
						<GenerateInstallerBtn />
					</div>
				</div>
			</div>

			{/* Results */}
			<div className="space-y-4">
				{isLoading ? (
					<Loading />
				) : totalFilteredApps === 0 ? (
					<div className="text-center py-12 w-full">
						<p className="text-muted-foreground">
							Did not find an app? Submit a issue to{' '}
							<Link
								href="https://github.com/microsoft/winget-pkgs/issues/new?template=package_request.yml"
								target="_blank">
								Winget
							</Link>
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
							{apps.map(app => (
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
				<Pagination
					setCurrentPage={useCallback(
						pageAction => {
							const page =
								typeof pageAction === 'function'
									? pageAction(Math.floor(skip / take) + 1)
									: pageAction;
							setSkip((page - 1) * take);
						},
						[setSkip, skip, take]
					)}
					currentPage={currentPage}
					itemsPerPage={take}
					setItemsPerPage={setTake}
					totalPages={totalPages}
					totalItems={totalFilteredApps}
				/>
			</div>
		</div>
	);
}
