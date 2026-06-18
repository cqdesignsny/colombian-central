/**
 * Renders one or more JSON-LD structured-data blocks. Server component; safe to
 * drop into any page or layout. Pass an object or an array of objects.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
