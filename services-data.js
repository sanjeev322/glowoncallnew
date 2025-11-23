// Services Data
const servicesData = {
    facials: [
        {
            id: 'hydrafacial',
            name: 'HydraFacial',
            description: 'Deep cleansing, exfoliation, and hydration treatment for all skin types. Includes extraction and serum infusion for instant glow.',
            originalPrice: 2500,
            discountedPrice: 1999,
            duration: 60,
            image: 'assets/facial/HydraFacial.png',
            category: 'facials',
            benefits: ['Deep hydration', 'Removes blackheads', 'Instant glow', 'Non-invasive'],
            procedure: 'Cleanse → Extract → Hydrate → Protect',
            idealFor: 'All skin types, especially dry and congested skin'
        },
        {
            id: 'collagen-renewal',
            name: 'Collagen Renewal Facial',
            description: 'Anti-aging treatment that stimulates collagen production. Reduces fine lines and improves skin elasticity.',
            originalPrice: 3500,
            discountedPrice: 2999,
            duration: 75,
            image: 'assets/facial/Collagen Renewal Facial.jpg',
            category: 'facials',
            benefits: ['Reduces fine lines', 'Firms skin', 'Boosts collagen', 'Anti-aging'],
            procedure: 'Deep cleanse → Collagen mask → LED therapy → Moisturize',
            idealFor: 'Mature skin, fine lines, loss of elasticity'
        },
        {
            id: 'vitamin-c-glow',
            name: 'Vitamin C Glow Facial',
            description: 'Brightening treatment with vitamin C serum. Perfect for dull skin and pigmentation concerns.',
            originalPrice: 3000,
            discountedPrice: 2399,
            duration: 60,
            image: 'assets/facial/istockphoto-1254805067-612x612.jpg',
            category: 'facials',
            benefits: ['Brightens skin', 'Reduces dark spots', 'Antioxidant protection', 'Even skin tone'],
            procedure: 'Cleanse → Vitamin C serum → Brightening mask → Sun protection',
            idealFor: 'Dull skin, dark spots, uneven skin tone'
        },
        {
            id: 'charcoal-detox',
            name: 'Charcoal Detox Facial',
            description: 'Deep pore cleansing treatment with activated charcoal. Perfect for oily and acne-prone skin.',
            originalPrice: 3000,
            discountedPrice: 2599,
            duration: 60,
            image: 'assets/facial/Charcoal Detox Facial.jpg',
            category: 'facials',
            benefits: ['Deep pore cleansing', 'Removes toxins', 'Controls oil', 'Purifies skin'],
            procedure: 'Steam → Charcoal mask → Extraction → Soothing serum',
            idealFor: 'Oily skin, acne-prone skin, clogged pores'
        },
        {
            id: 'golden-glow',
            name: 'Golden Glow Facial',
            description: 'Luxurious gold-infused facial treatment. Provides instant radiance and anti-aging benefits.',
            originalPrice: 3000,
            discountedPrice: 2699,
            duration: 75,
            image: 'assets/facial/Golden Glow Facial.jpg',
            category: 'facials',
            benefits: ['Luxurious experience', 'Anti-aging', 'Radiant glow', 'Improves circulation'],
            procedure: 'Cleanse → Gold mask → Massage → Hydrating serum',
            idealFor: 'Special occasions, mature skin, dull complexion'
        },
        {
            id: 'dermaplaning-facial',
            name: 'Dermaplaning (Add-on)',
            description: 'Gentle exfoliation treatment that removes dead skin cells and fine facial hair for smoother skin. Can be added to any facial.',
            originalPrice: 1300,
            discountedPrice: 799,
            duration: 30,
            image: 'assets/facial/Dermaplaning.jpg',
            category: 'facials',
            isAddon: true,
            benefits: ['Smooth skin', 'Better product absorption', 'Removes peach fuzz', 'Instant results'],
            procedure: 'Cleanse → Dermaplaning → Soothing serum → Moisturize',
            idealFor: 'All skin types, pre-event treatment'
        },
        {
            id: 'korean-glass-skin',
            name: 'Korean Glass Skin Facial',
            description: 'Multi-step Korean skincare treatment for glass-like skin finish. Includes double cleansing, exfoliation, and hydration.',
            originalPrice: 3000,
            discountedPrice: 2499,
            duration: 90,
            image: 'assets/facial/Korean Glass Skin Facial.avif',
            category: 'facials',
            benefits: ['Glass-like glow', 'Deep hydration', 'Poreless appearance', 'Dewy finish'],
            procedure: 'Double cleanse → Exfoliate → Essence → Mask → Seal moisture',
            idealFor: 'All skin types seeking the Korean glass skin effect'
        }
        
    ],
    
    'lash-extensions': [
        {
            id: 'classic-lash',
            name: 'Classic Lash Extension',
            description: 'Natural-looking lash extensions with 1:1 ratio. Perfect for everyday wear and subtle enhancement.',
            originalPrice: 2500,
            discountedPrice: 1999,
            duration: 120,
            image: 'assets/Lash/Classic Lash Extension.webp',
            category: 'lash-extensions',
            benefits: ['Natural look', 'Long-lasting', 'Waterproof', 'No mascara needed'],
            procedure: 'Cleanse → Isolate → Apply extensions → Set',
            idealFor: 'First-time users, natural everyday look'
        },
        {
            id: 'hybrid-lash',
            name: 'Hybrid Lash Extension',
            description: 'Combination of classic and volume techniques. Offers more fullness while maintaining natural look.',
            originalPrice: 3500,
            discountedPrice: 2499,
            duration: 150,
            image: 'assets/Lash/Hybrid Lash Extension.webp',
            category: 'lash-extensions',
            benefits: ['Fuller lashes', 'Natural + glamorous', 'Customizable density', 'Long-lasting'],
            procedure: 'Cleanse → Map design → Classic + volume application → Seal',
            idealFor: 'Those wanting more fullness than classic but less than volume'
        },
        {
            id: 'lash-lift',
            name: 'Lash Lift',
            description: 'Natural lash enhancement that lifts and curls your existing lashes. Lasts 6-8 weeks.',
            originalPrice: 2000,
            discountedPrice: 1500,
            duration: 60,
            image: 'assets/Lash/Lash Lift.jpg',
            category: 'lash-extensions',
            benefits: ['Natural enhancement', 'Low maintenance', 'No extensions needed', 'Curl lasts 6-8 weeks'],
            procedure: 'Cleanse → Apply lifting solution → Set curl → Tint (optional)',
            idealFor: 'Those with natural lashes wanting lift and curl'
        }
    ],
    
    eyebrows: [
        {
            id: 'brow-tint',
            name: 'Eyebrow Tint',
            description: 'Professional eyebrow tinting service to enhance and define your brows.',
            originalPrice: 500,
            discountedPrice: 500,
            duration: 30,
            image: 'assets/Eyebrows/Eyebrow Tint.webp',
            category: 'eyebrows',
            isAddon: true,
            benefits: ['Enhanced definition', 'Long-lasting color', 'Natural look', 'Fills sparse areas'],
            procedure: 'Clean → Apply tint → Process → Remove excess',
            idealFor: 'Light or sparse eyebrows, special occasions'
        },
        {
            id: 'eyebrow-lamination',
            name: 'Eyebrow Lamination',
            description: 'Semi-permanent treatment that creates fuller, more defined eyebrows by setting the hairs in place.',
            originalPrice: 2000,
            discountedPrice: 1499,
            duration: 45,
            image: 'assets/Eyebrows/Eyebrow Lamination.jpg',
            category: 'eyebrows',
            benefits: ['Fuller appearance', 'Lasts 6-8 weeks', 'Tames unruly hairs', 'Low maintenance'],
            procedure: 'Cleanse → Lifting solution → Neutralize → Set',
            idealFor: 'Unruly brows, those wanting fuller brow look'
        }
    ],
    
    addons: [
        {
            id: 'dermaplaning',
            name: 'Dermaplaning',
            description: 'Gentle exfoliation treatment that removes dead skin cells and fine facial hair for smoother skin.',
            originalPrice: 1300,
            discountedPrice: 799,
            duration: 30,
            image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop&crop=face',
            category: 'addons',
            isAddon: true,
            benefits: ['Smooth skin', 'Better product absorption', 'Removes peach fuzz', 'Instant results'],
            procedure: 'Cleanse → Dermaplaning → Soothing serum → Moisturize',
            idealFor: 'All skin types, pre-event treatment'
        }
    ],
    
    combos: [
        {
            id: 'combo-hydra-classic-derma',
            name: 'HydraFacial + Classic Lash + Dermaplaning',
            description: 'Complete beauty package combining our most popular facial treatment with lash extensions and skin exfoliation.',
            originalPrice: 6100,
            discountedPrice: 3000,
            duration: 210,
            image: 'assets/facial/HydraFacial.png',
            category: 'combos',
            services: ['HydraFacial', 'Classic Lash Extension', 'Dermaplaning']
        },
        {
            id: 'combo-vitamin-c-classic-derma',
            name: 'Vitamin C Glow + Classic Lash + Dermaplaning',
            description: 'Brightening facial treatment combined with natural lash enhancement and skin exfoliation.',
            originalPrice: 6100,
            discountedPrice: 3500,
            duration: 210,
            image: 'assets/facial/istockphoto-1254805067-612x612.jpg',
            category: 'combos',
            services: ['Vitamin C Glow Facial', 'Classic Lash Extension', 'Dermaplaning']
        },
        {
            id: 'combo-charcoal-classic-derma',
            name: 'Charcoal Detox + Classic Lash + Dermaplaning',
            description: 'Deep cleansing charcoal facial with lash enhancement and skin exfoliation.',
            originalPrice: 6100,
            discountedPrice: 3500,
            duration: 210,
            image: 'assets/facial/Charcoal Detox Facial.jpg',
            category: 'combos',
            services: ['Charcoal Detox Facial', 'Classic Lash Extension', 'Dermaplaning']
        },
        {
            id: 'combo-golden-classic-derma',
            name: 'Golden Glow + Classic Lash + Dermaplaning',
            description: 'Luxurious gold facial treatment with natural lash extensions and skin exfoliation.',
            originalPrice: 6100,
            discountedPrice: 3500,
            duration: 225,
            image: 'assets/facial/Golden Glow Facial.jpg',
            category: 'combos',
            services: ['Golden Glow Facial', 'Classic Lash Extension', 'Dermaplaning']
        },
        {
            id: 'combo-collagen-classic-derma',
            name: 'Collagen Renewal + Classic Lash + Dermaplaning',
            description: 'Anti-aging facial treatment combined with lash extensions and skin exfoliation.',
            originalPrice: 6600,
            discountedPrice: 4000,
            duration: 225,
            image: 'assets/facial/Collagen Renewal Facial.jpg',
            category: 'combos',
            services: ['Collagen Renewal Facial', 'Classic Lash Extension', 'Dermaplaning']
        },
        {
            id: 'combo-korean-classic-derma',
            name: 'Korean Glass Skin + Classic Lash + Dermaplaning',
            description: 'Korean skincare method combined with lash extensions and dermaplaning for ultimate glow.',
            originalPrice: 6100,
            discountedPrice: 3500,
            duration: 240,
            image: 'assets/facial/Korean Glass Skin Facial.avif',
            category: 'combos',
            services: ['Korean Glass Skin Facial', 'Classic Lash Extension', 'Dermaplaning']
        }
    ]
   
    
};

// Search functionality
function searchServices(query) {
    if (!query) return [];
    
    const allServices = [
        ...servicesData.facials, 
        ...servicesData['lash-extensions'], 
        ...servicesData.eyebrows, 
        ...servicesData.addons, 
        ...servicesData.combos,
        ...servicesData.waxing,
        ...servicesData.threading,
        ...servicesData['hair-treatment'],
        ...servicesData['spa-at-home'],
        ...servicesData['pedicure-manicure'],
        ...servicesData['hair-products'],
        ...servicesData['body-products'],
        ...servicesData['face-products']
    ];
    return allServices.filter(service => 
        service.name.toLowerCase().includes(query.toLowerCase()) ||
        service.description.toLowerCase().includes(query.toLowerCase())
    );
}

// Get services by category
function getServicesByCategory(category) {
    return servicesData[category] || [];
}

// Get all services
function getAllServices() {
    return servicesData;
}
