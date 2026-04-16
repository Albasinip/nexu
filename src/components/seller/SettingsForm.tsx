'use client';

import React, { useState } from 'react';
import { updateBusinessProfile } from '@/app/actions/sellerSettings';

type BusinessData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  city: string | null;
  country: string | null;
};

export function SettingsForm({ business }: { business: BusinessData }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateBusinessProfile(business.id, formData);

    if (res.success) {
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente.' });
    } else {
      setMessage({ type: 'error', text: res.error || 'Ocurrió un error.' });
    }

    setLoading(false);
  };

  const handleSupportClick = () => {
    alert(
      'Para cambiar la razón comercial o el enlace, escribe a soporte@nexus.com indicando tu RUC/ID fiscal.'
    );
  };

  return (
    <div className="settings-shell">
      <div className="settings-header">
        <div>
          <span className="settings-kicker">Configuración del negocio</span>
          <h1 className="settings-title">Ajustes de Storefront</h1>
          <p className="settings-subtitle">
            Administra la identidad pública y los datos operativos de tu negocio.
          </p>
        </div>

        <div className="settings-badge">
          <span className="settings-badge-dot" />
          Panel activo
        </div>
      </div>

      {message && (
        <div
          className={`settings-alert ${message.type === 'error'
              ? 'settings-alert-danger'
              : 'settings-alert-success'
            }`}
        >
          <span className="settings-alert-icon">
            {message.type === 'success' ? '✓' : '!'}
          </span>
          <span>{message.text}</span>
        </div>
      )}

      <div className="settings-grid">
        <section className="settings-card settings-card-primary">
          <div className="settings-card-head">
            <div>
              <p className="settings-section-label">Perfil editable</p>
              <h2>Perfil Público</h2>
              <p>
                Configura cómo te ven tus clientes en tu tienda digital.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="settings-form">
            <div className="settings-field">
              <label className="settings-label">Descripción del local</label>
              <textarea
                name="description"
                className="settings-input settings-textarea"
                rows={5}
                placeholder="Ej: Las mejores hamburguesas artesanales de la ciudad, hechas con ingredientes seleccionados."
                defaultValue={business.description || ''}
              />
              <p className="settings-helper">
                Aparece bajo tu encabezado principal y ayuda a presentar tu propuesta a nuevos clientes.
              </p>
            </div>

            <div className="settings-row">
              <div className="settings-field">
                <label className="settings-label">Ciudad base</label>
                <input
                  name="city"
                  type="text"
                  className="settings-input"
                  placeholder="Ej: La Serena"
                  defaultValue={business.city || ''}
                />
              </div>

              <div className="settings-field">
                <label className="settings-label">País</label>
                <input
                  name="country"
                  type="text"
                  className="settings-input"
                  placeholder="Ej: Chile"
                  defaultValue={business.country || ''}
                />
              </div>
            </div>

            <div className="settings-actions">
              <button
                type="submit"
                className="settings-btn settings-btn-primary"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </section>

        <section className="settings-card settings-card-critical">
          <div className="settings-card-head">
            <div>
              <p className="settings-section-label settings-section-label-danger">
                Información protegida
              </p>
              <h2>Datos Críticos y Operativos</h2>
              <p>
                Estos datos afectan identidad comercial, rutas públicas y consistencia operativa.
              </p>
            </div>
          </div>

          <div className="settings-warning-box">
            <strong>Edición restringida</strong>
            <p>
              La razón comercial y el enlace de la tienda no se modifican desde este panel.
              Cualquier cambio debe solicitarse a soporte operativo.
            </p>
          </div>

          <div className="settings-form">
            <div className="settings-field">
              <label className="settings-label">Razón / Nombre comercial</label>
              <input
                type="text"
                className="settings-input settings-input-readonly"
                disabled
                value={business.name}
              />
            </div>

            <div className="settings-field">
              <label className="settings-label">Enlace de la tienda</label>

              <div className="settings-slug-box">
                <span className="settings-slug-prefix">nexu.com/store/</span>
                <input
                  type="text"
                  className="settings-slug-input"
                  disabled
                  value={business.slug}
                />
              </div>

              <p className="settings-helper">
                Este identificador es persistente y define la URL pública del negocio.
              </p>
            </div>

            <div className="settings-actions settings-actions-left">
              <button
                type="button"
                onClick={handleSupportClick}
                className="settings-btn settings-btn-secondary"
              >
                Contactar soporte
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}