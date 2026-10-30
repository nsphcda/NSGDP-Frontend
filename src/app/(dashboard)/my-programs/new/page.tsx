import { redirect } from "next/navigation";

// Programmes are created by the agency in the admin portal and assigned to
// development partners; partners update progress and upload reports.
export default function NewProgrammePage() {
  redirect("/my-programs");
}
