export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="fixed bottom-0  mt-20 border-t border-(--line) px-4 pb-14 pt-10 text-(--sea-ink-soft)">
      <div className="items-center flex flex-col gap-4 text-center sm:flex-row ">
        <p className="m-0 text-sm">
          &copy; {year} Totaldata All rights reserved.
        </p>
        <p className="island-kicker m-0">Built with TanStack Start</p>
      </div>
    </footer>
  )
}
