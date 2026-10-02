import Link from "next/link";
import { NotFoundContent } from "@/components/NotFoundContent";
import { Logo } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-ink/10">
        <div className="shell flex h-20 items-center justify-center">
          <Link href="/" aria-label="Re7an — home">
            <Logo />
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <NotFoundContent />
      </main>
    </div>
  );
}
