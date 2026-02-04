import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Decoded JWT token payload structure
 */
export interface DecodedToken {
  userId: string;
  email: string;
  role?: string;
  organizations?: Array<{
    organizationId: string;
    role: string; // e.g., "org_admin", "member", "org_admin,member"
  }>;
  iat?: number;
  exp?: number;
}

/**
 * User data structure from sessionStorage (includes full organization details)
 */
interface SessionUserData {
  message: string;
  token: string;
  user: {
    _id: string;
    email: string;
    surname: string;
    firstName: string;
    organizations?: Array<{
      organizationId: string;
      organizationName: string;
      status: string;
      role: string; // e.g., "org_admin,member"
      balances: {
        savings: number;
        contribution: number;
        loanBalance: number;
      };
    }>;
  };
}

/**
 * Get and decode the authentication token from cookies
 * @returns Decoded token or null if not found/invalid
 */
export async function getDecodedToken(): Promise<DecodedToken | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("myUserToken")?.value;

    if (!token) {
      console.log("❌ No token found in cookies");
      return null;
    }

    // Decode JWT token (assuming it's a standard JWT)
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload)) as DecodedToken;

    // 🐛 DEBUG: Log the entire decoded token structure
    console.log("🔑 Decoded Token Structure:", JSON.stringify(decoded, null, 2));
    console.log("🔑 Token has organizations?", !!decoded.organizations);
    console.log("🔑 Organizations count:", decoded.organizations?.length || 0);

    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

/**
 * Get the raw token string from cookies
 */
export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("myUserToken")?.value || null;
}

/**
 * Get user organizations from sessionStorage (server-side compatible)
 * This reads the full user data stored during login
 */
function getUserOrganizationsFromSession(): Array<{ organizationId: string; role: string }> {
  // Server-side: we can't access sessionStorage directly
  // The organizations must be included in the JWT token OR passed via headers
  // For now, return empty array - this will be populated client-side

  // Note: In server components/API routes, we rely on the JWT token
  // In client components, AuthContext has access to sessionStorage
  return [];
}

/**
 * Check if user has a specific role in an organization
 * @param orgId - Organization ID to check
 * @param requiredRole - Role to verify (e.g., "org_admin")
 * @returns true if user has the required role
 */
export async function hasOrgRole(orgId: string, requiredRole: string): Promise<boolean> {
  const decoded = await getDecodedToken();

  console.log("🔍 hasOrgRole called:", { orgId, requiredRole });

  if (!decoded || !decoded.organizations) {
    console.log("❌ No decoded token or organizations");
    return false;
  }

  console.log("📋 All user organizations:", decoded.organizations);

  const org = decoded.organizations.find((o) => o.organizationId === orgId);

  if (!org) {
    console.log("❌ Organization not found:", orgId);
    console.log(
      "Available org IDs:",
      decoded.organizations.map((o) => o.organizationId),
    );
    return false;
  }

  console.log("✅ Found organization:", { orgId, rawRole: org.role });

  // Handle comma-separated roles like "org_admin,member"
  const roles = org.role.split(",").map((r) => r.trim().toLowerCase());
  const normalizedRequiredRole = requiredRole.trim().toLowerCase();

  console.log("🔍 Role check:", {
    rawRole: org.role,
    parsedRoles: roles,
    requiredRole: normalizedRequiredRole,
    hasRole: roles.includes(normalizedRequiredRole),
  });

  return roles.includes(normalizedRequiredRole);
}

/**
 * Check if user belongs to an organization (any role)
 * @param orgId - Organization ID to check
 * @returns true if user is a member of the organization
 */
export async function isMemberOfOrg(orgId: string): Promise<boolean> {
  const decoded = await getDecodedToken();

  if (!decoded || !decoded.organizations) {
    return false;
  }

  return decoded.organizations.some((o) => o.organizationId === orgId);
}

/**
 * Middleware-like function to validate org admin access
 * Returns error response if validation fails, null if successful
 * @param orgId - Organization ID to validate access for
 */
export async function requireOrgAdmin(orgId: string | null): Promise<NextResponse | null> {
  // Validate orgId parameter
  if (!orgId) {
    return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
  }

  // Check authentication
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  // Get decoded token for debugging
  const decoded = await getDecodedToken();
  console.log("🔐 requireOrgAdmin check:", {
    requestedOrgId: orgId,
    userOrganizations: decoded?.organizations?.map((o) => ({
      id: o.organizationId,
      role: o.role,
    })),
  });

  // Check authorization
  const isAdmin = await hasOrgRole(orgId, "org_admin");
  console.log("🔐 hasOrgRole result:", {
    orgId,
    isAdmin,
    requiredRole: "org_admin",
  });

  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden: org_admin role required for this organization" }, { status: 403 });
  }

  return null; // Validation passed
}

/**
 * Middleware-like function to validate organization membership
 * Returns error response if validation fails, null if successful
 * @param orgId - Organization ID to validate access for (optional, checks any org membership if not provided)
 */
export async function requireOrgMembership(orgId?: string | null): Promise<NextResponse | null> {
  // Check authentication
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  // If orgId is provided, check membership in that specific org
  if (orgId) {
    const isMember = await isMemberOfOrg(orgId);
    if (!isMember) {
      return NextResponse.json({ error: "Forbidden: You are not a member of this organization" }, { status: 403 });
    }
  }

  return null; // Validation passed
}

/**
 * Require basic authentication (just checks if token exists)
 */
export async function requireAuth(): Promise<NextResponse | null> {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  return null; // Validation passed
}

/**
 * Get user's organizations from token
 */
export async function getUserOrganizations(): Promise<
  Array<{
    organizationId: string;
    role: string;
  }>
> {
  const decoded = await getDecodedToken();
  return decoded?.organizations || [];
}

/**
 * Get user's admin organizations (where they have org_admin role)
 */
export async function getUserAdminOrganizations(): Promise<string[]> {
  const orgs = await getUserOrganizations();
  return orgs.filter((org) => org.role.includes("org_admin")).map((org) => org.organizationId);
}

/**
 * Check if user is a super admin
 */
export async function isSuperAdmin(): Promise<boolean> {
  const decoded = await getDecodedToken();
  return decoded?.role === "superAdmin";
}
