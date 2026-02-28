export default function Footer() {
  return (
    <footer className="border-t border-light-4 dark:border-dark-1">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-3 dark:text-gray-2">
        © {new Date().getFullYear()} BAUN YÖS •
      </div>
    </footer>
  );
}