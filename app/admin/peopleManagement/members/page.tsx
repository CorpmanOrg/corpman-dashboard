import MembersPage from "@/pages/PeopleManagement/Members";

export default function Members() {
  return <MembersPage />;
}


// Example usage in Members/index.tsx
// import { useMutation } from "@tanstack/react-query";
// import { approveOrRejectMembersFn } from "@/utils/ApiFactory/member";

// const { mutate: approveOrRejectMembers, isLoading } = useMutation({
//   mutationFn: approveOrRejectMembersFn,
//   onSuccess: (data) => {
//     // Show success toast, refetch members, etc.
//   },
//   onError: (error: any) => {
//     // Show error toast
//   },
// });

// // To approve/reject:
// approveOrRejectMembers({
//   updates: [
//     { memberId: "685471c8cc68006fd99d0621", status: "active" },
//     { memberId: "685471c3cc68006fd99d061c", status: "rejected" },
//   ],
// });