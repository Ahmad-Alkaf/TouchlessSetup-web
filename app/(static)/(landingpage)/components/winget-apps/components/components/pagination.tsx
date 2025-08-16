import {Button} from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight
} from 'lucide-react';
import {Dispatch, SetStateAction} from 'react';

export default function Pagination({
	setCurrentPage,
	currentPage,
	itemsPerPage,
	setItemsPerPage,
	totalPages,
	totalItems
}: {
	setCurrentPage: Dispatch<SetStateAction<number>>;
	currentPage: number;
	itemsPerPage: number;
	setItemsPerPage: Dispatch<SetStateAction<number>>;
	totalPages: number;
	totalItems: number;
}) {
	return (
		<div className="flex items-center w-full justify-between">
			<div className="flex items-center gap-2">
				{/* Items per page selector */}
				<Select
					value={itemsPerPage.toString()}
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
					Showing{' '}
					{(currentPage - 1) * itemsPerPage +
						(totalPages > 0 ? 1 : 0)}{' '}
					to {Math.min(currentPage * itemsPerPage, totalItems)} of{' '}
					{totalItems} apps
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
}
