import type { Product } from "@/lib/types";
import { saveProductAction } from "@/app/admin/actions";
import { PdfUploadZone } from "./PdfUploadZone";

export default function ProductForm({ product }: { product?: Product }) {
  const priceMajor = product ? (product.price / 100).toFixed(2) : "";
  return (
    <form action={saveProductAction} encType="multipart/form-data" className="space-y-6" data-testid="product-form">
      {product && <input type="hidden" name="id" value={product.id} />}

      <Field label="Title" name="title" defaultValue={product?.title} required testid="pf-title" />
      <Field label="Slug (optional — derived from title)" name="slug" defaultValue={product?.slug} testid="pf-slug" />
      <Field label="Subtitle" name="subtitle" defaultValue={product?.subtitle} testid="pf-subtitle" />
      <Field label="Collection" name="collection" defaultValue={product?.collection || "The Collections"} />

      <label className="block text-sm">
        <span className="mb-2 block text-stone">Description</span>
        <textarea
          name="description"
          rows={5}
          defaultValue={product?.description}
          className="w-full border border-line bg-paper px-3 py-2 outline-none focus:border-brass"
        />
      </label>

      <div className="grid gap-6 sm:grid-cols-3">
        <Field label="Price (AED)" name="price" type="number" step="0.01" defaultValue={priceMajor} testid="pf-price" />
        <Field label="Pages" name="pages" type="number" defaultValue={product ? String(product.pages) : ""} />
        <Field label="Sort order" name="sort_order" type="number" defaultValue={product ? String(product.sort_order) : "0"} />
      </div>

      <label className="block text-sm">
        <span className="mb-2 block text-stone">Cover accent colour</span>
        <input
          name="cover_accent"
          type="color"
          defaultValue={product?.cover_accent || "#1f2937"}
          className="h-10 w-20 border border-line bg-paper"
        />
      </label>

      <PdfUploadZone currentFilename={product?.pdf_filename || null} />

      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" name="published" defaultChecked={product ? product.published === 1 : true} data-testid="pf-published" />
        <span>Published (visible in the storefront)</span>
      </label>

      <button
        type="submit"
        data-testid="pf-save"
        className="border border-ink bg-ink px-8 py-3 text-xs uppercase tracking-[0.22em] text-paper transition hover:bg-transparent hover:text-ink"
      >
        Save dossier
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  step,
  required,
  testid,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  step?: string;
  required?: boolean;
  testid?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-2 block text-stone">{label}</span>
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        defaultValue={defaultValue}
        data-testid={testid}
        className="w-full border border-line bg-paper px-3 py-2 outline-none focus:border-brass"
      />
    </label>
  );
}
