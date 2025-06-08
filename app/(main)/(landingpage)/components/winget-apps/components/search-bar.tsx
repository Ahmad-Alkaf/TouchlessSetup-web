import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
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
	Clock,
	Download,
	Filter,
	Grid3X3,
	List,
	Search,
	Star,
	X
} from 'lucide-react';
import {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {AppCard, AppListItem} from './app-item';
import {WinGetApp} from '@/lib/type';
import {SelectedAppsContext} from '../../SelectedAppsContext';
import {Tooltip, TooltipTrigger} from '@/components/ui/tooltip';
import {TooltipContent} from '@radix-ui/react-tooltip';

// Simulated large dataset - in real app this would come from API
const generateApps: (count: number) => WinGetApp[] = count => {
	const categories = [
		'Productivity',
		'Development',
		'Design',
		'Communication',
		'Entertainment',
		'Business',
		'Education',
		'Utilities',
		'Games',
		'Social',
		'Finance',
		'Health',
		'Travel',
		'News',
		'Photography',
		'Music',
		'Video',
		'Security'
	];

	const companies = [
		'Microsoft',
		'Google',
		'Apple',
		'Adobe',
		'Slack',
		'Zoom',
		'Figma',
		'Notion',
		'Spotify',
		'Discord',
		'GitHub',
		'JetBrains',
		'Atlassian'
	];

	const appNames = [
		'Studio',
		'Pro',
		'Express',
		'Lite',
		'Premium',
		'Enterprise',
		'Cloud',
		'Desktop',
		'Mobile',
		'Web',
		'Plus',
		'Advanced',
		'Standard',
		'Basic'
	];

	return Array.from(
		{length: count},
		(_, i) =>
			({
				id: appNames[i % appNames.length] + i,
				description: `A powerful ${categories[
					i % categories.length
				].toLowerCase()} application for modern workflows`,
				name: appNames[i % appNames.length],
				publisher: companies[i % companies.length],
				releaseDate: new Date(
					Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
				),
				tags: categories.slice(0, Math.floor(Math.random() * 3) + 1),
				version: `${Math.floor(Math.random() * 20)}.${Math.floor(
					Math.random() * 20
				)}.${Math.floor(Math.random() * 20)}`
			} as WinGetApp)
	);
};

const APPS = generateApps(5000); // Simulate 5000 apps
const ITEMS_PER_PAGE = 20;

type SortOption =
	| 'nameAscending'
	| 'nameDescending'
	| 'releaseDateNewest'
	| 'releaseDateOldest';

type ViewMode = 'grid' | 'list';
export default function SearchBar() {
	const {selectedApps, setSelectedApps} = useContext(SelectedAppsContext);
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [sortBy, setSortBy] = useState<SortOption>('nameAscending');
	const [currentPage, setCurrentPage] = useState(1);
	const [viewMode, setViewMode] = useState<ViewMode>('grid');
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [selectedWinget, setSelectedWinget] = useState<WinGetApp[]>([]);

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
		() => [...new Set(APPS.flatMap(app => app.tags))].sort(),
		[]
	);

	const publishers = useMemo(
		() => [...new Set(APPS.map(app => app.publisher))].sort(),
		[]
	);

	// Filter and sort apps
	const filteredAndSortedApps = useMemo<WinGetApp[]>(() => {
		const filtered = APPS.filter(app => {
			const matchesSearch =
				app.name
					.toLowerCase()
					.includes(debouncedSearch.toLowerCase()) ||
				app.description
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
				case 'releaseDateNewest':
					return b.releaseDate.getTime() - a.releaseDate.getTime();
				case 'releaseDateOldest':
					return a.releaseDate.getTime() - b.releaseDate.getTime();
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
	const totalPages = Math.ceil(filteredAndSortedApps.length / ITEMS_PER_PAGE);
	const paginatedApps = useMemo<WinGetApp[]>(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		return filteredAndSortedApps.slice(start, start + ITEMS_PER_PAGE);
	}, [filteredAndSortedApps, currentPage]);

	const toggleTag = useCallback((tag: string) => {
		setSelectedTags(prev =>
			prev.includes(tag) ? prev.filter(c => c !== tag) : [...prev, tag]
		);
	}, []);

	const clearFilters = useCallback(() => {
		setSelectedTags([]);
		setSearchTerm('');
	}, []);

	// Pagination Component
	const Pagination = () => (
		<div className="flex items-center justify-between">
			<div className="text-sm text-muted-foreground">
				Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
				{Math.min(
					currentPage * ITEMS_PER_PAGE,
					filteredAndSortedApps.length
				)}{' '}
				of {filteredAndSortedApps.length} apps
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
					Page {currentPage} of {totalPages}
				</span>
				<Button
					variant="outline"
					size="sm"
					onClick={() =>
						setCurrentPage(prev => Math.min(totalPages, prev + 1))
					}
					disabled={currentPage === totalPages}>
					<ChevronRight className="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => setCurrentPage(totalPages)}
					disabled={currentPage === totalPages}>
					<ChevronsRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);

	return (
		<div className="max-w-7xl mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						{/* <h1 className="text-3xl font-bold">App Directory</h1>
						<p className="text-muted-foreground">
							Browse and select from{' '}
							{APPS.length.toLocaleString()} available
							applications
						</p> */}
					</div>
					<div className="flex items-center gap-2">
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
					</div>
				</div>

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
							<SelectItem value="releaseDateNewest">
								Release Date (Newest First)
							</SelectItem>
							<SelectItem value="releaseDateOldest">
								Release Date (Oldest First)
							</SelectItem>
						</SelectContent>
					</Select>
					<Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
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
								{/* Categories */}
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
					</Sheet>
				</div>

				{/* Selection Summary */}
				<div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
					<div className="flex items-center gap-4">
						<span className="text-sm">
							<strong>{selectedApps.length}</strong> apps selected
						</span>
						{selectedApps.length > 0 && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setSelectedApps(prev =>
										prev.filter(v =>
											selectedWinget
												.map(a => a.id)
												.includes(v.id)
										)
									);
									setSelectedWinget([]);
								}}>
								<X className="h-4 w-4 mr-1" />
								Clear Selection
							</Button>
						)}
					</div>
					<div className="flex items-center gap-2">
						{selectedApps.length > 0 && (
							<Button size="sm">
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
					<div className="text-center py-12">
						<p className="text-muted-foreground">
							No apps found matching your criteria
						</p>
						<Button
							variant="outline"
							onClick={clearFilters}
							className="mt-4">
							Clear Filters
						</Button>
					</div>
				) : (
					<>
						{viewMode === 'grid' ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
								{paginatedApps.map(app => (
									<AppCard key={app.id} app={app} />
								))}
							</div>
						) : (
							<div className="space-y-2">
								{paginatedApps.map(app => (
									<AppListItem key={app.id} app={app} />
								))}
							</div>
						)}

						<Pagination />
					</>
				)}
			</div>
		</div>
	);
}
