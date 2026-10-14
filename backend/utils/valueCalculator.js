const BASE_PRICES = {
  Jacket: 1500,
  Jeans: 1000,
  Shirt: 600,
  Dress: 1200,
  Sneakers: 2000,
  Tshirt: 500,
  Hoodie: 1200,
  Other: 700
};

const BRAND_TIERS = {
  Premium: 1.8, // Zara, Nike, Levi's, Adidas
  MidTier: 1.2, // H&M, Uniqlo, Max
  Standard: 1.0 // Local / Generic
};

const CONDITION_MULT = {
  'New with tags': 1.0,
  'Like New': 0.85,
  'Good': 0.70,
  'Fair': 0.50
};

const calculateSwapValue = (clothingType, brandTier = 'Standard', condition = 'Good') => {
  const base = BASE_PRICES[clothingType] || BASE_PRICES.Other;
  const brand = BRAND_TIERS[brandTier] || 1.0;
  const cond = CONDITION_MULT[condition] || 0.70;

  return Math.round(base * brand * cond);
};

module.exports = calculateSwapValue;