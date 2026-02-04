# Auth-Helpers Temporarily Disabled

## Summary

All API routes have been updated to **temporarily disable** auth-helper validations while waiting for the backend to add `organizations` array to the JWT token.

## What Changed

- ⏸️ **Commented out** all `requireOrgAdmin()` and `requireAuth()` checks
- ✅ **Added basic authentication** - routes only verify that a token exists
- 📝 **Added TODO comments** - clear markers for when to re-enable

## Routes Updated (20 total)

### Admin Records

1. ✅ `/api/admin/records/orgBalance` - orgBalance
2. ✅ `/api/admin/records/cooperativeSummary` - cooperativeSummary
3. ✅ `/api/admin/records/organizationStatement` - organizationStatement
4. ✅ `/api/admin/records/transactionHistory` - transactionHistory
5. ✅ `/api/admin/records/memberProfile` - memberProfile
6. ✅ `/api/admin/records/history` - history
7. ✅ `/api/admin/records/memberStatement` - memberStatement
8. ✅ `/api/admin/records/balance` - balance
9. ✅ `/api/admin/records/loanEligibility` - loanEligibility

### Admin Financials

10. ✅ `/api/admin/financials/adminTransaction` - adminTransaction
11. ✅ `/api/admin/financials/newPendingPayments` - newPendingPayments
12. ✅ `/api/admin/financials/transaction` - transaction
13. ✅ `/api/admin/financials/pendingPayments` - pendingPayments

### Admin People

14. ✅ `/api/admin/people/assignRole` - assignRole
15. ✅ `/api/admin/people/getMemberById` - getMemberById
16. ✅ `/api/admin/createMembers` - createMembers

### Admin Settings

17. ✅ `/api/admin/settings/updateSettings` - updateSettings
18. ✅ `/api/admin/settings/getSettings` - getSettings

### Other

19. ✅ `/api/fetchMembers` - fetchMembers
20. ✅ `/api/approveMember` - approveMember

## Current Behavior

- ✅ Routes check if user has a valid authentication token
- ✅ Routes pass token to backend API
- ⚠️ Routes DO NOT check if user has `org_admin` role
- ⚠️ Backend API is responsible for authorization

## How to Re-Enable Auth-Helpers

Once your backend developer adds `organizations` to the JWT token:

### Step 1: Update JWT Structure

Backend should create tokens like this:

```javascript
const token = jwt.sign(
  {
    userId: user._id,
    email: user.email,
    organizations: user.organizations.map((org) => ({
      organizationId: org.organizationId,
      role: org.role, // e.g., "org_admin,member"
    })),
  },
  SECRET_KEY,
);
```

### Step 2: Verify Token Structure

Check that `/api/userAuth` returns:

```json
{
  "userId": "...",
  "email": "...",
  "organizations": [
    {
      "organizationId": "695adba05b135b3d1b7b002e",
      "role": "org_admin,member"
    }
  ]
}
```

### Step 3: Uncomment Auth-Helper Validations

Search for: `⏸️ TEMPORARILY DISABLED` in all route files and:

1. Uncomment the auth-helper validation code
2. Remove the basic auth check
3. Remove the TODO comment

Example:

```typescript
// BEFORE (current state)
// ⏸️ TEMPORARILY DISABLED: Auth-helper validation
// const authError = await requireOrgAdmin(orgId);
// if (authError) {
//   return authError;
// }

const cookieStore = await cookies();
const token = cookieStore.get("myUserToken")?.value;
if (!token) {
  return NextResponse.json({ error: "Authentication required" }, { status: 401 });
}

// AFTER (when re-enabled)
const authError = await requireOrgAdmin(orgId);
if (authError) {
  return authError;
}

const token = await getToken();
```

## Testing Checklist

Once re-enabled, test:

- [ ] Admin can access admin-only endpoints
- [ ] Regular members get 403 when accessing admin endpoints
- [ ] Users with `org_admin,member` role work correctly
- [ ] orgId validation works (can't access other orgs)
- [ ] Logout clears localStorage properly

## Notes

- All auth-helper code is preserved and commented out
- Basic token checking ensures users must be logged in
- Backend API still enforces authorization (as backup)
- This is a temporary measure until JWT structure is updated

---

**Created**: January 23, 2026  
**Status**: ⏸️ Auth-Helpers Disabled  
**Next Step**: Wait for backend developer to add organizations to JWT
