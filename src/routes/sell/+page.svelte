<script>
	import { supabase } from '$lib/supabase';

	let title = $state('');
	let category = $state('');
	let condition = $state('Used');
	let price = $state('');
	let negotiable = $state('Yes');
	let location = $state('');
	let description = $state('');
	let phone = $state('');

	let submitting = $state(false);
	let successMessage = $state('');
	let errorMessage = $state('');

	// CAR
	let carBrand = $state('');
	let carModel = $state('');
	let carYear = $state('');
	let mileage = $state('');
	let fuelType = $state('');
	let transmission = $state('');
	let engineSize = $state('');
	let bodyType = $state('');
	let carColor = $state('');
	let previousOwners = $state('');
	let accidentHistory = $state('');
	let serviceHistory = $state('');

	// PHONE
	let phoneBrand = $state('');
	let phoneModel = $state('');
	let storage = $state('');
	let ram = $state('');
	let phoneColor = $state('');
	let batteryHealth = $state('');
	let simType = $state('');
	let networkStatus = $state('');
	let screenCondition = $state('');
	let repairHistory = $state('');
	let accessories = $state('');
	let phoneWarranty = $state('');

	// LAPTOP
	let laptopBrand = $state('');
	let laptopModel = $state('');
	let processor = $state('');
	let laptopRam = $state('');
	let laptopStorage = $state('');
	let storageType = $state('');
	let gpu = $state('');
	let screenSize = $state('');
	let laptopBattery = $state('');
	let operatingSystem = $state('');
	let chargerIncluded = $state('');
	let laptopRepairHistory = $state('');
	let laptopWarranty = $state('');

	// ELECTRONICS
	let electronicType = $state('');
	let electronicBrand = $state('');
	let electronicModel = $state('');
	let tvScreenSize = $state('');
	let resolution = $state('');
	let smartTv = $state('');
	let connectivity = $state('');
	let electronicDefects = $state('');
	let electronicAccessories = $state('');
	let electronicWarranty = $state('');

	// FURNITURE
	let furnitureType = $state('');
	let material = $state('');
	let dimensions = $state('');
	let furnitureColor = $state('');
	let itemAge = $state('');
	let furnitureCondition = $state('');
	let setPieces = $state('');
	let deliveryAvailable = $state('');

	// OTHER
	let otherBrand = $state('');
	let otherModel = $state('');
	let otherAge = $state('');
	let otherDefects = $state('');
	let quantity = $state('');
	let otherAccessories = $state('');
	let otherWarranty = $state('');

	// PHOTOS
	let images = $state([]);
	let imagePreviews = $state([]);

	function handleImages(event) {
		const files = Array.from(event.currentTarget.files ?? []);

		if (files.length > 8) {
			alert('You can upload a maximum of 8 photos.');
			event.currentTarget.value = '';
			return;
		}

		imagePreviews.forEach((url) => URL.revokeObjectURL(url));

		images = files;

		imagePreviews = files.map((file) =>
			URL.createObjectURL(file)
		);
	}

	function removeImage(index) {
		URL.revokeObjectURL(imagePreviews[index]);

		images = images.filter((_, i) => i !== index);

		imagePreviews = imagePreviews.filter(
			(_, i) => i !== index
		);
	}

	function buildSpecifications() {
		if (category === 'Cars') {
			return {
				brand: carBrand,
				model: carModel,
				year: carYear,
				mileage:
					condition === 'Used'
						? mileage
						: null,
				fuelType,
				transmission,
				engineSize,
				bodyType,
				color: carColor,
				previousOwners:
					condition === 'Used'
						? previousOwners
						: null,
				accidentHistory:
					condition === 'Used'
						? accidentHistory
						: null,
				serviceHistory:
					condition === 'Used'
						? serviceHistory
						: null
			};
		}

		if (category === 'Mobile Phones') {
			return {
				brand: phoneBrand,
				model: phoneModel,
				storage,
				ram,
				color: phoneColor,
				batteryHealth:
					condition === 'Used'
						? batteryHealth
						: null,
				simType,
				networkStatus,
				screenCondition:
					condition === 'Used'
						? screenCondition
						: null,
				repairHistory:
					condition === 'Used'
						? repairHistory
						: null,
				accessories,
				warranty: phoneWarranty
			};
		}

		if (category === 'Laptops') {
			return {
				brand: laptopBrand,
				model: laptopModel,
				processor,
				ram: laptopRam,
				storage: laptopStorage,
				storageType,
				gpu,
				screenSize,
				batteryCondition:
					condition === 'Used'
						? laptopBattery
						: null,
				operatingSystem,
				chargerIncluded,
				repairHistory:
					condition === 'Used'
						? laptopRepairHistory
						: null,
				warranty: laptopWarranty
			};
		}

		if (category === 'TV & Electronics') {
			return {
				productType: electronicType,
				brand: electronicBrand,
				model: electronicModel,
				screenSize: tvScreenSize,
				resolution,
				smartTv,
				connectivity,
				defects:
					condition === 'Used'
						? electronicDefects
						: null,
				accessories: electronicAccessories,
				warranty: electronicWarranty
			};
		}

		if (category === 'Home & Furniture') {
			return {
				itemType: furnitureType,
				material,
				dimensions,
				color: furnitureColor,
				age:
					condition === 'Used'
						? itemAge
						: null,
				damage:
					condition === 'Used'
						? furnitureCondition
						: null,
				numberOfPieces: setPieces,
				deliveryAvailable
			};
		}

		if (category === 'Other') {
			return {
				brand: otherBrand,
				model: otherModel,
				quantity,
				age:
					condition === 'Used'
						? otherAge
						: null,
				defects:
					condition === 'Used'
						? otherDefects
						: null,
				accessories: otherAccessories,
				warranty: otherWarranty
			};
		}

		return {};
	}

	function resetForm() {
		title = '';
		category = '';
		condition = 'Used';
		price = '';
		negotiable = 'Yes';
		location = '';
		description = '';
		phone = '';

		images = [];

		imagePreviews.forEach((url) =>
			URL.revokeObjectURL(url)
		);

		imagePreviews = [];
	}

	async function uploadImages() {
		const uploadedUrls = [];

		for (const file of images) {
			const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
			const safeExtension = ['jpg', 'jpeg', 'png', 'webp'].includes(extension)
				? extension
				: 'jpg';

			const fileName = `${crypto.randomUUID()}.${safeExtension}`;
			const filePath = `listings/${fileName}`;

			const { error: uploadError } = await supabase.storage
				.from('marketplace-images')
				.upload(filePath, file, {
					cacheControl: '3600',
					upsert: false,
					contentType: file.type
				});

			if (uploadError) {
				throw uploadError;
			}

			const { data } = supabase.storage
				.from('marketplace-images')
				.getPublicUrl(filePath);

			uploadedUrls.push(data.publicUrl);
		}

		return uploadedUrls;
	}

	async function submitListing(event) {
		event.preventDefault();

		successMessage = '';
		errorMessage = '';

		if (
			!title.trim() ||
			!category ||
			!condition ||
			!price ||
			!location.trim() ||
			!phone.trim()
		) {
			errorMessage = 'Please complete all required fields.';
			return;
		}

		if (images.length === 0) {
			errorMessage = 'Please add at least one product photo.';
			return;
		}

		const numericPrice = Number(price);

		if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
			errorMessage = 'Please enter a valid price.';
			return;
		}

		submitting = true;

		try {
			const specifications = buildSpecifications();

			// Upload all selected photos first.
			const imageUrls = await uploadImages();

			// Then save the listing with the real Supabase Storage URLs.
			const { error } = await supabase
				.from('marketplace_listings')
				.insert({
					title: title.trim(),
					category,
					condition,
					price: numericPrice,
					negotiable: negotiable === 'Yes',
					location: location.trim(),
					description: description.trim(),
					seller_phone: phone.trim(),
					specifications,
					image_urls: imageUrls,
					status: 'pending'
				});

			if (error) {
				throw error;
			}

			successMessage =
				'Listing submitted successfully! Your photos were uploaded and the listing is waiting for admin approval.';

			resetForm();

			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		} catch (error) {
			console.error('Listing submission error:', error);

			errorMessage =
				error?.message ??
				'Could not submit the listing. Please try again.';
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Sell an Item | 4KAZ Marketplace</title>

	<meta
		name="description"
		content="Sell new and used products on 4KAZ Marketplace."
	/>
</svelte:head>

<header class="navbar">
	<a class="brand" href="/">
		<span class="logo">4K</span>

		<div>
			<strong>4KAZ</strong>
			<small>Marketplace</small>
		</div>
	</a>

	<nav>
		<a href="/">Home</a>
		<a href="/products">Browse</a>
		<a href="/products?category=Cars">
			Cars
		</a>
		<a href="/products?category=Mobile%20Phones">
			Phones
		</a>
		<a href="/products?category=TV%20%26%20Electronics">
			Electronics
		</a>
	</nav>

	<a
		class="browse-button"
		href="/products"
	>
		Browse Items
	</a>
</header>

<main>
	<section class="heading">
		<p class="eyebrow">
			SELL ON 4KAZ
		</p>

		<h1>Sell your item.</h1>

		<p>
			Tell buyers exactly what you're selling.
		</p>
	</section>

	<section class="form-wrapper">

		{#if successMessage}
			<div class="message success-message">
				<strong>✓ Listing received</strong>

				<p>{successMessage}</p>
			</div>
		{/if}

		{#if errorMessage}
			<div class="message error-message">
				<strong>Something needs attention</strong>

				<p>{errorMessage}</p>
			</div>
		{/if}

		<form onsubmit={submitListing}>

			<!-- BASIC INFORMATION -->

			<div class="form-section">
				<div class="section-number">
					01
				</div>

				<div class="section-content">
					<h2>Basic information</h2>

					<p class="section-description">
						Start by choosing the type of item
						you want to sell.
					</p>

					<div class="field">
						<label for="title">
							Item title *
						</label>

						<input
							id="title"
							bind:value={title}
							placeholder="Example: Toyota Corolla 2020"
							maxlength="120"
							required
						/>
					</div>

					<div class="two-columns">
						<div class="field">
							<label for="category">
								Category *
							</label>

							<select
								id="category"
								bind:value={category}
								required
							>
								<option value="">
									Choose category
								</option>

								<option value="Cars">
									Cars
								</option>

								<option value="Mobile Phones">
									Mobile Phones
								</option>

								<option value="Laptops">
									Laptops & Computers
								</option>

								<option value="TV & Electronics">
									TV & Electronics
								</option>

								<option value="Home & Furniture">
									Home & Furniture
								</option>

								<option value="Other">
									Other
								</option>
							</select>
						</div>

						<div class="field">
							<label for="condition">
								Condition *
							</label>

							<select
								id="condition"
								bind:value={condition}
								required
							>
								<option value="Used">
									Used
								</option>

								<option value="New">
									New
								</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			<!-- CATEGORY SPECIFICATIONS -->

			{#if category}
				<div class="form-section specification-section">
					<div class="section-number">
						02
					</div>

					<div class="section-content">
						<h2>
							{category} specifications
						</h2>

						<p class="section-description">
							Give buyers the important information
							they need before contacting you.
						</p>

						<!-- CARS -->

						{#if category === 'Cars'}
							<div class="two-columns">
								<div class="field">
									<label for="car-brand">
										Brand / Make *
									</label>

									<input
										id="car-brand"
										bind:value={carBrand}
										placeholder="Toyota"
										required
									/>
								</div>

								<div class="field">
									<label for="car-model">
										Model *
									</label>

									<input
										id="car-model"
										bind:value={carModel}
										placeholder="Corolla"
										required
									/>
								</div>
							</div>

							<div class="three-columns">
								<div class="field">
									<label for="car-year">
										Year *
									</label>

									<input
										id="car-year"
										bind:value={carYear}
										type="number"
										min="1900"
										max="2100"
										placeholder="2020"
										required
									/>
								</div>

								<div class="field">
									<label for="fuel-type">
										Fuel type *
									</label>

									<select
										id="fuel-type"
										bind:value={fuelType}
										required
									>
										<option value="">
											Choose
										</option>
										<option>Petrol</option>
										<option>Diesel</option>
										<option>Hybrid</option>
										<option>Electric</option>
										<option>Other</option>
									</select>
								</div>

								<div class="field">
									<label for="transmission">
										Transmission *
									</label>

									<select
										id="transmission"
										bind:value={transmission}
										required
									>
										<option value="">
											Choose
										</option>
										<option>Automatic</option>
										<option>Manual</option>
									</select>
								</div>
							</div>

							{#if condition === 'Used'}
								<div class="used-box">
									<h3>
										Used vehicle history
									</h3>

									<p>
										Help buyers understand the
										history of this vehicle.
									</p>

									<div class="two-columns">
										<div class="field">
											<label for="mileage">
												Mileage / journey history (km) *
											</label>

											<input
												id="mileage"
												bind:value={mileage}
												type="number"
												min="0"
												placeholder="85000"
												required
											/>
										</div>

										<div class="field">
											<label for="previous-owners">
												Previous owners
											</label>

											<input
												id="previous-owners"
												bind:value={previousOwners}
												type="number"
												min="0"
												placeholder="1"
											/>
										</div>
									</div>

									<div class="two-columns">
										<div class="field">
											<label for="accident-history">
												Accident history *
											</label>

											<select
												id="accident-history"
												bind:value={accidentHistory}
												required
											>
												<option value="">
													Choose
												</option>
												<option>
													No accident
												</option>
												<option>
													Minor accident
												</option>
												<option>
													Major accident
												</option>
												<option>
													Unknown
												</option>
											</select>
										</div>

										<div class="field">
											<label for="service-history">
												Service history
											</label>

											<select
												id="service-history"
												bind:value={serviceHistory}
											>
												<option value="">
													Choose
												</option>
												<option>
													Full service history
												</option>
												<option>
													Partial service history
												</option>
												<option>
													No records
												</option>
												<option>
													Unknown
												</option>
											</select>
										</div>
									</div>
								</div>
							{/if}

							<div class="three-columns">
								<div class="field">
									<label for="engine-size">
										Engine size
									</label>

									<input
										id="engine-size"
										bind:value={engineSize}
										placeholder="1.8L"
									/>
								</div>

								<div class="field">
									<label for="body-type">
										Body type
									</label>

									<select
										id="body-type"
										bind:value={bodyType}
									>
										<option value="">
											Choose
										</option>
										<option>Sedan</option>
										<option>SUV</option>
										<option>Hatchback</option>
										<option>Pickup</option>
										<option>Van</option>
										<option>Coupe</option>
										<option>Other</option>
									</select>
								</div>

								<div class="field">
									<label for="car-color">
										Color
									</label>

									<input
										id="car-color"
										bind:value={carColor}
										placeholder="White"
									/>
								</div>
							</div>

						<!-- MOBILE PHONES -->

						{:else if category === 'Mobile Phones'}

							<div class="two-columns">
								<div class="field">
									<label for="phone-brand">
										Brand *
									</label>

									<input
										id="phone-brand"
										bind:value={phoneBrand}
										placeholder="Samsung"
										required
									/>
								</div>

								<div class="field">
									<label for="phone-model">
										Model *
									</label>

									<input
										id="phone-model"
										bind:value={phoneModel}
										placeholder="Galaxy S23"
										required
									/>
								</div>
							</div>

							<div class="three-columns">
								<div class="field">
									<label for="phone-storage">
										Storage *
									</label>

									<select
										id="phone-storage"
										bind:value={storage}
										required
									>
										<option value="">
											Choose
										</option>
										<option>32 GB</option>
										<option>64 GB</option>
										<option>128 GB</option>
										<option>256 GB</option>
										<option>512 GB</option>
										<option>1 TB</option>
										<option>Other</option>
									</select>
								</div>

								<div class="field">
									<label for="phone-ram">
										RAM
									</label>

									<input
										id="phone-ram"
										bind:value={ram}
										placeholder="8 GB"
									/>
								</div>

								<div class="field">
									<label for="phone-color">
										Color
									</label>

									<input
										id="phone-color"
										bind:value={phoneColor}
										placeholder="Black"
									/>
								</div>
							</div>

							{#if condition === 'Used'}
								<div class="used-box">
									<h3>
										Used phone condition
									</h3>

									<div class="two-columns">
										<div class="field">
											<label for="battery-health">
												Battery health
											</label>

											<input
												id="battery-health"
												bind:value={batteryHealth}
												placeholder="Example: 88%"
											/>
										</div>

										<div class="field">
											<label for="screen-condition">
												Screen condition *
											</label>

											<select
												id="screen-condition"
												bind:value={screenCondition}
												required
											>
												<option value="">
													Choose
												</option>
												<option>Excellent</option>
												<option>Good</option>
												<option>
													Minor scratches
												</option>
												<option>Cracked</option>
												<option>Damaged</option>
											</select>
										</div>
									</div>

									<div class="field">
										<label for="repair-history">
											Repair history
										</label>

										<input
											id="repair-history"
											bind:value={repairHistory}
											placeholder="Example: Never repaired"
										/>
									</div>
								</div>
							{/if}

							<div class="two-columns">
								<div class="field">
									<label for="sim-type">
										SIM type
									</label>

									<input
										id="sim-type"
										bind:value={simType}
										placeholder="Dual SIM / eSIM"
									/>
								</div>

								<div class="field">
									<label for="network-status">
										Network status
									</label>

									<select
										id="network-status"
										bind:value={networkStatus}
									>
										<option value="">
											Choose
										</option>
										<option>Unlocked</option>
										<option>
											Network locked
										</option>
										<option>Unknown</option>
									</select>
								</div>
							</div>

							<div class="two-columns">
								<div class="field">
									<label for="phone-accessories">
										Accessories included
									</label>

									<input
										id="phone-accessories"
										bind:value={accessories}
										placeholder="Box, charger, case"
									/>
								</div>

								<div class="field">
									<label for="phone-warranty">
										Warranty
									</label>

									<input
										id="phone-warranty"
										bind:value={phoneWarranty}
										placeholder="Example: 6 months"
									/>
								</div>
							</div>

						<!-- LAPTOP -->

						{:else if category === 'Laptops'}

							<div class="two-columns">
								<div class="field">
									<label for="laptop-brand">
										Brand *
									</label>

									<input
										id="laptop-brand"
										bind:value={laptopBrand}
										placeholder="HP"
										required
									/>
								</div>

								<div class="field">
									<label for="laptop-model">
										Model *
									</label>

									<input
										id="laptop-model"
										bind:value={laptopModel}
										placeholder="EliteBook 840"
										required
									/>
								</div>
							</div>

							<div class="three-columns">
								<div class="field">
									<label for="processor">
										Processor / CPU *
									</label>

									<input
										id="processor"
										bind:value={processor}
										placeholder="Intel Core i7"
										required
									/>
								</div>

								<div class="field">
									<label for="laptop-ram">
										RAM *
									</label>

									<input
										id="laptop-ram"
										bind:value={laptopRam}
										placeholder="16 GB"
										required
									/>
								</div>

								<div class="field">
									<label for="laptop-storage">
										Storage *
									</label>

									<input
										id="laptop-storage"
										bind:value={laptopStorage}
										placeholder="512 GB"
										required
									/>
								</div>
							</div>

							<div class="three-columns">
								<div class="field">
									<label for="storage-type">
										Storage type
									</label>

									<select
										id="storage-type"
										bind:value={storageType}
									>
										<option value="">
											Choose
										</option>
										<option>SSD</option>
										<option>HDD</option>
										<option>SSD + HDD</option>
									</select>
								</div>

								<div class="field">
									<label for="gpu">
										Graphics / GPU
									</label>

									<input
										id="gpu"
										bind:value={gpu}
										placeholder="Intel / NVIDIA / AMD"
									/>
								</div>

								<div class="field">
									<label for="screen-size">
										Screen size
									</label>

									<input
										id="screen-size"
										bind:value={screenSize}
										placeholder="14 inch"
									/>
								</div>
							</div>

							{#if condition === 'Used'}
								<div class="used-box">
									<h3>
										Used laptop condition
									</h3>

									<div class="two-columns">
										<div class="field">
											<label for="laptop-battery">
												Battery condition
											</label>

											<input
												id="laptop-battery"
												bind:value={laptopBattery}
												placeholder="Good / 3 hours"
											/>
										</div>

										<div class="field">
											<label for="laptop-repair">
												Repair history
											</label>

											<input
												id="laptop-repair"
												bind:value={laptopRepairHistory}
												placeholder="Never repaired"
											/>
										</div>
									</div>
								</div>
							{/if}

							<div class="three-columns">
								<div class="field">
									<label for="operating-system">
										Operating system
									</label>

									<input
										id="operating-system"
										bind:value={operatingSystem}
										placeholder="Windows 11"
									/>
								</div>

								<div class="field">
									<label for="charger">
										Charger included?
									</label>

									<select
										id="charger"
										bind:value={chargerIncluded}
									>
										<option value="">
											Choose
										</option>
										<option>Yes</option>
										<option>No</option>
									</select>
								</div>

								<div class="field">
									<label for="laptop-warranty">
										Warranty
									</label>

									<input
										id="laptop-warranty"
										bind:value={laptopWarranty}
										placeholder="Example: 3 months"
									/>
								</div>
							</div>

						<!-- ELECTRONICS -->

						{:else if category === 'TV & Electronics'}

							<div class="three-columns">
								<div class="field">
									<label for="electronic-type">
										Product type *
									</label>

									<input
										id="electronic-type"
										bind:value={electronicType}
										placeholder="Smart TV"
										required
									/>
								</div>

								<div class="field">
									<label for="electronic-brand">
										Brand *
									</label>

									<input
										id="electronic-brand"
										bind:value={electronicBrand}
										placeholder="Samsung"
										required
									/>
								</div>

								<div class="field">
									<label for="electronic-model">
										Model
									</label>

									<input
										id="electronic-model"
										bind:value={electronicModel}
										placeholder="Model number"
									/>
								</div>
							</div>

							<div class="three-columns">
								<div class="field">
									<label for="tv-screen-size">
										Screen size
									</label>

									<input
										id="tv-screen-size"
										bind:value={tvScreenSize}
										placeholder="55 inch"
									/>
								</div>

								<div class="field">
									<label for="resolution">
										Resolution
									</label>

									<select
										id="resolution"
										bind:value={resolution}
									>
										<option value="">
											Choose
										</option>
										<option>HD</option>
										<option>Full HD</option>
										<option>4K</option>
										<option>8K</option>
										<option>Other</option>
									</select>
								</div>

								<div class="field">
									<label for="smart-tv">
										Smart TV?
									</label>

									<select
										id="smart-tv"
										bind:value={smartTv}
									>
										<option value="">
											Choose
										</option>
										<option>Yes</option>
										<option>No</option>
										<option>
											Not applicable
										</option>
									</select>
								</div>
							</div>

							<div class="field">
								<label for="connectivity">
									Connectivity
								</label>

								<input
									id="connectivity"
									bind:value={connectivity}
									placeholder="Wi-Fi, Bluetooth, HDMI, USB"
								/>
							</div>

							{#if condition === 'Used'}
								<div class="used-box">
									<h3>
										Used item condition
									</h3>

									<div class="field">
										<label for="electronic-defects">
											Known defects or damage *
										</label>

										<input
											id="electronic-defects"
											bind:value={electronicDefects}
											placeholder="No defects / describe any problem"
											required
										/>
									</div>
								</div>
							{/if}

							<div class="two-columns">
								<div class="field">
									<label for="electronic-accessories">
										Accessories included
									</label>

									<input
										id="electronic-accessories"
										bind:value={electronicAccessories}
										placeholder="Remote, cables, box"
									/>
								</div>

								<div class="field">
									<label for="electronic-warranty">
										Warranty
									</label>

									<input
										id="electronic-warranty"
										bind:value={electronicWarranty}
										placeholder="Example: 1 year"
									/>
								</div>
							</div>

						<!-- FURNITURE -->

						{:else if category === 'Home & Furniture'}

							<div class="two-columns">
								<div class="field">
									<label for="furniture-type">
										Item type *
									</label>

									<input
										id="furniture-type"
										bind:value={furnitureType}
										placeholder="Sofa, bed, table..."
										required
									/>
								</div>

								<div class="field">
									<label for="material">
										Material
									</label>

									<input
										id="material"
										bind:value={material}
										placeholder="Wood, leather..."
									/>
								</div>
							</div>

							<div class="three-columns">
								<div class="field">
									<label for="dimensions">
										Dimensions
									</label>

									<input
										id="dimensions"
										bind:value={dimensions}
										placeholder="200 × 90 × 80 cm"
									/>
								</div>

								<div class="field">
									<label for="furniture-color">
										Color
									</label>

									<input
										id="furniture-color"
										bind:value={furnitureColor}
										placeholder="Brown"
									/>
								</div>

								<div class="field">
									<label for="set-pieces">
										Number of pieces
									</label>

									<input
										id="set-pieces"
										bind:value={setPieces}
										type="number"
										min="1"
										placeholder="1"
									/>
								</div>
							</div>

							{#if condition === 'Used'}
								<div class="used-box">
									<h3>
										Used furniture condition
									</h3>

									<div class="two-columns">
										<div class="field">
											<label for="item-age">
												Approximate age
											</label>

											<input
												id="item-age"
												bind:value={itemAge}
												placeholder="2 years"
											/>
										</div>

										<div class="field">
											<label for="furniture-condition">
												Wear or damage
											</label>

											<input
												id="furniture-condition"
												bind:value={furnitureCondition}
												placeholder="Minor scratches / none"
											/>
										</div>
									</div>
								</div>
							{/if}

							<div class="field">
								<label for="delivery">
									Delivery available?
								</label>

								<select
									id="delivery"
									bind:value={deliveryAvailable}
								>
									<option value="">
										Choose
									</option>
									<option>Yes</option>
									<option>No</option>
									<option>
										Can be arranged
									</option>
								</select>
							</div>

						<!-- OTHER -->

						{:else if category === 'Other'}

							<div class="two-columns">
								<div class="field">
									<label for="other-brand">
										Brand
									</label>

									<input
										id="other-brand"
										bind:value={otherBrand}
										placeholder="Brand if applicable"
									/>
								</div>

								<div class="field">
									<label for="other-model">
										Model
									</label>

									<input
										id="other-model"
										bind:value={otherModel}
										placeholder="Model if applicable"
									/>
								</div>
							</div>

							<div class="two-columns">
								<div class="field">
									<label for="quantity">
										Quantity
									</label>

									<input
										id="quantity"
										bind:value={quantity}
										type="number"
										min="1"
										placeholder="1"
									/>
								</div>

								{#if condition === 'Used'}
									<div class="field">
										<label for="other-age">
											Approximate age
										</label>

										<input
											id="other-age"
											bind:value={otherAge}
											placeholder="Example: 1 year"
										/>
									</div>
								{/if}
							</div>

							{#if condition === 'Used'}
								<div class="field">
									<label for="other-defects">
										Defects, wear or damage *
									</label>

									<input
										id="other-defects"
										bind:value={otherDefects}
										placeholder="Describe any known problems"
										required
									/>
								</div>
							{/if}

							<div class="two-columns">
								<div class="field">
									<label for="other-accessories">
										Accessories included
									</label>

									<input
										id="other-accessories"
										bind:value={otherAccessories}
										placeholder="Accessories or extras"
									/>
								</div>

								<div class="field">
									<label for="other-warranty">
										Warranty
									</label>

									<input
										id="other-warranty"
										bind:value={otherWarranty}
										placeholder="Warranty if available"
									/>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<!-- PRICE -->

			<div class="form-section">
				<div class="section-number">
					{category ? '03' : '02'}
				</div>

				<div class="section-content">
					<h2>Price & location</h2>

					<div class="three-columns">
						<div class="field">
							<label for="price">
								Price (ETB) *
							</label>

							<input
								id="price"
								bind:value={price}
								type="number"
								min="1"
								step="1"
								placeholder="50000"
								required
							/>
						</div>

						<div class="field">
							<label for="negotiable">
								Negotiable?
							</label>

							<select
								id="negotiable"
								bind:value={negotiable}
							>
								<option>Yes</option>
								<option>No</option>
							</select>
						</div>

						<div class="field">
							<label for="location">
								Location *
							</label>

							<input
								id="location"
								bind:value={location}
								placeholder="Example: Addis Ababa"
								maxlength="100"
								required
							/>
						</div>
					</div>

					<div class="field">
						<label for="description">
							Additional description
						</label>

						<textarea
							id="description"
							bind:value={description}
							rows="7"
							maxlength="2000"
							placeholder="Tell buyers anything else they should know..."
						></textarea>

						<small>
							{description.length}/2000
						</small>
					</div>
				</div>
			</div>

			<!-- PHOTOS -->

			<div class="form-section">
				<div class="section-number">
					{category ? '04' : '03'}
				</div>

				<div class="section-content">
					<h2>Product photos</h2>

					<p class="section-description">
						Add up to 8 clear photos.
						For used items, show the real condition.
					</p>

					<label class="upload-box">
						<input
							type="file"
							accept="image/jpeg,image/png,image/webp"
							multiple
							onchange={handleImages}
						/>

						<div class="upload-icon">
							＋
						</div>

						<strong>
							Add product photos
						</strong>

						<span>
							JPG, PNG or WEBP · Maximum 8 photos
						</span>
					</label>

					{#if imagePreviews.length > 0}
						<div class="preview-grid">
							{#each imagePreviews as preview, index}
								<div class="preview">
									<img
										src={preview}
										alt={`Product preview ${index + 1}`}
									/>

									{#if index === 0}
										<span class="main-photo">
											Main photo
										</span>
									{/if}

									<button
										type="button"
										class="remove"
										aria-label="Remove image"
										onclick={() =>
											removeImage(index)}
									>
										×
									</button>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- SELLER -->

			<div class="form-section">
				<div class="section-number">
					{category ? '05' : '04'}
				</div>

				<div class="section-content">
					<h2>Seller information</h2>

					<p class="section-description">
						Buyers will use this information
						to contact you.
					</p>

					<div class="field">
						<label for="phone">
							Phone number *
						</label>

						<input
							id="phone"
							bind:value={phone}
							type="tel"
							placeholder="09XXXXXXXX"
							maxlength="20"
							required
						/>
					</div>
				</div>
			</div>

			<div class="submit-area">
				<div>
					<strong>
						Ready to sell?
					</strong>

					<p>
						New listings are submitted for
						admin approval.
					</p>
				</div>

				<button
					type="submit"
					disabled={submitting}
				>
					{#if submitting}
						Submitting...
					{:else}
						Submit Listing →
					{/if}
				</button>
			</div>
		</form>
	</section>
</main>

<footer>
	<div>
		<strong>
			4KAZ Marketplace
		</strong>

		<p>
			Buy & sell across Ethiopia.
		</p>
	</div>

	<p>
		© 2026 4KAZ Marketplace
	</p>
</footer>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		font-family: Arial, Helvetica, sans-serif;
		background: #f5f5f3;
		color: #171717;
	}

	input,
	select,
	textarea,
	button {
		font: inherit;
	}

	button {
		cursor: pointer;
	}

	button:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}

	.navbar {
		height: 82px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 30px;
		padding: 0 5%;
		background: white;
		border-bottom: 1px solid #ddd;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		color: #111;
		text-decoration: none;
	}

	.logo {
		width: 46px;
		height: 46px;
		display: grid;
		place-items: center;
		border-radius: 10px;
		background: #191919;
		color: white;
		font-weight: 900;
	}

	.brand div {
		display: flex;
		flex-direction: column;
	}

	.brand strong {
		font-size: 21px;
	}

	.brand small {
		color: #777;
	}

	nav {
		display: flex;
		gap: 26px;
	}

	nav a {
		color: #333;
		text-decoration: none;
		font-size: 14px;
		font-weight: 600;
	}

	nav a:hover {
		opacity: 0.55;
	}

	.browse-button {
		padding: 13px 19px;
		border-radius: 8px;
		background: #191919;
		color: white;
		text-decoration: none;
		font-size: 14px;
		font-weight: 700;
	}

	.heading {
		padding: 70px 6% 55px;
		background: #191919;
		color: white;
	}

	.eyebrow {
		margin: 0 0 18px;
		color: #aaa;
		font-size: 10px;
		font-weight: 900;
		letter-spacing: 4px;
	}

	.heading h1 {
		margin: 0;
		font-size: clamp(50px, 7vw, 90px);
		line-height: 0.95;
		letter-spacing: -5px;
	}

	.heading > p:last-child {
		margin: 22px 0 0;
		color: #aaa;
		font-size: 17px;
	}

	.form-wrapper {
		max-width: 1100px;
		margin: 0 auto;
		padding: 60px 25px 100px;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 22px;
	}

	.message {
		margin-bottom: 25px;
		padding: 20px 24px;
		border-radius: 12px;
	}

	.message strong {
		display: block;
		margin-bottom: 5px;
		font-size: 17px;
	}

	.message p {
		margin: 0;
		line-height: 1.5;
	}

	.success-message {
		border: 1px solid #98d6aa;
		background: #effaf2;
		color: #17622c;
	}

	.error-message {
		border: 1px solid #e5aaaa;
		background: #fff2f2;
		color: #8b2020;
	}

	.form-section {
		display: grid;
		grid-template-columns: 70px 1fr;
		gap: 25px;
		padding: 35px;
		border: 1px solid #ddd;
		border-radius: 16px;
		background: white;
	}

	.specification-section {
		border: 2px solid #191919;
	}

	.section-number {
		width: 50px;
		height: 50px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: #191919;
		color: white;
		font-size: 12px;
		font-weight: 900;
	}

	.section-content {
		min-width: 0;
	}

	.section-content h2 {
		margin: 7px 0 8px;
		font-size: 28px;
		letter-spacing: -1px;
	}

	.section-description {
		margin: 0 0 28px;
		color: #777;
		line-height: 1.5;
		font-size: 14px;
	}

	.field {
		margin-top: 22px;
	}

	.field label {
		display: block;
		margin-bottom: 8px;
		font-size: 13px;
		font-weight: 700;
	}

	.field input,
	.field select,
	.field textarea {
		width: 100%;
		padding: 15px 16px;
		border: 1px solid #ccc;
		border-radius: 9px;
		background: white;
		outline: none;
	}

	.field input:focus,
	.field select:focus,
	.field textarea:focus {
		border-color: #191919;
		box-shadow:
			0 0 0 2px rgba(0, 0, 0, 0.05);
	}

	.field textarea {
		resize: vertical;
		line-height: 1.5;
	}

	.field small {
		display: block;
		margin-top: 7px;
		color: #888;
		text-align: right;
	}

	.two-columns {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 15px;
	}

	.three-columns {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 15px;
	}

	.used-box {
		margin-top: 28px;
		padding: 25px;
		border-radius: 12px;
		background: #f3f3f1;
		border-left: 4px solid #191919;
	}

	.used-box h3 {
		margin: 0;
		font-size: 18px;
	}

	.used-box > p {
		margin: 8px 0 0;
		color: #777;
		font-size: 13px;
	}

	.upload-box {
		min-height: 210px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 9px;
		padding: 25px;
		border: 2px dashed #c8c8c8;
		border-radius: 13px;
		background: #fafafa;
		text-align: center;
		cursor: pointer;
	}

	.upload-box:hover {
		border-color: #191919;
		background: #f7f7f7;
	}

	.upload-box input {
		display: none;
	}

	.upload-icon {
		width: 55px;
		height: 55px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: #191919;
		color: white;
		font-size: 28px;
	}

	.upload-box span {
		color: #888;
		font-size: 12px;
	}

	.preview-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 12px;
		margin-top: 18px;
	}

	.preview {
		aspect-ratio: 1 / 1;
		position: relative;
		overflow: hidden;
		border-radius: 10px;
		background: #eee;
	}

	.preview img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}

	.main-photo {
		position: absolute;
		left: 8px;
		bottom: 8px;
		padding: 6px 9px;
		border-radius: 20px;
		background: #191919;
		color: white;
		font-size: 10px;
		font-weight: 700;
	}

	.remove {
		width: 30px;
		height: 30px;
		position: absolute;
		top: 7px;
		right: 7px;
		display: grid;
		place-items: center;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: white;
		color: #111;
		font-size: 21px;
	}

	.submit-area {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 30px;
		padding: 30px 35px;
		border-radius: 14px;
		background: #191919;
		color: white;
	}

	.submit-area strong {
		font-size: 19px;
	}

	.submit-area p {
		margin: 5px 0 0;
		color: #aaa;
		font-size: 13px;
	}

	.submit-area button {
		padding: 16px 24px;
		border: 0;
		border-radius: 8px;
		background: white;
		color: #111;
		font-weight: 800;
		white-space: nowrap;
	}

	footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 30px;
		padding: 45px 6%;
		border-top: 1px solid #ddd;
		background: white;
		color: #777;
		font-size: 12px;
	}

	footer strong {
		color: #111;
		font-size: 18px;
	}

	footer p {
		margin: 5px 0 0;
	}

	@media (max-width: 800px) {
		nav {
			display: none;
		}

		.navbar {
			padding: 0 18px;
		}

		.heading {
			padding: 55px 20px 45px;
		}

		.form-wrapper {
			padding: 35px 15px 70px;
		}

		.form-section {
			grid-template-columns: 1fr;
			padding: 25px 20px;
		}

		.two-columns,
		.three-columns {
			grid-template-columns: 1fr;
			gap: 0;
		}

		.preview-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.submit-area {
			align-items: flex-start;
			flex-direction: column;
		}

		.submit-area button {
			width: 100%;
		}

		footer {
			padding: 40px 20px;
			flex-direction: column;
			align-items: flex-start;
		}
	}

	@media (max-width: 450px) {
		.brand small {
			display: none;
		}
	}
</style>