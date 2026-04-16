import Link from "next/link";

type OrderSuccessPageProps = {
  params: Promise<{
    slug: string;
    orderId: string;
  }>;
};

function formatStoreName(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatOrderCode(orderId: string) {
  return orderId.split("-")[0]?.toUpperCase() || orderId.toUpperCase();
}

export default async function OrderSuccessPage({
  params,
}: OrderSuccessPageProps) {
  const { slug, orderId } = await params;

  const storeName = formatStoreName(slug);
  const orderCode = formatOrderCode(orderId);

  return (
    <main
      style={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.25rem",
        background:
          "radial-gradient(circle at top, rgba(16,185,129,0.08), transparent 35%), var(--color-background)",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "720px",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "1.5rem",
          padding: "2.5rem",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "220px",
            height: "220px",
            borderRadius: "999px",
            background: "rgba(16,185,129,0.08)",
            filter: "blur(20px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "84px",
              height: "84px",
              borderRadius: "999px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#ffffff",
              fontSize: "2.25rem",
              fontWeight: 900,
              boxShadow: "0 16px 40px rgba(16,185,129,0.28)",
              marginBottom: "1.5rem",
            }}
          >
            ✓
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.45rem 0.8rem",
              borderRadius: "999px",
              background: "var(--color-surface-dim)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-muted)",
              fontSize: "0.85rem",
              fontWeight: 600,
              marginBottom: "1.25rem",
            }}
          >
            Confirmación de pedido
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              lineHeight: 1.05,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: "var(--color-text-main)",
              marginBottom: "1rem",
            }}
          >
            Pedido recibido correctamente
          </h1>

          <p
            style={{
              maxWidth: "560px",
              margin: "0 auto 2rem",
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "var(--color-text-muted)",
            }}
          >
            Tu pedido{" "}
            <strong style={{ color: "var(--color-text-main)" }}>
              #{orderCode}
            </strong>{" "}
            ya fue registrado en{" "}
            <strong style={{ color: "var(--color-text-main)" }}>
              {storeName}
            </strong>
            . El negocio podrá revisar la solicitud y actualizar su estado en breve.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
              textAlign: "left",
            }}
          >
            <div
              style={{
                padding: "1rem",
                borderRadius: "1rem",
                background: "var(--color-surface-dim)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--color-text-muted)",
                  marginBottom: "0.4rem",
                }}
              >
                Código
              </div>
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "var(--color-text-main)",
                }}
              >
                #{orderCode}
              </div>
            </div>

            <div
              style={{
                padding: "1rem",
                borderRadius: "1rem",
                background: "var(--color-surface-dim)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--color-text-muted)",
                  marginBottom: "0.4rem",
                }}
              >
                Tienda
              </div>
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "var(--color-text-main)",
                }}
              >
                {storeName}
              </div>
            </div>

            <div
              style={{
                padding: "1rem",
                borderRadius: "1rem",
                background: "var(--color-surface-dim)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--color-text-muted)",
                  marginBottom: "0.4rem",
                }}
              >
                Estado inicial
              </div>
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "#10b981",
                }}
              >
                Recibido
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.85rem",
            }}
          >
            <Link
              href={`/store/${slug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "200px",
                padding: "0.95rem 1.4rem",
                background: "var(--color-text-main)",
                color: "var(--color-background)",
                borderRadius: "999px",
                fontWeight: 800,
                textDecoration: "none",
                transition: "transform 160ms ease, opacity 160ms ease",
              }}
            >
              Seguir comprando
            </Link>

            <Link
              href="/user/profile"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "200px",
                padding: "0.95rem 1.4rem",
                background: "var(--color-surface-dim)",
                color: "var(--color-text-main)",
                borderRadius: "999px",
                fontWeight: 800,
                textDecoration: "none",
                border: "1px solid var(--color-border)",
              }}
            >
              Ver mi perfil
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}