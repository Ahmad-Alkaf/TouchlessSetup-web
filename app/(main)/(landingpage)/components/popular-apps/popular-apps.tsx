import {Card, CardContent} from '@/components/ui/card';
import Category from './components/category';
import {CATEGORIES} from './components/CATEGORIES';

export default function PopularApps() {
	return (
			<Card>
				<div className="text-center space-y-2">
					<h1 id="popular-apps" className="text-3xl font-bold">Popular Apps</h1>
					<p className="text-muted-foreground">
						List of popular apps users find helpful
					</p>
				</div>
				<CardContent>
					<div className="space-y-6">
						<div className="grid gap-4">
							{CATEGORIES.map(category => (
								<Category
									key={category.name}
									category={category}
								/>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
	);
}
