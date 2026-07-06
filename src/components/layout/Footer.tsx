export function Footer() {
  return (
    <footer className="border-t border-[var(--color-aco)] mt-16">
      <div className="px-6 py-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[var(--color-cinza-medio)]">
        <span className="display text-sm">BELINI <span className="text-[var(--color-cautela)]">VEÍCULOS</span></span>
        <span className="font-specs text-xs">© {new Date().getFullYear()} · JI-PARANÁ/RO</span>
      </div>
    </footer>
  )
}
