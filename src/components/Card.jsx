export const Card = ({ title, children, className = "", headerAction = null }) => (
    <div className={"bg-brand-cream rounded-xl shadow-lg overflow-hidden border border-brand-midblue/30 " + className}>
        {title && (
            <div className="px-4 py-3 bg-brand-darkblue border-b border-brand-midblue flex justify-between items-center">
                <h3 className="text-sm font-bold text-brand-cream uppercase tracking-wide">{title}</h3>
                {headerAction}
            </div>
        )}
        <div className="p-4">{children}</div>
    </div>
)
