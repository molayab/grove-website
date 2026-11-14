import type { HomeContent } from './types';

// Copy fields hold HTML snippets (entities, <br>, <code>) and are rendered with set:html.
export const home: HomeContent = {
  "meta": {
    "title": "Grove para Mac — la app nativa para agentes de IA y worktrees de git",
    "description": "La app nativa de Mac para Claude Code, Codex y otros agentes de IA. Cambia de worktree de git y tu agente, shell y diff te siguen. $9.99, pago único.",
    "ogImageAlt": "Grove para Mac: agentes de IA y worktrees de git en una ventana nativa de macOS",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Grove for Mac",
      "alternateName": "Grove",
      "url": "https://grove.molayab.com/es/",
      "description": "La app nativa de Mac para Claude Code, Codex y otros agentes de IA. Cambia de worktree de git y tu agente, shell y diff te siguen. $9.99, pago único.",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "macOS 26 or later",
      "inLanguage": "es",
      "image": "https://grove.molayab.com/og-image.png",
      "screenshot": "https://grove.molayab.com/screenshots/agent.png",
      "downloadUrl": "https://github.com/molayab/grove-website/releases/latest/download/Grove.dmg",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "USD",
        "lowPrice": "9.99",
        "highPrice": "39.99",
        "offerCount": "3"
      },
      "author": {
        "@type": "Person",
        "name": "Mateo Olaya Bernal",
        "url": "https://molayab.com"
      }
    }
  },
  "hero": {
    "badge": "Sin Electron &nbsp;·&nbsp; Sin suscripción &nbsp;·&nbsp; macOS nativo",
    "title": "Tu espacio de trabajo,<br>en una ventana.",
    "sub": "La app nativa de Mac para agentes de IA. Cambia de worktree y tu agente, tu shell y tu diff te siguen — Claude Code, Codex, Gemini CLI y más.",
    "ctaPrimary": "Prueba gratis",
    "ctaSecondary": "Ver qué incluye",
    "trial": "Prueba gratis &nbsp;·&nbsp; Firmado con Developer ID y notarizado por Apple"
  },
  "carousel": {
    "label": "Capturas de Grove",
    "controlsLabel": "Elige una captura",
    "pause": "Pausar presentación",
    "play": "Reproducir presentación",
    "slides": [
      {"alt": "Recorrido animado de Grove: cambiar de worktree mientras el agente, el shell, los archivos y el diff te siguen", "caption": "Grove en acción — todo tu espacio de trabajo, una sola ventana"},
      {
        "alt": "La ventana de Grove con la paleta ⌘K abierta sobre una sesión de Claude Code, listando prompts y comandos de shell guardados",
        "caption": "Prompts y comandos guardados, a un ⌘K"
      },
      {
        "alt": "La pestaña Agent de Grove ejecutando Claude Code, con la lista de proyectos, los worktrees y el panel de git en la barra lateral",
        "caption": "Tu agente de IA, ya en la carpeta correcta"
      },
      {
        "alt": "La pestaña Changes de Grove mostrando un diff unificado con un cuadro de comentario y un botón Send to Agent",
        "caption": "Revisa el diff y envía notas al agente"
      },
      {
        "alt": "La pestaña Files de Grove con el árbol de archivos y un README en Markdown renderizado, con un diagrama Mermaid",
        "caption": "Árbol de archivos con vistas previas de Markdown"
      },
      {
        "alt": "La pestaña Shell de Grove con dos pestañas de shell abiertas, mostrando git log y los worktrees",
        "caption": "Todas las pestañas de shell que necesites"
      },
      {
        "alt": "La pestaña Browser de Grove con la documentación de Vite y React ancladas como pestañas",
        "caption": "Las páginas de tu proyecto, junto al código"
      }
    ]
  },
  "download": {
    "eyebrow": "Descarga",
    "title": "Prueba Grove gratis.",
    "sub": "Una versión de prueba completa, servida directamente desde el último release de GitHub — sin cuenta, sin correo electrónico.",
    "button": "Descargar para macOS",
    "fetching": "Obteniendo el último release&hellip;",
    "note": "Firmado y notarizado por Apple — ábrelo directamente, sin avisos de seguridad.",
    "allReleases": "Todos los releases en GitHub →"
  },
  "demo": {
    "eyebrow": "Demo",
    "title": "Míralo en movimiento.",
    "sub": "El recorrido de 25 segundos por Grove: agentes, worktrees, revisión de diffs y prompts guardados en una sola ventana.",
    "items": [
      {
        "label": "Video promocional de Grove: agentes de IA, git worktrees, revisión de diff y prompts guardados en una sola ventana nativa de Mac",
        "caption": "Grove en 25 segundos."
      }
    ]
  },
  "features": {
    "eyebrow": "Funciones",
    "title": "Todo lo que un desarrollador moderno necesita.",
    "sub": "Nada de Electron. Nada de suscripciones. Solo una app nativa rápida y enfocada.",
    "items": [
      {
        "title": "Agentes de IA, de forma nativa",
        "body": "Trae tu propio agente de IA — Claude Code, opencode, Codex, Gemini CLI, Aider o cualquier otro CLI que agregues tú — y simplemente funciona, ya apuntando a la carpeta correcta. Ejecuta varias pestañas de agente lado a lado, sin configurar el PATH."
      },
      {
        "title": "Worktrees primero",
        "body": "Trabaja en tres ramas a la vez, sin perder tu lugar. Crea un worktree nuevo desde cualquier rama con un clic — cada uno tiene su propio agente, shell, archivos y cambios, y todo te sigue cuando cambias."
      },
      {
        "title": "Revisa y devuélveselo",
        "body": "La pestaña Changes se actualiza en vivo mientras tu agente edita archivos. Lee el diff, comenta cualquier línea y envía esa nota directamente al agente — sin copiar rutas ni números de línea."
      },
      {
        "title": "Prompts y comandos, a un ⌘K",
        "body": "Guarda los prompts y comandos que usas todos los días, por proyecto o en una biblioteca compartida. Presiona ⌘K, elige uno y aparece en tu agente o en una pestaña de shell — listo para ejecutar."
      },
      {
        "title": "Git, en lenguaje claro",
        "body": "Un solo botón Sync en lugar de fetch, pull y push. Guarda tus cambios, mira tus guardados recientes — y salta a cualquiera como un nuevo worktree — y, si un pull está bloqueado por cambios locales, Grove te ofrece hacer stash y pull por ti."
      },
      {
        "title": "Archivos, con vistas previas reales",
        "body": "Explora el checkout en un árbol de archivos y previsualiza lo que seleccionas. El Markdown se muestra al estilo GitHub — tablas, código e incluso diagramas Mermaid — y se exporta a PDF en un paso."
      },
      {
        "title": "Pestañas de shell",
        "body": "¿Necesitas una terminal de verdad? Abre todas las que quieras, todas ubicadas en la misma carpeta que tu agente — corre los tests en una, sigue un log en otra, sin cambiar de contexto."
      },
      {
        "title": "Las páginas de tu proyecto, ancladas",
        "body": "Ancla el gestor de issues, la documentación o el dashboard de cada proyecto. Se abren en la pestaña Browser, justo al lado de tu código, y se quedan con ese espacio de trabajo."
      },
      {
        "title": "Nada destructivo por defecto",
        "body": "Grove no deja que un clic accidental borre tu trabajo. No hay force push, descartar un archivo o eliminar un commit sin publicar siempre pide confirmación, y todo lo que sale de tu máquina también."
      },
      {
        "title": "Layouts divididos",
        "body": "Pon dos o tres espacios lado a lado — Agente junto a Cambios, Shell junto a Archivos. Elige un layout en la barra de herramientas o con ⌃⌘1–6 y muévete entre paneles con el teclado."
      },
      {
        "title": "Worktrees, organizados",
        "body": "Marca con estrella los worktrees donde vives, agrupa el resto en grupos con nombre, reordénalos y añade una descripción de una línea. Bloquea uno para que no se mueva, o archívalo cuando la rama termine."
      },
      {
        "title": "Notas que siguen al checkout",
        "body": "Cada worktree tiene su propia línea “Trabajando en”, una lista de TODOs ordenada y una nota de borrador — y los TODOs abiertos aparecen en su fila de la barra lateral, para que sepas dónde te quedaste."
      },
      {
        "title": "Sigue trabajando aunque tú no",
        "body": "Cambia a otro proyecto y este sigue corriendo — su agente y su shell siguen en segundo plano aunque no lo estés mirando. Revisa uno sin pausar el otro, y vuelve exactamente a la pestaña donde lo dejaste."
      }
    ]
  },
  "screenshots": {
    "eyebrow": "Capturas",
    "title": "Míralo en la ventana.",
    "sub": "El mismo checkout, todas las formas en que trabajas en él.",
    "items": [
      {
        "alt": "La pestaña Agent de Grove ejecutando Claude Code en un espacio de trabajo, con la lista de proyectos, los worktrees y el panel de git en la barra lateral",
        "caption": "Tu agente favorito, ya en la carpeta correcta — con cada proyecto y worktree a un clic."
      },
      {
        "alt": "La pestaña Changes de Grove mostrando un diff unificado de un componente de React, con un cuadro de comentario en línea y un botón Send to Agent",
        "caption": "Revisa el diff, comenta una línea y envíala directamente a tu agente."
      },
      {
        "alt": "La paleta ⌘K de Grove con prompts y comandos de shell guardados para el espacio de trabajo",
        "caption": "Presiona ⌘K para ejecutar un prompt o comando guardado sobre el checkout actual."
      },
      {
        "alt": "La pestaña Files de Grove con el árbol de archivos de un proyecto y un README en Markdown renderizado, con un diagrama Mermaid y una tabla",
        "caption": "Un árbol de archivos con vistas previas — el Markdown se muestra con tablas y diagramas Mermaid."
      },
      {
        "alt": "La pestaña Shell de Grove con dos pestañas de shell abiertas, mostrando la salida de git log y de los worktrees del espacio de trabajo",
        "caption": "Todas las shells que necesites, ubicadas en el mismo checkout que tu agente."
      },
      {
        "alt": "La pestaña Browser de Grove con la documentación de Vite y React ancladas como pestañas junto al espacio de trabajo",
        "caption": "Ancla la documentación, el gestor de issues o el dashboard de cada proyecto — junto a tu código."
      },
      {
        "alt": "La ventana de Configuración de Grove en la pestaña General, mostrando opciones de vista previa de Markdown y colores de acento",
        "caption": "Valores predeterminados sensatos desde el inicio — y un color de acento a tu gusto."
      }
    ]
  },
  "why": {
    "eyebrow": "¿Por qué nativo?",
    "title": "Hecho para macOS.<br>No adaptado a él.",
    "items": [
      "Hecho para no colgarse nunca — sin la ruedita de la muerte, ni con varios agentes corriendo a la vez.",
      "Se siente parte de macOS, no una página web en una ventana — respeta tu modo oscuro, tu tamaño de fuente, tu sistema, desde el primer momento.",
      "Instálalo con confianza — Apple verificó que Grove es seguro, así que no verás una advertencia de \"desarrollador no identificado\", aunque esté fuera de la App Store.",
      "Encuentra tus herramientas donde sea que las hayas instalado — Homebrew, <code>~/.local/bin</code>, <code>~/.bun/bin</code> — incluso al abrir Grove desde el Dock, no solo desde la terminal."
    ],
    "badges": [
      "Swift 6.2",
      "SwiftUI",
      "macOS 26+",
      "Developer ID",
      "Sin Electron",
      "Sin suscripciones"
    ]
  },
  "agents": {
    "eyebrow": "Agentes compatibles",
    "title": "Elige tu compañero de IA para programar.",
    "sub": "Grove encuentra el binario del agente automáticamente — no necesitas configurar el PATH. ¿Usas otro? Agrega cualquier agente CLI en Configuración."
  },
  "pricing": {
    "eyebrow": "Precios",
    "title": "Paga una vez, tenlo para siempre.",
    "sub": "Compra única. Todas las actualizaciones futuras incluidas. Elige el número de licencias según cuántos Macs uses.",
    "tiers": [
      {
        "name": "1 Licencia",
        "period": "pago único · 1 Mac"
      },
      {
        "name": "3 Licencias",
        "period": "pago único · hasta 3 Macs",
        "badge": "Más popular"
      },
      {
        "name": "5 Licencias",
        "period": "pago único · hasta 5 Macs"
      }
    ],
    "features": [
      "Todas las funciones actuales",
      "Todas las actualizaciones futuras",
      "Espacios de trabajo y worktrees ilimitados",
      "Todos los agentes de IA — Claude Code, opencode, Codex, Gemini CLI, Aider o el tuyo",
      "macOS 26+ · Firmado con Developer ID y notarizado"
    ],
    "buy": "Comprar licencia",
    "note": "Pago seguro a través de Gumroad &nbsp;·&nbsp; Gratis para descargar y probar — compra una licencia cuando termine tu prueba"
  },
  "blog": {
    "eyebrow": "Del blog",
    "title": "Novedades, y cómo está hecho.",
    "sub": "Notas de versión y artículos técnicos sobre Grove, en molayab.com (en inglés).",
    "allPosts": "Todos los artículos sobre Grove &rarr;"
  }
};
