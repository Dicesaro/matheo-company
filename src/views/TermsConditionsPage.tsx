const lastUpdated = new Date().toLocaleDateString('es-PE', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const TermsConditionsPage = () => {
  return (
    <div className="container mx-auto px-4 pb-16 pt-6 text-gray-800">
      <h1 className="text-4xl font-bold mb-2 text-matheo-red">
        Términos y Condiciones
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        Última actualización: {lastUpdated}
      </p>

      <div className="prose max-w-none text-gray-600">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            1. Aceptación de los Términos
          </h2>
          <p className="mb-4">
            Bienvenido a Industrial Company MATHEO EIRL (en adelante,
            &quot;MATHEO&quot;, &quot;nosotros&quot; o
            &quot;nuestra&quot;), importador y distribuidor de
            herramientas industriales de precisión para la industria
            metalmecánica. Al acceder y utilizar el sitio web{' '}
            <strong>industrialcompanymatheo.com</strong> (en adelante,
            el &quot;Sitio&quot;), usted acepta cumplir con estos
            Términos y Condiciones. Si no está de acuerdo con alguno
            de ellos, le solicitamos que no utilice nuestro Sitio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            2. Uso del Sitio
          </h2>
          <p className="mb-4">
            Usted se compromete a utilizar el Sitio únicamente con
            fines legales y de manera que no infrinja los derechos de
            terceros, ni restrinja o inhiba el uso y disfrute del
            Sitio por parte de cualquier otra persona.
          </p>
          <p className="mb-4">
            De igual manera, no podrá, entre otras conductas: (a)
            extraer, copiar o reproducir de forma masiva el contenido,
            imágenes o bases de datos del Sitio; (b) introducir virus,
            malware o cualquier tecnología que pueda dañar o
            interferir con su funcionamiento; (c) intentar obtener
            acceso no autorizado a nuestro sistema o a cuentas de
            otros usuarios; ni (d) utilizar el Sitio para publicar o
            transmitir contenido ilícito, difamatorio o fraudulento.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            3. Cuentas y Favoritos
          </h2>
          <p className="mb-4">
            Algunas funciones del Sitio, como la lista de favoritos,
            pueden requerir el uso de una cuenta u otro mecanismo de
            identificación. Usted es el único responsable de mantener
            la confidencialidad de sus credenciales y de todas las
            actividades que se realicen con ellas. En caso de uso no
            autorizado de su cuenta, deberá notificarnos de inmediato.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            4. Propiedad Intelectual
          </h2>
          <p className="mb-4">
            Todo el contenido del Sitio, incluyendo textos, gráficos,
            logotipos, marcas, imágenes, videos, catálogos, fichas
            técnicas, software y cualquier otro material, es propiedad
            de Industrial Company MATHEO EIRL o de sus proveedores de
            contenido, y está protegido por las leyes de propiedad
            intelectual de la República del Perú, así como por los
            tratados internacionales aplicables. Queda prohibida su
            reproducción, distribución o uso comercial sin
            autorización previa y por escrito.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            5. Productos, Cotizaciones y Precios
          </h2>
          <p className="mb-4">
            El Sitio tiene carácter informativo y de catálogo. Nos
            esforzamos por mostrar con precisión las características,
            imágenes y colores de nuestros productos; sin embargo, no
            podemos garantizar que la visualización en su monitor sea
            exacta. Los precios se expresan en soles (PEN) y tienen
            carácter referencial, pudiendo variar según la
            disponibilidad de stock y el tipo de cambio aplicable.
          </p>
          <p className="mb-4">
            Las consultas, cotizaciones y pedidos se coordinan a
            través de los medios de contacto indicados en el Sitio
            (WhatsApp y correo electrónico). Toda cotización tendrá la
            validez que se indique en el propio documento, y la venta
            quedará sujeta a la confirmación de stock por parte de
            nuestro equipo.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            6. Pedidos, Pagos y Facturación
          </h2>
          <p className="mb-4">
            La confirmación de un pedido se realiza mediante la
            aceptación de la cotización por parte del cliente y se
            ejecutará conforme a las condiciones pactadas (precio,
            forma de pago y plazo de entrega). Emitiremos los
            comprobantes de pago conforme a la normativa vigente de la
            SUNAT cuando corresponda.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            7. Envíos y Entregas
          </h2>
          <p className="mb-4">
            Realizamos envíos a nivel nacional. Los plazos de entrega
            son referenciales, generalmente de 1 a 7 días hábiles
            según la ubicación del destino y la disponibilidad del
            producto. La demora en la entrega por causas ajenas a
            nosotros (despachos, transportistas, condiciones
            climáticas) no generará responsabilidad alguna.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            8. Garantías y Devoluciones
          </h2>
          <p className="mb-4">
            Aceptamos devoluciones y cambios dentro de los treinta
            (30) días siguientes a la entrega, siempre que el producto
            se encuentre en su estado original, sin uso y con su
            empaque, y previa coordinación con nuestro equipo
            comercial a través de los canales de contacto. Los
            productos que presenten algún desperfecto serán evaluados,
            y de corresponder, serán reparados, cambiados o devueltos
            conforme a lo pactado y a la legislación aplicable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            9. Limitación de Responsabilidad
          </h2>
          <p className="mb-4">
            El Sitio se proporciona &quot;tal cual&quot; y sin
            garantías de ningún tipo, expresas o implícitas. En la
            máxima medida permitida por ley, MATHEO no será
            responsable por daños directos, indirectos, incidentales o
            consecuentes derivados del uso o la imposibilidad de uso
            del Sitio, ni por interrupciones del servicio ocasionadas
            por mantenimiento, fallas técnicas o casos de fuerza
            mayor.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            10. Enlaces a Terceros
          </h2>
          <p className="mb-4">
            El Sitio puede contener enlaces a sitios web de terceros
            (redes sociales, mapas, proveedores de pago o transporte).
            No tenemos control sobre dichos sitios ni asumimos
            responsabilidad por su contenido, políticas o prácticas.
            El acceso a estos enlaces se realiza bajo su propia
            responsabilidad.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            11. Protección de Datos Personales
          </h2>
          <p className="mb-4">
            El tratamiento de sus datos personales se realiza conforme
            a la Ley N° 29733, Ley de Protección de Datos Personales,
            y su reglamento. Le invitamos a revisar nuestra{' '}
            <a
              href="/politica-de-privacidad"
              className="text-matheo-red underline"
            >
              Política de Privacidad
            </a>{' '}
            para conocer cómo recopilamos, usamos y protegemos su
            información.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            12. Libro de Reclamaciones
          </h2>
          <p className="mb-4">
            Conforme al Código de Protección y Defensa del Consumidor
            (Ley N° 29571), contamos con un Libro de Reclamaciones a
            disposición de nuestros clientes. Puede presentar su
            reclamo o queja a través de nuestro{' '}
            <a
              href="/libro-de-reclamaciones"
              className="text-matheo-red underline"
            >
              formulario de Libro de Reclamaciones
            </a>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            13. Cambios en los Términos
          </h2>
          <p className="mb-4">
            Nos reservamos el derecho de actualizar, cambiar o
            reemplazar cualquier parte de estos Términos y Condiciones
            mediante la publicación de las modificaciones en el Sitio.
            La fecha de la última actualización se indica al inicio de
            esta página. Es su responsabilidad revisarla
            periódicamente; el uso continuado del Sitio después de la
            publicación de cambios implica su aceptación.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            14. Ley Aplicable y Jurisdicción
          </h2>
          <p className="mb-4">
            Estos Términos y Condiciones se rigen por las leyes de la
            República del Perú. Cualquier controversia derivada de su
            uso del Sitio se someterá a los jueces y tribunales
            competentes de la ciudad de Lima, Perú, sin perjuicio de
            los derechos que le reconoce la legislación peruana en
            materia de consumo.
          </p>
        </section>
      </div>
    </div>
  )
}

export default TermsConditionsPage