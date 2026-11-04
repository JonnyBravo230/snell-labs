// Single source of truth for Snell Labs catalog, affiliations and order history.
// Every page reads from here so names and prices stay in sync.

const SL_PRODUCTS = [
  { id: "grapple-v4",   name: "Grappling Utility Module v4", price: 45000,   clearance: 2, stock: "In Stock",
    description: "High-tensile liquid cable launcher with pneumatic recoil absorption and titanium alloy anchor hooks." },
  { id: "vib-shield",   name: "Vibranium Weave Shield",      price: 1250000, clearance: 5, stock: "Limited",
    description: "Kinetic energy absorption disk with custom aerodynamic balance and auto-return magnetic coupling." },
  { id: "thruster",     name: "Sub-Orbital Thruster Pack",   price: 850000,  clearance: 4, stock: "In Stock",
    description: "Dual vector-thrust flight apparatus with integrated gyroscopic stabilization and emergency chute." },
  { id: "web-fluid",    name: "Web-Fluid Cartridges",        price: 12500,   clearance: 1, stock: "In Stock",
    description: "High-shear tensile polymer formula with auto-dissolving 1-hour degradation timer. (Box of 50)" },
  { id: "fusion-core",  name: "Micro-Fusion Core",           price: 490000,  clearance: 5, stock: "Limited",
    description: "Compact power unit yielding continuous 3.2 gigawatts for cybernetic limbs or localized forcefields." },
  { id: "stun-gaunt",   name: "Electro-Stun Gauntlets",      price: 80000,   clearance: 2, stock: "In Stock",
    description: "Tactical wrist units delivering non-lethal 50,000-volt incapacitating pulses on contact." }
];

const SL_AFFILIATIONS = ["Avengers", "Justice League", "X-Men", "Independent"];

const SL_STATUSES = {
  "Submitted":  "badge-submitted",
  "Assembly":   "badge-pending",
  "In Transit": "badge-transit",
  "Delivered":  "badge-fulfilled"
};

// Historical orders. Cost is derived from the catalog price x qty.
const SL_SEED_ORDERS = [
  { id: 9041, name: "Batman",          affiliation: "Justice League", productId: "grapple-v4",  qty: 12, status: "Delivered" },
  { id: 9042, name: "Iron Man",        affiliation: "Avengers",       productId: "thruster",    qty: 4,  status: "In Transit" },
  { id: 9043, name: "Spider-Man",      affiliation: "Independent",    productId: "web-fluid",   qty: 10, status: "Delivered" },
  { id: 9044, name: "Captain America", affiliation: "Avengers",       productId: "vib-shield",  qty: 1,  status: "Assembly" },
  { id: 9045, name: "Cyborg",          affiliation: "Justice League", productId: "fusion-core", qty: 2,  status: "Delivered" },
  { id: 9046, name: "Black Widow",     affiliation: "Avengers",       productId: "stun-gaunt",  qty: 2,  status: "In Transit" }
];

const SL_STORAGE_KEY = "snell-labs-requisitions";

function slProduct(id) {
  return SL_PRODUCTS.find(p => p.id === id);
}

function slFormatCurrency(amount) {
  return "$" + amount.toLocaleString("en-US");
}

function slEscape(str) {
  return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Requisitions submitted from this browser (demo only; stored locally, never sent anywhere).
function slLoadSubmitted() {
  try {
    const raw = localStorage.getItem(SL_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

function slSaveSubmitted(list) {
  try {
    localStorage.setItem(SL_STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch (e) {
    return false;
  }
}

function slAllOrders() {
  return SL_SEED_ORDERS.concat(slLoadSubmitted())
    .map(o => {
      const product = slProduct(o.productId);
      if (!product) return null;
      return { ...o, product: product.name, cost: product.price * o.qty };
    })
    .filter(Boolean);
}

function slNextOrderId() {
  return Math.max(...SL_SEED_ORDERS.concat(slLoadSubmitted()).map(o => o.id)) + 1;
}
