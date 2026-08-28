const lastUpdated = new Date().toLocaleDateString('es-PE', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 pb-16 pt-6 text-gray-800">
      <h1 className="text-4xl font-bold mb-2 text-matheo-red">
        Política de Privacidad
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        Última actualización: {lastUpdated}
      </p>

      <div className="prose max-w-none text-gray-600">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            1. Introducción
          </h2>
          <p className="mb-4">
            En Industrial Company MATHEO EIRL (en adelante,
            &quot;MATHEO&quot;), respetamos su privacidad y nos
            comprometemos a proteger los datos personales que nos
            proporcione. Esta Política de Privacidad explica cómo
            recopilamos, usamos, almacenamos y protegemos su
            información cuando visita nuestro sitio web{' '}
            <strong>industrialcompanymatheo.com</strong>, conforme a
            la Ley N° 29733, Ley de Protección de Datos Personales, y
            su reglamento.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            2. Información que Recopilamos
          </h2>
          <p className="mb-4">
            Podemos recopilar la siguiente información:
          </p>
          <ul className="mb-4 list-disc pl-6">
            <li>
              <strong>Datos de contacto:</strong> nombre, correo
              electrónico, número de teléfono y dirección, cuando se
              comunica con nosotros a través de nuestros formularios,
              WhatsApp o correo.
            </li>
            <li>
              <strong>Datos de navegación:</strong> información
              técnica y de uso del Sitio, como dirección IP, tipo de
              navegador y páginas visitadas, mediante herramientas de
              analítica y medición.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            3. Uso de la Información
          </h2>
          <p className="mb-4">
            Utilizamos la información recopilada para:
          </p>
          <ul className="mb-4 list-disc pl-6">
            <li>Responder a sus consultas y brindar cotizaciones.</li>
            <li>
              Procesar y dar seguimiento a pedidos, entregas y
              comprobantes.
            </li>
            <li>
              Mejorar nuestro sitio web, productos y atención al
              cliente.
            </li>
            <li>
              Si usted lo ha autorizado, enviarle información
              comercial y promociones de nuestro catálogo.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            4. Base Legal y Sus Derechos
          </h2>
          <p className="mb-4">
            Tratamos sus datos personales con su consentimiento y para
            el cumplimiento de las obligaciones derivadas de la
            relación comercial. De conformidad con la Ley N° 29733,
            usted tiene derecho a solicitar el acceso, la
            rectificación y la cancelación de sus datos personales,
            así como a oponerse a su tratamiento, comunicándose con
            nosotros a través de los medios indicados en esta
            política. También puede presentar una reclamación ante la
            Autoridad Nacional de Protección de Datos Personales.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            5. Seguridad y Conservación de los Datos
          </h2>
          <p className="mb-4">
            Implementamos medidas de seguridad razonables para
            proteger su información personal contra el acceso no
            autorizado, la alteración, la divulgación o la
            destrucción. Conservamos sus datos únicamente durante el
            tiempo necesario para los fines descritos en esta política
            o lo que exija la normativa vigente.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            6. Enlaces a Terceros y Redes Sociales
          </h2>
          <p className="mb-4">
            Nuestro sitio puede contener enlaces a plataformas de
            terceros, como redes sociales, servicios de mapas o
            herramientas de medición. No somos responsables de las
            prácticas de privacidad de dichos sitios, por lo que le
            recomendamos revisar sus propias políticas al acceder a
            ellos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            7. Cambios en la Política de Privacidad
          </h2>
          <p className="mb-4">
            Nos reservamos el derecho de actualizar esta política
            cuando sea necesario. La fecha de la última actualización
            se indica al inicio de esta página. Le recomendamos
            revisarla periódicamente para mantenerse informado sobre
            cómo protegemos su información.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            8. Contacto
          </h2>
          <p className="mb-4">
            Si tiene alguna pregunta sobre esta Política de Privacidad
            o sobre el tratamiento de sus datos personales, puede
            contactarnos a través de nuestro correo{' '}
            <a
              href="mailto:ventas@matheocompany.com"
              className="text-matheo-red underline"
            >
              ventas@matheocompany.com
            </a>{' '}
            o visitarnos en Av. Argentina N° 639 Int. Calle 10, Stand
            B218-B219 C.C. UDAMPE, Lima Cercado, Perú.
          </p>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage