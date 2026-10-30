export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="sticky h-15 bottom-0 z-50 border-t border-(--line) bg-(--header-bg) w-full text-(--sea-ink-soft)">
      <div className="items-center flex flex-col justify-between gap-4 text-center sm:flex-row m-5">
        <p className="text-sm">&copy; {year} Totaldata All rights reserved.</p>
        <p className="island-kicker ">Built with TanStack Start</p>
      </div>
    </footer>
  );
}
