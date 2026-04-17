import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { storefrontService } from "@/core/storefront/storefront.service";
import HubDashboard from "@/components/buyer/HubDashboard";
import { CartProvider } from "@/components/buyer/CartContext";
import { AuthDrawerProvider } from "@/components/buyer/BuyerAuthContext";
import { BuyerAuthDrawer } from "@/components/buyer/BuyerAuthDrawer";

export const dynamic = "force-dynamic";

type BuyerHubUser = {
  id: string;
  name: string;
  email: string;
} | null;

type BuyerHubOrder = {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: Date;
  business: {
    name: string;
  };
  items: {
    id: string;
    quantity: number;
    product: {
      name: string;
    };
  }[];
};

type BuyerHubStore = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  city: string | null;
  country: string | null;
};

async function getBuyerSessionData() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      sessionUser: null,
      orders: [] as BuyerHubOrder[],
    };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  const orders = await prisma.order.findMany({
    where: { buyerId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      business: {
        select: {
          name: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const sessionUser: BuyerHubUser = {
    id: user.id,
    name: dbUser?.name || user.user_metadata?.name || "Cliente",
    email: dbUser?.email || user.email || "",
  };

  const mappedOrders: BuyerHubOrder[] = (orders as any[]).map((order: any) => ({
    id: order.id,
    status: order.status,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt,
    business: {
      name: order.business.name,
    },
    items: (order.items as any[]).map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        name: item.product.name,
      },
    })),
  }));

  return {
    sessionUser,
    orders: mappedOrders,
  };
}

async function getAvailableStores() {
  const resultStores = await storefrontService.getAllStores();

  if (!resultStores.success || !resultStores.data) {
    return [] as BuyerHubStore[];
  }

  return resultStores.data.map((store) => ({
    id: store.id || "",
    name: store.name || "",
    slug: store.slug || "",
    description: store.description || null,
    city: store.city || null,
    country: store.country || null,
  }));
}

export default async function BuyerProfileHubPage() {
  const [{ sessionUser, orders }, stores] = await Promise.all([
    getBuyerSessionData(),
    getAvailableStores(),
  ]);

  return (
    <AuthDrawerProvider>
      <CartProvider>
        <BuyerAuthDrawer />

        <HubDashboard
          user={sessionUser}
          orders={orders}
          stores={stores}
        />
      </CartProvider>
    </AuthDrawerProvider>
  );
}