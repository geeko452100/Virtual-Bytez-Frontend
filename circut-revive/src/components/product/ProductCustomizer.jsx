import { formatPrice } from '../../utils/pricing'

export default function ProductCustomizer({
  product,
  selections,
  pricing,
  onSelectChange,
  onCheckboxToggle,
  onTextChange,
}) {
  return (
    <section className="panel p-6" aria-labelledby="customizer-heading">
      <h2 id="customizer-heading">Build yours</h2>
      <p className="mb-5 text-text-muted">
        Every unit is hand-checked. Options below adjust price in real time.
      </p>

      <div className="flex flex-col gap-5">
        {product.customizationOptions.map((option) => (
          <fieldset key={option.id} className="m-0 rounded-lg border border-border p-4">
            <legend className="px-1.5 font-semibold text-text-h">{option.label}</legend>

            {option.type === 'select' && (
              <div className="mt-3 flex flex-col gap-2">
                {option.choices.map((choice) => (
                  <label
                    key={choice.value}
                    className="flex items-center gap-2.5 rounded-md border border-transparent px-2.5 py-2 has-[:checked]:border-accent-border has-[:checked]:bg-accent-bg"
                  >
                    <input
                      type="radio"
                      name={option.id}
                      value={choice.value}
                      checked={selections[option.id] === choice.value}
                      onChange={() => onSelectChange(option.id, choice.value)}
                    />
                    <span className="flex-1">{choice.label}</span>
                    {choice.priceModifier > 0 && (
                      <span className="font-mono text-sm text-accent">+{formatPrice(choice.priceModifier)}</span>
                    )}
                  </label>
                ))}
              </div>
            )}

            {option.type === 'checkbox' && (
              <div className="mt-3 flex flex-col gap-2">
                {option.choices.map((choice) => (
                  <label
                    key={choice.value}
                    className="flex items-center gap-2.5 rounded-md border border-transparent px-2.5 py-2 has-[:checked]:border-accent-border has-[:checked]:bg-accent-bg"
                  >
                    <input
                      type="checkbox"
                      checked={(selections[option.id] ?? []).includes(choice.value)}
                      onChange={() => onCheckboxToggle(option.id, choice.value)}
                    />
                    <span className="flex-1">{choice.label}</span>
                    {choice.priceModifier > 0 && (
                      <span className="font-mono text-sm text-accent">+{formatPrice(choice.priceModifier)}</span>
                    )}
                  </label>
                ))}
              </div>
            )}

            {option.type === 'text' && (
              <div className="mt-3">
                <input
                  type="text"
                  className="form-input w-full"
                  value={selections[option.id] ?? ''}
                  placeholder={option.placeholder}
                  maxLength={option.maxLength}
                  onChange={(e) => onTextChange(option.id, e.target.value)}
                />
                {option.priceModifier > 0 && (
                  <span className="mt-2 block font-mono text-sm text-accent">
                    +{formatPrice(option.priceModifier)} when filled
                  </span>
                )}
              </div>
            )}
          </fieldset>
        ))}
      </div>

      <aside className="mt-6 border-t border-border pt-4">
        <div className="flex justify-between py-1.5 text-[0.95rem]">
          <span>Base price</span>
          <span>{formatPrice(pricing.basePrice)}</span>
        </div>
        {pricing.breakdown.map((line) => (
          <div key={line.label} className="flex justify-between py-1.5 text-sm text-text-muted">
            <span>{line.label}</span>
            <span>+{formatPrice(line.amount)}</span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t border-dashed border-border pt-3 font-mono text-lg font-bold text-accent">
          <span>Your total</span>
          <span>{formatPrice(pricing.total)}</span>
        </div>
      </aside>
    </section>
  )
}
