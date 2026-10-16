import { MOCK_PRODUCTS } from '../config/constants.js';

// Master list of raw materials for haute floristry atelier
export const MASTER_RAW_MATERIALS = [
  {
    id: 'RAW-1',
    name_ar: 'سيقان بيوني وتوليب هولندي أبيض ناصع',
    name_en: 'Dutch Royal White Peonies & Tulips',
    quantity: 120,
    unit_ar: 'ساق',
    unit_en: 'stem',
    reorder_level: 25,
    cost_per_unit: 45,
    category_ar: 'زهور طبيعية مستوردة',
    category_en: 'Imported Flowers',
    supplier_ar: 'أمستردام للزهور النادرة (هولندا)',
    supplier_en: 'Amsterdam Flora Co.',
  },
  {
    id: 'RAW-2',
    name_ar: 'ورود كيتو الإكوادورية المخملية الحمراء',
    name_en: 'Ecuadorian Velvet Crimson Roses',
    quantity: 240,
    unit_ar: 'ساق',
    unit_en: 'stem',
    reorder_level: 40,
    cost_per_unit: 35,
    category_ar: 'زهور طبيعية مستوردة',
    category_en: 'Imported Flowers',
    supplier_ar: 'مزارع أنديز كيتو (الإكوادور)',
    supplier_en: 'Andes Quito Exotics',
  },
  {
    id: 'RAW-8',
    name_ar: 'وشاح حرير ملكي مطرز بعبارات خاصة (إسكات مخصصة)',
    name_en: 'Royal Embroidered Keepsake Sash',
    quantity: 45,
    unit_ar: 'وشاح',
    unit_en: 'sash',
    reorder_level: 15,
    cost_per_unit: 35,
    category_ar: 'أوشحة وإسكات مطرزة',
    category_en: 'Custom Sashes & Ribbons',
    supplier_ar: 'مطبعة وتطريز أوشحة المناسبات الراقية',
    supplier_en: 'Elite Embroidery House',
  },
  {
    id: 'RAW-9',
    name_ar: 'سيقان جوري أبيض ناصع إكوادوري قطف الصباح',
    name_en: 'Ecuadorian Pure White Garden Roses',
    quantity: 180,
    unit_ar: 'ساق',
    unit_en: 'stem',
    reorder_level: 30,
    cost_per_unit: 30,
    category_ar: 'زهور طبيعية مستوردة',
    category_en: 'Imported Flowers',
    supplier_ar: 'مزارع أنديز كيتو (الإكوادور)',
    supplier_en: 'Andes Quito Exotics',
  },
  {
    id: 'RAW-10',
    name_ar: 'زهور زنبق الكالا ليلي الهولندي الأبيض الملكي',
    name_en: 'Dutch White Calla Lily Stems',
    quantity: 80,
    unit_ar: 'ساق',
    unit_en: 'stem',
    reorder_level: 20,
    cost_per_unit: 40,
    category_ar: 'زهور طبيعية مستوردة',
    category_en: 'Imported Flowers',
    supplier_ar: 'مستورد الزهور الملكية (أمستردام)',
    supplier_en: 'Royal Dutch Floral Import',
  },
  {
    id: 'RAW-3',
    name_ar: 'أعقاد لؤلؤ عاجي مطرز للأعراس',
    name_en: 'Bridal Natural Pearl Trims',
    quantity: 35,
    unit_ar: 'عقد',
    unit_en: 'trim',
    reorder_level: 10,
    cost_per_unit: 65,
    category_ar: 'إكسسوارات ولؤلؤ عرائس',
    category_en: 'Bridal Trims',
    supplier_ar: 'دار المجوهرات والتطريز',
    supplier_en: 'Atelier Pearls Co.',
  },
  {
    id: 'RAW-4',
    name_ar: 'صناديق خشب أرز تذكارية مخصصة',
    name_en: 'Personalized Keepsake Cedar Boxes',
    quantity: 18,
    unit_ar: 'صندوق',
    unit_en: 'box',
    reorder_level: 15,
    cost_per_unit: 180,
    category_ar: 'صناديق خشبية وتذكارات',
    category_en: 'Wooden Keepsakes',
    supplier_ar: 'ورشة النجارة والأصداف الملكية',
    supplier_en: 'Royal Carpentry Atelier',
  },
  {
    id: 'RAW-11',
    name_ar: 'ورق تغليف فاخر بطبقات عنابية وأطراف مذهبة',
    name_en: 'Luxury Burgundy & Gold Border Wrap Sheets',
    quantity: 160,
    unit_ar: 'فرخ',
    unit_en: 'sheet',
    reorder_level: 30,
    cost_per_unit: 20,
    category_ar: 'تغليف ومستلزمات الورق',
    category_en: 'Luxury Wrapping',
    supplier_ar: 'المؤسسة الدولية للتغليف الفاخر',
    supplier_en: 'Elite Wrapping Supplies',
  },
  {
    id: 'RAW-12',
    name_ar: 'توبر أكريليك مذهب للمناسبات والتخرج',
    name_en: 'Golden Acrylic Celebration Topper',
    quantity: 60,
    unit_ar: 'قطعة',
    unit_en: 'piece',
    reorder_level: 15,
    cost_per_unit: 25,
    category_ar: 'إكسسوارات تخرج وتوبرز',
    category_en: 'Toppers & Accents',
    supplier_ar: 'ورشة حفر وقص الأكريليك المذهب',
    supplier_en: 'Gold Acrylic Works',
  },
  {
    id: 'RAW-7',
    name_ar: 'أشرطة حرير وساتان عريض مذهب الحواف',
    name_en: 'Gold-Trimmed Satin Ribbon Rolls',
    quantity: 40,
    unit_ar: 'متر',
    unit_en: 'meter',
    reorder_level: 20,
    cost_per_unit: 15,
    category_ar: 'أشرطة وساتان فاخر',
    category_en: 'Luxury Ribbons',
    supplier_ar: 'مصنع الحرير الدمشقي الفاخر',
    supplier_en: 'Damascene Silk Mills',
  },
  {
    id: 'RAW-5',
    name_ar: 'ورق قطني فرنسي معتق لبطاقات الإهداء',
    name_en: 'French Cotton Parchment Sheets',
    quantity: 350,
    unit_ar: 'بطاقة',
    unit_en: 'card',
    reorder_level: 50,
    cost_per_unit: 12,
    category_ar: 'تغليف ومستلزمات الورق',
    category_en: 'Stationery',
    supplier_ar: 'مطبعة الأوراق الملكية',
    supplier_en: 'Parisian Stationery House',
  },
  {
    id: 'RAW-6',
    name_ar: 'قوالب شمع قرمزي مذهب للأختام',
    name_en: 'Royal Crimson Wax Seal Blocks',
    quantity: 45,
    unit_ar: 'قالب',
    unit_en: 'block',
    reorder_level: 12,
    cost_per_unit: 25,
    category_ar: 'أختام وشمع ملكي',
    category_en: 'Wax Seals',
    supplier_ar: 'دار الصياغة والأختام',
    supplier_en: 'Royal Seal Atelier',
  },
];

// Default recipes for bouquets in MOCK_PRODUCTS
export const DEFAULT_BOUQUET_RECIPES = {
  '1': [ // طقم سيف ذا ديت الملكي مع البوكيه واللؤلؤ (Price: 2000)
    { raw_id: 'RAW-1', quantity: 15 }, // 15 بيوني = 675
    { raw_id: 'RAW-4', quantity: 1 },  // صندوق أرز = 180
    { raw_id: 'RAW-3', quantity: 2 },  // 2 عقد لؤلؤ = 130
    { raw_id: 'RAW-2', quantity: 1 },  // وردة مفردة = 35
    { raw_id: 'RAW-7', quantity: 3 },  // 3 أمتار ساتان = 45
    { raw_id: 'RAW-5', quantity: 1 },  // بطاقة إهداء = 12
    { raw_id: 'RAW-6', quantity: 1 },  // ختم شمع = 25
  ],
  '2': [ // عروس اللؤلؤ الملكي والدانتيل الأبيض (Price: 1500)
    { raw_id: 'RAW-1', quantity: 12 }, // 12 بيوني = 540
    { raw_id: 'RAW-9', quantity: 8 },  // 8 جوري أبيض = 240
    { raw_id: 'RAW-3', quantity: 2 },  // 2 عقد لؤلؤ = 130
    { raw_id: 'RAW-7', quantity: 2 },  // 2 متر ساتان = 30
  ],
  '3': [ // سلطان الورد الإكوادوري وتتويج المجد (Price: 900)
    { raw_id: 'RAW-2', quantity: 14 }, // 14 جوري أحمر = 490
    { raw_id: 'RAW-8', quantity: 1 },  // 1 وشاح/إسكات تخرج مطرز = 35
    { raw_id: 'RAW-12', quantity: 1 }, // 1 توبر تخرج مذهب = 25
    { raw_id: 'RAW-11', quantity: 2 }, // 2 فرخ تغليف = 40
    { raw_id: 'RAW-7', quantity: 2 },  // 2 متر ساتان = 30
  ],
  '4': [ // كلاسيك روز المخملي الأحمر (Price: 850)
    { raw_id: 'RAW-2', quantity: 15 }, // 15 جوري أحمر = 525
    { raw_id: 'RAW-11', quantity: 2 }, // 2 تغليف = 40
    { raw_id: 'RAW-7', quantity: 2 },  // 2 متر ساتان = 30
  ],
  '5': [ // بوكيه زنبق الكالا ليلي والبيوني (Price: 1200)
    { raw_id: 'RAW-10', quantity: 10 }, // 10 كالا ليلي = 400
    { raw_id: 'RAW-1', quantity: 8 },   // 8 بيوني = 360
    { raw_id: 'RAW-7', quantity: 2 },   // 2 متر ساتان = 30
    { raw_id: 'RAW-11', quantity: 1 },  // 1 تغليف = 20
  ],
  '6': [ // بوكيه التخرج الملكي الأرجواني والذهبي (Price: 1100)
    { raw_id: 'RAW-9', quantity: 12 },  // 12 جوري أبيض = 360
    { raw_id: 'RAW-8', quantity: 1 },   // 1 وشاح/إسكات تخرج = 35
    { raw_id: 'RAW-12', quantity: 1 },  // 1 توبر تخرج = 25
    { raw_id: 'RAW-11', quantity: 3 },  // 3 تغليف فاخر = 60
    { raw_id: 'RAW-7', quantity: 3 },   // 3 متر ساتان = 45
  ],
  '7': [ // بوكيه الياقوت الإمبراطوري الأحمر (Price: 1350)
    { raw_id: 'RAW-2', quantity: 20 },  // 20 جوري إكوادوري أحمر = 700
    { raw_id: 'RAW-11', quantity: 3 },  // 3 تغليف = 60
    { raw_id: 'RAW-7', quantity: 3 },   // 3 متر ساتان = 45
    { raw_id: 'RAW-5', quantity: 1 },   // بطاقة = 12
    { raw_id: 'RAW-6', quantity: 1 },   // ختم شمع = 25
  ],
  '8': [ // طقم أساور مناسبات فاخر باللؤلؤ والورد (Price: 1500)
    { raw_id: 'RAW-3', quantity: 4 },   // 4 أعقاد لؤلؤ = 260
    { raw_id: 'RAW-2', quantity: 6 },   // 6 ورود حمراء = 210
    { raw_id: 'RAW-7', quantity: 4 },   // 4 متر ساتان = 60
  ],
  '9': [ // بوكيه عروس زنبق الكالا والكريستال الفاخر (Price: 1000)
    { raw_id: 'RAW-10', quantity: 12 }, // 12 كالا ليلي = 480
    { raw_id: 'RAW-3', quantity: 1 },   // 1 عقد لؤلؤ = 65
    { raw_id: 'RAW-7', quantity: 2 },   // 2 متر ساتان = 30
  ],
  '10': [ // بوكيه أميرة الربيع المتألقة (Price: 1150)
    { raw_id: 'RAW-1', quantity: 10 },  // 10 بيوني = 450
    { raw_id: 'RAW-9', quantity: 8 },   // 8 جوري أبيض = 240
    { raw_id: 'RAW-11', quantity: 2 },  // 2 تغليف = 40
    { raw_id: 'RAW-7', quantity: 2 },   // 2 ساتان = 30
  ],
};

// 1. Get raw materials inventory from localStorage, ensuring master items are present
export function getRawMaterialsInventory() {
  if (typeof localStorage === 'undefined') {
    return [...MASTER_RAW_MATERIALS];
  }
  try {
    const saved = localStorage.getItem('al_ward_raw_inventory');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure new master items like RAW-8 (sashes) and RAW-9..12 are merged if missing
        const existingIds = new Set(parsed.map((item) => item.id));
        let changed = false;
        MASTER_RAW_MATERIALS.forEach((master) => {
          if (!existingIds.has(master.id)) {
            parsed.push({ ...master });
            changed = true;
          }
        });
        if (changed) {
          localStorage.setItem('al_ward_raw_inventory', JSON.stringify(parsed));
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading raw inventory from localStorage:', e);
  }

  // Fallback to initial master materials
  try {
    localStorage.setItem('al_ward_raw_inventory', JSON.stringify(MASTER_RAW_MATERIALS));
  } catch {
    // ignore
  }
  return [...MASTER_RAW_MATERIALS];
}

// 2. Save updated raw materials inventory and notify listeners
export function saveRawMaterialsInventory(updatedInventory) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem('al_ward_raw_inventory', JSON.stringify(updatedInventory));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('al_ward_raw_inventory_updated', { detail: updatedInventory }));
    }
  } catch (e) {
    console.error('Error saving raw inventory:', e);
  }
}

// 3. Get all bouquet recipes (customized or default)
export function getBouquetRecipes() {
  if (typeof localStorage === 'undefined') {
    return { ...DEFAULT_BOUQUET_RECIPES };
  }
  try {
    const saved = localStorage.getItem('al_ward_bouquet_recipes');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed === 'object' && parsed !== null) {
        return { ...DEFAULT_BOUQUET_RECIPES, ...parsed };
      }
    }
  } catch (e) {
    console.error('Error loading bouquet recipes:', e);
  }
  return { ...DEFAULT_BOUQUET_RECIPES };
}

// 4. Get recipe for a single bouquet
export function getBouquetRecipe(bouquetId) {
  const recipes = getBouquetRecipes();
  return recipes[bouquetId] || DEFAULT_BOUQUET_RECIPES[bouquetId] || [
    { raw_id: 'RAW-2', quantity: 10 },
    { raw_id: 'RAW-11', quantity: 2 },
    { raw_id: 'RAW-7', quantity: 2 },
  ];
}

// 5. Save a bouquet's recipe and updated price
export function saveBouquetRecipe(bouquetId, recipeData) {
  if (typeof localStorage === 'undefined') return false;
  try {
    const current = getBouquetRecipes();
    current[bouquetId] = recipeData.recipe;
    localStorage.setItem('al_ward_bouquet_recipes', JSON.stringify(current));

    // Also update products overrides if price was changed
    const overrides = JSON.parse(localStorage.getItem('al_ward_products_overrides') || '{}');
    overrides[bouquetId] = {
      ...(overrides[bouquetId] || {}),
      price: recipeData.price,
      sale_price: recipeData.sale_price,
      custom_materials_count: recipeData.recipe.length,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem('al_ward_products_overrides', JSON.stringify(overrides));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('al_ward_bouquet_recipes_updated', {
        detail: { bouquetId, recipeData },
      }));
    }
    return true;
  } catch (e) {
    console.error('Error saving bouquet recipe:', e);
    return false;
  }
}

// 6. Calculate detailed financials for a bouquet recipe
export function calculateBouquetFinancials(recipe = [], sellingPrice = 0, inventory = null) {
  const rawList = inventory || getRawMaterialsInventory();
  const rawMap = new Map(rawList.map((m) => [m.id, m]));

  let totalMaterialCost = 0;
  const itemsBreakdown = [];

  recipe.forEach((item) => {
    const raw = rawMap.get(item.raw_id);
    const costPerUnit = raw ? Number(raw.cost_per_unit) : Number(item.cost_per_unit || 0);
    const quantity = Number(item.quantity) || 0;
    const totalCost = quantity * costPerUnit;

    totalMaterialCost += totalCost;

    itemsBreakdown.push({
      raw_id: item.raw_id,
      name_ar: raw ? raw.name_ar : (item.name_ar || 'خامة إضافية'),
      name_en: raw ? raw.name_en : (item.name_en || 'Raw Material'),
      unit_ar: raw ? raw.unit_ar : (item.unit_ar || 'وحدة'),
      unit_en: raw ? raw.unit_en : (item.unit_en || 'unit'),
      cost_per_unit: costPerUnit,
      quantity,
      total_cost: totalCost,
      available_stock: raw ? raw.quantity : 0,
      is_low_stock: raw ? raw.quantity <= raw.reorder_level : false,
    });
  });

  const priceNum = Number(sellingPrice) || 0;
  const netProfit = priceNum - totalMaterialCost;
  const marginPercent = priceNum > 0 ? (netProfit / priceNum) * 100 : 0;

  let marginStatus = 'excellent';
  if (marginPercent < 0) marginStatus = 'loss';
  else if (marginPercent < 20) marginStatus = 'low';
  else if (marginPercent < 35) marginStatus = 'good';

  return {
    total_material_cost: Math.round(totalMaterialCost * 100) / 100,
    selling_price: priceNum,
    net_profit: Math.round(netProfit * 100) / 100,
    margin_percent: Math.round(marginPercent * 10) / 10,
    margin_status: marginStatus,
    items_breakdown: itemsBreakdown,
  };
}

// 7. Calculate financials for an order based on items and their bouquet recipes
export function calculateOrderFinancials(order, inventory = null) {
  const rawList = inventory || getRawMaterialsInventory();
  const rawMap = new Map(rawList.map((m) => [m.id, m]));
  const recipes = getBouquetRecipes();

  let orderMaterialCost = 0;
  const materialsDeducted = [];

  const items = order.items || [];
  items.forEach((item) => {
    const bouquetId = String(item.id);
    const recipe = recipes[bouquetId] || DEFAULT_BOUQUET_RECIPES[bouquetId] || [
      { raw_id: 'RAW-2', quantity: 10 },
      { raw_id: 'RAW-11', quantity: 2 },
      { raw_id: 'RAW-7', quantity: 2 },
    ];
    const orderItemQty = Number(item.quantity) || 1;

    recipe.forEach((rec) => {
      const raw = rawMap.get(rec.raw_id);
      const costPerUnit = raw ? Number(raw.cost_per_unit) : 30;
      const totalUsedQty = (Number(rec.quantity) || 0) * orderItemQty;
      const totalItemCost = totalUsedQty * costPerUnit;

      orderMaterialCost += totalItemCost;

      materialsDeducted.push({
        bouquet_name: item.name || `بوكيه #${bouquetId}`,
        raw_id: rec.raw_id,
        raw_name_ar: raw ? raw.name_ar : 'خامة',
        raw_name_en: raw ? raw.name_en : 'Material',
        unit_ar: raw ? raw.unit_ar : 'وحدة',
        quantity: totalUsedQty,
        cost_per_unit: costPerUnit,
        total_cost: totalItemCost,
      });
    });
  });

  const orderTotal = Number(order.total_price) || 0;
  const netProfit = orderTotal - orderMaterialCost;
  const marginPercent = orderTotal > 0 ? (netProfit / orderTotal) * 100 : 0;

  return {
    order_id: order.id,
    total_revenue: orderTotal,
    total_material_cost: Math.round(orderMaterialCost * 100) / 100,
    net_profit: Math.round(netProfit * 100) / 100,
    margin_percent: Math.round(marginPercent * 10) / 10,
    materials_deducted: materialsDeducted,
  };
}

// 8. Deduct raw materials from inventory for an order (safe from duplicate deductions)
export function deductMaterialsForOrder(order) {
  if (!order || !order.items || order.is_inventory_deducted) {
    return { success: false, reason: 'Already deducted or invalid order' };
  }

  const inventory = getRawMaterialsInventory();
  const rawMap = new Map(inventory.map((m) => [m.id, m]));
  const recipes = getBouquetRecipes();

  const deductions = [];
  const lowStockWarnings = [];

  order.items.forEach((item) => {
    const bouquetId = String(item.id);
    const recipe = recipes[bouquetId] || DEFAULT_BOUQUET_RECIPES[bouquetId] || [
      { raw_id: 'RAW-2', quantity: 10 },
      { raw_id: 'RAW-11', quantity: 2 },
      { raw_id: 'RAW-7', quantity: 2 },
    ];
    const orderQty = Number(item.quantity) || 1;

    recipe.forEach((rec) => {
      const raw = rawMap.get(rec.raw_id);
      if (raw) {
        const qtyToDeduct = (Number(rec.quantity) || 0) * orderQty;
        raw.quantity = Math.max(0, raw.quantity - qtyToDeduct);

        deductions.push({
          raw_id: raw.id,
          name_ar: raw.name_ar,
          unit_ar: raw.unit_ar,
          deducted: qtyToDeduct,
          remaining: raw.quantity,
          cost_per_unit: raw.cost_per_unit,
          total_cost: qtyToDeduct * raw.cost_per_unit,
        });

        if (raw.quantity <= raw.reorder_level) {
          lowStockWarnings.push({
            id: raw.id,
            name_ar: raw.name_ar,
            remaining: raw.quantity,
            reorder_level: raw.reorder_level,
          });
        }
      }
    });
  });

  // Save updated inventory
  saveRawMaterialsInventory(inventory);

  // Calculate order financials and mark order as deducted
  const financials = calculateOrderFinancials(order, inventory);
  order.is_inventory_deducted = true;
  order.financials = financials;
  order.deducted_at = new Date().toISOString();

  // Update order in localStorage
  try {
    const local = JSON.parse(localStorage.getItem('al_ward_orders') || '[]');
    const updated = local.map((o) => (o.id === order.id ? { ...o, ...order } : o));
    localStorage.setItem('al_ward_orders', JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving deducted order to localStorage:', e);
  }

  return {
    success: true,
    financials,
    deductions,
    lowStockWarnings,
    updatedInventory: inventory,
  };
}

// 9. Calculate overall analytics for orders (Total Revenue, Material Costs, Net Profit, Margin)
export function calculateOrdersAnalytics(orders = []) {
  let totalRevenue = 0;
  let totalMaterialCost = 0;

  orders.forEach((ord) => {
    const financials = ord.financials || calculateOrderFinancials(ord);
    totalRevenue += Number(financials.total_revenue) || 0;
    totalMaterialCost += Number(financials.total_material_cost) || 0;
  });

  const totalNetProfit = totalRevenue - totalMaterialCost;
  const avgMargin = totalRevenue > 0 ? (totalNetProfit / totalRevenue) * 100 : 0;

  return {
    total_revenue: Math.round(totalRevenue),
    total_material_cost: Math.round(totalMaterialCost),
    total_net_profit: Math.round(totalNetProfit),
    avg_margin: Math.round(avgMargin * 10) / 10,
    total_orders: orders.length,
  };
}
