/**
 * Injecte un (ou plusieurs) bloc JSON-LD dans la page via <script type="application/ld+json">.
 *
 * Server Component pur — pas de JS côté client, pas de hydration.
 *
 * Échappe `<`, `>` et `&` pour éviter qu'un payload terminant prématurément
 * </script> ne casse le markup.
 */

type JsonLdPayload = Record<string, unknown>;

interface JsonLdProps {
  /** Un objet JSON-LD ou un tableau d'objets (chaque élément génère un <script>). */
  data: JsonLdPayload | readonly JsonLdPayload[];
}

function escape(json: string): string {
  return json.replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

export function JsonLd({ data }: JsonLdProps) {
  const payloads = Array.isArray(data) ? data : [data];
  return (
    <>
      {payloads.map((payload, index) => (
        <script
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: escape(JSON.stringify(payload)) }}
        />
      ))}
    </>
  );
}
