import { writable } from 'svelte/store';

export const language = writable('en');

export const translations = {
	en: {
		home: 'Home',
		realEstate: 'Real Estate',
		products: 'Products',
		sell: 'Sell',
		about: 'About Us',
		contact: 'Contact',

		buy: 'Buy',
		find: 'Find',

		search: 'Search',
		searchPlaceholder: 'What are you looking for?',
		allCategories: 'All Categories',

		cars: 'Cars',
		mobilePhones: 'Mobile Phones',
		laptops: 'Laptops',
		electronics: 'TV & Electronics',
		furniture: 'Home & Furniture',
		otherItems: 'Other Items',

		popular: 'Popular',
		contactSeller: 'Contact Seller',
		viewDetails: 'View Details'
	},

	am: {
		home: 'መነሻ',
		realEstate: 'ሪል እስቴት',
		products: 'ምርቶች',
		sell: 'ይሽጡ',
		about: 'ስለ እኛ',
		contact: 'ያግኙን',

		buy: 'ይግዙ',
		find: 'ይፈልጉ',

		search: 'ፈልግ',
		searchPlaceholder: 'ምን እየፈለጉ ነው?',
		allCategories: 'ሁሉም ምድቦች',

		cars: 'መኪናዎች',
		mobilePhones: 'ሞባይል ስልኮች',
		laptops: 'ላፕቶፖች',
		electronics: 'ቲቪ እና ኤሌክትሮኒክስ',
		furniture: 'የቤት ዕቃዎች',
		otherItems: 'ሌሎች ዕቃዎች',

		popular: 'ታዋቂ',
		contactSeller: 'ሻጩን ያግኙ',
		viewDetails: 'ዝርዝር ይመልከቱ'
	}
};