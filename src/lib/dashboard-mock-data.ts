export const dashboardMetrics = {
  totalSales: 4250.80,
  ordersToday: 84,
  averageTicket: 50.60,
  prepTimeAvg: "14m",
  salesTrend: "+12.5%",
  ordersTrend: "+5.2%"
};

export const salesChartData = [
  { time: "10:00", sales: 120, orders: 4 },
  { time: "11:00", sales: 250, orders: 8 },
  { time: "12:00", sales: 850, orders: 20 },
  { time: "13:00", sales: 1200, orders: 25 },
  { time: "14:00", sales: 900, orders: 18 },
  { time: "15:00", sales: 300, orders: 9 },
  { time: "16:00", sales: 450, orders: 12 },
];

export const activeOrders = [
  { id: "#2380", customer: "Andrea G.", status: "Nuevo", timeElapsed: "2m", total: 45.00 },
  { id: "#2379", customer: "Martín P.", status: "En preparación", timeElapsed: "8m", total: 110.50 },
  { id: "#2378", customer: "Laura V.", status: "En preparación", timeElapsed: "12m", total: 25.00 },
  { id: "#2377", customer: "Carlos R.", status: "Listo", timeElapsed: "15m", total: 85.00 },
];

export const topProducts = [
  { id: 1, name: "Burger Doble Trufa", sales: 34, revenue: 850, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop" },
  { id: 2, name: "Papas Rústicas", sales: 28, revenue: 140, image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=200&auto=format&fit=crop" },
  { id: 3, name: "Milkshake Vainilla", sales: 15, revenue: 90, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=200&auto=format&fit=crop" },
];

export const operationsSummary = {
  completed: 145,
  pending: 12,
  canceled: 3,
  stockAlerts: 2
};

export const recentActivity = [
  { id: 1, action: "Pedido #2377 marcado como Listo", time: "Hace 2 min", type: "order" },
  { id: 2, action: "Stock agotado: Pan Brioche", time: "Hace 15 min", type: "alert" },
  { id: 3, action: "Pedido #2360 entregado exitosamente", time: "Hace 1 hora", type: "success" },
];
