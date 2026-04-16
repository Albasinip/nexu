import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { ServiceResult } from "@/types";
import { LoginDTO, SignupDTO } from "./auth.schema";

/**
 * ==============================
 * Types
 * ==============================
 */

type AuthUserRole = "SELLER" | "BUYER";

type LoginResult = {
  userId: string;
};

type SignupResult = {
  userId: string;
  requiresEmailConfirmation: boolean;
};

/**
 * ==============================
 * Helpers
 * ==============================
 */

function ok<T>(data: T): ServiceResult<T> {
  return { success: true, data };
}

function fail<T = never>(error: string, status?: number): ServiceResult<T> {
  return { success: false, error, ...(status ? { status } : {}) };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Error interno del servidor";
}

function validateSupabaseConfig(): ServiceResult<any> | null {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return fail("Error de configuración del servidor");
  }
  return null;
}

async function getSupabaseClient() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

function generateSlugFromEmail(email: string): string {
  const base = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 20);

  const suffix = Math.floor(Math.random() * 1000);
  return `${base || "negocio"}-${suffix}`;
}

async function syncUser(params: {
  id: string;
  email: string;
  name: string;
  role: AuthUserRole;
}) {
  const { id, email, name, role } = params;

  return prisma.user.upsert({
    where: { id },
    update: { name },
    create: {
      id,
      email,
      name,
      role,
    },
  });
}

async function createBusiness(params: {
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  businessName?: string;
  city?: string;
}) {
  const { ownerId, ownerName, ownerEmail, businessName, city } = params;
  
  const finalName = businessName || `${ownerName}'s Business`;
  const baseSlug = finalName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  const suffix = Math.floor(Math.random() * 1000);
  const slug = `${baseSlug || "negocio"}-${suffix}`;

  return prisma.business.create({
    data: {
      name: finalName,
      slug: slug,
      city: city || null,
      ownerId,
    },
  });
}

/**
 * ==============================
 * Core Auth Flow
 * ==============================
 */

async function handleSignup(
  data: SignupDTO,
  role: AuthUserRole
): Promise<ServiceResult<SignupResult>> {
  const configError = validateSupabaseConfig();
  if (configError) return configError;

  const supabase = await getSupabaseClient();

  const { email, password, name } = data;

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role },
    },
  });

  if (error) return fail(error.message, error.status);

  const user = authData.user;
  if (!user) return fail("No se pudo obtener el usuario desde el proveedor");

  try {
    await syncUser({
      id: user.id,
      email: user.email!,
      name,
      role,
    });

    if (role === "SELLER") {
      await createBusiness({
        ownerId: user.id,
        ownerName: name,
        ownerEmail: user.email!,
        businessName: data.businessName,
        city: data.city,
      });
    }
  } catch (error) {
    console.error("=== [START DEBUG: ERROR AL SINCRONIZAR] ===");
    console.error("1. [Supabase User]:", { id: user.id, email: user.email, meta: user.user_metadata });
    console.error("2. [Prisma User]: Intento UPSERT", { id: user.id, email: user.email, name, role });
    console.error("3. [Prisma Tenant]: Intento CREATE", { ownerId: user.id, businessName: data.businessName || name });
    console.error("4. [Error Real Original]:", error);
    console.error("==========================================");
    return fail("Error al sincronizar datos con la base de datos");
  }

  const requiresEmailConfirmation = !authData.session;

  return ok({
    userId: user.id,
    requiresEmailConfirmation,
  });
}

/**
 * ==============================
 * Auth Service
 * ==============================
 */

export const authService = {
  async login(data: LoginDTO): Promise<ServiceResult<LoginResult>> {
    const configError = validateSupabaseConfig();
    if (configError) return configError;

    const supabase = await getSupabaseClient();

    const { email, password } = data;

    const { data: authData, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) return fail(error.message, error.status);

    const user = authData.user;
    if (!user) return fail("No se pudo obtener el usuario");

    return ok({ userId: user.id });
  },

  async signup(data: SignupDTO): Promise<ServiceResult<SignupResult>> {
    return handleSignup(data, "SELLER");
  },

  async customerSignup(
    data: SignupDTO
  ): Promise<ServiceResult<SignupResult>> {
    return handleSignup(data, "BUYER");
  },

  async logout(): Promise<void> {
    const supabase = await getSupabaseClient();
    await supabase.auth.signOut();
  },
};