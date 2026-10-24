export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 border-t border-(--line) w-full p-4 text-(--sea-ink-soft)">
      <div className="items-center flex flex-col justify-between gap-4 text-center sm:flex-row ">
        <p className="ml-20 text-sm">&copy; {year} Totaldata All rights reserved.</p>
        <p className="island-kicker mr-20">Built with TanStack Start</p>
      </div>
    </footer>
  );
}
