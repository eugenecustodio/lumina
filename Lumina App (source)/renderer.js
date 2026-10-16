const STORAGE_KEY = "wayline.warehouse.desktop.v1";
const app = document.getElementById("app");
const modalRoot = document.getElementById("modal-root");
const toastElement = document.getElementById("toast");

const ICON_PATHS = {
  dashboard: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  inventory: '<path d="m21 8-9 5-9-5"/><path d="m3.3 7 8.7-5 8.7 5v10L12 22l-8.7-5Z"/><path d="M12 13v9"/>',
  orders: '<path d="M9 5h6"/><path d="M9 9h6"/><path d="M9 13h4"/><path d="M5 3h14v18H5z"/><path d="m15.5 17 1.5 1.5 3-3"/>',
  picking: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 3-3v-6a3 3 0 0 1 3-3"/><path d="m4 4 3-2 3 2v4l-3 2-3-2Z"/>',
  package: '<path d="m21 8-9 5-9-5"/><path d="m3.3 7 8.7-5 8.7 5v10L12 22l-8.7-5Z"/><path d="M12 13v9"/><path d="m7.5 4.6 9 5.1"/>',
  complete: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.6 2.6L16.5 9"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  alert: '<path d="M10.3 3.6 2.4 17.3A2 2 0 0 0 4.1 20h15.8a2 2 0 0 0 1.7-2.7L13.7 3.6a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  pie: '<path d="M11 3a9 9 0 1 0 9 9h-9Z"/><path d="M14 3.6A9 9 0 0 1 20.4 10H14Z"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  arrow: '<path d="M5 12h14M14 7l5 5-5 5"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  location: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
  more: '<circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
  layout: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 17.5h7M17.5 14v7"/>',
  save: '<path d="M5 3h12l2 2v16H5z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/>',
  rack: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M4 9h16M4 15h16M8 3v18M16 3v18"/>',
  shelf: '<path d="M5 3v18M19 3v18M5 7h14M5 12h14M5 17h14"/><path d="M3 21h18"/>',
  bin: '<path d="m12 3 8 4.5-8 4.5-8-4.5Z"/><path d="M4 7.5V17l8 4 8-4V7.5M12 12v9"/>',
  eraser: '<path d="m7 21-4-4L14.5 5.5a2.1 2.1 0 0 1 3 0l1 1a2.1 2.1 0 0 1 0 3L7 21Z"/><path d="m10 10 5 5M7 21h13"/>',
  path: '<path d="M5 21V9a4 4 0 0 1 4-4h6a4 4 0 0 0 4-4"/><path d="m2 18 3 3 3-3M16 4l3-3 3 3"/>',
  start: '<path d="M6 21V4"/><path d="M6 5h11l-2.5 3L17 11H6"/><circle cx="6" cy="21" r="1.5"/>',
  upload: '<path d="M12 16V3"/><path d="m7 8 5-5 5 5"/><path d="M5 14v6h14v-6"/>',
  download: '<path d="M12 3v13"/><path d="m7 11 5 5 5-5"/><path d="M5 20h14"/>',
  door: '<path d="M6 21V4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21"/><path d="M3 21h18"/><path d="M14.5 12h.01"/>',
  boxes: '<path d="m4 7 5-3 5 3-5 3Z"/><path d="M4 7v6l5 3 5-3V7M9 10v6"/><path d="m14 10 3-2 3 2-3 2Z"/><path d="M14 10v5l3 2.5 3-2.5v-5"/>',
};

function icon(name, className = "ui-icon") {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] || ICON_PATHS.package}</svg>`;
}

function hydrateStaticIcons() {
  document.querySelectorAll("[data-icon]").forEach((element) => { element.innerHTML = icon(element.dataset.icon); });
}

const due = (hours) => new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
function createZoneLayout(rows = 8, columns = 7, type = "Rack") { const cells = {}; for (let row = 1; row <= rows; row += 1) for (let column = 1; column <= columns; column += 1) cells[`${row}-${column}`] = row === rows || column % 2 === 0 ? "Path" : type; return { rows, columns, cells }; }
function normalizeZoneToTwoSides(source, defaultType) { const oldRows = Math.max(2, Number(source?.rows) || 8); const oldColumns = Math.max(1, Number(source?.columns) || 2); const oldCells = source?.cells || {}; const rows = Math.max(2, Math.min(48, oldColumns > 2 ? Math.ceil(oldRows * oldColumns / 2) : oldRows)); const cells = {}; Object.entries(oldCells).forEach(([key,type]) => { const [oldRow,oldColumn] = key.split("-").map(Number); const index = (oldRow - 1) * oldColumns + oldColumn - 1; const row = oldColumns > 2 ? Math.floor(index / 2) + 1 : oldRow; const column = oldColumns > 2 ? index % 2 + 1 : oldColumn; if (row <= rows && column <= 2 && ["Rack","Shelf","Bin"].includes(type)) cells[`${row}-${column}`] = type; }); return { rows, columns: 2, cells }; }
function convertTwoSideZoneToGrid(source, defaultType) { const twoSide = normalizeZoneToTwoSides(source, defaultType); const cells = {}; for (let row = 1; row <= twoSide.rows; row += 1) { if (twoSide.cells[`${row}-1`]) cells[`${row}-1`] = twoSide.cells[`${row}-1`]; cells[`${row}-2`] = "Path"; if (twoSide.cells[`${row}-2`]) cells[`${row}-3`] = twoSide.cells[`${row}-2`]; } return { rows: twoSide.rows, columns: 3, cells }; }
function normalizeGridZone(source, defaultType) { const rows = Math.max(3, Math.min(30, Number(source?.rows) || 8)); const columns = Math.max(3, Math.min(30, Number(source?.columns) || 7)); const cells = {}; Object.entries(source?.cells || {}).forEach(([key,type]) => { const [row,column] = key.split("-").map(Number); if (row >= 1 && row <= rows && column >= 1 && column <= columns && ["Path","Rack","Shelf","Bin"].includes(type)) cells[key] = type; }); return { rows, columns, cells }; }
function defaultWarehouseLayout() { return { zoneCount: 4, orientation: "Vertical", aisleWidth: "Standard", defaultContainerType: "Rack", reachabilityVersion: 3, freeGridVersion: 3, startingPoint: { zone:"A", key:"8-4" }, zoneLayouts: { A:createZoneLayout(), B:createZoneLayout(), C:createZoneLayout(), D:createZoneLayout() } }; }
function normalizeWarehouseLayout(saved = {}) {
  const base = defaultWarehouseLayout(); const zoneCount = Math.max(2, Math.min(4, Number(saved.zoneCount) || base.zoneCount)); const defaultType = ["Rack","Shelf","Bin"].includes(saved.defaultContainerType) ? saved.defaultContainerType : "Rack"; const zoneLayouts = {};
  ["A","B","C","D"].forEach((zone) => { const source = saved.zoneLayouts?.[zone]; zoneLayouts[zone] = !source ? createZoneLayout(8,7,defaultType) : Number(saved.freeGridVersion) >= 3 ? normalizeGridZone(source,defaultType) : convertTwoSideZoneToGrid(source,defaultType); });
  const activeZones = Array.from({ length: zoneCount }, (_, index) => String.fromCharCode(65 + index)); let startingPoint = saved.startingPoint; const startZone = zoneLayouts[startingPoint?.zone]; if (!activeZones.includes(startingPoint?.zone) || startZone?.cells?.[startingPoint?.key] !== "Path") { const zone = zoneLayouts.A; const paths = Object.keys(zone.cells).filter((key) => zone.cells[key] === "Path"); startingPoint = { zone:"A", key:zoneEntryPath(zone,saved.orientation || base.orientation) || paths[0] || gridKey(zone.rows,Math.ceil(zone.columns / 2)) }; zone.cells[startingPoint.key] = "Path"; }
  return { ...base, ...saved, zoneCount, defaultContainerType: defaultType, reachabilityVersion: 3, freeGridVersion: 3, startingPoint, zoneLayouts };
}
function migrateLocationToTwoSides(value, savedLayout = {}) { const location = parseLocation(value); const isLegacy = /^([A-Z])-(\d{1,2})-R\d{1,2}-S\d{1,2}-B\d{1,2}$/i.test(value || ""); const oldColumns = Math.max(1, Number(savedLayout.zoneLayouts?.[location.zone]?.columns) || Number(savedLayout.aislesPerZone) || 2); if (!location.zone) return value; if (Number(savedLayout.reachabilityVersion) >= 2 || oldColumns <= 2) return isLegacy ? composeLocation(location) : value; const index = (Number(location.containerNumber) - 1) * oldColumns + Number(location.aisle) - 1; return composeLocation({ ...location, aisle: index % 2 + 1, containerNumber: Math.floor(index / 2) + 1 }); }
function migrateLocationToFreeGrid(value, savedLayout = {}) { if (Number(savedLayout.freeGridVersion) >= 3) return value; const twoSideValue = migrateLocationToTwoSides(value, savedLayout); const location = parseLocation(twoSideValue); if (!location.zone) return value; return composeLocation({ ...location, aisle: Number(location.aisle) === 2 ? 3 : 1 }); }
function migrateInventoryToFreeGrid(inventory, savedLayout = {}) { return inventory.map((item) => ({ ...item, location: migrateLocationToFreeGrid(item.location, savedLayout) })); }
function migrateBatchesToFreeGrid(batches, savedLayout = {}) { return batches.map((batch) => ({ ...batch, route: (batch.route || []).map((stop) => ({ ...stop, location: migrateLocationToFreeGrid(stop.location, savedLayout) })) })); }
function migrateInventoryStatuses(inventory) { const statusMap = { Active:"Available", Hold:"Quarantined", "Out of stock":"Out Of Stock" }; return inventory.map((item) => ({ ...item, status:statusMap[item.status] || item.status || "Available" })); }
// ---------- stock, cart and batching rules ----------
const CONTAINER_CAPACITY = { Rack: 500, Shelf: 250, Bin: 100 };   // units one square can hold
const CART_CAPACITY = 60;          // load units one picking cart can carry
const MAX_ORDERS_PER_BATCH = 4;
const PICKERS = ["Picker 1", "Picker 2", "Picker 3"];
const MODEL_VERSION = 17;
function productBySku(sku) { return state.inventory.find((item) => item.sku === sku); }
function containerTypeOf(location) { return parseLocation(location).containerType; }
function capacityOf(location) { return CONTAINER_CAPACITY[containerTypeOf(location)] || 0; }
// Products keep stock per location; quantity and location (the primary one) stay in sync for the rest of the app.
function syncProduct(item) {
  // update entries in place so callers holding an entry keep a live reference
  item.locations = (item.locations || []).filter((entry) => entry && entry.location);
  item.locations.forEach((entry) => { entry.quantity = Math.max(0, Math.round(Number(entry.quantity) || 0)); });
  if (!item.locations.length && item.location) item.locations = [{ location: item.location, quantity: Math.max(0, Number(item.quantity) || 0) }];
  item.quantity = item.locations.reduce((sum, entry) => sum + entry.quantity, 0);
  item.location = item.locations[0]?.location || "";
  return item;
}
function normalizeProduct(item) { if (!Array.isArray(item.locations) || !item.locations.length) item.locations = [{ location: item.location, quantity: Number(item.quantity) || 0 }]; return syncProduct(item); }
// Which product holds each square (one product per square).
function locationOwners(exceptSku = null) { const owners = new Map(); state.inventory.forEach((item) => { if (item.sku === exceptSku) return; (item.locations || []).forEach((entry) => owners.set(entry.location, item.name)); }); return owners; }
function recordMovement(item, location, change, type, reference = "") {
  if (!change && type !== "Count correction") return;
  state.movements.unshift({ id: Date.now() + Math.random(), at: new Date().toISOString(), sku: item.sku, name: item.name, location, change, balance: item.quantity, type, reference });
  state.movements = state.movements.slice(0, 600);
}
// Stock already promised to open picking batches.
function reservedBySku() { const map = new Map(); openBatches().forEach((batch) => (batch.route || []).forEach((stop) => map.set(stop.sku, (map.get(stop.sku) || 0) + stop.quantity))); return map; }
function reservedByLocation(exceptBatchId = null) { const map = new Map(); openBatches().forEach((batch) => { if (batch.id === exceptBatchId) return; (batch.route || []).forEach((stop) => map.set(`${stop.sku}@${stop.location}`, (map.get(`${stop.sku}@${stop.location}`) || 0) + stop.quantity)); }); return map; }
// Handling rules for batching: hazardous and cold-chain goods travel on their own carts; oversized items take more room.
function orderHandlingClass(order) {
  const types = order.lines.map((line) => productBySku(line.sku)?.handlingType);
  if (types.includes("Hazardous")) return "Hazardous";
  if (types.includes("Refrigerated") || types.includes("Frozen")) return "Cold chain";
  return "Standard";
}
function itemLoad(sku, quantity) { return quantity * (productBySku(sku)?.handlingType === "Oversized" ? 5 : 1); }
function orderLoad(order) { return order.lines.reduce((sum, line) => sum + itemLoad(line.sku, line.quantity), 0); }
function batchLoad(batch) { return (batch.route || []).reduce((sum, stop) => sum + itemLoad(stop.sku, stop.quantity), 0); }
// Order life cycle: ready (Pending) → batched (Picking) → picked → packed → shipped (Completed); or cancelled.
const ORDER_STAGE_LABEL = { ready: "Pending", batched: "Picking", picked: "Picked", packed: "Packed", shipped: "Completed", cancelled: "Cancelled" };
function orderStage(order) { return ORDER_STAGE_LABEL[order.status] || "Pending"; }
function isOrderOpen(order) { return !["shipped", "cancelled"].includes(order.status); }
function upgradeState(saved) {
  saved.inventory = (saved.inventory || []).map(normalizeProduct);
  saved.movements = Array.isArray(saved.movements) ? saved.movements : [];
  if (Number(saved.modelVersion) < MODEL_VERSION || !saved.modelVersion) {
    // before v1.7 "picked" meant the order was finished
    if (saved.modelVersion === undefined) saved.orders.forEach((order) => { if (order.status === "picked") order.status = "shipped"; });
    saved.modelVersion = MODEL_VERSION;
  }
  saved.orders.forEach((order) => { order.events = order.events || { createdAt: order.createdAt || new Date().toISOString() }; });
  saved.batches.forEach((batch) => {
    batch.route = (batch.route || []).map((stop) => ({ ...stop, id: stop.id || `${stop.sku}@${stop.location}` }));
    batch.assignedPicker = PICKERS.includes(batch.assignedPicker) ? batch.assignedPicker : PICKERS[0];
  });
  return saved;
}
const defaultState = () => ({
  inventory: [
    { id: 1, sku: "PCK-STD-001", name: "Double-wall shipping box", category: "Packaging", quantity: 428, reorderPoint: 120, location: "A-01-R01", handlingType: "Standard", status: "Available" },
    { id: 2, sku: "EQP-FRG-001", name: "Wireless barcode scanner", category: "Equipment", quantity: 18, reorderPoint: 24, location: "A-03-R04", handlingType: "Fragile", status: "Available" },
    { id: 3, sku: "PCK-STD-002", name: "Kraft paper roll 450 mm", category: "Packaging", quantity: 62, reorderPoint: 30, location: "B-03-R01", handlingType: "Standard", status: "Available" },
    { id: 4, sku: "LAB-STD-001", name: "Thermal label 100 × 150", category: "Labels", quantity: 9, reorderPoint: 20, location: "B-03-R03", handlingType: "Standard", status: "Available" },
    { id: 5, sku: "SAF-STD-001", name: "Safety vest — yellow", category: "Safety", quantity: 86, reorderPoint: 18, location: "C-01-R05", handlingType: "Standard", status: "Available" },
    { id: 6, sku: "PCK-STD-003", name: "Clear packing tape 48 mm", category: "Packaging", quantity: 244, reorderPoint: 72, location: "C-03-R02", handlingType: "Standard", status: "Available" },
    { id: 7, sku: "EQP-HAZ-001", name: "Scanner battery pack", category: "Equipment", quantity: 33, reorderPoint: 16, location: "D-03-R04", handlingType: "Hazardous", status: "Available" },
    { id: 8, sku: "SAF-STD-002", name: "Nitrile gloves — medium", category: "Safety", quantity: 14, reorderPoint: 25, location: "D-03-R01", handlingType: "Standard", status: "Available" },
  ],
  orders: [
    { id: 1, orderNumber: "SO-10481", customer: "Northstar Retail", priority: "urgent", dueAt: due(-2), status: "ready", batchCode: null, lines: [{ sku: "EQP-FRG-001", quantity: 3 }, { sku: "EQP-HAZ-001", quantity: 4 }] },
    { id: 2, orderNumber: "SO-10482", customer: "Mira Home", priority: "express", dueAt: due(1), status: "ready", batchCode: null, lines: [{ sku: "PCK-STD-001", quantity: 24 }, { sku: "PCK-STD-003", quantity: 8 }] },
    { id: 3, orderNumber: "SO-10483", customer: "Pioneer Goods", priority: "standard", dueAt: due(3), status: "ready", batchCode: null, lines: [{ sku: "PCK-STD-002", quantity: 4 }, { sku: "LAB-STD-001", quantity: 3 }] },
    { id: 4, orderNumber: "SO-10484", customer: "Studio Seven", priority: "express", dueAt: due(-1), status: "ready", batchCode: null, lines: [{ sku: "SAF-STD-001", quantity: 12 }, { sku: "SAF-STD-002", quantity: 5 }] },
    { id: 5, orderNumber: "SO-10485", customer: "Cedar & Co.", priority: "standard", dueAt: due(5), status: "ready", batchCode: null, lines: [{ sku: "PCK-STD-001", quantity: 30 }, { sku: "PCK-STD-002", quantity: 2 }] },
    { id: 6, orderNumber: "SO-10486", customer: "Orchid Supply", priority: "standard", dueAt: due(7), status: "ready", batchCode: null, lines: [{ sku: "PCK-STD-003", quantity: 16 }, { sku: "LAB-STD-001", quantity: 2 }] },
    { id: 7, orderNumber: "SO-10487", customer: "Fieldwork Labs", priority: "express", dueAt: due(9), status: "ready", batchCode: null, lines: [{ sku: "EQP-HAZ-001", quantity: 6 }, { sku: "SAF-STD-002", quantity: 4 }] },
  ],
  batches: [],
  warehouseLayout: defaultWarehouseLayout(),
  history: [],
});

let state = loadState();
let currentView = "dashboard";
let chartPeriod = "Week";
let selectedBatchId = state.batches[0]?.id || null;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.inventory && saved?.orders && saved?.batches) {
      const upgraded = upgradeState({ ...defaultState(), ...saved, inventory: migrateInventoryStatuses(migrateInventoryToFreeGrid(saved.inventory, saved.warehouseLayout || {})), batches: migrateBatchesToFreeGrid(saved.batches, saved.warehouseLayout || {}), warehouseLayout: normalizeWarehouseLayout(saved.warehouseLayout || {}), history: Array.isArray(saved.history) ? saved.history : [], modelVersion: saved.modelVersion });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(upgraded));
      return upgraded;
    }
  } catch {}
  const fresh = upgradeState({ ...defaultState(), modelVersion: MODEL_VERSION });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}

function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); updateReadyBadge(); }
function recordHistory(action, detail, area, iconName = "history") { state.history.unshift({ id: Date.now() + Math.random(), action, detail, area, icon: iconName, at: new Date().toISOString() }); state.history = state.history.slice(0, 150); }
function updateReadyBadge() { document.getElementById("ready-badge").textContent = state.orders.filter((order) => order.status === "ready").length; }
function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char])); }
function formatDate(value) { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value)); }
function formatTime(value) { return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(value)); }
function toast(message) { toastElement.textContent = message; toastElement.classList.add("show"); clearTimeout(toast.timer); toast.timer = setTimeout(() => toastElement.classList.remove("show"), 2400); }

// Shared definitions so every page counts and labels things the same way.
const BASE_CATEGORIES = ["Food","Snacks","Beverages","Packaging","Equipment","Labels","Safety","General"];
const HOLD_STATUSES = ["Damaged","Quarantined"];
function localDateKey(value = new Date()) { const date = new Date(value); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`; }
function isLowStock(item) { return item.quantity > 0 && item.quantity <= item.reorderPoint; }
function isOutOfStock(item) { return item.quantity === 0 || item.status === "Out Of Stock"; }
function productDisplayStatus(item) { if (HOLD_STATUSES.includes(item.status)) return item.status; if (isOutOfStock(item)) return "Out Of Stock"; if (isLowStock(item)) return "Low Stock"; return item.status || "Available"; }
function isOrderDelayed(order) { return isOrderOpen(order) && new Date(order.dueAt) < new Date(); }
function orderDisplayStatus(order) { if (!isOrderOpen(order)) return orderStage(order); if (isOrderDelayed(order)) return "Delayed"; return orderStage(order); }
function openBatches() { return state.batches.filter((batch) => batch.status !== "complete"); }

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (modalRoot.innerHTML) { closeModal(); return; }
  document.querySelectorAll(".row-menu.open").forEach((menu) => menu.classList.remove("open"));
});

document.querySelectorAll(".nav-item").forEach((button) => button.addEventListener("click", () => navigate(button.dataset.view)));
const viewFilters = { orders: "All", inventory: "All" };
let pendingHighlight = null;
function navigate(view, options = {}) {
  currentView = view;
  if (options.filter && view in viewFilters) viewFilters[view] = options.filter;
  if (options.batchId) selectedBatchId = options.batchId;
  pendingHighlight = options.highlight || null;
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  render();
  app.focus({ preventScroll: true });
  applyHighlight();
}
function applyHighlight() {
  if (!pendingHighlight) return;
  const element = document.querySelector(pendingHighlight); pendingHighlight = null;
  if (!element) return;
  element.hidden = false; element.classList.remove("flash"); void element.offsetWidth; element.classList.add("flash");
  element.scrollIntoView({ block: "center" });
}
function filterChips(view, options) {
  return `<div class="filter-chips" role="group" aria-label="Filter">${options.map((option) => `<button type="button" class="chip ${viewFilters[view] === option.key ? "active" : ""}" data-chip="${escapeHtml(option.key)}" aria-pressed="${viewFilters[view] === option.key}">${escapeHtml(option.label || option.key)}${option.count === undefined ? "" : `<b>${option.count}</b>`}</button>`).join("")}</div>`;
}
// Search box + filter chips over a table. Each row carries data-search and data-keys (space-separated "|" list of chip keys).
function setupTableFilter(view, searchId, rowSelector, emptySelector) {
  const search = document.getElementById(searchId); const rows = [...document.querySelectorAll(rowSelector)]; const empty = document.querySelector(emptySelector);
  const apply = () => { const query = search.value.trim().toLowerCase(); const chip = viewFilters[view]; let visible = 0;
    rows.forEach((row) => { const matches = (!query || row.dataset.search.includes(query)) && (chip === "All" || row.dataset.keys.split("|").includes(chip)); row.hidden = !matches; if (matches) visible += 1; });
    empty.hidden = visible > 0; };
  search.addEventListener("input", apply);
  document.querySelectorAll("[data-chip]").forEach((button) => button.addEventListener("click", () => {
    viewFilters[view] = button.dataset.chip;
    document.querySelectorAll("[data-chip]").forEach((other) => { const on = other === button; other.classList.toggle("active", on); other.setAttribute("aria-pressed", String(on)); });
    apply();
  }));
  apply();
}

function render() {
  updateReadyBadge();
  if (currentView === "inventory") renderInventory();
  else if (currentView === "orders") renderOrders();
  else if (currentView === "picking") renderPicking();
  else if (currentView === "history") renderHistory();
  else renderDashboard();
}

function pageHeader(title, description, action = "") {
  return `<div class="page-header"><div><h1>${title}</h1>${description ? `<p>${description}</p>` : ""}</div>${action}</div>`;
}

function renderDashboard() {
  const countStatus = (label) => state.orders.filter((order) => orderDisplayStatus(order) === label).length;
  const completed = countStatus("Completed");
  const delayedIds = new Set(state.orders.filter(isOrderDelayed).map((order) => order.id));
  const picking = countStatus("Picking");
  const waiting = countStatus("Pending");
  const packing = countStatus("Picked") + countStatus("Packed");
  const open = state.orders.filter(isOrderOpen).length;
  const activeTotal = state.orders.filter((order) => order.status !== "cancelled").length;
  const low = state.inventory.filter(isLowStock);
  const alerts = buildAlerts();
  const statuses = [
    { label: "Completed", value: completed, color: "#91b84b" },
    { label: "Packing", value: packing, color: "#5aa9c9", filter: "To pack" },
    { label: "Picking", value: picking, color: "#e6c451" },
    { label: "Pending", value: waiting, color: "#8ab8aa" },
    { label: "Delayed", value: delayedIds.size, color: "#e7786d" },
  ];
  const total = Math.max(1, statuses.reduce((sum, item) => sum + item.value, 0));
  let cursor = 0;
  const gradient = statuses.map((status) => { const start = cursor; cursor += status.value / total * 100; return `${status.color} ${start}% ${cursor}%`; }).join(",");

  app.innerHTML = `<div class="page dashboard-page">${pageHeader("Dashboard")}
    <section class="kpi-grid" aria-label="Order overview">
      ${kpi("cyan", "package", activeTotal, "Total Orders", "orders", "All")}
      ${kpi("lime", "complete", completed, "Completed Orders", "orders", "Completed")}
      ${kpi("yellow", "clock", open, "Open Orders", "orders", "Open")}
      ${kpi("rose", "alert", low.length, "Low-Stock Products", "inventory", "Low stock")}
    </section>
    <section class="dashboard-grid">
      <div class="dashboard-left">
        <article class="card card-pad">
          <div class="section-head"><h2>Order Volume</h2><div class="period-tabs">${["Week","Month","Year"].map((period) => `<button data-period="${period}" class="${period === chartPeriod ? "active" : ""}">${period}</button>`).join("")}</div></div>
          <div class="legend"><span><i style="background:#59bfc2"></i>Received</span><span><i style="background:#91b84b"></i>Completed</span><span><i style="background:#e7786d"></i>Delayed</span></div>
          <div class="chart-wrap"><svg id="order-chart" viewBox="0 0 760 250" role="img" aria-label="Interactive order volume chart"></svg><div class="chart-tooltip" id="chart-tooltip"></div></div>
        </article>
        <article class="card card-pad"><div class="section-head"><h2>Order Status Breakdown</h2><span class="section-icon">${icon("pie")}</span></div><div class="status-layout"><div class="donut" style="background:conic-gradient(${gradient})"><div class="donut-center"><div><strong>${activeTotal}</strong><span>total orders</span></div></div></div><div class="status-list">${statuses.map((status) => `<button type="button" class="status-line" data-go-view="orders" data-go-filter="${status.filter || status.label}" title="Show ${status.label.toLowerCase()} orders"><i style="background:${status.color}"></i><span>${status.label}</span><b>${status.value}</b><div class="status-progress"><span style="width:${status.value / total * 100}%;background:${status.color}"></span></div></button>`).join("")}</div></div></article>
      </div>
      <article class="card notifications"><div class="section-head"><h2>Notifications</h2><span class="section-icon notification-bell">${icon("bell")}<span class="notification-badge">${alerts.length}</span></span></div><div class="alert-list">${alerts.length ? alerts.map((alert, index) => alertMarkup(alert, index)).join("") : `<div class="empty"><strong>No Urgent Alerts</strong></div>`}</div></article>
    </section>
  </div>`;
  document.querySelectorAll("[data-period]").forEach((button) => button.addEventListener("click", () => { chartPeriod = button.dataset.period; renderDashboard(); }));
  document.querySelectorAll("[data-go-view]").forEach((button) => button.addEventListener("click", () => navigate(button.dataset.goView, { filter: button.dataset.goFilter })));
  document.querySelectorAll("[data-alert]").forEach((button) => button.addEventListener("click", () => navigate(alerts[Number(button.dataset.alert)].go.view, alerts[Number(button.dataset.alert)].go)));
  drawChart(chartPeriod, completed, delayedIds.size);
  requestAnimationFrame(syncDashboardPanels);
}

function syncDashboardPanels() {
  const leftColumn = document.querySelector(".dashboard-left");
  const notifications = document.querySelector(".notifications");
  if (!leftColumn || !notifications) return;
  notifications.style.height = window.matchMedia("(max-width: 1120px)").matches ? "420px" : `${leftColumn.offsetHeight}px`;
}

function kpi(tone, iconName, value, label, view, filter) { return `<button type="button" class="kpi ${tone}" data-go-view="${view}" data-go-filter="${escapeHtml(filter)}" title="Open ${view === "orders" ? "Orders" : "Inventory"}"><div class="kpi-top"><span class="kpi-icon">${icon(iconName, "ui-icon icon-lg")}</span><div><span class="kpi-value">${value}</span><span class="kpi-label">${label}</span></div></div></button>`; }
function distribute(total, count) { const values = Array.from({ length: count }, () => 0); for (let i = 0; i < total; i += 1) values[(i * 3 + 1) % count] += 1; return values; }

function drawChart(period, completed, delayed) {
  const labels = period === "Week" ? ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] : period === "Month" ? ["W1","W2","W3","W4"] : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const series = [
    { name: "Received", color: "#59bfc2", values: distribute(state.orders.length, labels.length) },
    { name: "Completed", color: "#91b84b", values: distribute(completed, labels.length) },
    { name: "Delayed", color: "#e7786d", values: distribute(delayed, labels.length) },
  ];
  const svg = document.getElementById("order-chart");
  const tip = document.getElementById("chart-tooltip");
  const left = 48, right = 18, top = 18, bottom = 34, width = 760 - left - right, height = 250 - top - bottom;
  const max = Math.max(4, ...series.flatMap((item) => item.values));
  const x = (index) => left + index * width / Math.max(1, labels.length - 1);
  const y = (value) => top + height - value / max * height;
  const grid = Array.from({ length: 5 }, (_, index) => { const value = Math.round(max * (4 - index) / 4); const yy = top + index * height / 4; return `<line x1="${left}" y1="${yy}" x2="${760-right}" y2="${yy}" stroke="#e6ebe8"/><text x="${left-10}" y="${yy+4}" text-anchor="end" fill="#8a9894" font-size="10">${value}</text>`; }).join("");
  const xLabels = labels.map((label, index) => `<text x="${x(index)}" y="${250-8}" text-anchor="middle" fill="#71827d" font-size="10">${label}</text>`).join("");
  const smoothPath = (points) => points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const curve = (point.x - previous.x) * .42;
    return `${path} C ${previous.x + curve} ${previous.y}, ${point.x - curve} ${point.y}, ${point.x} ${point.y}`;
  }, `M ${points[0].x} ${points[0].y}`);
  const lines = series.map((item, seriesIndex) => {
    const points = item.values.map((value, index) => ({ x: x(index), y: y(value) }));
    const path = smoothPath(points);
    const area = seriesIndex === 0 ? `<path d="${path} L ${points.at(-1).x} ${top + height} L ${points[0].x} ${top + height} Z" fill="url(#received-area)"/>` : "";
    const dots = item.values.map((value, index) => `<circle class="chart-point" cx="${x(index)}" cy="${y(value)}" r="4.5" fill="${item.color}" data-series="${item.name}" data-label="${labels[index]}" data-value="${value}"/>`).join("");
    return `${area}<path d="${path}" fill="none" stroke="${item.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${dots}`;
  }).join("");
  svg.innerHTML = `<defs><linearGradient id="received-area" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#59bfc2" stop-opacity=".18"/><stop offset="100%" stop-color="#59bfc2" stop-opacity="0"/></linearGradient></defs>${grid}${xLabels}${lines}`;
  svg.querySelectorAll(".chart-point").forEach((point) => {
    point.addEventListener("mouseenter", () => { tip.innerHTML = `<strong>${point.dataset.label} · ${point.dataset.series}</strong><span>${point.dataset.value} order${point.dataset.value === "1" ? "" : "s"}</span>`; tip.style.left = `${point.cx.baseVal.value / 760 * 100}%`; tip.style.top = `${point.cy.baseVal.value / 250 * 100}%`; tip.classList.add("show"); point.setAttribute("r", "7"); });
    point.addEventListener("mouseleave", () => { tip.classList.remove("show"); point.setAttribute("r", "4.5"); });
  });
}

function buildAlerts() {
  const alerts = [];
  const toProduct = (item) => ({ view: "inventory", filter: "All", highlight: `[data-product-id="${item.id}"]` });
  const toOrder = (order) => ({ view: "orders", filter: "All", highlight: `[data-order-id="${order.id}"]` });
  state.inventory.filter((item) => item.quantity === 0).forEach((item) => alerts.push({ title: "Out of stock", detail: `${item.name} has zero available inventory.`, severity: "critical", icon: "alert", go: toProduct(item) }));
  state.orders.filter(isOrderDelayed).forEach((order) => alerts.push({ title: "Delayed order", detail: `${order.orderNumber} is still ${orderStage(order).toLowerCase()} after its due time.`, severity: "critical", icon: "clock", go: toOrder(order) }));
  state.orders.filter((order) => order.status === "ready" && order.priority === "urgent").forEach((order) => alerts.push({ title: "Priority order waiting", detail: `${order.orderNumber} is urgent and has not been batched.`, severity: "critical", icon: "alert", go: toOrder(order) }));
  heldOrders().forEach((problems, orderId) => { const order = state.orders.find((candidate) => candidate.id === orderId); alerts.push({ title: "Order held for stock", detail: `${order.orderNumber} can't be batched: ${problems.join("; ")}.`, severity: "warning", icon: "orders", go: toOrder(order) }); });
  state.inventory.filter(isLowStock).forEach((item) => alerts.push({ title: "Low stock", detail: `${item.name} is at ${item.quantity}; reorder point is ${item.reorderPoint}.`, severity: "warning", icon: "alert", go: toProduct(item) }));
  state.inventory.filter((item) => item.status === "Damaged").forEach((item) => alerts.push({ title: "Damaged item reported", detail: `${item.name} is marked as damaged.`, severity: "critical", icon: "alert", go: toProduct(item) }));
  openBatches().filter((batch) => Date.now() - new Date(batch.createdAt) > 90 * 60 * 1000).forEach((batch) => alerts.push({ title: "Picking batch delayed", detail: `${batch.code} is at ${batch.progress}% after its target window.`, severity: "warning", icon: "clock", go: { view: "picking", batchId: batch.id } }));
  state.inventory.forEach((item) => (item.locations || []).forEach((entry) => {
    if (!isLocationWithinLayout(entry.location)) alerts.push({ title: "Warehouse location issue", detail: `${item.name} at ${entry.location} is outside the current warehouse layout.`, severity: "info", icon: "location", go: toProduct(item) });
    else if (!isContainerReachable(entry.location)) alerts.push({ title: "Unreachable picking location", detail: `${item.name} at ${entry.location} has no walkway from the starting point.`, severity: "critical", icon: "picking", go: toProduct(item) });
    if (entry.quantity > capacityOf(entry.location)) alerts.push({ title: "Location over capacity", detail: `${entry.location} holds ${entry.quantity} of ${item.name}; capacity is ${capacityOf(entry.location)}.`, severity: "warning", icon: "boxes", go: toProduct(item) });
  }));
  const names = new Map(); state.inventory.forEach((item) => { const key = item.name.trim().toLowerCase(); names.set(key, [...(names.get(key) || []), item]); });
  names.forEach((items) => { if (items.length > 1) alerts.push({ title: "Duplicate product names", detail: `${items.length} products are called "${items[0].name}". Rename one so imports match the right product.`, severity: "warning", icon: "inventory", go: toProduct(items[1]) }); });
  const toPack = state.orders.filter((order) => order.status === "picked").length; const toShip = state.orders.filter((order) => order.status === "packed").length;
  if (toPack) alerts.push({ title: "Orders waiting to be packed", detail: `${toPack} picked order${toPack === 1 ? " is" : "s are"} waiting to be packed.`, severity: "info", icon: "package", go: { view: "orders", filter: "To pack" } });
  if (toShip) alerts.push({ title: "Orders ready to ship", detail: `${toShip} packed order${toShip === 1 ? " is" : "s are"} ready to ship.`, severity: "info", icon: "arrow", go: { view: "orders", filter: "To ship" } });
  const rank = { critical: 0, warning: 1, info: 2 };
  return alerts.sort((a, b) => rank[a.severity] - rank[b.severity]);
}
function alertMarkup(alert, index) { return `<button type="button" class="alert ${alert.severity}" data-alert="${index}"><span class="alert-icon">${icon(alert.icon)}</span><div><strong>${escapeHtml(alert.title)}</strong><p>${escapeHtml(alert.detail)}</p></div><span class="alert-go">${icon("arrow")}</span></button>`; }

function renderInventory(query = "") {
  const reserved = reservedBySku();
  const totalUnits = state.inventory.reduce((sum, item) => sum + Number(item.quantity || 0), 0); const reservedUnits = [...reserved.values()].reduce((sum, value) => sum + value, 0);
  const lowStock = state.inventory.filter(isLowStock).length; const outOfStock = state.inventory.filter(isOutOfStock).length;
  const actions = `<div class="header-actions"><button class="btn secondary with-icon" id="download-template">${icon("download")}<span>Template</span></button><button class="btn secondary with-icon" id="import-csv">${icon("upload")}<span>Import CSV</span></button><button class="btn with-icon" id="add-product">${icon("plus")}<span>Add Product</span></button><input type="file" id="csv-file" accept=".csv,text/csv" hidden /></div>`;
  app.innerHTML = `<div class="page inventory-page">${pageHeader("Inventory", "Stock per location, what is reserved for picking, and what is still available.", actions)}<section class="inventory-summary" aria-label="Inventory Summary"><article><span>${icon("boxes")}</span><div><strong>${state.inventory.length}</strong><small>Total Products</small></div></article><article><span>${icon("inventory")}</span><div><strong>${totalUnits.toLocaleString()}</strong><small>Units On Hand</small></div></article><article><span>${icon("picking")}</span><div><strong>${reservedUnits.toLocaleString()}</strong><small>Reserved For Picking</small></div></article><article><span>${icon("alert")}</span><div><strong>${lowStock}</strong><small>Low Stock</small></div></article></section><div class="toolbar"><input class="search" id="inventory-search" value="${escapeHtml(query)}" placeholder="Search product, SKU, category, location or status…" autocomplete="off" />${filterChips("inventory", [{ key: "All", count: state.inventory.length }, { key: "Low stock", count: lowStock }, { key: "Out of stock", count: outOfStock }, { key: "On hold", count: state.inventory.filter((item) => HOLD_STATUSES.includes(item.status)).length }])}</div><section class="card table-card inventory-table"><div class="table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th title="Units physically in the warehouse">On Hand</th><th title="Units set aside for open picking batches">Reserved</th><th title="On hand minus reserved">Available</th><th>Locations</th><th>Handling</th><th>Status</th><th class="row-menu-head"><span class="sr-only">More Options</span></th></tr></thead><tbody>${state.inventory.map((item) => productRow(item, reserved.get(item.sku) || 0)).join("")}</tbody></table></div><div class="empty inventory-empty" hidden>No Products Found.</div></section></div>`;
  setupTableFilter("inventory", "inventory-search", "[data-product-row]", ".inventory-empty");
  document.getElementById("add-product").addEventListener("click", () => openProductModal());
  document.getElementById("download-template").addEventListener("click", downloadInventoryTemplate);
  document.getElementById("import-csv").addEventListener("click", () => document.getElementById("csv-file").click());
  document.getElementById("csv-file").addEventListener("change", importInventoryCsv);
  document.querySelectorAll("[data-menu]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    const menu = button.closest(".row-menu");
    document.querySelectorAll(".row-menu.open").forEach((other) => { if (other !== menu) other.classList.remove("open"); });
    menu.classList.toggle("open");
    button.setAttribute("aria-expanded", String(menu.classList.contains("open")));
  }));
  const bind = (attr, fn) => document.querySelectorAll(`[${attr}]`).forEach((button) => button.addEventListener("click", () => { closeRowMenus(); fn(Number(button.getAttribute(attr))); }));
  bind("data-edit", openProductModal); bind("data-receive", openReceiveModal); bind("data-locations", openLocationsModal); bind("data-movements", openStockHistoryModal); bind("data-delete", deleteProduct);
  app.onclick = (event) => { if (!event.target.closest(".row-menu")) document.querySelectorAll(".row-menu.open").forEach((menu) => menu.classList.remove("open")); };
}

function productRow(item, reserved = 0) {
  const displayStatus = productDisplayStatus(item);
  const pill = displayStatus === "Available" ? "good" : displayStatus === "Low Stock" || displayStatus === "Quarantined" ? "warn" : "bad";
  const available = item.quantity - reserved;
  const locations = item.locations || [];
  const searchable = [item.name, item.sku, item.category, ...locations.map((entry) => entry.location), item.handlingType, item.status, displayStatus].join(" ").toLowerCase();
  const keys = [isLowStock(item) ? "Low stock" : "", isOutOfStock(item) ? "Out of stock" : "", HOLD_STATUSES.includes(item.status) ? "On hold" : ""].filter(Boolean).join("|");
  const locationCell = `<span class="location">${escapeHtml(item.location)}</span>${locations.length > 1 ? `<span class="more-locations" title="${escapeHtml(locations.map((entry) => `${entry.location}: ${entry.quantity}`).join("\n"))}">+${locations.length - 1}</span>` : ""}`;
  return `<tr data-product-row data-product-id="${item.id}" data-keys="${escapeHtml(keys)}" data-search="${escapeHtml(searchable)}"><td><strong>${escapeHtml(item.name)}</strong><small class="product-info sku" title="Product code (SKU)">${escapeHtml(item.sku)}</small></td><td>${escapeHtml(item.category)}</td><td><strong>${item.quantity}</strong></td><td>${reserved ? reserved : `<span class="muted">0</span>`}</td><td><strong class="${available <= 0 ? "text-bad" : ""}">${available}</strong></td><td>${locationCell}</td><td>${escapeHtml(item.handlingType)}</td><td><span class="pill ${pill}">${displayStatus}</span></td><td class="row-menu-cell"><div class="row-menu"><button class="more-button" type="button" data-menu="${item.id}" aria-label="More Options For ${escapeHtml(item.name)}" aria-haspopup="true" aria-expanded="false">${icon("more")}</button><div class="row-menu-popover"><button type="button" data-receive="${item.id}">${icon("download")}<span>Receive Stock</span></button><button type="button" data-locations="${item.id}">${icon("location")}<span>Locations &amp; Transfers</span></button><button type="button" data-movements="${item.id}">${icon("history")}<span>Stock History</span></button><button type="button" data-edit="${item.id}">${icon("edit")}<span>Edit Product</span></button><button type="button" class="danger" data-delete="${item.id}">${icon("trash")}<span>Delete Product</span></button></div></div></td></tr>`;
}

function nameTaken(name, exceptSku = null) { const lower = name.trim().toLowerCase(); return state.inventory.some((item) => item.sku !== exceptSku && item.name.trim().toLowerCase() === lower); }
// Checks a square for a product: inside the layout, a container, not used by another product, and within capacity.
function locationProblem(location, sku, quantity, { allowOwn = [] } = {}) {
  if (!isLocationWithinLayout(location)) return "Choose a square that contains a Rack, Shelf or Bin.";
  const owner = locationOwners(sku).get(location); if (owner) return `${location} already holds ${owner}. Each square holds one product.`;
  const own = productBySku(sku); if (own && !allowOwn.includes(location) && (own.locations || []).some((entry) => entry.location === location)) return `${location} is already one of this product's locations.`;
  if (quantity > capacityOf(location)) return `${location} holds at most ${capacityOf(location)} units (${containerTypeOf(location)}).`;
  return "";
}
function openProductModal(itemId = null) {
  const item = state.inventory.find((product) => product.id === itemId) || { sku: "", name: "", category: "General", quantity: 0, reorderPoint: 0, location: "", locations: [], handlingType: "Standard", status: "Available" };
  const multi = (item.locations || []).length > 1;
  const location = parseLocation(item.location);
  const layout = state.warehouseLayout;
  if (!itemId) location.containerType = layout.defaultContainerType;
  const zoneNames = Array.from({ length: layout.zoneCount }, (_, index) => String.fromCharCode(65 + index));
  const initialZoneLayout = layout.zoneLayouts[location.zone || zoneNames[0]] || createZoneLayout();
  const categories = [...BASE_CATEGORIES];
  if (item.category && !categories.includes(item.category)) categories.push(item.category);
  const handling = ["Standard","Fragile","Refrigerated","Frozen","Hazardous","Oversized"];
  const statuses = ["Available","Quarantined","Damaged","Out Of Stock"];
  const primaryQty = item.locations?.[0]?.quantity ?? item.quantity;
  modalRoot.innerHTML = `<div class="modal-backdrop"><form class="modal product-modal" id="product-form" novalidate><div class="modal-head"><h2>${itemId ? "Edit Product" : "Add Product"}</h2><p class="modal-info">${icon("info")}<span>Product codes are generated automatically. Names must be unique, and each square holds one product.</span></p></div><div class="form-grid vertical-form">
    <div class="field"><label>Product Name</label><input name="name" required value="${escapeHtml(item.name)}" /></div>
    <div class="field"><label>Category</label><select name="category">${categories.map((value) => `<option value="${escapeHtml(value)}" ${value === item.category ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}</select></div>
    <div class="field"><label>${multi ? "Quantity At Primary Location" : "Quantity"}</label><input name="quantity" type="number" min="0" step="1" required value="${primaryQty}" /><small class="field-hint">${multi ? `Total across ${item.locations.length} locations: ${item.quantity}. Other locations are managed in Locations &amp; Transfers.` : "Use Receive Stock for deliveries so they are logged."}</small></div>
    <div class="field"><label>Low-Stock Threshold</label><input name="reorderPoint" type="number" min="0" step="1" required value="${item.reorderPoint}" /></div>
    <div class="field"><label>Handling Type</label><select name="handlingType">${handling.map((value) => `<option ${value === item.handlingType ? "selected" : ""}>${value}</option>`).join("")}</select><small class="field-hint">Hazardous and Refrigerated/Frozen items get their own picking carts; Fragile items are picked last; Oversized items take 5× cart space.</small></div>
    <div class="field"><label>Status</label><select name="status">${statuses.map((value) => `<option ${value === item.status ? "selected" : ""}>${value}</option>`).join("")}</select></div>
    <section class="location-section"><div class="location-section-head"><div><h3>${multi ? "Primary Location" : "Warehouse Location"}</h3><p>Grey squares already hold another product. Racks hold ${CONTAINER_CAPACITY.Rack}, shelves ${CONTAINER_CAPACITY.Shelf} and bins ${CONTAINER_CAPACITY.Bin} units.</p></div>${icon("location")}</div><div class="location-fields">
      <div class="field"><label>Zone</label><select name="zone" required><option value="" ${location.zone ? "" : "selected"} disabled>Select Zone</option>${zoneNames.map((value) => `<option value="${value}" ${value === location.zone ? "selected" : ""}>Zone ${value}</option>`).join("")}</select></div>
      <div class="field"><label>Grid Column</label><input name="aisle" type="number" min="1" max="${initialZoneLayout.columns}" required value="${location.aisle}" placeholder="1–${initialZoneLayout.columns}" /></div>
      <div class="field"><label>Container Type</label><select name="containerType" required>${["Rack","Shelf","Bin"].map((value) => `<option value="${value}" ${value === location.containerType ? "selected" : ""}>${value}</option>`).join("")}</select></div>
      <div class="field"><label>Grid Row</label><input name="containerNumber" type="number" min="1" max="${initialZoneLayout.rows}" required value="${location.containerNumber}" placeholder="1–${initialZoneLayout.rows}" /></div>
    </div><div class="location-preview" id="location-preview" aria-live="polite" data-sku="${escapeHtml(item.sku)}"></div></section>
    <p class="form-error wide" id="product-error" role="alert" hidden></p>
  </div><div class="modal-actions"><button type="button" class="btn secondary with-icon" id="cancel-product">${icon("close")}<span>Cancel</span></button><button class="btn with-icon" type="submit">${icon(itemId ? "check" : "plus")}<span>${itemId ? "Save Changes" : "Add Product"}</span></button></div></form></div>`;
  const form = document.getElementById("product-form"); const errorBox = document.getElementById("product-error");
  const refreshPreview = () => { const data = Object.fromEntries(new FormData(form)); const zoneLayout = state.warehouseLayout.zoneLayouts?.[data.zone]; const columnInput = form.elements.aisle; const rowInput = form.elements.containerNumber; if (zoneLayout) { columnInput.max = zoneLayout.columns; columnInput.placeholder = `1–${zoneLayout.columns}`; rowInput.max = zoneLayout.rows; rowInput.placeholder = `1–${zoneLayout.rows}`; const piece = zoneLayout.cells?.[`${Number(data.containerNumber)}-${Number(data.aisle)}`]; if (["Rack","Shelf","Bin"].includes(piece)) form.elements.containerType.value = piece; } updateLocationPreview(form); };
  form.querySelectorAll('[name="zone"], [name="aisle"], [name="containerType"], [name="containerNumber"]').forEach((control) => control.addEventListener("input", refreshPreview));
  form.addEventListener("input", () => { errorBox.hidden = true; });
  refreshPreview();
  document.getElementById("cancel-product").addEventListener("click", closeModal);
  document.querySelector(".modal-backdrop").addEventListener("click", (event) => { if (event.target.classList.contains("modal-backdrop")) closeModal(); });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const name = data.name.trim(); const quantity = parseWholeNumber(String(data.quantity).trim()); const reorderPoint = parseWholeNumber(String(data.reorderPoint).trim());
    const locationCode = composeLocation(data);
    const problems = [];
    if (!name) problems.push("Enter a product name.");
    else if (nameTaken(name, item.sku || null)) problems.push(`Another product is already called "${name}".`);
    if (Number.isNaN(quantity)) problems.push("Quantity must be a whole number.");
    if (Number.isNaN(reorderPoint)) problems.push("Low-stock threshold must be a whole number.");
    const locationIssue = locationProblem(locationCode, item.sku || null, Number.isNaN(quantity) ? 0 : quantity, { allowOwn: [item.location] }); if (locationIssue) problems.push(locationIssue);
    if (problems.length) { errorBox.textContent = problems.join(" "); errorBox.hidden = false; return; }
    const sku = item.sku || nextProductId(data.category, data.handlingType);
    const updated = { ...item, id: itemId || nextId(state.inventory), sku, name, category: data.category, handlingType: data.handlingType, status: data.status, reorderPoint, locations: (item.locations || []).map((entry) => ({ ...entry })) };
    if (!updated.locations.length) updated.locations = [{ location: locationCode, quantity: 0 }];
    const oldPrimary = updated.locations[0].location; const oldQty = updated.locations[0].quantity;
    updated.locations[0] = { location: locationCode, quantity };
    if (updated.status === "Out Of Stock" && quantity > 0 && !multi) updated.status = "Available";
    syncProduct(updated);
    if (itemId) state.inventory = state.inventory.map((product) => product.id === itemId ? updated : product); else state.inventory.push(updated);
    if (!itemId) recordMovement(updated, locationCode, quantity, "Initial stock");
    else {
      if (oldPrimary !== locationCode && oldQty) { recordMovement(updated, oldPrimary, -oldQty, "Moved", `to ${locationCode}`); recordMovement(updated, locationCode, oldQty, "Moved", `from ${oldPrimary}`); }
      if (quantity !== oldQty) recordMovement(updated, locationCode, quantity - oldQty, "Adjustment", "Edited product");
      // keep open picking routes pointing at the product's current location
      if (oldPrimary !== locationCode) openBatches().forEach((batch) => (batch.route || []).forEach((stop) => { if (stop.sku === sku && stop.location === oldPrimary) { stop.location = locationCode; stop.id = `${sku}@${locationCode}`; } }));
    }
    recordHistory(itemId ? "Product Updated" : "Product Added", `${updated.name} · ${updated.location} · ${updated.quantity} Units`, "Inventory", "inventory");
    saveState(); closeModal(); renderInventory(); toast(itemId ? `${updated.name} Updated` : `${updated.name} Added`);
  });
}

// ---------- stock windows: receive, locations & transfers, history ----------
function refreshBehindModal() { if (currentView === "inventory") renderInventory(document.getElementById("inventory-search")?.value || ""); else render(); }
function locationOptionLabel(entry) { return `${entry.location} · ${entry.quantity} / ${capacityOf(entry.location)} units`; }
function openReceiveModal(itemId) {
  const item = state.inventory.find((product) => product.id === itemId); if (!item) return;
  modalRoot.innerHTML = `<div class="modal-backdrop"><form class="modal small-modal" id="receive-form" novalidate><div class="modal-head"><h2>Receive Stock</h2><p class="modal-info">${icon("info")}<span>${escapeHtml(item.name)} · ${escapeHtml(item.sku)} · ${item.quantity} on hand</span></p></div><div class="form-grid">
    <div class="field wide"><label for="receive-location">Put Away At</label><select id="receive-location" name="location">${item.locations.map((entry) => `<option value="${escapeHtml(entry.location)}">${escapeHtml(locationOptionLabel(entry))}</option>`).join("")}</select></div>
    <div class="field"><label for="receive-quantity">Units Received</label><input id="receive-quantity" name="quantity" type="number" min="1" step="1" value="1" /></div>
    <div class="field"><label for="receive-reference">Reference (Optional)</label><input id="receive-reference" name="reference" maxlength="40" placeholder="e.g. PO-2041" /></div>
    <p class="form-error wide" id="receive-error" role="alert" hidden></p>
  </div><div class="modal-actions"><button type="button" class="btn secondary with-icon" data-close>${icon("close")}<span>Cancel</span></button><button class="btn with-icon" type="submit">${icon("download")}<span>Receive</span></button></div></form></div>`;
  wireModal("receive-form", (form, fail) => {
    const quantity = parseWholeNumber(form.elements.quantity.value.trim()); const entry = item.locations.find((candidate) => candidate.location === form.elements.location.value);
    if (Number.isNaN(quantity) || quantity < 1) return fail("Units received must be a whole number of at least 1.");
    const room = capacityOf(entry.location) - entry.quantity; if (quantity > room) return fail(`${entry.location} has room for ${room} more units (capacity ${capacityOf(entry.location)}). Put the rest in another location via Locations & Transfers.`);
    entry.quantity += quantity; syncProduct(item); if (item.status === "Out Of Stock") item.status = "Available";
    const reference = form.elements.reference.value.trim();
    recordMovement(item, entry.location, quantity, "Received", reference);
    recordHistory("Stock Received", `${item.name} · +${quantity} Units at ${entry.location}${reference ? ` · ${reference}` : ""}`, "Inventory", "download");
    saveState(); closeModal(); refreshBehindModal(); toast(`${quantity} ${item.name} received`);
  });
}
function wireModal(formId, onSubmit) {
  const form = document.getElementById(formId); const errorBox = form.querySelector(".form-error");
  const fail = (message) => { errorBox.textContent = message; errorBox.hidden = false; };
  form.addEventListener("input", () => { if (errorBox) errorBox.hidden = true; });
  form.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", closeModal));
  document.querySelector(".modal-backdrop").addEventListener("click", (event) => { if (event.target.classList.contains("modal-backdrop")) closeModal(); });
  form.addEventListener("submit", (event) => { event.preventDefault(); onSubmit(form, fail); });
  form.querySelector("input:not([type=hidden]), select")?.focus();
  return form;
}
function openLocationsModal(itemId, notice = "") {
  const item = state.inventory.find((product) => product.id === itemId); if (!item) return;
  const reserved = reservedByLocation();
  const rows = item.locations.map((entry, index) => {
    const held = reserved.get(`${item.sku}@${entry.location}`) || 0;
    return `<tr><td><span class="location">${escapeHtml(entry.location)}</span>${index === 0 ? `<span class="pill good">Primary</span>` : ""}</td><td>${containerTypeOf(entry.location)}</td><td><strong>${entry.quantity}</strong> / ${capacityOf(entry.location)}${held ? `<small>${held} reserved for picking</small>` : ""}</td><td class="location-actions">${index ? `<button type="button" class="btn small secondary" data-primary="${index}">Make Primary</button>` : ""}${item.locations.length > 1 && entry.quantity - held > 0 ? `<button type="button" class="btn small secondary" data-transfer="${index}">Transfer</button>` : ""}${item.locations.length > 1 && entry.quantity === 0 && !held ? `<button type="button" class="btn small secondary danger-text" data-remove-location="${index}">Remove</button>` : ""}</td></tr>`;
  }).join("");
  modalRoot.innerHTML = `<div class="modal-backdrop"><form class="modal locations-modal" id="locations-form" novalidate><div class="modal-head"><h2>Locations &amp; Transfers</h2><p class="modal-info">${icon("info")}<span>${escapeHtml(item.name)} · ${item.quantity} units across ${item.locations.length} location${item.locations.length === 1 ? "" : "s"}. Picking takes from the primary location first.</span></p></div>
    <div class="form-grid">${notice ? `<p class="form-note wide">${escapeHtml(notice)}</p>` : ""}<div class="wide"><table class="mini-table"><thead><tr><th>Location</th><th>Type</th><th>Units / Capacity</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
    <div class="wide transfer-panel" id="transfer-panel" hidden></div>
    <section class="location-section wide"><div class="location-section-head"><div><h3>Add A Location</h3><p>Click a free square on the map. New locations start empty; use Receive Stock or Transfer to fill them.</p></div>${icon("location")}</div><div class="location-preview" id="new-location-preview"></div></section>
    <p class="form-error wide" id="locations-error" role="alert" hidden></p></div>
    <div class="modal-actions"><button type="button" class="btn secondary with-icon" data-close>${icon("check")}<span>Done</span></button></div></form></div>`;
  const form = wireModal("locations-form", () => {});
  const fail = (message) => { const box = document.getElementById("locations-error"); box.textContent = message; box.hidden = false; };
  const save = (message, history) => { syncProduct(item); if (history) recordHistory(history[0], history[1], "Inventory", "location"); saveState(); refreshBehindModal(); openLocationsModal(itemId, message); };
  form.querySelectorAll("[data-primary]").forEach((button) => button.addEventListener("click", () => { const [entry] = item.locations.splice(Number(button.dataset.primary), 1); item.locations.unshift(entry); save(`${entry.location} is now the primary location.`, ["Primary Location Changed", `${item.name} · ${entry.location}`]); }));
  form.querySelectorAll("[data-remove-location]").forEach((button) => button.addEventListener("click", () => { const [entry] = item.locations.splice(Number(button.dataset.removeLocation), 1); save(`${entry.location} was removed.`, ["Location Removed", `${item.name} · ${entry.location}`]); }));
  form.querySelectorAll("[data-transfer]").forEach((button) => button.addEventListener("click", () => {
    const from = item.locations[Number(button.dataset.transfer)]; const free = from.quantity - (reserved.get(`${item.sku}@${from.location}`) || 0);
    const panel = document.getElementById("transfer-panel"); panel.hidden = false;
    panel.innerHTML = `<div class="transfer-row"><span>Move from <strong>${escapeHtml(from.location)}</strong> to</span><select id="transfer-to">${item.locations.filter((entry) => entry !== from).map((entry) => `<option value="${escapeHtml(entry.location)}">${escapeHtml(locationOptionLabel(entry))}</option>`).join("")}</select><input id="transfer-qty" type="number" min="1" max="${free}" value="${free}" aria-label="Units to move" /><button type="button" class="btn small" id="transfer-go">Move</button></div><small class="field-hint">${free} units can move (reserved units stay for picking).</small>`;
    document.getElementById("transfer-go").addEventListener("click", () => {
      const quantity = parseWholeNumber(document.getElementById("transfer-qty").value.trim()); const to = item.locations.find((entry) => entry.location === document.getElementById("transfer-to").value);
      if (Number.isNaN(quantity) || quantity < 1 || quantity > free) return fail(`Enter between 1 and ${free} units.`);
      if (to.quantity + quantity > capacityOf(to.location)) return fail(`${to.location} has room for ${capacityOf(to.location) - to.quantity} more units.`);
      from.quantity -= quantity; to.quantity += quantity; syncProduct(item);
      recordMovement(item, from.location, -quantity, "Transfer", `to ${to.location}`); recordMovement(item, to.location, quantity, "Transfer", `from ${from.location}`);
      save(`Moved ${quantity} units from ${from.location} to ${to.location}.`, ["Stock Transferred", `${item.name} · ${quantity} Units · ${from.location} → ${to.location}`]);
    });
  }));
  const preview = document.getElementById("new-location-preview");
  const drawPicker = (selected = "") => {
    const owners = locationOwners(); // includes this product's own squares
    const ok = selected && !owners.has(selected) && isLocationWithinLayout(selected);
    preview.innerHTML = `<div class="preview-head"><div><span>New Location</span><strong>${selected ? escapeHtml(selected) : "Choose A Free Square"}</strong></div>${ok ? `<button type="button" class="btn small with-icon" id="add-location">${icon("plus")}<span>Add ${escapeHtml(selected)}</span></button>` : ""}</div><div class="shared-map-preview interactive-location-map">${warehouseLayoutSvg({ selectedLocation: selected, compact: true, interactive: true, occupiedBy: owners })}</div>`;
    preview.querySelectorAll("[data-location]").forEach((element) => { const choose = () => drawPicker(element.dataset.location); element.addEventListener("click", choose); element.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(); } }); });
    document.getElementById("add-location")?.addEventListener("click", () => { item.locations.push({ location: selected, quantity: 0 }); save(`${selected} added. Use Receive Stock or Transfer to fill it.`, ["Location Added", `${item.name} · ${selected}`]); });
  };
  drawPicker();
}
function openStockHistoryModal(itemId) {
  const item = state.inventory.find((product) => product.id === itemId); if (!item) return;
  const entries = state.movements.filter((movement) => movement.sku === item.sku);
  const when = (value) => new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
  modalRoot.innerHTML = `<div class="modal-backdrop"><form class="modal locations-modal" id="history-form"><div class="modal-head"><h2>Stock History</h2><p class="modal-info">${icon("info")}<span>${escapeHtml(item.name)} · ${item.quantity} on hand now</span></p></div><div class="form-grid"><div class="wide">${entries.length ? `<table class="mini-table"><thead><tr><th>When</th><th>Movement</th><th>Location</th><th>Change</th><th>Balance</th><th>Reference</th></tr></thead><tbody>${entries.map((entry) => `<tr><td>${when(entry.at)}</td><td>${escapeHtml(entry.type)}</td><td><span class="location">${escapeHtml(entry.location)}</span></td><td class="${entry.change < 0 ? "text-bad" : "text-good"}"><strong>${entry.change > 0 ? "+" : ""}${entry.change}</strong></td><td>${entry.balance}</td><td>${escapeHtml(entry.reference || "")}</td></tr>`).join("")}</tbody></table>` : `<p class="form-note">No stock movements recorded yet. Receipts, picks, transfers, adjustments and short-pick corrections will appear here.</p>`}</div></div><div class="modal-actions"><button type="button" class="btn secondary with-icon" data-close>${icon("check")}<span>Close</span></button></div></form></div>`;
  wireModal("history-form", () => closeModal());
}
function closeRowMenus() { document.querySelectorAll(".row-menu.open").forEach((menu) => menu.classList.remove("open")); }
function closeModal() { modalRoot.innerHTML = ""; }
function deleteProduct(id) {
  const item = state.inventory.find((product) => product.id === id); if (!item) return;
  const blockingBatches = openBatches().filter((batch) => (batch.route || []).some((stop) => stop.sku === item.sku));
  if (blockingBatches.length) { alert(`${item.name} can't be deleted yet because it is being picked in ${blockingBatches.map((batch) => batch.code).join(", ")}.\n\nComplete ${blockingBatches.length === 1 ? "that batch" : "those batches"} first.`); return; }
  const waitingOrders = state.orders.filter((order) => order.status === "ready" && order.lines.some((line) => line.sku === item.sku));
  const warning = waitingOrders.length ? `\n\n${waitingOrders.length} pending order${waitingOrders.length === 1 ? " uses" : "s use"} this product (${waitingOrders.map((order) => order.orderNumber).join(", ")}). ${waitingOrders.length === 1 ? "It" : "They"} will be held back from batching.` : "";
  if (!confirm(`Delete ${item.name}?${warning}`)) return;
  state.inventory = state.inventory.filter((product) => product.id !== id); recordHistory("Product Deleted", `${item.name} was removed from Inventory.`, "Inventory", "trash"); saveState(); renderInventory(); toast(`${item.name} Removed`); }
function csvValue(value) { const text = String(value ?? ""); return /[",\r\n]/.test(text) ? `"${text.replaceAll('"','""')}"` : text; }
function downloadInventoryTemplate() { const rows = [["Product Name","Category","Quantity","Low-Stock Threshold","Handling Type","Status","Zone","Grid Column","Grid Row"],["Sample Product","General",100,20,"Standard","Available","A",1,1]]; const csv = rows.map((row) => row.map(csvValue).join(",")).join("\r\n"); const link = document.createElement("a"); const url = URL.createObjectURL(new Blob(["\ufeff",csv],{ type:"text/csv;charset=utf-8" })); link.href = url; link.download = "Lumina Inventory Import Template.csv"; link.click(); URL.revokeObjectURL(url); recordHistory("Inventory Template Downloaded", "CSV import template downloaded (opens in Excel or Google Sheets).", "Inventory", "download"); saveState(); toast("Inventory Template Downloaded"); }
function parseCsv(text) { const rows = []; let row = []; let value = ""; let quoted = false; for (let index = 0; index < text.length; index += 1) { const char = text[index]; if (char === '"') { if (quoted && text[index + 1] === '"') { value += '"'; index += 1; } else quoted = !quoted; } else if (char === "," && !quoted) { row.push(value); value = ""; } else if ((char === "\n" || char === "\r") && !quoted) { if (char === "\r" && text[index + 1] === "\n") index += 1; row.push(value); if (row.some((cell) => String(cell).trim())) rows.push(row); row = []; value = ""; } else value += char; } row.push(value); if (row.some((cell) => String(cell).trim())) rows.push(row); return rows; }
function decodeCsvBytes(buffer) { try { return new TextDecoder("utf-8", { fatal: true }).decode(buffer); } catch { return new TextDecoder("windows-1252").decode(buffer); } }
function parseWholeNumber(text) { return /^\d+$/.test(text) ? Number(text) : NaN; }
function importInventoryCsv(event) {
  const input = event.target; const file = input.files?.[0]; input.value = ""; if (!file) return;
  const reader = new FileReader();
  reader.onerror = () => toast("Could Not Read The CSV File");
  reader.onload = () => {
    const rows = parseCsv(decodeCsvBytes(reader.result)); if (rows.length < 2) { toast("The CSV Has No Product Rows"); return; }
    const normalize = (value) => String(value || "").replace(/^﻿/,"").trim().toLowerCase().replace(/[^a-z0-9]+/g,"");
    const headers = rows[0].map(normalize);
    const required = ["productname","category","quantity","lowstockthreshold","handlingtype","status","zone","gridcolumn","gridrow"];
    const missing = required.filter((name) => !headers.includes(name)); if (missing.length) { alert(`Missing columns: ${missing.join(", ")}`); return; }
    const at = (row,name) => String(row[headers.indexOf(name)] ?? "").trim();
    const allowedHandling = ["Standard","Fragile","Refrigerated","Frozen","Hazardous","Oversized"]; const allowedStatuses = ["Available","Quarantined","Damaged","Out Of Stock"];
    const activeZones = Array.from({ length: state.warehouseLayout.zoneCount }, (_, index) => String.fromCharCode(65 + index));
    let added = 0; let updatedCount = 0; const errors = []; const seenNames = new Map();
    rows.slice(1).forEach((row,rowIndex) => {
      const problems = [];
      const name = at(row,"productname"); if (!name) problems.push("Product Name is blank");
      else if (seenNames.has(name.toLowerCase())) problems.push(`"${name}" already appears on row ${seenNames.get(name.toLowerCase())}; product names must be unique`);
      const category = at(row,"category") || "General";
      const quantityText = at(row,"quantity"); const quantity = parseWholeNumber(quantityText); if (Number.isNaN(quantity)) problems.push(quantityText ? `Quantity "${quantityText}" is not a whole number` : "Quantity is blank");
      const thresholdText = at(row,"lowstockthreshold"); const reorderPoint = parseWholeNumber(thresholdText); if (Number.isNaN(reorderPoint)) problems.push(thresholdText ? `Low-Stock Threshold "${thresholdText}" is not a whole number` : "Low-Stock Threshold is blank");
      const handlingInput = at(row,"handlingtype"); const handlingType = allowedHandling.find((value) => value.toLowerCase() === handlingInput.toLowerCase()); if (!handlingType) problems.push(handlingInput ? `Handling Type "${handlingInput}" is not recognised` : "Handling Type is blank");
      const statusInput = at(row,"status"); const status = allowedStatuses.find((value) => value.toLowerCase() === statusInput.toLowerCase()) || ({ active:"Available", hold:"Quarantined", "out of stock":"Out Of Stock" }[statusInput.toLowerCase()]); if (!status) problems.push(statusInput ? `Status "${statusInput}" is not recognised` : "Status is blank");
      const zoneName = at(row,"zone").toUpperCase(); const column = parseWholeNumber(at(row,"gridcolumn")); const gridRow = parseWholeNumber(at(row,"gridrow"));
      const zone = activeZones.includes(zoneName) ? state.warehouseLayout.zoneLayouts?.[zoneName] : null; const containerType = zone?.cells?.[gridKey(gridRow,column)];
      if (!zone) problems.push(zoneName ? `Zone ${zoneName} is not in the current layout` : "Zone is blank");
      else if (Number.isNaN(column) || Number.isNaN(gridRow)) problems.push("Grid Column and Grid Row must be whole numbers");
      else if (!["Rack","Shelf","Bin"].includes(containerType)) problems.push(`Zone ${zoneName} column ${column}, row ${gridRow} is ${containerType === "Path" ? "a walkway" : "not a Rack, Shelf or Bin"}`);
      const location = problems.length ? "" : composeLocation({ zone:zoneName, aisle:column, containerType, containerNumber:gridRow });
      const existing = name ? state.inventory.find((item) => item.name.trim().toLowerCase() === name.toLowerCase()) : null;
      const others = existing ? existing.locations.slice(1) : [];
      const primaryQuantity = Number.isNaN(quantity) ? 0 : quantity - others.reduce((sum, entry) => sum + entry.quantity, 0);
      if (!problems.length) {
        const owner = locationOwners(existing?.sku || null).get(location);
        if (owner) problems.push(`${location} already holds ${owner}`);
        else if (others.some((entry) => entry.location === location)) problems.push(`${location} is already one of this product's other locations`);
        if (primaryQuantity < 0) problems.push(`Quantity ${quantity} is less than the ${quantity - primaryQuantity} units kept in this product's other locations`);
        else if (primaryQuantity > capacityOf(location)) problems.push(`${location} holds at most ${capacityOf(location)} units`);
      }
      if (problems.length) { errors.push(`Row ${rowIndex + 2}: ${problems.join("; ")}`); return; }
      seenNames.set(name.toLowerCase(), rowIndex + 2);
      const sku = existing?.sku || nextProductId(category,handlingType);
      const product = syncProduct({ ...(existing || {}), id:existing?.id || nextId(state.inventory), sku, name, category, reorderPoint, handlingType, status, locations: [{ location, quantity: primaryQuantity }, ...others.map((entry) => ({ ...entry }))] });
      if (existing) {
        const oldPrimary = existing.locations[0]; state.inventory = state.inventory.map((item) => item.id === existing.id ? product : item); updatedCount += 1;
        if (oldPrimary.location !== location && oldPrimary.quantity) { recordMovement(product, oldPrimary.location, -oldPrimary.quantity, "Moved", `CSV import · to ${location}`); recordMovement(product, location, oldPrimary.quantity, "Moved", `CSV import · from ${oldPrimary.location}`); }
        if (primaryQuantity !== oldPrimary.quantity) recordMovement(product, location, primaryQuantity - oldPrimary.quantity, "Adjustment", "CSV import");
      } else { state.inventory.push(product); added += 1; recordMovement(product, location, primaryQuantity, "Initial stock", "CSV import"); }
    });
    if (added || updatedCount) { recordHistory("Inventory CSV Imported", `${added} Added · ${updatedCount} Updated${errors.length ? ` · ${errors.length} Skipped` : ""}`, "Inventory", "upload"); saveState(); renderInventory(); toast(`${added + updatedCount} Product${added + updatedCount === 1 ? "" : "s"} Imported`); } else toast("No Valid Products Were Imported");
    if (errors.length) alert(`${errors.length} row${errors.length === 1 ? " was" : "s were"} skipped:\n\n${errors.slice(0,12).join("\n")}${errors.length > 12 ? `\n…and ${errors.length - 12} more` : ""}`);
  };
  reader.readAsArrayBuffer(file);
}
function nextId(items) { return Math.max(0, ...items.map((item) => item.id)) + 1; }
function nextProductId(category, handlingType) { const categories = { Food:"FOD", Snacks:"SNA", Beverages:"BEV", Packaging:"PCK", Equipment:"EQP", Labels:"LAB", Safety:"SAF", General:"GEN" }; const handling = { Standard:"STD", Fragile:"FRG", Refrigerated:"CHL", Frozen:"FRZ", Hazardous:"HAZ", Oversized:"OVR" }; const prefix = `${categories[category] || category.slice(0,3).toUpperCase()}-${handling[handlingType] || handlingType.slice(0,3).toUpperCase()}`; const highest = state.inventory.filter((item) => item.sku.startsWith(`${prefix}-`)).reduce((max, item) => Math.max(max, Number(item.sku.split("-").pop()) || 0), 0); return `${prefix}-${String(highest + 1).padStart(3,"0")}`; }
function parseLocation(value = "") {
  const current = value.match(/^([A-Z])-(\d{1,2})-([RSB])(\d{1,2})$/i);
  if (current) return { zone: current[1].toUpperCase(), aisle: String(Number(current[2])), containerType: { R:"Rack", S:"Shelf", B:"Bin" }[current[3].toUpperCase()], containerNumber: String(Number(current[4])) };
  const legacy = value.match(/^([A-Z])-(\d{1,2})-R(\d{1,2})-S(\d{1,2})-B(\d{1,2})$/i);
  if (legacy) return { zone: legacy[1].toUpperCase(), aisle: String(Number(legacy[2])), containerType: "Rack", containerNumber: String(Number(legacy[3])) };
  return { zone: "", aisle: "", containerType: "Rack", containerNumber: "" };
}
function composeLocation(data) { const pad = (value) => String(value).padStart(2,"0"); const code = { Rack:"R", Shelf:"S", Bin:"B" }[data.containerType] || "R"; return `${String(data.zone).toUpperCase()}-${pad(data.aisle)}-${code}${pad(data.containerNumber)}`; }
function isLocationWithinLayout(value, layout = state.warehouseLayout) { const location = parseLocation(value); const zoneIndex = location.zone ? location.zone.charCodeAt(0) - 64 : 0; const zone = layout.zoneLayouts?.[location.zone]; const key = `${Number(location.containerNumber)}-${Number(location.aisle)}`; return zoneIndex >= 1 && zoneIndex <= layout.zoneCount && zone && Number(location.aisle) >= 1 && Number(location.aisle) <= zone.columns && Number(location.containerNumber) >= 1 && Number(location.containerNumber) <= zone.rows && zone.cells?.[key] === location.containerType; }
function bindLocationMap(preview,form) { const selectLocation = (element) => { const location = parseLocation(element.dataset.location); form.elements.zone.value = location.zone; form.elements.aisle.value = location.aisle; form.elements.containerType.value = location.containerType; form.elements.containerNumber.value = location.containerNumber; updateLocationPreview(form); }; preview.querySelectorAll("[data-location]").forEach((element) => { element.addEventListener("click", () => selectLocation(element)); element.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectLocation(element); } }); }); }
function updateLocationPreview(form) {
  const preview = document.getElementById("location-preview"); if (!preview) return; const data = Object.fromEntries(new FormData(form)); const column = Number(data.aisle); const row = Number(data.containerNumber); const zoneLayout = state.warehouseLayout.zoneLayouts?.[data.zone]; const placedType = zoneLayout?.cells?.[gridKey(row,column)]; const validContainer = ["Rack","Shelf","Bin"].includes(placedType); if (validContainer) { data.containerType = placedType; form.elements.containerType.value = placedType; }
  const sku = preview.dataset.sku || null; const owners = locationOwners(sku);
  const code = validContainer ? composeLocation(data) : ""; const takenBy = code ? owners.get(code) : null;
  const message = !data.zone || !zoneLayout || column < 1 || column > zoneLayout.columns || row < 1 || row > zoneLayout.rows ? "Click any free Rack, Shelf or Bin on the map" : placedType === "Path" ? "That square is a walkway. Choose a container." : !validContainer ? "That square is empty. Choose a container." : takenBy ? `Already holds ${takenBy}` : `Selected ${placedType} · holds up to ${CONTAINER_CAPACITY[placedType]} units`;
  preview.innerHTML = `<div class="preview-head"><div><span>Location Selection</span><strong>${code ? escapeHtml(code) : "Choose A Container"}</strong></div><span class="preview-key ${takenBy ? "bad" : ""}"><i></i>${escapeHtml(message)}</span></div><div class="shared-map-preview interactive-location-map">${warehouseLayoutSvg({ selectedLocation: code, compact: true, interactive: true, occupiedBy: owners })}</div>`; bindLocationMap(preview, form);
}

function availableStockBySku() {
  // On-hand quantity minus what open (not yet completed) batches are already going to take.
  const available = new Map(state.inventory.map((item) => [item.sku, item.quantity]));
  openBatches().forEach((batch) => (batch.route || []).forEach((stop) => { if (available.has(stop.sku)) available.set(stop.sku, available.get(stop.sku) - stop.quantity); }));
  return available;
}
function usableLocation(location) { return isLocationWithinLayout(location) && isContainerReachable(location); }
// Units a picker can actually take: stock in reachable locations, minus what open batches already reserved there.
function pickableStockBySku(exceptBatchId = null) {
  const reserved = reservedByLocation(exceptBatchId); const map = new Map();
  state.inventory.forEach((item) => map.set(item.sku, (item.locations || []).reduce((sum, entry) => sum + (usableLocation(entry.location) ? Math.max(0, entry.quantity - (reserved.get(`${item.sku}@${entry.location}`) || 0)) : 0), 0)));
  return map;
}
function orderBlockers(order, available) {
  const needed = new Map(); order.lines.forEach((line) => needed.set(line.sku, (needed.get(line.sku) || 0) + line.quantity));
  const problems = [];
  needed.forEach((quantity, sku) => {
    const item = productBySku(sku);
    if (!item) problems.push(`${sku} is no longer in Inventory`);
    else if (HOLD_STATUSES.includes(item.status) || item.status === "Out Of Stock") problems.push(`${item.name} is ${item.status}`);
    else if (!(item.locations || []).some((entry) => usableLocation(entry.location))) problems.push(`${item.name} has no reachable location`);
    else { const free = Math.max(0, available.get(sku) ?? 0); if (free < quantity) problems.push(`${item.name} is short by ${quantity - free}`); }
  });
  return problems;
}
function heldOrders() {
  const available = pickableStockBySku(); const held = new Map();
  sortReadyOrders(state.orders.filter((order) => order.status === "ready")).forEach((order) => { const problems = orderBlockers(order, available); if (problems.length) held.set(order.id, problems); else order.lines.forEach((line) => available.set(line.sku, (available.get(line.sku) || 0) - line.quantity)); });
  return held;
}
function sortReadyOrders(orders) { const rank = { urgent:0, express:1, standard:2 }; return [...orders].sort((a,b) => rank[a.priority] - rank[b.priority] || new Date(a.dueAt) - new Date(b.dueAt)); }

function renderOrders() {
  const ready = state.orders.filter((order) => order.status === "ready").length;
  const held = heldOrders();
  const countOf = (label) => state.orders.filter((order) => orderDisplayStatus(order) === label).length;
  const countStatus = (status) => state.orders.filter((order) => order.status === status).length;
  const actions = `<div class="header-actions"><button class="btn secondary with-icon" id="sample-orders">${icon("boxes")}<span>Add sample orders</span></button><button class="btn secondary with-icon" id="new-order">${icon("plus")}<span>New order</span></button><button class="btn with-icon" id="auto-batch" ${ready > held.size ? "" : "disabled"}>${icon("layers")}<span>Create automatic batches</span></button></div>`;
  const chips = filterChips("orders", [
    { key: "All", count: state.orders.length }, { key: "Open", count: state.orders.filter(isOrderOpen).length },
    { key: "Pending", count: countOf("Pending") }, { key: "Picking", count: countOf("Picking") }, { key: "To pack", count: countStatus("picked") }, { key: "To ship", count: countStatus("packed") },
    { key: "Delayed", count: countOf("Delayed") }, { key: "Held", count: held.size }, { key: "Completed", count: countStatus("shipped") }, { key: "Cancelled", count: countStatus("cancelled") }]);
  app.innerHTML = `<div class="page">${pageHeader("Orders", "Pick, pack and ship. Batches are built by priority, then due date. Orders without enough stock are held.", actions)}<div class="toolbar"><input class="search" id="order-search" placeholder="Search order, customer, product, status, or batch…" autocomplete="off" />${chips}</div><section class="card table-card"><div class="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Priority</th><th>Due</th><th>Items</th><th>Status</th><th>Batch</th><th class="actions-head">Next Step</th></tr></thead><tbody>${[...state.orders].reverse().map((order) => orderRow(order, held.get(order.id))).join("")}</tbody></table></div><div class="empty orders-empty" hidden>No Orders Found.</div></section></div>`;
  setupTableFilter("orders", "order-search", "[data-order-row]", ".orders-empty");
  document.getElementById("auto-batch").addEventListener("click", createAutomaticBatches);
  document.getElementById("new-order").addEventListener("click", () => openOrderModal());
  document.getElementById("sample-orders").addEventListener("click", () => generateSampleOrders(3));
  bindOrderActions(app);
  app.onclick = (event) => { if (!event.target.closest(".row-menu")) document.querySelectorAll(".row-menu.open").forEach((menu) => menu.classList.remove("open")); };
}
// Buttons shared by the Orders table and the order details window.
function bindOrderActions(root) {
  root.querySelectorAll("[data-order-menu]").forEach((button) => button.addEventListener("click", (event) => { event.stopPropagation(); const menu = button.closest(".row-menu"); document.querySelectorAll(".row-menu.open").forEach((other) => { if (other !== menu) other.classList.remove("open"); }); menu.classList.toggle("open"); }));
  const bind = (attr, fn) => root.querySelectorAll(`[${attr}]`).forEach((button) => button.addEventListener("click", (event) => { event.stopPropagation(); closeRowMenus(); fn(Number(button.getAttribute(attr))); }));
  bind("data-details", openOrderDetails); bind("data-edit-order", (id) => openOrderModal(id)); bind("data-cancel-order", cancelOrder); bind("data-delete-order", deleteOrder); bind("data-pack", packOrder); bind("data-ship", shipOrder);
}
function orderActionsMarkup(order, { inline = true } = {}) {
  const next = order.status === "picked" ? `<button type="button" class="btn small with-icon" data-pack="${order.id}">${icon("package")}<span>Pack</span></button>` : order.status === "packed" ? `<button type="button" class="btn small with-icon" data-ship="${order.id}">${icon("arrow")}<span>Ship</span></button>` : "";
  const items = [`<button type="button" data-details="${order.id}">${icon("info")}<span>View Details</span></button>`];
  if (order.status === "ready") items.push(`<button type="button" data-edit-order="${order.id}">${icon("edit")}<span>Edit Order</span></button>`);
  if (["ready", "batched"].includes(order.status)) items.push(`<button type="button" class="danger" data-cancel-order="${order.id}">${icon("close")}<span>Cancel Order</span></button>`);
  if (["ready", "cancelled", "shipped"].includes(order.status)) items.push(`<button type="button" class="danger" data-delete-order="${order.id}">${icon("trash")}<span>Delete Order</span></button>`);
  if (!inline) return { next, items };
  return `<div class="order-actions">${next}<div class="row-menu"><button class="more-button" type="button" data-order-menu="${order.id}" aria-label="More options for ${escapeHtml(order.orderNumber)}" aria-haspopup="true">${icon("more")}</button><div class="row-menu-popover">${items.join("")}</div></div></div>`;
}
function orderRow(order, problems = []) {
  const priority = order.priority === "urgent" ? "bad" : order.priority === "express" ? "warn" : "";
  const status = orderDisplayStatus(order); const stage = orderStage(order);
  const statusPill = status === "Completed" ? "good" : ["Picking", "Picked", "Packed"].includes(status) ? "warn" : status === "Delayed" ? "bad" : "";
  const stageNote = status === "Delayed" && stage !== "Pending" ? `<small>${stage}</small>` : order.shortPicked && order.status === "ready" ? `<small class="text-bad">Short-picked · back to pending</small>` : "";
  const batchCell = order.batchCode ? escapeHtml(order.batchCode) : problems.length ? `<span class="pill bad" title="${escapeHtml(problems.join("; "))}">Held</span><small>${escapeHtml(problems[0])}${problems.length > 1 ? ` +${problems.length - 1} more` : ""}</small>` : order.status === "ready" ? "Awaiting" : "—";
  const itemNames = order.lines.map((line) => productBySku(line.sku)?.name || line.sku);
  const searchable = [order.orderNumber, order.customer, order.priority, status, stage, order.batchCode || "", problems.length ? "held" : "", ...itemNames].join(" ").toLowerCase();
  const keys = [status, isOrderOpen(order) ? "Open" : "", order.status === "picked" ? "To pack" : "", order.status === "packed" ? "To ship" : "", problems.length ? "Held" : ""].filter(Boolean).join("|");
  const items = `${order.lines.reduce((sum, line) => sum + line.quantity, 0)} units<small title="${escapeHtml(order.lines.map((line, index) => `${line.quantity} × ${itemNames[index]}`).join("\n"))}">${order.lines.length} product${order.lines.length === 1 ? "" : "s"}</small>`;
  return `<tr data-order-row data-order-id="${order.id}" data-keys="${escapeHtml(keys)}" data-search="${escapeHtml(searchable)}" class="${order.status === "cancelled" ? "muted-row" : ""}"><td><button type="button" class="link-button" data-details="${order.id}">${escapeHtml(order.orderNumber)}</button></td><td>${escapeHtml(order.customer)}</td><td><span class="pill ${priority}">${capitalize(order.priority)}</span></td><td>${formatDate(order.dueAt)}<small>${formatTime(order.dueAt)}</small></td><td>${items}</td><td><span class="pill ${statusPill}">${status}</span>${stageNote}</td><td>${batchCell}</td><td class="row-menu-cell actions-cell">${orderActionsMarkup(order)}</td></tr>`;
}

function nextOrderNumber() { const highest = state.orders.reduce((max, order) => Math.max(max, Number(String(order.orderNumber).match(/(\d+)$/)?.[1]) || 0), 10480); return `SO-${highest + 1}`; }
function toLocalInputValue(date) { return `${localDateKey(date)}T${String(date.getHours()).padStart(2,"0")}:${String(date.getMinutes()).padStart(2,"0")}`; }
// Stock a new order could still use: on hand, minus open batches, minus orders already waiting to be batched.
function freeStockForNewOrders() { const free = availableStockBySku(); state.orders.filter((order) => order.status === "ready").forEach((order) => order.lines.forEach((line) => free.set(line.sku, (free.get(line.sku) || 0) - line.quantity))); return free; }
function addOrder({ customer, priority, dueAt, lines }) {
  const now = new Date().toISOString();
  const order = { id: nextId(state.orders), orderNumber: nextOrderNumber(), customer, priority, dueAt, status: "ready", batchCode: null, lines, createdAt: now, events: { createdAt: now } };
  state.orders.push(order); return order;
}

function openOrderModal(orderId = null) {
  const editing = orderId ? state.orders.find((order) => order.id === orderId && order.status === "ready") : null;
  if (orderId && !editing) { toast("Only pending orders can be edited"); return; }
  if (!state.inventory.length) { toast("Add products to Inventory first"); return; }
  const products = [...state.inventory].sort((a,b) => a.name.localeCompare(b.name));
  const free = freeStockForNewOrders();
  if (editing) editing.lines.forEach((line) => free.set(line.sku, (free.get(line.sku) || 0) + line.quantity)); // its own stock is not "taken"
  const due = new Date(Date.now() + 4 * 60 * 60 * 1000); due.setMinutes(Math.ceil(due.getMinutes() / 15) * 15, 0, 0);
  const productOptions = products.map((item) => `<option value="${escapeHtml(item.sku)}">${escapeHtml(item.name)} (${escapeHtml(item.sku)})</option>`).join("");
  modalRoot.innerHTML = `<div class="modal-backdrop"><form class="modal order-modal" id="order-form" novalidate><div class="modal-head"><h2>${editing ? `Edit ${escapeHtml(editing.orderNumber)}` : "New order"}</h2><p class="modal-info">${icon("info")}<span>The order number is assigned automatically. Items without enough usable stock will hold the order back from batching.</span></p></div>
    <div class="form-grid">
      <div class="field wide"><label for="order-customer">Customer</label><input id="order-customer" name="customer" maxlength="60" placeholder="e.g. Harbor Supply Co." autocomplete="off" value="${escapeHtml(editing?.customer || "")}" /></div>
      <div class="field"><label for="order-priority">Priority</label><select id="order-priority" name="priority">${["standard","express","urgent"].map((value) => `<option value="${value}" ${editing?.priority === value ? "selected" : ""}>${capitalize(value)}</option>`).join("")}</select></div>
      <div class="field"><label for="order-due">Due</label><input id="order-due" name="dueAt" type="datetime-local" value="${toLocalInputValue(editing ? new Date(editing.dueAt) : due)}" /></div>
      <section class="order-lines wide"><div class="order-lines-head"><h3>Items</h3><button type="button" class="btn small secondary with-icon" id="add-line">${icon("plus")}<span>Add item</span></button></div><div class="order-line-list" id="order-line-list"></div></section>
      <p class="form-error wide" id="order-error" role="alert" hidden></p>
    </div>
    <div class="modal-actions"><button type="button" class="btn secondary with-icon" id="cancel-order">${icon("close")}<span>Cancel</span></button><button class="btn with-icon" type="submit">${icon("check")}<span>${editing ? "Save changes" : "Create order"}</span></button></div></form></div>`;
  const list = document.getElementById("order-line-list"); const form = document.getElementById("order-form"); const errorBox = document.getElementById("order-error");
  const refreshHints = () => {
    const wanted = new Map();
    list.querySelectorAll(".order-line").forEach((line) => { const sku = line.querySelector("select").value; wanted.set(sku, (wanted.get(sku) || 0) + Math.max(0, Number(line.querySelector("input").value) || 0)); });
    list.querySelectorAll(".order-line").forEach((line) => {
      const sku = line.querySelector("select").value; const item = state.inventory.find((product) => product.sku === sku); const hint = line.querySelector(".line-hint");
      const available = Math.max(0, free.get(sku) ?? 0); const need = wanted.get(sku) || 0; let text = `${available} available`; let warn = false;
      if (HOLD_STATUSES.includes(item.status) || item.status === "Out Of Stock") { text = `${item.status}: will be held`; warn = true; }
      else if (need > available) { text = `Short by ${need - available}: will be held`; warn = true; }
      hint.textContent = text; hint.classList.toggle("warn", warn);
    });
    list.querySelectorAll("[data-remove-line]").forEach((button) => { button.disabled = list.children.length === 1; });
  };
  const addLine = (presetSku = null, presetQuantity = 1) => {
    const used = new Set([...list.querySelectorAll("select")].map((select) => select.value));
    const pick = products.find((item) => !used.has(item.sku) && !HOLD_STATUSES.includes(item.status) && (free.get(item.sku) ?? 0) > 0) || products.find((item) => !used.has(item.sku)) || products[0];
    const row = document.createElement("div"); row.className = "order-line";
    row.innerHTML = `<select aria-label="Product">${productOptions}</select><input type="number" min="1" step="1" value="1" aria-label="Quantity" /><span class="line-hint"></span><button type="button" class="icon-button" data-remove-line aria-label="Remove item">${icon("close")}</button>`;
    row.querySelector("select").value = typeof presetSku === "string" ? presetSku : pick.sku; row.querySelector("input").value = presetQuantity; list.appendChild(row);
    row.querySelector("select").addEventListener("change", refreshHints); row.querySelector("input").addEventListener("input", refreshHints);
    row.querySelector("[data-remove-line]").addEventListener("click", () => { row.remove(); refreshHints(); });
    refreshHints();
  };
  if (editing) editing.lines.forEach((line) => addLine(line.sku, line.quantity)); else addLine();
  document.getElementById("add-line").addEventListener("click", () => addLine());
  document.getElementById("cancel-order").addEventListener("click", closeModal);
  document.querySelector(".modal-backdrop").addEventListener("click", (event) => { if (event.target.classList.contains("modal-backdrop")) closeModal(); });
  document.getElementById("order-customer").focus();
  form.addEventListener("input", () => { errorBox.hidden = true; });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const customer = form.elements.customer.value.trim(); const dueValue = form.elements.dueAt.value; const problems = [];
    if (!customer) problems.push("Enter a customer name.");
    if (!dueValue || Number.isNaN(new Date(dueValue).getTime())) problems.push("Choose a due date and time.");
    const merged = new Map(); let badQuantity = false;
    list.querySelectorAll(".order-line").forEach((line) => { const quantity = Number(line.querySelector("input").value); if (!Number.isInteger(quantity) || quantity < 1) badQuantity = true; else merged.set(line.querySelector("select").value, (merged.get(line.querySelector("select").value) || 0) + quantity); });
    if (badQuantity) problems.push("Each quantity must be a whole number of at least 1.");
    if (!merged.size) problems.push("Add at least one item.");
    if (problems.length) { errorBox.textContent = problems.join(" "); errorBox.hidden = false; return; }
    const fields = { customer, priority: form.elements.priority.value, dueAt: new Date(dueValue).toISOString(), lines: [...merged].map(([sku, quantity]) => ({ sku, quantity })) };
    const order = editing ? Object.assign(editing, fields, { shortPicked: false }) : addOrder(fields);
    const units = order.lines.reduce((sum, line) => sum + line.quantity, 0);
    recordHistory(editing ? "Order Updated" : "Order Created", `${order.orderNumber} · ${order.customer} · ${capitalize(order.priority)} · ${units} Units`, "Orders", "orders");
    saveState(); closeModal(); navigate("orders", { filter: "All", highlight: `[data-order-id="${order.id}"]` }); toast(`${order.orderNumber} ${editing ? "updated" : "created"}`);
  });
}

const SAMPLE_CUSTOMERS = ["Harbor Supply Co.","Lumen Outfitters","Bayside Market","Kestrel Logistics","Maple & Pine","Summit Hardware","Bluewater Café","Atlas Print Shop","Juniper Health","Tidewell Grocers","Redwood Studio","Copperline Tools"];
function generateSampleOrders(count = 3) {
  const usable = state.inventory.filter((item) => !HOLD_STATUSES.includes(item.status) && item.status !== "Out Of Stock" && item.quantity > 0 && isLocationWithinLayout(item.location) && isContainerReachable(item.location));
  if (!usable.length) { toast("No usable stock: restock or reset the demo first"); return; }
  const free = freeStockForNewOrders(); const random = (n) => Math.floor(Math.random() * n);
  const customers = [...SAMPLE_CUSTOMERS].sort(() => Math.random() - .5); const created = [];
  for (let index = 0; index < count; index += 1) {
    const roll = Math.random(); const priority = roll < .15 ? "urgent" : roll < .5 ? "express" : "standard";
    const due = new Date(Date.now() + (1 + random(8)) * 60 * 60 * 1000); due.setMinutes(random(4) * 15, 0, 0);
    const pool = usable.filter((item) => (free.get(item.sku) ?? 0) > 0).sort(() => Math.random() - .5);
    const picks = (pool.length ? pool : usable).slice(0, 1 + random(Math.min(3, (pool.length || usable.length))));
    const lines = picks.map((item) => { const spare = Math.max(1, free.get(item.sku) ?? 1); const quantity = Math.max(1, Math.min(12, 1 + random(Math.max(1, Math.floor(spare / 3))))); free.set(item.sku, (free.get(item.sku) || 0) - quantity); return { sku: item.sku, quantity }; });
    created.push(addOrder({ customer: customers[index % customers.length], priority, dueAt: due.toISOString(), lines }));
  }
  recordHistory("Sample Orders Generated", `${created.map((order) => order.orderNumber).join(", ")} added for the demo.`, "Orders", "orders");
  saveState(); navigate("orders", { filter: "All", highlight: `[data-order-id="${created.at(-1).id}"]` }); toast(`${created.length} sample orders added`);
}
// ---------- order life cycle ----------
function rerenderOrderViews() { if (modalRoot.querySelector("#order-details")) closeModal(); render(); }
function packOrder(id) { const order = state.orders.find((candidate) => candidate.id === id); if (!order || order.status !== "picked") return; order.status = "packed"; order.events.packedAt = new Date().toISOString(); recordHistory("Order Packed", `${order.orderNumber} · ${order.customer}`, "Orders", "package"); saveState(); rerenderOrderViews(); toast(`${order.orderNumber} packed`); }
function shipOrder(id) { const order = state.orders.find((candidate) => candidate.id === id); if (!order || order.status !== "packed") return; order.status = "shipped"; order.events.shippedAt = new Date().toISOString(); recordHistory("Order Shipped", `${order.orderNumber} · ${order.customer}`, "Orders", "arrow"); saveState(); rerenderOrderViews(); toast(`${order.orderNumber} shipped`); }
function cancelOrder(id) {
  const order = state.orders.find((candidate) => candidate.id === id); if (!order || !["ready", "batched"].includes(order.status)) return;
  const batch = order.status === "batched" ? state.batches.find((candidate) => candidate.code === order.batchCode && candidate.status !== "complete") : null;
  if (!confirm(`Cancel ${order.orderNumber} for ${order.customer}?${batch ? `\n\nIt will be removed from picking batch ${batch.code}.` : ""}`)) return;
  if (batch) detachOrderFromBatch(batch, order);
  order.status = "cancelled"; order.batchCode = null; order.events.cancelledAt = new Date().toISOString();
  recordHistory("Order Cancelled", `${order.orderNumber} · ${order.customer}${batch ? ` · removed from ${batch.code}` : ""}`, "Orders", "close");
  saveState(); rerenderOrderViews(); toast(`${order.orderNumber} cancelled`);
}
function deleteOrder(id) {
  const order = state.orders.find((candidate) => candidate.id === id); if (!order || !["ready", "cancelled", "shipped"].includes(order.status)) return;
  if (!confirm(`Delete ${order.orderNumber} for ${order.customer}? This can't be undone.`)) return;
  state.orders = state.orders.filter((candidate) => candidate.id !== id);
  recordHistory("Order Deleted", `${order.orderNumber} · ${order.customer}`, "Orders", "trash");
  saveState(); rerenderOrderViews(); toast(`${order.orderNumber} deleted`);
}
function openOrderDetails(id) {
  const order = state.orders.find((candidate) => candidate.id === id); if (!order) return;
  const held = order.status === "ready" ? heldOrders().get(order.id) || [] : [];
  const available = availableStockBySku();
  const batch = order.batchCode ? state.batches.find((candidate) => candidate.code === order.batchCode) : null;
  const when = (value) => value ? `${formatDate(value)}, ${formatTime(value)}` : "";
  const steps = [["Created", order.events?.createdAt], ["Batched for picking", order.events?.batchedAt], ["Picked", order.events?.pickedAt], ["Packed", order.events?.packedAt], ["Shipped", order.events?.shippedAt]];
  if (order.events?.cancelledAt) steps.push(["Cancelled", order.events.cancelledAt]);
  const { next, items } = orderActionsMarkup(order, { inline: false });
  const status = orderDisplayStatus(order);
  modalRoot.innerHTML = `<div class="modal-backdrop"><form class="modal order-modal" id="order-details"><div class="modal-head"><h2>${escapeHtml(order.orderNumber)} · ${escapeHtml(order.customer)}</h2><p class="modal-info"><span class="pill ${status === "Completed" ? "good" : status === "Delayed" ? "bad" : ""}">${status}</span><span>${capitalize(order.priority)} priority · due ${when(order.dueAt)} · ${orderHandlingClass(order)} handling · cart load ${orderLoad(order)}</span></p></div>
    <div class="form-grid"><div class="wide"><table class="mini-table"><thead><tr><th>Product</th><th>Qty</th><th>Location</th><th>Available</th><th>Handling</th></tr></thead><tbody>${order.lines.map((line) => { const item = productBySku(line.sku); return `<tr><td><strong>${escapeHtml(item?.name || line.sku)}</strong><small>${escapeHtml(line.sku)}</small></td><td>${line.quantity}</td><td>${item ? `<span class="location">${escapeHtml(item.location)}</span>${item.locations.length > 1 ? `<span class="more-locations">+${item.locations.length - 1}</span>` : ""}` : "Not in inventory"}</td><td class="${(available.get(line.sku) ?? 0) < line.quantity && order.status === "ready" ? "text-bad" : ""}">${Math.max(0, available.get(line.sku) ?? 0)}</td><td>${escapeHtml(item?.handlingType || "—")}</td></tr>`; }).join("")}</tbody></table></div>
    ${held.length ? `<p class="form-error wide">Held: ${escapeHtml(held.join("; "))}.</p>` : ""}${order.shortPicked && order.status === "ready" ? `<p class="form-note wide">This order went back to Pending after a short pick. It will be batched again once stock allows.</p>` : ""}
    <div class="wide detail-columns"><section><h3>Progress</h3><ol class="timeline">${steps.map(([label, at]) => `<li class="${at ? "done" : ""}"><span>${label}</span><small>${at ? when(at) : "—"}</small></li>`).join("")}</ol></section><section><h3>Picking</h3>${batch ? `<p><strong>${escapeHtml(batch.code)}</strong> · ${escapeHtml(batch.assignedPicker)}${batch.status === "complete" ? " · completed" : ` · ${batchPickCounts(batch).picked} of ${batch.route.length} stops picked`}</p>` : `<p class="muted">Not in a batch.</p>`}</section></div></div>
    <div class="modal-actions"><div class="details-more">${items.filter((item) => !item.includes("data-details")).join("")}</div>${next}<button type="button" class="btn secondary with-icon" data-close>${icon("check")}<span>Close</span></button></div></form></div>`;
  const form = wireModal("order-details", () => {});
  bindOrderActions(form);
}
function capitalize(value) { return value.charAt(0).toUpperCase() + value.slice(1); }

// Turn orders into picking stops: take from the primary location first, then the fullest other locations.
function allocateStops(orders, exceptBatchId = null) {
  const reserved = reservedByLocation(exceptBatchId); const need = new Map(); const stops = [];
  orders.forEach((order) => order.lines.forEach((line) => need.set(line.sku, (need.get(line.sku) || 0) + line.quantity)));
  const add = (stop) => { const same = stops.find((candidate) => candidate.id === stop.id); if (same) same.quantity += stop.quantity; else stops.push(stop); };
  need.forEach((quantity, sku) => {
    const item = productBySku(sku); let remaining = quantity;
    if (item) {
      const [primary, ...others] = item.locations;
      [primary, ...[...others].sort((a, b) => b.quantity - a.quantity)].filter(Boolean).forEach((entry) => {
        if (remaining <= 0 || !usableLocation(entry.location)) return;
        const take = Math.min(entry.quantity - (reserved.get(`${sku}@${entry.location}`) || 0), remaining);
        if (take > 0) { add({ id: `${sku}@${entry.location}`, sku, name: item.name, location: entry.location, quantity: take }); remaining -= take; }
      });
    }
    if (remaining > 0) add({ id: `${sku}@${item?.location || "Unassigned"}`, sku, name: item?.name || sku, location: item?.location || "Unassigned", quantity: remaining });
  });
  return stops.map((stop, index) => ({ ...stop, sequence: index + 1 }));
}
function batchHandlingClass(orders) { const classes = orders.map(orderHandlingClass); return classes.includes("Hazardous") ? "Hazardous" : classes.includes("Cold chain") ? "Cold chain" : "Standard"; }
function createAutomaticBatches() {
  const ready = sortReadyOrders(state.orders.filter((order) => order.status === "ready"));
  if (!ready.length) return;
  const available = pickableStockBySku(); const accepted = []; const held = [];
  ready.forEach((order) => { const problems = orderBlockers(order, available); if (problems.length) { held.push(`${order.orderNumber}: ${problems.join("; ")}`); return; } order.lines.forEach((line) => available.set(line.sku, (available.get(line.sku) || 0) - line.quantity)); accepted.push(order); });
  if (!accepted.length) { alert(`No orders could be batched:\n\n${held.join("\n")}`); return; }
  // Same handling class, priority and due day share a cart; hazardous and cold-chain goods never share with others.
  const groups = new Map();
  accepted.forEach((order) => { const key = `${orderHandlingClass(order)}|${order.priority}|${localDateKey(order.dueAt)}`; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(order); });
  // Fill carts: up to MAX_ORDERS_PER_BATCH orders and CART_CAPACITY load units (an order bigger than a cart gets its own).
  const carts = [];
  groups.forEach((orders, key) => { let cart = null; orders.forEach((order) => { const load = orderLoad(order); if (!cart || cart.orders.length >= MAX_ORDERS_PER_BATCH || cart.load + load > CART_CAPACITY) { cart = { handlingClass: key.split("|")[0], orders: [], load: 0 }; carts.push(cart); } cart.orders.push(order); cart.load += load; }); });
  // Balance pickers by unfinished work (load units), not by number of batches.
  const workload = new Map(PICKERS.map((picker) => [picker, 0]));
  openBatches().forEach((batch) => workload.set(batch.assignedPicker, (workload.get(batch.assignedPicker) || 0) + batchLoad(batch)));
  const today = localDateKey().slice(2).replaceAll("-",""); const now = new Date().toISOString();
  carts.forEach((cart) => {
    const picker = [...workload].sort((a, b) => a[1] - b[1] || PICKERS.indexOf(a[0]) - PICKERS.indexOf(b[0]))[0][0];
    const id = nextId(state.batches); const priority = cart.orders[0].priority; const classLetter = { Hazardous: "H", "Cold chain": "C" }[cart.handlingClass] || "";
    const code = `B-${priority[0].toUpperCase()}${classLetter}-${today}-${String(id).padStart(2,"0")}`;
    const route = optimizeRouteStops(allocateStops(cart.orders));
    state.batches.unshift({ id, code, status: "planned", orderIds: cart.orders.map((order) => order.id), route, assignedPicker: picker, progress: 0, createdAt: now, handlingClass: cart.handlingClass, load: cart.load });
    workload.set(picker, workload.get(picker) + cart.load);
    cart.orders.forEach((order) => { order.status = "batched"; order.batchCode = code; order.shortPicked = false; order.events.batchedAt = now; });
  });
  selectedBatchId = state.batches[0]?.id || null;
  recordHistory("Automatic Batches Created", `${carts.length} batch${carts.length === 1 ? "" : "es"} assigned across Picker 1–3${held.length ? ` · ${held.length} order${held.length === 1 ? "" : "s"} held for stock` : ""}.`, "Orders", "layers");
  saveState(); navigate("picking"); toast(`${carts.length} automatic batch${carts.length === 1 ? "" : "es"} created`);
  if (held.length) setTimeout(() => alert(`${held.length} order${held.length === 1 ? " was" : "s were"} held back:\n\n${held.join("\n")}`), 60);
}

function isStopPicked(batch, stop) { return batch.status === "complete" || Boolean(stop.picked); }
function batchPickCounts(batch) { const route = batch.route || []; const picked = route.filter((stop) => isStopPicked(batch, stop)).length; return { picked, total: route.length, percent: route.length ? Math.round(picked / route.length * 100) : 0 }; }
function handlingBadge(handlingClass) { return handlingClass && handlingClass !== "Standard" ? `<span class="pill ${handlingClass === "Hazardous" ? "bad" : "cold"}">${handlingClass}</span>` : ""; }
function renderPicking() {
  const selected = state.batches.find((batch) => batch.id === selectedBatchId) || state.batches[0];
  const layoutAction = `<button class="btn secondary with-icon" id="edit-layout">${icon("layout")}<span>Edit Warehouse Layout</span></button>`;
  if (!selected) { app.innerHTML = `<div class="page">${pageHeader("Picking", "Aisle-safe routes for the three-picker team.", layoutAction)}<section class="card empty"><div><span class="empty-icon">${icon("picking")}</span><h2>No Picking Batches Yet</h2><p>Create automatic batches from ready orders.</p><button class="btn with-icon" id="create-first-batch">${icon("layers")}<span>Create Automatic Batches</span></button></div></section></div>`; document.getElementById("create-first-batch").addEventListener("click", createAutomaticBatches); document.getElementById("edit-layout").addEventListener("click", openWarehouseLayoutModal); return; }
  selectedBatchId = selected.id;
  const planValid = hasValidPlan(selected);
  if (!planValid) selected.route = optimizeRouteStops(selected.route || []);
  const builtin = planValid ? null : builtinRoutePlan(selected.route, normalizeWarehouseLayout(state.warehouseLayout));
  const unreachableIds = new Set(planValid ? selected.plan.unreachable : builtin.unreachable);
  const unreachableCount = unreachableIds.size;
  const done = selected.status === "complete"; const counts = batchPickCounts(selected);
  const nextStop = done ? null : selected.route.find((stop) => !stop.picked && !unreachableIds.has(stopKey(stop))) || null;
  const allPicked = counts.picked === counts.total && counts.total > 0;
  const batchOrders = state.orders.filter((order) => selected.orderIds.includes(order.id));
  const load = batchLoad(selected);
  const batchList = state.batches.map((batch) => { const c = batchPickCounts(batch); return `<button class="batch-item ${batch.id === selected.id ? "active" : ""}" data-batch="${batch.id}"><strong>${batch.code}</strong>${handlingBadge(batch.handlingClass)}<span>${batch.orderIds.length} Orders · ${batch.route.length} Stops · ${batch.assignedPicker}</span><span class="batch-progress" aria-label="${c.percent}% picked"><i style="width:${c.percent}%"></i></span></button>`; }).join("");
  const pickerControl = done ? escapeHtml(selected.assignedPicker) : `<select id="assign-picker" class="picker-select" aria-label="Assigned picker">${PICKERS.map((picker) => `<option ${picker === selected.assignedPicker ? "selected" : ""}>${picker}</option>`).join("")}</select>`;
  const actions = done ? `<span class="pill good with-icon">${icon("complete")}<span>Completed</span></span>` : `<button class="btn small secondary-dark with-icon" id="cancel-batch">${icon("close")}<span>Cancel Batch</span></button><button class="btn small with-icon" id="complete-batch" ${allPicked && !unreachableCount ? "" : `disabled title="${unreachableCount ? "Reconnect the path grid before completing" : "Pick every stop first"}"`}>${icon("check")}<span>Complete Batch</span></button>`;
  const fragileTag = (stop) => stopIsLast(stop) ? `<span class="tag fragile">Fragile · picked last</span>` : "";
  const banner = done ? "" : nextStop
    ? `<div class="next-stop"><b>${String(nextStop.sequence).padStart(2,"0")}</b><div><span>Next stop</span><strong>${escapeHtml(nextStop.name)}</strong><small>${escapeHtml(nextStop.location)} · ${nextStop.quantity} Units${stopIsLast(nextStop) ? " · Fragile" : ""}</small></div><button class="btn small secondary-dark" data-short="${escapeHtml(stopKey(nextStop))}">Short Pick</button><button class="btn small with-icon" data-pick="${escapeHtml(stopKey(nextStop))}">${icon("check")}<span>Mark picked</span></button></div>`
    : allPicked ? `<div class="next-stop all-picked"><b>${icon("check")}</b><div><span>All stops picked</span><strong>Walk back to S, then complete the batch to update stock and hand the orders to packing.</strong></div></div>` : "";
  const stops = selected.route.map((stop) => {
    const id = stopKey(stop); const unreachable = unreachableIds.has(id); const picked = isStopPicked(selected, stop); const isNext = nextStop && id === stopKey(nextStop);
    const detail = unreachable ? " · Unreachable" : stop.short ? ` · Short: ${stop.pickedQty} of ${stop.quantity}` : picked ? " · Picked" : isNext ? " · Next" : "";
    return `<div class="stop ${unreachable ? "unreachable" : ""} ${picked ? "picked" : ""} ${stop.short ? "short" : ""} ${isNext ? "next" : ""}"><button type="button" class="stop-main" data-stop="${escapeHtml(id)}" aria-pressed="${picked}" ${done || unreachable ? "disabled" : ""} title="${done ? "Batch completed" : unreachable ? "Unreachable: fix the path grid" : picked ? "Click to undo" : "Click to mark picked"}"><b>${unreachable ? "!" : picked ? icon("check") : String(stop.sequence).padStart(2,"0")}</b><strong>${escapeHtml(stop.name)}</strong><small>${escapeHtml(stop.location)} · ${stop.quantity} Units${detail}</small>${fragileTag(stop)}</button>${!done && !unreachable && !picked ? `<button type="button" class="stop-short" data-short="${escapeHtml(id)}" title="Record that fewer units were found">Short</button>` : ""}</div>`;
  }).join("") + (selected.route.length ? `<div class="stop return-stop"><div class="stop-main"><b>S</b><strong>Back to the start</strong><small>Drop off the cart for packing</small></div></div>` : "");
  const ordersCard = `<article class="card card-pad batch-orders"><div class="section-head"><div><h2>Orders In This Batch</h2><p>${done ? "Picked orders move on to packing." : "Remove an order to send it back to Pending; its stops are recalculated."}</p></div><span class="section-icon">${icon("orders")}</span></div><div class="batch-order-list">${batchOrders.map((order) => `<div class="batch-order"><div><button type="button" class="link-button" data-details="${order.id}">${escapeHtml(order.orderNumber)}</button><small>${escapeHtml(order.customer)} · ${order.lines.reduce((sum, line) => sum + line.quantity, 0)} units · ${orderStage(order)}</small></div>${done ? "" : `<button type="button" class="btn small secondary" data-remove-order="${order.id}">Remove</button>`}</div>`).join("") || `<p class="muted">No orders.</p>`}</div></article>`;
  app.innerHTML = `<div class="page">${pageHeader("Picking", "Tick each stop as it is picked. Routes start and end at S and follow the saved path grid.", layoutAction)}<section class="batch-layout"><aside class="card batch-list"><div class="batch-list-head"><h2>Pick Batches</h2><p>Balanced by workload across Picker 1–3</p></div>${batchList}</aside><div><article class="card route-card"><div class="route-head"><div><strong>${selected.code}</strong>${handlingBadge(selected.handlingClass)}<p>${pickerControl} · ${selected.orderIds.length} Orders · ${counts.picked} of ${counts.total} stops picked · cart load ${load}/${CART_CAPACITY}${load > CART_CAPACITY ? " (single large order)" : ""}</p><div class="route-progress"><span style="width:${counts.percent}%"></span></div>${engineStatusMarkup(selected, planValid, builtin?.distance)}</div><div class="route-actions">${unreachableCount ? `<span class="pill bad">${unreachableCount} Unreachable</span>` : ""}${actions}</div></div>${banner}<div class="route-map">${warehouseLayoutSvg({ route: selected.route, pickedIds: new Set(selected.route.filter((stop) => isStopPicked(selected, stop)).map(stopKey)), nextId: nextStop ? stopKey(nextStop) : null, enginePlan: planValid ? selected.plan : null })}</div></article><article class="card card-pad" style="margin-top:18px"><div class="section-head"><div><h2>Stop Sequence</h2><p>${done ? "This batch is complete." : `${planValid ? "Stop order planned by the Java route engine. " : ""}Click a stop to mark it picked (click again to undo), or Short if fewer units were there. Fragile items come last.`}</p></div><span class="section-icon">${icon("location")}</span></div><div class="stop-grid">${stops}</div></article>${ordersCard}</div></section></div>`;
  document.querySelectorAll("[data-batch]").forEach((button) => button.addEventListener("click", () => { selectedBatchId = Number(button.dataset.batch); renderPicking(); }));
  document.getElementById("edit-layout").addEventListener("click", openWarehouseLayoutModal);
  document.querySelectorAll("[data-stop], [data-pick]").forEach((button) => button.addEventListener("click", () => toggleStopPicked(selected, button.dataset.stop || button.dataset.pick)));
  document.querySelectorAll("[data-short]").forEach((button) => button.addEventListener("click", () => openShortPickModal(selected, button.dataset.short)));
  document.querySelectorAll("[data-remove-order]").forEach((button) => button.addEventListener("click", () => removeOrderFromBatch(selected, Number(button.dataset.removeOrder))));
  document.querySelectorAll(".batch-orders [data-details]").forEach((button) => button.addEventListener("click", () => openOrderDetails(Number(button.dataset.details))));
  document.getElementById("assign-picker")?.addEventListener("change", (event) => { const previous = selected.assignedPicker; selected.assignedPicker = event.target.value; recordHistory("Picker Reassigned", `${selected.code} · ${previous} → ${selected.assignedPicker}`, "Picking", "picking"); saveState(); renderPicking(); toast(`${selected.code} assigned to ${selected.assignedPicker}`); });
  document.getElementById("cancel-batch")?.addEventListener("click", () => cancelBatch(selected));
  document.getElementById("complete-batch")?.addEventListener("click", () => completeBatch(selected));
  if (!planValid) requestRoutePlan(selected);
}
function toggleStopPicked(batch, id) {
  if (batch.status === "complete") return;
  const stop = (batch.route || []).find((candidate) => stopKey(candidate) === id); if (!stop) return;
  stop.picked = !stop.picked; if (!stop.picked) { stop.short = false; delete stop.pickedQty; }
  const counts = batchPickCounts(batch); batch.progress = counts.percent; batch.status = counts.picked ? "active" : "planned";
  saveState(); renderPicking();
  if (stop.picked) toast(counts.picked === counts.total ? `All stops picked: walk back to S and complete ${batch.code}` : `${stop.name} picked`);
}
function openShortPickModal(batch, id) {
  const stop = (batch.route || []).find((candidate) => stopKey(candidate) === id); if (!stop || batch.status === "complete") return;
  modalRoot.innerHTML = `<div class="modal-backdrop"><form class="modal small-modal" id="short-form" novalidate><div class="modal-head"><h2>Short Pick</h2><p class="modal-info">${icon("info")}<span>${escapeHtml(stop.name)} at ${escapeHtml(stop.location)} · ${stop.quantity} units expected</span></p></div><div class="form-grid">
    <div class="field wide"><label for="short-quantity">Units Actually Found</label><input id="short-quantity" name="found" type="number" min="0" max="${stop.quantity - 1}" step="1" value="0" /><small class="field-hint">When the batch is completed, the location's stock is corrected to what was really there. Orders that can't be filled go back to Pending, and any units picked for them are returned to the shelf.</small></div>
    <p class="form-error wide" id="short-error" role="alert" hidden></p></div>
    <div class="modal-actions"><button type="button" class="btn secondary with-icon" data-close>${icon("close")}<span>Cancel</span></button><button class="btn with-icon" type="submit">${icon("alert")}<span>Record Short Pick</span></button></div></form></div>`;
  wireModal("short-form", (form, fail) => {
    const found = parseWholeNumber(form.elements.found.value.trim());
    if (Number.isNaN(found) || found < 0 || found >= stop.quantity) return fail(`Enter a whole number from 0 to ${stop.quantity - 1}. If all ${stop.quantity} were there, use Mark picked instead.`);
    stop.picked = true; stop.short = true; stop.pickedQty = found;
    const counts = batchPickCounts(batch); batch.progress = counts.percent; batch.status = "active";
    recordHistory("Short Pick Recorded", `${batch.code} · ${stop.name} at ${stop.location} · found ${found} of ${stop.quantity}`, "Picking", "alert");
    saveState(); closeModal(); renderPicking(); toast(`Short pick recorded: ${found} of ${stop.quantity}`);
  });
}
// Removes an order from an open batch and recalculates its stops (keeping picks that still match).
function detachOrderFromBatch(batch, order) {
  batch.orderIds = batch.orderIds.filter((orderId) => orderId !== order.id);
  order.batchCode = null;
  const remaining = state.orders.filter((candidate) => batch.orderIds.includes(candidate.id));
  if (!remaining.length) { state.batches = state.batches.filter((candidate) => candidate !== batch); if (selectedBatchId === batch.id) selectedBatchId = null; return "emptied"; }
  const previous = new Map(batch.route.map((stop) => [stopKey(stop), stop]));
  batch.route = optimizeRouteStops(allocateStops(remaining, batch.id).map((stop) => { const old = previous.get(stop.id); return old && old.quantity === stop.quantity ? { ...stop, picked: old.picked, short: old.short, pickedQty: old.pickedQty } : stop; }));
  batch.handlingClass = batchHandlingClass(remaining); batch.load = remaining.reduce((sum, candidate) => sum + orderLoad(candidate), 0);
  batch.progress = batchPickCounts(batch).percent;
  return "updated";
}
function removeOrderFromBatch(batch, orderId) {
  const order = state.orders.find((candidate) => candidate.id === orderId); if (!order || batch.status === "complete") return;
  if (!confirm(`Remove ${order.orderNumber} from ${batch.code}? It goes back to Pending.`)) return;
  const result = detachOrderFromBatch(batch, order); order.status = "ready";
  recordHistory("Order Removed From Batch", `${order.orderNumber} · ${batch.code}${result === "emptied" ? " · batch closed (no orders left)" : " · stops recalculated"}`, "Picking", "layers");
  saveState(); renderPicking(); toast(`${order.orderNumber} back to Pending`);
}
function cancelBatch(batch) {
  if (batch.status === "complete") return;
  if (!confirm(`Cancel ${batch.code}?\n\nIts ${batch.orderIds.length} order${batch.orderIds.length === 1 ? "" : "s"} go back to Pending. Nothing is taken from stock.`)) return;
  state.orders.forEach((order) => { if (batch.orderIds.includes(order.id)) { order.status = "ready"; order.batchCode = null; } });
  state.batches = state.batches.filter((candidate) => candidate !== batch); selectedBatchId = state.batches[0]?.id || null;
  recordHistory("Batch Cancelled", `${batch.code} · ${batch.orderIds.length} order${batch.orderIds.length === 1 ? "" : "s"} back to Pending`, "Picking", "close");
  saveState(); renderPicking(); toast(`${batch.code} cancelled`);
}
// Completing: take the picked units off the shelves, correct short-picked locations, then hand units to
// orders (most urgent first). Orders that can't be filled go back to Pending; their units return to stock.
function completeBatch(batch) {
  if (batch.status === "complete") return;
  const now = new Date().toISOString(); const pool = new Map(); const shortNotes = [];
  batch.route.forEach((stop) => {
    const picked = stop.short ? Math.min(Math.max(0, stop.pickedQty ?? 0), stop.quantity) : stop.quantity;
    pool.set(stop.sku, (pool.get(stop.sku) || 0) + picked);
    const item = productBySku(stop.sku); const entry = item?.locations.find((candidate) => candidate.location === stop.location); if (!entry) return;
    const take = Math.min(entry.quantity, picked); entry.quantity -= take; syncProduct(item);
    recordMovement(item, stop.location, -take, "Picked", batch.code);
    if (stop.short) {
      const missing = entry.quantity; entry.quantity = 0; syncProduct(item);
      recordMovement(item, stop.location, -missing, "Count correction", `Short pick in ${batch.code}: found ${picked} of ${stop.quantity}`);
      shortNotes.push(`${item.name} at ${stop.location}: ${picked} of ${stop.quantity}`);
    }
  });
  const filled = []; const backOrdered = [];
  sortReadyOrders(state.orders.filter((order) => batch.orderIds.includes(order.id))).forEach((order) => {
    const need = new Map(); order.lines.forEach((line) => need.set(line.sku, (need.get(line.sku) || 0) + line.quantity));
    if ([...need].every(([sku, quantity]) => (pool.get(sku) || 0) >= quantity)) { need.forEach((quantity, sku) => pool.set(sku, pool.get(sku) - quantity)); order.status = "picked"; order.events.pickedAt = now; filled.push(order.orderNumber); }
    else { order.status = "ready"; order.batchCode = null; order.shortPicked = true; backOrdered.push(order.orderNumber); }
  });
  pool.forEach((quantity, sku) => {
    if (quantity <= 0) return; const item = productBySku(sku); if (!item) return;
    const stop = batch.route.find((candidate) => candidate.sku === sku); const entry = item.locations.find((candidate) => candidate.location === stop?.location) || item.locations[0];
    entry.quantity += quantity; syncProduct(item); recordMovement(item, entry.location, quantity, "Returned to stock", `${batch.code}: not needed after short pick`);
  });
  batch.status = "complete"; batch.progress = 100; batch.completedAt = now; batch.route.forEach((stop) => { stop.picked = true; });
  if (shortNotes.length) recordHistory("Stock Corrected After Short Pick", `${batch.code} · ${shortNotes.join("; ")}`, "Inventory", "alert");
  recordHistory("Batch Completed", `${batch.code} · ${batch.assignedPicker} · ${filled.length} order${filled.length === 1 ? "" : "s"} to packing${backOrdered.length ? ` · ${backOrdered.join(", ")} back to Pending` : ""}`, "Picking", "complete");
  saveState(); renderPicking(); toast(backOrdered.length ? `${batch.code} completed · ${backOrdered.length} order${backOrdered.length === 1 ? "" : "s"} back to Pending` : `${batch.code} completed · stock updated`);
}

function gridKey(row,column) { return `${row}-${column}`; }
function gridPosition(key) { const [row,column] = String(key).split("-").map(Number); return { row,column }; }
function pathNeighbors(zone,key) { const { row,column } = gridPosition(key); return [[row-1,column],[row+1,column],[row,column-1],[row,column+1]].filter(([nextRow,nextColumn]) => nextRow >= 1 && nextRow <= zone.rows && nextColumn >= 1 && nextColumn <= zone.columns && zone.cells?.[gridKey(nextRow,nextColumn)] === "Path").map(([nextRow,nextColumn]) => gridKey(nextRow,nextColumn)); }
function adjacentPathKeys(zone,row,column) { return [[row-1,column],[row+1,column],[row,column-1],[row,column+1]].filter(([nextRow,nextColumn]) => zone.cells?.[gridKey(nextRow,nextColumn)] === "Path").map(([nextRow,nextColumn]) => gridKey(nextRow,nextColumn)); }
function boundaryPathKeys(zone,orientation = "Vertical") { const paths = []; if (orientation === "Horizontal") { for (let row = 1; row <= zone.rows; row += 1) if (zone.cells?.[gridKey(row,1)] === "Path") paths.push(gridKey(row,1)); } else { for (let column = 1; column <= zone.columns; column += 1) if (zone.cells?.[gridKey(zone.rows,column)] === "Path") paths.push(gridKey(zone.rows,column)); } return paths; }
function zoneEntryPath(zone,orientation = "Vertical") { const paths = boundaryPathKeys(zone,orientation); const center = orientation === "Horizontal" ? (zone.rows + 1) / 2 : (zone.columns + 1) / 2; return paths.sort((a,b) => Math.abs((orientation === "Horizontal" ? gridPosition(a).row : gridPosition(a).column) - center) - Math.abs((orientation === "Horizontal" ? gridPosition(b).row : gridPosition(b).column) - center))[0] || null; }
function warehouseStartingPoint(layout) { const saved = layout.startingPoint; const zone = layout.zoneLayouts?.[saved?.zone]; if (zone?.cells?.[saved?.key] === "Path") return saved; const zoneName = "A"; const fallbackZone = layout.zoneLayouts[zoneName]; return { zone:zoneName, key:zoneEntryPath(fallbackZone,layout.orientation) || Object.keys(fallbackZone.cells).find((key) => fallbackZone.cells[key] === "Path") } ; }
function shortestPathToAny(zone,start,targets) { if (!start || !targets.size) return null; const queue = [start]; const parents = new Map([[start,null]]); let goal = targets.has(start) ? start : null; while (queue.length && !goal) { const current = queue.shift(); for (const next of pathNeighbors(zone,current)) if (!parents.has(next)) { parents.set(next,current); if (targets.has(next)) { goal = next; break; } queue.push(next); } } if (!goal) return null; const path = []; for (let cursor = goal; cursor; cursor = parents.get(cursor)) path.unshift(cursor); return path; }
// The edge of a zone that faces the dispatch corridor (bottom row, or column 1 when horizontal).
function isCorridorEdge(zone, key, orientation) { const { row, column } = gridPosition(key); return orientation === "Horizontal" ? column === 1 : row === zone.rows; }
// One door per zone. A door placed in the grid editor wins; otherwise the start zone uses the edge
// square nearest the starting point and other zones use the middle walkway square on their edge.
function zoneDoorKey(layout, zoneName) {
  const zone = layout.zoneLayouts?.[zoneName]; if (!zone) return null;
  const custom = layout.doors?.[zoneName];
  if (custom && zone.cells?.[custom] === "Path" && isCorridorEdge(zone, custom, layout.orientation)) return custom;
  const start = warehouseStartingPoint(layout);
  if (zoneName === start.zone) return shortestPathToAny(zone, start.key, new Set(boundaryPathKeys(zone, layout.orientation)))?.at(-1) || null;
  return zoneEntryPath(zone, layout.orientation);
}
function startToCorridorPath(layout) { const start = warehouseStartingPoint(layout); const zone = layout.zoneLayouts[start.zone]; const door = zoneDoorKey(layout, start.zone); return door ? shortestPathToAny(zone, start.key, new Set([door])) : null; }
function isContainerReachable(value, layoutOverride = null) {
  const layout = normalizeWarehouseLayout(layoutOverride || state.warehouseLayout); const location = parseLocation(value); const zone = layout.zoneLayouts?.[location.zone]; if (!zone) return false;
  const start = warehouseStartingPoint(layout); const targets = new Set(adjacentPathKeys(zone, Number(location.containerNumber), Number(location.aisle)));
  if (location.zone === start.zone) return Boolean(shortestPathToAny(zone, start.key, targets));
  if (!startToCorridorPath(layout)) return false;
  const door = zoneDoorKey(layout, location.zone); return Boolean(door && shortestPathToAny(zone, door, targets));
}
// Fragile items are picked last so they ride on top of the cart.
function stopIsLast(stop) { return state.inventory.find((item) => item.sku === stop.sku)?.handlingType === "Fragile"; }
function stopKey(stop) { return stop.id || `${stop.sku}@${stop.location}`; }
// Built-in routing: zone by zone, nearest stop next, non-fragile stops first, then fragile ones.
function buildEfficientRoutePlan(route = [], layoutOverride = null) {
  const layout = normalizeWarehouseLayout(layoutOverride || state.warehouseLayout);
  const pending = route.map((stop, index) => ({ ...stop, _originalIndex: index, _location: parseLocation(stop.location), _last: stopIsLast(stop) }));
  const ordered = []; const segments = []; const unreachable = [];
  const start = warehouseStartingPoint(layout); const corridorConnected = Boolean(startToCorridorPath(layout));
  const zoneRank = (name) => layout.orientation === "Vertical" ? name.charCodeAt(0) : -name.charCodeAt(0);
  let position = { zone: start.zone, key: start.key };
  [false, true].forEach((lastGroup) => {
    const group = pending.filter((stop) => stop._last === lastGroup && stop._location.zone);
    const zoneNames = [...new Set(group.map((stop) => stop._location.zone))].sort((a, b) => a === position.zone ? -1 : b === position.zone ? 1 : zoneRank(a) - zoneRank(b));
    zoneNames.forEach((zoneName) => {
      const zone = layout.zoneLayouts[zoneName]; let remaining = group.filter((stop) => stop._location.zone === zoneName);
      const entersFromCorridor = zoneName !== position.zone;
      let current = !entersFromCorridor ? position.key : zone ? zoneDoorKey(layout, zoneName) : null;
      if (!zone || !current || (entersFromCorridor && !corridorConnected)) { unreachable.push(...remaining); return; }
      let visited = false;
      while (remaining.length) {
        let best = null;
        remaining.forEach((stop) => { const targets = new Set(adjacentPathKeys(zone, Number(stop._location.containerNumber), Number(stop._location.aisle))); const path = shortestPathToAny(zone, current, targets); if (path && (!best || path.length < best.path.length || (path.length === best.path.length && stop._originalIndex < best.stop._originalIndex))) best = { stop, path }; });
        if (!best) { unreachable.push(...remaining); break; }
        ordered.push(best.stop); segments.push({ zone: zoneName, stop: best.stop, path: best.path }); current = best.path.at(-1); visited = true;
        remaining = remaining.filter((stop) => stop !== best.stop);
      }
      if (visited) position = { zone: zoneName, key: current };
    });
  });
  pending.filter((stop) => !stop._location.zone).forEach((stop) => unreachable.push(stop));
  unreachable.sort((a, b) => a._originalIndex - b._originalIndex);
  const clean = (stop, index) => { const { _originalIndex, _location, _last, ...value } = stop; return { ...value, sequence: index + 1 }; };
  return { ordered: [...ordered, ...unreachable].map(clean), segments, unreachable };
}
function optimizeRouteStops(route) { return buildEfficientRoutePlan(route).ordered; }

// ---------- Java route engine (desktop app only; the browser falls back to built-in routing) ----------
function layoutBlocks(layout) {
  const zones = Array.from({ length: layout.zoneCount }, (_, index) => String.fromCharCode(65 + index));
  const gapSize = { Compact: 22, Standard: 34, Wide: 48 }[layout.aisleWidth] || 34;
  const blocks = [];
  if (layout.orientation === "Vertical") {
    const startX = 108, totalWidth = 620, blockWidth = (totalWidth - gapSize * (layout.zoneCount - 1)) / layout.zoneCount;
    zones.forEach((zone, index) => blocks.push({ zone, x: startX + index * (blockWidth + gapSize), y: 58, width: blockWidth, height: 238 }));
  } else {
    // Horizontal: zones are stacked beside a vertical corridor; keep squares square so the grid stays readable.
    const gap = Math.max(26, gapSize * .8); const totalRows = zones.reduce((sum, zone) => sum + layout.zoneLayouts[zone].rows, 0);
    const maxColumns = Math.max(...zones.map((zone) => layout.zoneLayouts[zone].columns));
    const cell = Math.max(12, Math.min(28, 610 / maxColumns, (660 - gap * (zones.length - 1)) / totalRows));
    let y = 50;
    zones.forEach((zone) => { const z = layout.zoneLayouts[zone]; blocks.push({ zone, x: 116, y, width: z.columns * cell, height: z.rows * cell }); y += z.rows * cell + gap; });
  }
  return blocks;
}
function layoutCellCenter(block, zone, key) { const { row, column } = gridPosition(key); return { x: block.x + (column - .5) * block.width / zone.columns, y: block.y + (row - .5) * block.height / zone.rows }; }
// The door square of each zone, with its position along the corridor (px and square-widths).
function corridorLinks(layout, blocks = layoutBlocks(layout)) {
  const vertical = layout.orientation === "Vertical";
  const unit = blocks.reduce((sum, block) => { const zone = layout.zoneLayouts[block.zone]; return sum + (vertical ? block.width / zone.columns : block.height / zone.rows); }, 0) / Math.max(1, blocks.length);
  const links = [];
  blocks.forEach((block) => {
    const zone = layout.zoneLayouts[block.zone]; const key = zoneDoorKey(layout, block.zone); if (!key) return;
    const center = layoutCellCenter(block, zone, key); const { row, column } = gridPosition(key); const px = vertical ? center.x : center.y;
    links.push({ zone: block.zone, row, col: column, px, pos: Math.round(px / unit * 1000) / 1000 });
  });
  return links;
}
const javaEngine = { available: typeof window.lumina?.optimizeRoute === "function", inflight: new Set(), failedKeys: new Set(), lastError: "" };
function hashText(text) { let hash = 2166136261; for (let index = 0; index < text.length; index += 1) { hash ^= text.charCodeAt(index); hash = Math.imul(hash, 16777619); } return (hash >>> 0).toString(36); }
function routePlanKey(batch) { return `${hashText(JSON.stringify(state.warehouseLayout))}:${(batch.route || []).map((stop) => `${stopKey(stop)}${stopIsLast(stop) ? "!" : ""}`).sort().join(",")}`; }
function hasValidPlan(batch) { return Boolean(batch.plan && batch.plan.key === routePlanKey(batch)); }
function buildRouteRequest(batch) {
  const layout = normalizeWarehouseLayout(state.warehouseLayout); const blocks = layoutBlocks(layout);
  const start = warehouseStartingPoint(layout); const startPosition = gridPosition(start.key);
  return {
    zones: blocks.map((block) => { const zone = layout.zoneLayouts[block.zone]; return { name: block.zone, rows: zone.rows, cols: zone.columns, paths: Object.keys(zone.cells).filter((key) => zone.cells[key] === "Path").map((key) => { const { row, column } = gridPosition(key); return [row, column]; }) }; }),
    start: { zone: start.zone, row: startPosition.row, col: startPosition.column },
    corridor: corridorLinks(layout, blocks).map(({ zone, row, col, pos }) => ({ zone, row, col, pos })),
    stops: (batch.route || []).map((stop) => { const location = parseLocation(stop.location); return { id: stopKey(stop), zone: location.zone, row: Number(location.containerNumber) || 0, col: Number(location.aisle) || 0, last: stopIsLast(stop) }; }),
    baselineOrder: buildEfficientRoutePlan(batch.route || []).ordered.map(stopKey),
    returnToStart: true,
  };
}
function requestRoutePlan(batch) {
  if (!javaEngine.available || batch.status === "complete" || !(batch.route || []).length || hasValidPlan(batch)) return;
  const key = routePlanKey(batch);
  if (javaEngine.inflight.has(key) || javaEngine.failedKeys.has(key)) return;
  javaEngine.inflight.add(key);
  const finish = (result) => {
    javaEngine.inflight.delete(key);
    const current = state.batches.find((candidate) => candidate.id === batch.id); if (!current) return;
    if (!result?.ok) { javaEngine.failedKeys.add(key); javaEngine.lastError = result?.error || "The Java engine did not respond."; }
    else if (routePlanKey(current) === key) {
      const byId = new Map(current.route.map((stop) => [stopKey(stop), stop]));
      const ordered = result.order.map((id) => byId.get(id)).filter(Boolean);
      current.route = [...ordered, ...current.route.filter((stop) => !result.order.includes(stopKey(stop)))].map((stop, index) => ({ ...stop, sequence: index + 1 }));
      current.plan = { key, engine: result.engine, distance: result.distance, baselineDistance: result.baselineDistance, method: result.method, micros: result.micros, legs: result.legs, unreachable: result.unreachable };
      javaEngine.lastError = ""; saveState();
    }
    if (currentView === "picking" && selectedBatchId === current.id) renderPicking();
  };
  try { window.lumina.optimizeRoute(buildRouteRequest(batch)).then(finish, (error) => finish({ ok: false, error: error?.message })); }
  catch (error) { finish({ ok: false, error: error.message }); }
}
function engineStatusMarkup(batch, planValid, builtinDistance) {
  if (planValid) {
    const plan = batch.plan; const steps = Math.round(plan.distance); const saved = Math.round(plan.baselineDistance - plan.distance);
    return `<span class="engine-chip java" title="${escapeHtml(plan.engine)} · planned in ${Math.max(1, Math.round(plan.micros / 1000))} ms">${icon("path")}<span>Java route engine · ${steps} steps round trip · ${plan.method === "exact" ? "shortest possible" : "optimized"}${saved > 0 ? ` · ${saved} fewer than built-in` : ""}</span></span>`;
  }
  const steps = builtinDistance ? ` · ${Math.round(builtinDistance)} steps round trip` : "";
  if (batch.status === "complete") return "";
  if (!javaEngine.available) return `<span class="engine-chip">${icon("path")}<span>Built-in routing${steps}</span></span>`;
  if (javaEngine.failedKeys.has(routePlanKey(batch))) return `<span class="engine-chip warn" title="${escapeHtml(javaEngine.lastError)}">${icon("alert")}<span>Built-in routing${steps} · Java engine unavailable</span></span>`;
  return `<span class="engine-chip busy">${icon("path")}<span>Java engine is optimizing this route…</span></span>`;
}
// The built-in route as continuous legs (same shape as the Java engine's, including the walk back to S).
function builtinRoutePlan(route, layout) {
  const plan = buildEfficientRoutePlan(route, layout); const links = corridorLinks(layout); const start = warehouseStartingPoint(layout);
  const linkIndex = (zoneName) => links.findIndex((link) => link.zone === zoneName);
  const square = (zone, key) => { const { row, column } = gridPosition(key); return { zone, row, col: column }; };
  // walk out of the previous zone through its door and along the corridor to the next zone's door
  const crossTo = (from, zoneName, points) => {
    const door = zoneDoorKey(layout, from.zone);
    const exit = door ? shortestPathToAny(layout.zoneLayouts[from.zone], from.key, new Set([door])) : null;
    (exit || [from.key]).forEach((key) => points.push(square(from.zone, key)));
    if (linkIndex(from.zone) >= 0) points.push({ corridor: linkIndex(from.zone) });
    if (linkIndex(zoneName) >= 0) points.push({ corridor: linkIndex(zoneName) });
  };
  let previous = { zone: start.zone, key: start.key }; const legs = [];
  plan.segments.forEach((segment) => {
    const points = [];
    if (segment.zone !== previous.zone) crossTo(previous, segment.zone, points);
    segment.path.forEach((key) => points.push(square(segment.zone, key)));
    legs.push({ stop: stopKey(segment.stop), points });
    previous = { zone: segment.zone, key: segment.path.at(-1) };
  });
  if (legs.length) {
    const points = []; const zone = layout.zoneLayouts[start.zone];
    let from = previous.key;
    if (previous.zone !== start.zone) { crossTo(previous, start.zone, points); from = zoneDoorKey(layout, start.zone); }
    (shortestPathToAny(zone, from, new Set([start.key])) || [from]).forEach((key) => points.push(square(start.zone, key)));
    legs.push({ stop: null, return: true, points });
  }
  return { source: "builtin", legs, unreachable: plan.unreachable.map(stopKey), distance: routeLegsDistance(legs, links) };
}
// Walking distance of a set of legs, in the same units as the Java engine (squares; corridor by position).
function routeLegsDistance(legs, links) {
  let total = 0;
  legs.forEach((leg) => leg.points.forEach((point, index) => {
    if (!index) return; const previous = leg.points[index - 1];
    const a = previous.corridor !== undefined, b = point.corridor !== undefined;
    total += a && b ? Math.abs(links[previous.corridor].pos - links[point.corridor].pos) : (a || b) ? 1 : (previous.row === point.row && previous.col === point.col && previous.zone === point.zone ? 0 : 1);
  }));
  return total;
}
// The corridor is drawn as part of the building (a grey lane with one door per zone), never as a route.
function corridorLaneSvg(layout, blocks) {
  if (!blocks.length) return "";
  const vertical = layout.orientation === "Vertical"; const first = blocks[0]; const last = blocks.at(-1);
  const doors = blocks.map((block) => {
    const key = zoneDoorKey(layout, block.zone); if (!key) return "";
    const center = layoutCellCenter(block, layout.zoneLayouts[block.zone], key);
    return vertical ? `<line x1="${center.x}" y1="${block.y + block.height}" x2="${center.x}" y2="313" stroke="#c4d4ce" stroke-width="5" stroke-linecap="round"/>` : `<line x1="${block.x}" y1="${center.y}" x2="100" y2="${center.y}" stroke="#c4d4ce" stroke-width="5" stroke-linecap="round"/>`;
  }).join("");
  const lane = vertical
    ? `<rect x="${first.x - 14}" y="312" width="${last.x + last.width - first.x + 28}" height="18" rx="9" fill="#e4ece8"/><text x="${last.x + last.width + 14}" y="342" text-anchor="end" font-size="7" font-weight="700" letter-spacing=".9" fill="#8a9c96">DISPATCH CORRIDOR</text>`
    : `<rect x="83" y="${first.y - 14}" width="18" height="${last.y + last.height - first.y + 28}" rx="9" fill="#e4ece8"/><text x="76" y="${last.y + last.height + 14}" text-anchor="start" font-size="7" font-weight="700" letter-spacing=".9" fill="#8a9c96" transform="rotate(-90 76 ${last.y + last.height + 14})">DISPATCH CORRIDOR</text>`;
  return `<g class="corridor-lane" aria-hidden="true">${lane}${doors}</g>`;
}
function engineRouteSvg(routePlan, route, layout, blocks, { compact, pickedIds, nextId }) {
  const links = corridorLinks(layout, blocks); const vertical = layout.orientation === "Vertical"; const tracking = Boolean(pickedIds);
  const corridorAt = vertical ? 321 : 92;
  const stopsById = new Map(route.map((stop) => [stopKey(stop), stop]));
  const locate = (location) => { const parsed = parseLocation(location || ""); const block = blocks.find((candidate) => candidate.zone === parsed.zone); const zone = layout.zoneLayouts[parsed.zone]; return block && zone ? layoutCellCenter(block, zone, gridKey(Number(parsed.containerNumber), Number(parsed.aisle))) : null; };
  const toPoint = (point) => { if (point.corridor !== undefined) { const link = links[point.corridor]; return vertical ? { x: link.px, y: corridorAt } : { x: corridorAt, y: link.px }; } const block = blocks.find((candidate) => candidate.zone === point.zone); return layoutCellCenter(block, layout.zoneLayouts[point.zone], gridKey(point.row, point.col)); };
  const markers = []; let number = 0;
  const lines = routePlan.legs.map((leg) => {
    const points = leg.points.map(toPoint); if (!points.length) return "";
    const path = points.map((point, i) => `${i ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
    if (leg.return) return `<path class="route-leg route-return" d="${path}" fill="none" stroke="#173f35" stroke-width="${compact ? 2.5 : 3.5}" stroke-dasharray="2 7" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/>`;
    number += 1;
    const marker = points.at(-1); const target = locate(stopsById.get(leg.stop)?.location) || marker;
    const picked = pickedIds?.has(leg.stop); const isNext = nextId && leg.stop === nextId;
    const fill = !tracking ? "#f2c94c" : picked ? "#91b84b" : isNext ? "#f2c94c" : "#ffffff"; const radius = isNext ? 11 : 9;
    markers.push(`${isNext ? `<circle cx="${marker.x}" cy="${marker.y}" r="16" fill="#f2c94c" opacity=".35"/>` : ""}<circle cx="${marker.x}" cy="${marker.y}" r="${radius}" fill="${fill}" stroke="#173f35" stroke-width="2"/><text x="${marker.x}" y="${marker.y + 3}" text-anchor="middle" font-size="${isNext ? 9 : 8}" font-weight="800" fill="${picked ? "#ffffff" : "#173f35"}">${picked ? "✓" : number}</text>`);
    return `<path class="route-leg${routePlan.source === "builtin" ? "" : " engine-leg"}" d="${path}" fill="none" stroke="#173f35" stroke-width="${compact ? 3 : 4.5}" stroke-dasharray="8 6" stroke-linecap="round" stroke-linejoin="round" opacity="${picked ? .3 : 1}"/><path d="M ${marker.x} ${marker.y} L ${target.x} ${target.y}" stroke="#e77969" stroke-width="2" opacity="${picked ? .4 : 1}"/>`;
  }).join("");
  const unreachable = (routePlan.unreachable || []).map((id) => { const point = locate(stopsById.get(id)?.location); return point ? `<circle cx="${point.x}" cy="${point.y}" r="7" fill="#e77969" stroke="#fff" stroke-width="2"/><text x="${point.x}" y="${point.y + 3}" text-anchor="middle" font-size="8" font-weight="800" fill="#fff">!</text>` : ""; }).join("");
  return { lines: lines + markers.join(""), unreachable };
}

function warehouseLayoutSvg({ route = [], selectedLocation = "", compact = false, layoutOverride = null, interactive = false, pickedIds = null, nextId = null, enginePlan = null, occupiedBy = null } = {}) {
  const raw = layoutOverride || state.warehouseLayout;
  const layout = normalizeWarehouseLayout(raw);
  const selected = selectedLocation ? parseLocation(selectedLocation) : null;
  const blocks = layoutBlocks(layout);
  const height = Math.max(360, Math.ceil(Math.max(...blocks.map((block) => block.y + block.height)) + 44));
  const cells = blocks.map((block) => {
    const cellMarkup = []; const zoneLayout = layout.zoneLayouts[block.zone];
    for (let row = 1; row <= zoneLayout.rows; row += 1) {
      for (let column = 1; column <= zoneLayout.columns; column += 1) {
        const piece = zoneLayout.cells?.[gridKey(row, column)] || "";
        const isSelected = selected?.zone === block.zone && Number(selected.aisle) === column && Number(selected.containerNumber) === row;
        const cellWidth = block.width / zoneLayout.columns; const cellHeight = block.height / zoneLayout.rows; const x = block.x + (column - 1) * cellWidth; const y = block.y + (row - 1) * cellHeight;
        const isContainer = ["Rack","Shelf","Bin"].includes(piece); const locationCode = isContainer ? composeLocation({ zone: block.zone, aisle: column, containerType: piece, containerNumber: row }) : "";
        const takenBy = isContainer && occupiedBy ? occupiedBy.get(locationCode) : null;
        const fill = takenBy ? "#d9dfdc" : piece === "Path" ? "#ffffff" : piece === "Rack" ? "#dceee8" : piece === "Shelf" ? "#f5edc9" : piece === "Bin" ? "#e3e9f4" : "#e8eeeb";
        const pieceColor = takenBy ? "#8a9894" : piece === "Rack" ? "#267464" : piece === "Shelf" ? "#98731d" : "#536f9d";
        const shape = `<rect x="${x}" y="${y}" width="${cellWidth}" height="${cellHeight}" rx="1.5" fill="${fill}" stroke="${isSelected ? "#e45f51" : "#b6c3bf"}" stroke-width="${isSelected ? 3 : .7}"/>${isContainer ? `<text x="${x + cellWidth / 2}" y="${y + cellHeight / 2 + 3}" text-anchor="middle" font-size="${Math.max(5, Math.min(8, Math.min(cellHeight, cellWidth) * .4))}" font-weight="800" fill="${pieceColor}">${piece[0]}</text>` : ""}`;
        if (interactive && isContainer && !takenBy) cellMarkup.push(`<g class="selectable-location ${isSelected ? "selected" : ""}" data-location="${locationCode}" role="button" tabindex="0"><title>${piece} ${locationCode} · holds up to ${CONTAINER_CAPACITY[piece]} units</title>${shape}</g>`);
        else if (takenBy) cellMarkup.push(`<g class="taken-location"><title>${locationCode} already holds ${escapeHtml(takenBy)}</title>${shape}</g>`);
        else cellMarkup.push(shape);
      }
    }
    return `<g>${cellMarkup.join("")}<rect x="${block.x}" y="${block.y}" width="${block.width}" height="${block.height}" fill="none" stroke="#587169" stroke-width="2" rx="2"/><text x="${block.x + block.width / 2}" y="${block.y - 10}" text-anchor="middle" font-size="11" font-weight="700" fill="#315b50">ZONE ${block.zone}</text></g>`;
  }).join("");
  const start = warehouseStartingPoint(layout);
  const startBlock = blocks.find((candidate) => candidate.zone === start.zone); const startZone = layout.zoneLayouts[start.zone];
  const startPoint = startBlock && startZone ? layoutCellCenter(startBlock, startZone, start.key) : { x: 55, y: 321 };
  const routeSource = enginePlan || (route.length ? builtinRoutePlan(route, layout) : null);
  const routeLayer = routeSource ? engineRouteSvg(routeSource, route, layout, blocks, { compact, pickedIds, nextId }) : null;
  const startMarker = `<g class="route-start"><circle cx="${startPoint.x}" cy="${startPoint.y}" r="10" fill="#163f35" stroke="#fff" stroke-width="2.5"/><text x="${startPoint.x}" y="${startPoint.y + 3.5}" text-anchor="middle" font-size="9" font-weight="800" fill="#fff">S</text><text x="${startPoint.x}" y="${startPoint.y - 14}" text-anchor="middle" font-size="8" font-weight="800" fill="#163f35">START</text></g>`;
  return `<svg class="warehouse-map ${compact ? "compact-map" : ""}" viewBox="0 0 760 ${height}" role="img" aria-label="Warehouse grid with one starting point, the dispatch corridor and the picking route"><rect width="760" height="${height}" fill="#f8faf8"/>${cells}${corridorLaneSvg(layout, blocks)}${routeLayer ? routeLayer.lines + routeLayer.unreachable : ""}${startMarker}</svg>`;
}

function openWarehouseLayoutModal() {
  const draft = normalizeWarehouseLayout(structuredClone(state.warehouseLayout));
  let activeZone = "A"; let selectedPiece = "Path"; let suppressBoardClick = false; const dirtyZones = new Set();
  modalRoot.innerHTML = `<div class="modal-backdrop"><form class="modal layout-modal board-layout-modal" id="layout-form"><div class="modal-head"><h2>Warehouse Grid Editor</h2><p class="modal-info">${icon("info")}<span>Choose a square type, then click or drag across the grid. Place the Starting Point on a connected path so every required container remains reachable.</span></p></div><div class="layout-settings-row">
    <div class="field"><label>Number Of Zones</label><select name="zoneCount">${[2,3,4].map((value) => `<option value="${value}" ${value === Number(draft.zoneCount) ? "selected" : ""}>${value} Zones</option>`).join("")}</select></div>
    <div class="field"><label>Layout Orientation</label><select name="orientation">${["Vertical","Horizontal"].map((value) => `<option ${value === draft.orientation ? "selected" : ""}>${value}</option>`).join("")}</select></div>
    <div class="field"><label>Zone Spacing</label><select name="aisleWidth">${["Compact","Standard","Wide"].map((value) => `<option ${value === draft.aisleWidth ? "selected" : ""}>${value}</option>`).join("")}</select></div>
  </div><div class="zone-tabs" id="zone-tabs"></div><div class="board-editor-shell">
    <aside class="piece-palette"><div><h3>Square Type</h3><p>Select what a square represents.</p></div>${["Start","Door","Path","Rack","Shelf","Bin","Eraser"].map((type) => `<button type="button" data-palette="${type}" title="${type === "Door" ? "Where this zone opens onto the dispatch corridor (one per zone, on the corridor edge)" : ""}"><span class="piece-icon ${type.toLowerCase()}">${icon(type.toLowerCase())}</span><span>${type === "Eraser" ? "Empty" : type === "Start" ? "Starting Point" : type}</span></button>`).join("")}</aside>
    <section class="zone-board-panel"><div class="board-toolbar"><div><h3 id="zone-editor-title">Zone A</h3><p id="zone-editor-size"></p></div><div class="board-size-actions"><button type="button" data-size="remove-row">− Row</button><button type="button" data-size="add-row">+ Row</button><button type="button" data-size="remove-column">− Column</button><button type="button" data-size="add-column">+ Column</button></div></div><div class="zone-board-wrap"><div class="zone-board free-grid-board" id="zone-board"></div></div><div class="board-hint">${icon("info")}<span>The Starting Point is unique and must sit on a walkable path. Pickers never cross Rack, Shelf, or Bin squares.</span></div></section>
  </div><section class="layout-live-section board-preview-section"><div class="location-section-head"><div><h3>Shared 2D Layout Preview</h3><p>Only edited zones change; all other saved zones remain intact.</p></div>${icon("layout")}</div><div class="layout-editor-preview" id="layout-editor-preview"></div></section><div class="modal-actions"><button type="button" class="btn secondary with-icon" id="cancel-layout">${icon("close")}<span>Cancel</span></button><button class="btn with-icon" type="submit" id="save-layout">${icon("save")}<span>Save Edited Zones</span></button></div></form></div>`;
  const form = document.getElementById("layout-form");
  const ensureDraftStartingPoint = () => { const activeZones = Array.from({ length:draft.zoneCount },(_,index) => String.fromCharCode(65 + index)); const currentZone = draft.zoneLayouts[draft.startingPoint?.zone]; if (activeZones.includes(draft.startingPoint?.zone) && currentZone?.cells?.[draft.startingPoint.key] === "Path") return; const zone = draft.zoneLayouts.A; const key = zoneEntryPath(zone,draft.orientation) || Object.keys(zone.cells).find((candidate) => zone.cells[candidate] === "Path") || gridKey(zone.rows,Math.ceil(zone.columns / 2)); zone.cells[key] = "Path"; draft.startingPoint = { zone:"A",key }; dirtyZones.add("A"); };
  const syncGlobalSettings = () => { draft.zoneCount = Number(form.elements.zoneCount.value); draft.orientation = form.elements.orientation.value; draft.aisleWidth = form.elements.aisleWidth.value; if (activeZone.charCodeAt(0) - 64 > draft.zoneCount) activeZone = "A"; ensureDraftStartingPoint(); };
  const placePiece = (key, type, source = "") => { const zone = draft.zoneLayouts[activeZone]; const currentStart = draft.startingPoint; draft.doors = { ...(draft.doors || {}) };
    if (type === "Door") { if (!isCorridorEdge(zone, key, draft.orientation)) { toast(draft.orientation === "Horizontal" ? "Doors go in column 1, the edge facing the corridor" : "Doors go in the bottom row, the edge facing the corridor"); return; } zone.cells[key] = "Path"; draft.doors[activeZone] = key; dirtyZones.add(activeZone); renderZoneEditor(); return; }
    if (draft.doors[activeZone] === key && type !== "Path" && type !== "Start") delete draft.doors[activeZone];
    if (type === "Start") { if (currentStart?.zone) dirtyZones.add(currentStart.zone); zone.cells[key] = "Path"; draft.startingPoint = { zone:activeZone,key }; } else { if (currentStart?.zone === activeZone && currentStart.key === key && !["Path"].includes(type)) { toast("Move The Starting Point Before Replacing This Square"); return; } if (source && source !== key) delete zone.cells[source]; if (type === "Eraser") delete zone.cells[key]; else zone.cells[key] = type; } dirtyZones.add(activeZone); renderZoneEditor(); };
  const beginPointerDrag = (event, type, source = "") => {
    if (event.button !== 0) return; const startX = event.clientX; const startY = event.clientY; let moved = false; let ghost = null; let highlighted = null;
    const move = (moveEvent) => { if (!moved && Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) < 6) return; moved = true; if (!ghost) { ghost = document.createElement("div"); ghost.className = `piece-drag-ghost ${type.toLowerCase()}`; ghost.innerHTML = `${icon(type.toLowerCase())}<span>${type}</span>`; document.body.appendChild(ghost); } ghost.style.left = `${moveEvent.clientX}px`; ghost.style.top = `${moveEvent.clientY}px`; highlighted?.classList.remove("drop-target"); highlighted = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY)?.closest("[data-cell]") || null; highlighted?.classList.add("drop-target"); };
    const end = (upEvent) => { document.removeEventListener("pointermove", move); document.removeEventListener("pointerup", end); highlighted?.classList.remove("drop-target"); ghost?.remove(); if (!moved) return; suppressBoardClick = true; const target = document.elementFromPoint(upEvent.clientX, upEvent.clientY)?.closest("[data-cell]"); setTimeout(() => { suppressBoardClick = false; }, 0); if (target) placePiece(target.dataset.cell, type, source); };
    document.addEventListener("pointermove", move); document.addEventListener("pointerup", end, { once: true });
  };
  const resizeZone = (action) => { const zone = draft.zoneLayouts[activeZone]; if (action === "add-row" && zone.rows < 20) zone.rows += 1; if (action === "remove-row" && zone.rows > 3) { Object.keys(zone.cells).filter((key) => Number(key.split("-")[0]) === zone.rows).forEach((key) => delete zone.cells[key]); zone.rows -= 1; } if (action === "add-column" && zone.columns < 20) zone.columns += 1; if (action === "remove-column" && zone.columns > 3) { Object.keys(zone.cells).filter((key) => Number(key.split("-")[1]) === zone.columns).forEach((key) => delete zone.cells[key]); zone.columns -= 1; } dirtyZones.add(activeZone); ensureDraftStartingPoint(); renderZoneEditor(); };
  const renderZoneEditor = () => {
    syncGlobalSettings(); const zone = draft.zoneLayouts[activeZone]; const zones = Array.from({ length: draft.zoneCount }, (_, index) => String.fromCharCode(65 + index));
    document.getElementById("zone-tabs").innerHTML = zones.map((name) => `<button type="button" data-zone="${name}" class="${name === activeZone ? "active" : ""}">Zone ${name}${dirtyZones.has(name) ? `<i></i>` : ""}</button>`).join("");
    document.querySelectorAll("[data-palette]").forEach((button) => button.classList.toggle("selected", button.dataset.palette === selectedPiece));
    document.getElementById("zone-editor-title").textContent = `Zone ${activeZone}`; document.getElementById("zone-editor-size").textContent = `${zone.rows} Rows × ${zone.columns} Columns · Free Grid`;
    const cells = []; for (let row = 1; row <= zone.rows; row += 1) for (let column = 1; column <= zone.columns; column += 1) { const key = `${row}-${column}`; const piece = zone.cells[key] || ""; const isPath = piece === "Path"; const isStart = draft.startingPoint?.zone === activeZone && draft.startingPoint.key === key; const isDoor = !isStart && zoneDoorKey(normalizeWarehouseLayout(draft), activeZone) === key; const displayedPiece = isStart ? "Start" : isDoor ? "Door" : piece; cells.push(`<button type="button" class="board-cell ${piece ? "occupied" : ""} ${isPath ? "path-cell" : ""} ${isStart ? "start-cell" : ""}" data-cell="${key}" aria-label="Row ${row}, Column ${column}${displayedPiece ? `, ${displayedPiece === "Start" ? "Starting Point" : displayedPiece}` : ", Empty"}" ${displayedPiece ? `data-piece="${displayedPiece}"` : ""}><span class="cell-coordinate">${row},${column}</span>${displayedPiece ? `<span class="placed-piece ${displayedPiece.toLowerCase()}">${icon(displayedPiece.toLowerCase())}<small>${displayedPiece === "Start" ? "Start" : displayedPiece === "Door" ? (draft.doors?.[activeZone] === key ? "Door" : "Door (auto)") : displayedPiece}</small></span>` : `<span class="empty-square">+</span>`}</button>`); }
    const board = document.getElementById("zone-board"); board.style.setProperty("--board-columns", zone.columns); board.innerHTML = cells.join("");
    document.getElementById("layout-editor-preview").innerHTML = warehouseLayoutSvg({ layoutOverride: draft, compact: true });
    document.querySelectorAll("[data-zone]").forEach((button) => button.addEventListener("click", () => { activeZone = button.dataset.zone; renderZoneEditor(); }));
    board.querySelectorAll("[data-cell]").forEach((cell) => { cell.addEventListener("click", () => { if (!suppressBoardClick) placePiece(cell.dataset.cell, selectedPiece); }); cell.addEventListener("pointerdown", (event) => { if (cell.dataset.piece) beginPointerDrag(event, cell.dataset.piece, cell.dataset.cell); }); });
    document.getElementById("save-layout").querySelector("span").textContent = dirtyZones.size ? `Save ${dirtyZones.size} Edited Zone${dirtyZones.size === 1 ? "" : "s"}` : "Save Layout Settings";
  };
  document.querySelectorAll("[data-palette]").forEach((button) => { button.addEventListener("click", () => { if (!suppressBoardClick) { selectedPiece = button.dataset.palette; renderZoneEditor(); } }); button.addEventListener("pointerdown", (event) => beginPointerDrag(event, button.dataset.palette)); });
  document.querySelectorAll("[data-size]").forEach((button) => button.addEventListener("click", () => resizeZone(button.dataset.size)));
  form.querySelectorAll(".layout-settings-row select").forEach((control) => control.addEventListener("change", renderZoneEditor));
  renderZoneEditor();
  document.getElementById("cancel-layout").addEventListener("click", closeModal);
  document.querySelector(".modal-backdrop").addEventListener("click", (event) => { if (event.target.classList.contains("modal-backdrop")) closeModal(); });
  form.addEventListener("submit", (event) => {
    event.preventDefault(); syncGlobalSettings(); const nextZoneLayouts = { ...state.warehouseLayout.zoneLayouts }; dirtyZones.forEach((zone) => { nextZoneLayouts[zone] = structuredClone(draft.zoneLayouts[zone]); });
    const nextLayout = normalizeWarehouseLayout({ ...state.warehouseLayout, zoneCount: draft.zoneCount, orientation: draft.orientation, aisleWidth: draft.aisleWidth, startingPoint:structuredClone(draft.startingPoint), doors: structuredClone(draft.doors || {}), zoneLayouts: nextZoneLayouts });
    // A square that changed between Rack, Shelf and Bin keeps its products: only the location code's type letter changes.
    const renamed = new Map(); let retyped = 0;
    const relabel = (code) => { const location = parseLocation(code); const piece = nextLayout.zoneLayouts[location.zone]?.cells?.[gridKey(Number(location.containerNumber), Number(location.aisle))]; if (location.zone && ["Rack","Shelf","Bin"].includes(piece) && piece !== location.containerType) { const next = composeLocation({ ...location, containerType: piece }); renamed.set(code, next); retyped += 1; return next; } return code; };
    const nextInventory = state.inventory.map((item) => syncProduct({ ...item, locations: item.locations.map((entry) => ({ ...entry, location: relabel(entry.location) })) }));
    // Warn about locations this change would newly strand (previously fine, now unusable).
    const stranded = [];
    state.inventory.forEach((item, index) => item.locations.forEach((entry, entryIndex) => {
      if (!(isLocationWithinLayout(entry.location) && isContainerReachable(entry.location))) return;
      const code = nextInventory[index].locations[entryIndex].location; const location = parseLocation(code); const piece = nextLayout.zoneLayouts[location.zone]?.cells?.[gridKey(Number(location.containerNumber), Number(location.aisle))];
      if (!isLocationWithinLayout(code, nextLayout)) stranded.push(`${item.name} (${code}): ${location.zone.charCodeAt(0) - 64 > nextLayout.zoneCount ? `Zone ${location.zone} is removed` : piece === "Path" ? "square is now a walkway" : piece ? "square changed" : "square is now empty or outside the zone"}`);
      else if (!isContainerReachable(code, nextLayout)) stranded.push(`${item.name} (${code}): no walkway reaches it`);
    }));
    if (stranded.length && !confirm(`Saving this layout will leave ${stranded.length} product location${stranded.length === 1 ? "" : "s"} unusable:\n\n${stranded.slice(0,10).join("\n")}${stranded.length > 10 ? `\n…and ${stranded.length - 10} more` : ""}\n\nThey will show as warnings and can't be picked until you move them or fix the grid. Save anyway?`)) return;
    state.warehouseLayout = nextLayout; state.inventory = nextInventory;
    state.batches.forEach((batch) => (batch.route || []).forEach((stop) => { if (renamed.has(stop.location)) { stop.location = renamed.get(stop.location); stop.id = `${stop.sku}@${stop.location}`; } }));
    state.batches.forEach((batch) => { batch.route = optimizeRouteStops(batch.route || []); });
    const changed = dirtyZones.size ? [...dirtyZones].map((zone) => `Zone ${zone}`).join(", ") : "Layout Settings"; const startPosition = gridPosition(state.warehouseLayout.startingPoint.key); recordHistory("Warehouse Grid Updated", `${changed} · Start Zone ${state.warehouseLayout.startingPoint.zone} (${startPosition.row},${startPosition.column}) · Routes Recalculated${retyped ? ` · ${retyped} Product Location${retyped === 1 ? "" : "s"} Relabelled` : ""}${stranded.length ? ` · ${stranded.length} Product${stranded.length === 1 ? "" : "s"} Need A New Location` : ""}`, "Layout", "layout"); saveState(); closeModal(); renderPicking(); toast(`${changed} Updated`);
  });
}

function renderHistory() {
  const entries = state.history;
  app.innerHTML = `<div class="page">${pageHeader("Activity History", "A record of important Inventory, Orders, Picking, and Layout changes.")}<div class="toolbar history-toolbar"><input class="search" id="history-search" placeholder="Search History…" autocomplete="off"/><select class="history-filter" id="history-filter"><option>All Areas</option><option>Inventory</option><option>Orders</option><option>Picking</option><option>Layout</option></select></div><section class="history-list">${entries.map(historyEntryMarkup).join("")}</section><section class="card empty history-empty" ${entries.length ? "hidden" : ""}><div><span class="empty-icon">${icon("history")}</span><h2>No Activity Yet</h2><p>Important changes will appear here automatically.</p></div></section></div>`;
  const search = document.getElementById("history-search"); const filter = document.getElementById("history-filter"); const rows = [...document.querySelectorAll("[data-history-entry]")]; const empty = document.querySelector(".history-empty");
  const applyFilters = () => { const query = search.value.trim().toLowerCase(); const area = filter.value; let visible = 0; rows.forEach((row) => { const matches = (!query || row.dataset.search.includes(query)) && (area === "All Areas" || row.dataset.area === area); row.hidden = !matches; if (matches) visible += 1; }); empty.hidden = visible > 0; };
  search.addEventListener("input", applyFilters); filter.addEventListener("change", applyFilters); applyFilters();
}

function historyEntryMarkup(entry) {
  const date = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(entry.at));
  const searchable = `${entry.action} ${entry.detail} ${entry.area}`.toLowerCase();
  return `<article class="card history-entry" data-history-entry data-area="${escapeHtml(entry.area)}" data-search="${escapeHtml(searchable)}"><span class="history-icon ${escapeHtml(entry.area.toLowerCase())}">${icon(entry.icon || "history")}</span><div><div class="history-entry-head"><strong>${escapeHtml(entry.action)}</strong><span class="pill">${escapeHtml(entry.area)}</span></div><p>${escapeHtml(entry.detail)}</p><time datetime="${escapeHtml(entry.at)}">${escapeHtml(date)}</time></div></article>`;
}

function resetDemoData() {
  if (!confirm("Reset all demo data?\n\nInventory, orders, picking batches, the warehouse layout and the activity history will go back to the original sample data. This can't be undone.")) return;
  closeModal(); state = upgradeState({ ...defaultState(), modelVersion: MODEL_VERSION }); selectedBatchId = null; chartPeriod = "Week";
  recordHistory("Demo Data Reset", "Inventory, orders, batches, layout and history restored to the sample data.", "Demo", "history");
  saveState(); navigate("dashboard"); toast("Demo Data Reset");
}
document.getElementById("reset-demo").addEventListener("click", resetDemoData);

hydrateStaticIcons();
window.addEventListener("resize", () => { if (currentView === "dashboard") requestAnimationFrame(syncDashboardPanels); });
updateReadyBadge();
render();
