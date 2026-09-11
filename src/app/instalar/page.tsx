import { redirect } from "next/navigation";

/** Ya no hay guía en pantalla; el PWA se usa desde la IP directamente. */
export default function InstalarPage() {
  redirect("/login");
}
