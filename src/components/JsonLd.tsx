/**
 * Renders one or more JSON-LD structured-data blocks. Server component; safe to
 * drop into any page or layout. Pass an object or an array of objects.
 *
 * The JSON is escaped before it goes into the <script> so untrusted, AI-written
 * content (news titles, deks, source names) can't break out of the tag with a
 * literal "</script>". Escaping `<` is what prevents the breakout; `>` and `&`
 * are escaped too for good measure.
 */
function safeJsonLd(data: object | object[]): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
