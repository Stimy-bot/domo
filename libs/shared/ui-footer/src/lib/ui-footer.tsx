const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "X", href: "https://x.com" },
  { label: "Instagram", href: "https://www.instagram.com" },
];


function UiFooter() {
 return (
    <footer className="fixed inset-x-0 bottom-0 p-4 text-sm text-center text-dark-light bg-dark-hard">
      <p className="pb-4 text-center">
        Copyright &copy; {new Date().getFullYear()}&nbsp;Totaldata All Rights Reserved
      </p>
      <div className="flex justify-center gap-4">
        {socialLinks.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-white"
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}

export { UiFooter };
