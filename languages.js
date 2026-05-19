// ---------------------------------------------------------
// LANGUAGES / I18N
// ---------------------------------------------------------

window.currentLang = window.currentLang || "en";

const translations = {
  en: {
    "lang.title": "Choose your language",

    "profile.title": "What best describes your situation?",
    "profile.moving_job": "I’m moving for a job",
    "profile.moving_family": "I’m moving with my family",
    "profile.student": "I’m a student",
    "profile.freelancer": "I’m a freelancer / self-employed",
    "profile.looking_job": "I’m looking for a job",
    "profile.other": "Other",
    "profile.other_specify": "Please specify",

    "needs.title": "What do you need help with?",
    "needs.housing": "Housing / apartment search",
    "needs.admin": "Administrative paperwork",
    "needs.schools": "Schools / childcare",
    "needs.health": "Health insurance",
    "needs.banking": "Banking",
    "needs.moving": "Moving services",
    "needs.language": "Language courses",
    "needs.job": "Job search / CV",
    "needs.freelancer": "Freelancer / self-employed",
    "needs.other": "Other",
    "needs.other_specify": "Please specify",

    "main.subtitle": "You can select more than one option.",
    "main.next": "Next",

    "how.title": "How it works",
    "how.step1.title": "1. Tell us your situation",
    "how.step1.text": "Fill a short form with your needs",
    "how.step2.title": "2. We match you",
    "how.step2.text": "We connect you with the right expert",
    "how.step3.title": "3. Get help fast",
    "how.step3.text": "Receive assistance within 24h",

    "seo.title": "Relocation services in Luxembourg for expats",
    "seo.p1": "Moving to Luxembourg can be complex, especially for expats and international professionals. LuxLanding helps you relocate smoothly by connecting you with trusted experts for housing, administrative paperwork, banking, schools, and relocation support tailored to your situation.",
    "seo.p2": "Whether you are moving for work, with your family, or planning a new life abroad, our platform simplifies the process and helps you avoid common mistakes. Get matched with the right support and move to Luxembourg with confidence.",

    "housing.title": "Housing / apartment search",
    "housing.q1": "What is your monthly budget?",
    "housing.q2": "How many bedrooms do you need?",
    "housing.q3": "Do you already have a work contract?",
    "housing.studio": "Studio",
    "housing.1br": "1 bedroom",
    "housing.2br": "2 bedrooms",
    "housing.3br": "3 bedrooms",
    "housing.4br": "4+ bedrooms",

    "schools.title": "Schools / childcare",
    "schools.q1": "How many children?",
    "schools.q2": "Ages?",
    "schools.q3": "Public, private or international?",
    "schools.public": "Public",
    "schools.private": "Private",
    "schools.international": "International",

    "admin.title": "Administrative paperwork",
    "admin.q1": "Do you already have a job contract?",
    "admin.q2": "Do you already have an address in Luxembourg?",

    "health.title": "Health insurance",
    "health.q1": "Do you need help choosing a health insurance provider?",
    "health.q2": "Are you already registered with CNS?",

    "banking.title": "Banking",
    "banking.q1": "Do you need help opening a bank account?",
    "banking.q2": "Are you already employed?",

    "moving.title": "Moving services",
    "moving.q1": "Do you need help with moving companies?",
    "moving.q2": "From which country are you moving?",

    "language.title": "Language courses",
    "language.q1": "Which language do you want to learn?",
    "language.q2": "What is your current level?",
    "language.fr": "French",
    "language.de": "German",
    "language.lu": "Luxembourgish",
    "language.en": "English",
    "language.beginner": "Beginner",
    "language.intermediate": "Intermediate",
    "language.advanced": "Advanced",

    "job.title": "Job search / CV",
    "job.q1": "Do you need help with your CV?",
    "job.q2": "Do you need interview preparation?",

    "freelancer.title": "Freelancer / self-employed",
    "freelancer.q1": "Do you need help registering your business?",
    "freelancer.q2": "Do you need tax guidance?",

    "context.title": "Tell us a bit about your situation",
    "context.q1": "What should we know about your situation?",

    "final.title": "Final details",
    "final.q1": "When are you planning to move?",
    "final.q2": "Are you looking for personalized professional support?",
    "final.support.yes": "Yes, I’m ready to get help",
    "final.support.maybe": "Maybe, I’d like to know more first",
    "final.support.exploring": "I’m just exploring",
    "final.opt1": "Within 30 days",
    "final.opt2": "1–3 months",
    "final.opt3": "3–6 months",
    "final.opt4": "I’m just exploring",

    "contact.title": "Your contact details",
    "contact.name": "Your name",
    "contact.email": "Your email",
    "contact.phone": "Your phone (WhatsApp recommended)",

    "form.submit": "Send",

    "privacy.consent": "I agree to be contacted about my request and accept the privacy notice.",
    "privacy.link": "Privacy notice",
    "privacy.title": "Privacy notice",
    "privacy.p1": "LuxLanding collects the information you submit through this form so we can review your relocation request and contact you with relevant support.",
    "privacy.p2": "We may store your name, email, phone number, selected needs and message in our internal systems, including Supabase and email notifications. We do not sell your personal information.",
    "privacy.p3": "You can request access, correction or deletion of your information by contacting LuxLanding directly.",
    "privacy.notice.title": "Privacy notice",
    "privacy.notice.p1": "LuxLanding collects the information you submit through this form so we can review your relocation request and contact you with relevant support.",
    "privacy.notice.p2": "We may store your name, email, phone number, selected needs and message in our internal systems, including Supabase and email notifications. We do not sell your personal information.",
    "privacy.notice.p3": "You can request access, correction or deletion of your information by contacting LuxLanding directly.",
    "privacy.notice.contact": "Click here to contact us",

    "thank.title": "Thank you!",
    "thank.text": "We’ve received your information and will get back to you shortly.",

    "services.title": "Everything you need to settle in Luxembourg",
    "services.subtitle": "Practical help for the most important parts of your move.",
    "services.housing.title": "Housing",
    "services.housing.text": "Find apartments and relocation support.",
    "services.paperwork.title": "Paperwork",
    "services.paperwork.text": "Registration, permits and admin help.",
    "services.banking.title": "Banking",
    "services.banking.text": "Open accounts and manage finances.",
    "services.family.title": "Family",
    "services.family.text": "Schools, childcare and integration.",

    "cta.title": "Ready to make your move easier?",
    "cta.text": "Get personalized help today",
    "cta.button": "Get Help Now",

    "common.yes": "Yes",
    "common.no": "No",
    "common.select": "Please select"
  },

  fr: {
    "lang.title": "Choisissez votre langue",

    "profile.title": "Quelle situation décrit le mieux votre cas ?",
    "profile.moving_job": "Je déménage pour un emploi",
    "profile.moving_family": "Je déménage avec ma famille",
    "profile.student": "Je suis étudiant(e)",
    "profile.freelancer": "Je suis freelance / indépendant(e)",
    "profile.looking_job": "Je cherche un emploi",
    "profile.other": "Autre",
    "profile.other_specify": "Veuillez préciser",

    "needs.title": "Pour quoi avez-vous besoin d’aide ?",
    "needs.housing": "Logement / recherche d’appartement",
    "needs.admin": "Démarches administratives",
    "needs.schools": "Écoles / garde d’enfants",
    "needs.health": "Assurance santé",
    "needs.banking": "Banque",
    "needs.moving": "Services de déménagement",
    "needs.language": "Cours de langue",
    "needs.job": "Recherche d’emploi / CV",
    "needs.freelancer": "Freelance / indépendant",
    "needs.other": "Autre",
    "needs.other_specify": "Veuillez préciser",

    "main.subtitle": "Vous pouvez sélectionner plusieurs options.",
    "main.next": "Suivant",

    "how.title": "Comment ça marche",
    "how.step1.title": "1. Expliquez votre situation",
    "how.step1.text": "Remplissez un court formulaire avec vos besoins",
    "how.step2.title": "2. Nous vous orientons",
    "how.step2.text": "Nous vous mettons en relation avec le bon expert",
    "how.step3.title": "3. Obtenez de l’aide rapidement",
    "how.step3.text": "Recevez une assistance sous 24h",

    "seo.title": "Services de relocation au Luxembourg pour expatriés",
    "seo.p1": "S’installer au Luxembourg peut être complexe, surtout pour les expatriés et les professionnels internationaux. LuxLanding vous aide à vous installer plus facilement en vous mettant en relation avec des experts de confiance pour le logement, les démarches administratives, la banque, les écoles et un accompagnement relocation adapté à votre situation.",
    "seo.p2": "Que vous déménagiez pour le travail, avec votre famille ou pour commencer une nouvelle vie à l’étranger, notre plateforme simplifie le processus et vous aide à éviter les erreurs courantes. Trouvez le bon accompagnement et installez-vous au Luxembourg en toute confiance.",

    "housing.title": "Logement / recherche d’appartement",
    "housing.q1": "Quel est votre budget mensuel ?",
    "housing.q2": "De combien de chambres avez-vous besoin ?",
    "housing.q3": "Avez-vous déjà un contrat de travail ?",
    "housing.studio": "Studio",
    "housing.1br": "1 chambre",
    "housing.2br": "2 chambres",
    "housing.3br": "3 chambres",
    "housing.4br": "4+ chambres",

    "schools.title": "Écoles / garde d’enfants",
    "schools.q1": "Combien d’enfants ?",
    "schools.q2": "Âges ?",
    "schools.q3": "Public, privé ou international ?",
    "schools.public": "Public",
    "schools.private": "Privé",
    "schools.international": "International",

    "admin.title": "Démarches administratives",
    "admin.q1": "Avez-vous déjà un contrat de travail ?",
    "admin.q2": "Avez-vous déjà une adresse au Luxembourg ?",

    "health.title": "Assurance santé",
    "health.q1": "Avez-vous besoin d’aide pour choisir une assurance santé ?",
    "health.q2": "Êtes-vous déjà inscrit(e) à la CNS ?",

    "banking.title": "Banque",
    "banking.q1": "Avez-vous besoin d’aide pour ouvrir un compte bancaire ?",
    "banking.q2": "Êtes-vous déjà employé(e) ?",

    "moving.title": "Services de déménagement",
    "moving.q1": "Avez-vous besoin d’aide pour trouver une société de déménagement ?",
    "moving.q2": "De quel pays déménagez-vous ?",

    "language.title": "Cours de langue",
    "language.q1": "Quelle langue voulez-vous apprendre ?",
    "language.q2": "Quel est votre niveau actuel ?",
    "language.fr": "Français",
    "language.de": "Allemand",
    "language.lu": "Luxembourgeois",
    "language.en": "Anglais",
    "language.beginner": "Débutant",
    "language.intermediate": "Intermédiaire",
    "language.advanced": "Avancé",

    "job.title": "Recherche d’emploi / CV",
    "job.q1": "Avez-vous besoin d’aide pour votre CV ?",
    "job.q2": "Avez-vous besoin d’une préparation aux entretiens ?",

    "freelancer.title": "Freelance / indépendant",
    "freelancer.q1": "Avez-vous besoin d’aide pour enregistrer votre activité ?",
    "freelancer.q2": "Avez-vous besoin de conseils fiscaux ?",

    "context.title": "Parlez-nous un peu de votre situation",
    "context.q1": "Que devrions-nous savoir sur votre situation ?",

    "final.title": "Derniers détails",
    "final.q1": "Quand prévoyez-vous de déménager ?",
    "final.q2": "Recherchez-vous un accompagnement professionnel personnalisé ?",
    "final.support.yes": "Oui, je suis prêt(e) à recevoir de l’aide",
    "final.support.maybe": "Peut-être, j’aimerais d’abord en savoir plus",
    "final.support.exploring": "Je me renseigne seulement",
    "final.opt1": "Dans les 30 jours",
    "final.opt2": "Dans 1 à 3 mois",
    "final.opt3": "Dans 3 à 6 mois",
    "final.opt4": "Je me renseigne seulement",

    "contact.title": "Vos coordonnées",
    "contact.name": "Votre nom",
    "contact.email": "Votre e-mail",
    "contact.phone": "Votre téléphone (WhatsApp recommandé)",

    "form.submit": "Envoyer",

    "privacy.consent": "J’accepte d’être contacté(e) au sujet de ma demande et j’accepte la notice de confidentialité.",
    "privacy.link": "Notice de confidentialité",
    "privacy.title": "Notice de confidentialité",
    "privacy.p1": "LuxLanding collecte les informations envoyées via ce formulaire afin d’analyser votre demande de relocation et de vous contacter avec un accompagnement adapté.",
    "privacy.p2": "Nous pouvons conserver votre nom, e-mail, téléphone, besoins sélectionnés et message dans nos systèmes internes, y compris Supabase et les notifications par e-mail. Nous ne vendons pas vos informations personnelles.",
    "privacy.p3": "Vous pouvez demander l’accès, la correction ou la suppression de vos informations en contactant directement LuxLanding.",
    "privacy.notice.title": "Notice de confidentialité",
    "privacy.notice.p1": "LuxLanding collecte les informations envoyées via ce formulaire afin d’analyser votre demande de relocation et de vous contacter avec un accompagnement adapté.",
    "privacy.notice.p2": "Nous pouvons conserver votre nom, e-mail, téléphone, besoins sélectionnés et message dans nos systèmes internes, y compris Supabase et les notifications par e-mail. Nous ne vendons pas vos informations personnelles.",
    "privacy.notice.p3": "Vous pouvez demander l’accès, la correction ou la suppression de vos informations en contactant directement LuxLanding.",
    "privacy.notice.contact": "Cliquez ici pour nous contacter",

    "thank.title": "Merci !",
    "thank.text": "Nous avons bien reçu vos informations et reviendrons vers vous rapidement.",

    "services.title": "Tout ce qu’il vous faut pour vous installer au Luxembourg",
    "services.subtitle": "Une aide pratique pour les aspects les plus importants de votre installation.",
    "services.housing.title": "Logement",
    "services.housing.text": "Trouvez un appartement et un accompagnement à la relocation.",
    "services.paperwork.title": "Démarches",
    "services.paperwork.text": "Inscription, permis et aide administrative.",
    "services.banking.title": "Banque",
    "services.banking.text": "Ouvrez un compte et gérez vos finances.",
    "services.family.title": "Famille",
    "services.family.text": "Écoles, garde d’enfants et intégration.",

    "cta.title": "Prêt à simplifier votre installation ?",
    "cta.text": "Obtenez une aide personnalisée dès aujourd’hui",
    "cta.button": "Obtenir de l’aide",

    "common.yes": "Oui",
    "common.no": "Non",
    "common.select": "Veuillez sélectionner"
  },

  es: {
    "lang.title": "Elige tu idioma",

    "profile.title": "¿Cuál describe mejor tu situación?",
    "profile.moving_job": "Me mudo por trabajo",
    "profile.moving_family": "Me mudo con mi familia",
    "profile.student": "Soy estudiante",
    "profile.freelancer": "Soy freelancer / autónomo",
    "profile.looking_job": "Estoy buscando trabajo",
    "profile.other": "Otro",
    "profile.other_specify": "Por favor especifica",

    "needs.title": "¿Con qué necesitas ayuda?",
    "needs.housing": "Vivienda / búsqueda de apartamento",
    "needs.admin": "Trámites administrativos",
    "needs.schools": "Escuelas / cuidado infantil",
    "needs.health": "Seguro de salud",
    "needs.banking": "Banca",
    "needs.moving": "Servicios de mudanza",
    "needs.language": "Cursos de idiomas",
    "needs.job": "Búsqueda de empleo / CV",
    "needs.freelancer": "Freelancer / autónomo",
    "needs.other": "Otro",
    "needs.other_specify": "Por favor especifica",

    "main.subtitle": "Puedes seleccionar más de una opción.",
    "main.next": "Siguiente",

    "how.title": "Cómo funciona",
    "how.step1.title": "1. Cuéntanos tu situación",
    "how.step1.text": "Completa un formulario corto con tus necesidades",
    "how.step2.title": "2. Te conectamos",
    "how.step2.text": "Te conectamos con el experto adecuado",
    "how.step3.title": "3. Recibe ayuda rápido",
    "how.step3.text": "Recibe asistencia en 24h",

    "seo.title": "Servicios de relocation en Luxemburgo para expatriados",
    "seo.p1": "Mudarse a Luxemburgo puede ser complejo, especialmente para expatriados y profesionales internacionales. LuxLanding te ayuda a instalarte con más tranquilidad conectándote con expertos de confianza en vivienda, trámites administrativos, banca, escuelas y apoyo de relocation adaptado a tu situación.",
    "seo.p2": "Ya sea que te mudes por trabajo, con tu familia o para empezar una nueva vida en el extranjero, nuestra plataforma simplifica el proceso y te ayuda a evitar errores comunes. Encuentra el apoyo adecuado y múdate a Luxemburgo con confianza.",

    "housing.title": "Vivienda / búsqueda de apartamento",
    "housing.q1": "¿Cuál es tu presupuesto mensual?",
    "housing.q2": "¿Cuántas habitaciones necesitas?",
    "housing.q3": "¿Ya tienes contrato de trabajo?",
    "housing.studio": "Estudio",
    "housing.1br": "1 habitación",
    "housing.2br": "2 habitaciones",
    "housing.3br": "3 habitaciones",
    "housing.4br": "4+ habitaciones",

    "schools.title": "Escuelas / cuidado infantil",
    "schools.q1": "¿Cuántos hijos?",
    "schools.q2": "¿Edades?",
    "schools.q3": "¿Pública, privada o internacional?",
    "schools.public": "Pública",
    "schools.private": "Privada",
    "schools.international": "Internacional",

    "admin.title": "Trámites administrativos",
    "admin.q1": "¿Ya tienes contrato de trabajo?",
    "admin.q2": "¿Ya tienes una dirección en Luxemburgo?",

    "health.title": "Seguro de salud",
    "health.q1": "¿Necesitas ayuda para elegir un proveedor de seguro de salud?",
    "health.q2": "¿Ya estás registrado en la CNS?",

    "banking.title": "Banca",
    "banking.q1": "¿Necesitas ayuda para abrir una cuenta bancaria?",
    "banking.q2": "¿Ya estás empleado?",

    "moving.title": "Servicios de mudanza",
    "moving.q1": "¿Necesitas ayuda con empresas de mudanza?",
    "moving.q2": "¿Desde qué país te mudas?",

    "language.title": "Cursos de idiomas",
    "language.q1": "¿Qué idioma quieres aprender?",
    "language.q2": "¿Cuál es tu nivel actual?",
    "language.fr": "Francés",
    "language.de": "Alemán",
    "language.lu": "Luxemburgués",
    "language.en": "Inglés",
    "language.beginner": "Principiante",
    "language.intermediate": "Intermedio",
    "language.advanced": "Avanzado",

    "job.title": "Búsqueda de empleo / CV",
    "job.q1": "¿Necesitas ayuda con tu CV?",
    "job.q2": "¿Necesitas preparación para entrevistas?",

    "freelancer.title": "Freelancer / autónomo",
    "freelancer.q1": "¿Necesitas ayuda para registrar tu negocio?",
    "freelancer.q2": "¿Necesitas orientación fiscal?",

    "context.title": "Cuéntanos un poco sobre tu situación",
    "context.q1": "¿Qué deberíamos saber sobre tu situación?",

    "final.title": "Detalles finales",
    "final.q1": "¿Cuándo planeas mudarte?",
    "final.q2": "¿Buscas apoyo profesional personalizado?",
    "final.support.yes": "Sí, estoy listo para recibir ayuda",
    "final.support.maybe": "Quizás, primero quiero saber más",
    "final.support.exploring": "Solo estoy explorando",
    "final.opt1": "Dentro de 30 días",
    "final.opt2": "En 1–3 meses",
    "final.opt3": "En 3–6 meses",
    "final.opt4": "Solo estoy explorando",

    "contact.title": "Tus datos de contacto",
    "contact.name": "Tu nombre",
    "contact.email": "Tu correo electrónico",
    "contact.phone": "Tu teléfono (WhatsApp recomendado)",

    "form.submit": "Enviar",

    "privacy.consent": "Acepto ser contactado sobre mi solicitud y acepto el aviso de privacidad.",
    "privacy.link": "Aviso de privacidad",
    "privacy.title": "Aviso de privacidad",
    "privacy.p1": "LuxLanding recopila la información que envías en este formulario para revisar tu solicitud de relocation y contactarte con apoyo relevante.",
    "privacy.p2": "Podemos guardar tu nombre, email, teléfono, necesidades seleccionadas y mensaje en nuestros sistemas internos, incluyendo Supabase y notificaciones por correo. No vendemos tu información personal.",
    "privacy.p3": "Puedes solicitar acceso, corrección o eliminación de tu información contactando directamente a LuxLanding.",
    "privacy.notice.title": "Aviso de privacidad",
    "privacy.notice.p1": "LuxLanding recopila la información que envías en este formulario para revisar tu solicitud de relocation y contactarte con apoyo relevante.",
    "privacy.notice.p2": "Podemos guardar tu nombre, email, teléfono, necesidades seleccionadas y mensaje en nuestros sistemas internos, incluyendo Supabase y notificaciones por correo. No vendemos tu información personal.",
    "privacy.notice.p3": "Puedes solicitar acceso, corrección o eliminación de tu información contactando directamente a LuxLanding.",
    "privacy.notice.contact": "Haz clic aquí para contactarnos",

    "thank.title": "¡Gracias!",
    "thank.text": "Hemos recibido tu información y te contactaremos pronto.",

    "services.title": "Todo lo que necesitas para instalarte en Luxemburgo",
    "services.subtitle": "Ayuda práctica para las partes más importantes de tu mudanza.",
    "services.housing.title": "Vivienda",
    "services.housing.text": "Encuentra apartamentos y apoyo para tu mudanza.",
    "services.paperwork.title": "Trámites",
    "services.paperwork.text": "Registro, permisos y ayuda administrativa.",
    "services.banking.title": "Banca",
    "services.banking.text": "Abre cuentas y gestiona tus finanzas.",
    "services.family.title": "Familia",
    "services.family.text": "Escuelas, cuidado infantil e integración.",

    "cta.title": "¿Listo para facilitar tu mudanza?",
    "cta.text": "Obtén ayuda personalizada hoy mismo",
    "cta.button": "Obtener ayuda",

    "common.yes": "Sí",
    "common.no": "No",
    "common.select": "Por favor selecciona"
  },

  pt: {
    "lang.title": "Escolha seu idioma",

    "profile.title": "O que melhor descreve sua situação?",
    "profile.moving_job": "Estou me mudando por trabalho",
    "profile.moving_family": "Estou me mudando com minha família",
    "profile.student": "Sou estudante",
    "profile.freelancer": "Sou freelancer / autônomo",
    "profile.looking_job": "Estou procurando emprego",
    "profile.other": "Outro",
    "profile.other_specify": "Por favor, especifique",

    "needs.title": "Com o que você precisa de ajuda?",
    "needs.housing": "Moradia / busca de apartamento",
    "needs.admin": "Processos administrativos",
    "needs.schools": "Escolas / cuidados infantis",
    "needs.health": "Seguro de saúde",
    "needs.banking": "Banco",
    "needs.moving": "Serviços de mudança",
    "needs.language": "Cursos de idioma",
    "needs.job": "Busca de emprego / CV",
    "needs.freelancer": "Freelancer / autônomo",
    "needs.other": "Outro",
    "needs.other_specify": "Por favor, especifique",

    "main.subtitle": "Você pode selecionar mais de uma opção.",
    "main.next": "Próximo",

    "how.title": "Como funciona",
    "how.step1.title": "1. Conte sua situação",
    "how.step1.text": "Preencha um formulário curto com suas necessidades",
    "how.step2.title": "2. Nós conectamos você",
    "how.step2.text": "Conectamos você ao especialista certo",
    "how.step3.title": "3. Receba ajuda rapidamente",
    "how.step3.text": "Receba assistência em até 24h",

    "seo.title": "Serviços de relocation no Luxemburgo para expatriados",
    "seo.p1": "Mudar-se para o Luxemburgo pode ser complexo, especialmente para expatriados e profissionais internacionais. A LuxLanding ajuda você a se instalar com mais tranquilidade, conectando você a especialistas de confiança em moradia, documentação, banco, escolas e suporte de relocation adaptado à sua situação.",
    "seo.p2": "Se você está se mudando por trabalho, com a família ou para começar uma nova vida no exterior, nossa plataforma simplifica o processo e ajuda você a evitar erros comuns. Encontre o suporte certo e mude-se para o Luxemburgo com confiança.",

    "housing.title": "Moradia / busca de apartamento",
    "housing.q1": "Qual é o seu orçamento mensal?",
    "housing.q2": "Quantos quartos você precisa?",
    "housing.q3": "Você já tem contrato de trabalho?",
    "housing.studio": "Estúdio",
    "housing.1br": "1 quarto",
    "housing.2br": "2 quartos",
    "housing.3br": "3 quartos",
    "housing.4br": "4+ quartos",

    "schools.title": "Escolas / cuidados infantis",
    "schools.q1": "Quantos filhos?",
    "schools.q2": "Idades?",
    "schools.q3": "Pública, privada ou internacional?",
    "schools.public": "Pública",
    "schools.private": "Privada",
    "schools.international": "Internacional",

    "admin.title": "Processos administrativos",
    "admin.q1": "Você já tem contrato de trabalho?",
    "admin.q2": "Você já tem um endereço em Luxemburgo?",

    "health.title": "Seguro de saúde",
    "health.q1": "Você precisa de ajuda para escolher um seguro de saúde?",
    "health.q2": "Você já está registrado na CNS?",

    "banking.title": "Banco",
    "banking.q1": "Você precisa de ajuda para abrir uma conta bancária?",
    "banking.q2": "Você já está empregado?",

    "moving.title": "Serviços de mudança",
    "moving.q1": "Você precisa de ajuda com empresas de mudança?",
    "moving.q2": "De qual país você está se mudando?",

    "language.title": "Cursos de idioma",
    "language.q1": "Qual idioma você quer aprender?",
    "language.q2": "Qual é o seu nível atual?",
    "language.fr": "Francês",
    "language.de": "Alemão",
    "language.lu": "Luxemburguês",
    "language.en": "Inglês",
    "language.beginner": "Iniciante",
    "language.intermediate": "Intermediário",
    "language.advanced": "Avançado",

    "job.title": "Busca de emprego / CV",
    "job.q1": "Você precisa de ajuda com seu CV?",
    "job.q2": "Você precisa de preparação para entrevistas?",

    "freelancer.title": "Freelancer / autônomo",
    "freelancer.q1": "Você precisa de ajuda para registrar seu negócio?",
    "freelancer.q2": "Você precisa de orientação fiscal?",

    "context.title": "Conte-nos um pouco sobre sua situação",
    "context.q1": "O que devemos saber sobre sua situação?",

    "final.title": "Detalhes finais",
    "final.q1": "Quando você pretende se mudar?",
    "final.q2": "Você procura suporte profissional personalizado?",
    "final.support.yes": "Sim, estou pronto para receber ajuda",
    "final.support.maybe": "Talvez, quero saber mais primeiro",
    "final.support.exploring": "Só estou explorando",
    "final.opt1": "Dentro de 30 dias",
    "final.opt2": "Em 1–3 meses",
    "final.opt3": "Em 3–6 meses",
    "final.opt4": "Só estou explorando",

    "contact.title": "Seus dados de contato",
    "contact.name": "Seu nome",
    "contact.email": "Seu e-mail",
    "contact.phone": "Seu telefone (WhatsApp recomendado)",

    "form.submit": "Enviar",

    "privacy.consent": "Aceito ser contactado sobre meu pedido e aceito o aviso de privacidade.",
    "privacy.link": "Aviso de privacidade",
    "privacy.title": "Aviso de privacidade",
    "privacy.p1": "A LuxLanding coleta as informações enviadas neste formulário para analisar seu pedido de relocation e entrar em contato com suporte relevante.",
    "privacy.p2": "Podemos armazenar seu nome, e-mail, telefone, necessidades selecionadas e mensagem em nossos sistemas internos, incluindo Supabase e notificações por e-mail. Não vendemos suas informações pessoais.",
    "privacy.p3": "Você pode solicitar acesso, correção ou exclusão das suas informações entrando em contato diretamente com a LuxLanding.",
    "privacy.notice.title": "Aviso de privacidade",
    "privacy.notice.p1": "A LuxLanding coleta as informações enviadas neste formulário para analisar seu pedido de relocation e entrar em contato com suporte relevante.",
    "privacy.notice.p2": "Podemos armazenar seu nome, e-mail, telefone, necessidades selecionadas e mensagem em nossos sistemas internos, incluindo Supabase e notificações por e-mail. Não vendemos suas informações pessoais.",
    "privacy.notice.p3": "Você pode solicitar acesso, correção ou exclusão das suas informações entrando em contato diretamente com a LuxLanding.",
    "privacy.notice.contact": "Clique aqui para entrar em contato",

    "thank.title": "Obrigado!",
    "thank.text": "Recebemos suas informações e entraremos em contato em breve.",

    "services.title": "Tudo o que você precisa para se estabelecer em Luxemburgo",
    "services.subtitle": "Ajuda prática para as partes mais importantes da sua mudança.",
    "services.housing.title": "Moradia",
    "services.housing.text": "Encontre apartamentos e apoio para relocação.",
    "services.paperwork.title": "Documentação",
    "services.paperwork.text": "Registro, permissões e ajuda administrativa.",
    "services.banking.title": "Banco",
    "services.banking.text": "Abra contas e organize suas finanças.",
    "services.family.title": "Família",
    "services.family.text": "Escolas, cuidado infantil e integração.",

    "cta.title": "Pronto para facilitar sua mudança?",
    "cta.text": "Receba ajuda personalizada hoje",
    "cta.button": "Obter ajuda",

    "common.yes": "Sim",
    "common.no": "Não",
    "common.select": "Por favor selecione"
  }
};

function applyLanguage(lang = window.currentLang || "en") {
  const dict = translations[lang] || translations.en;

  window.currentLang = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (!key || !(key in dict)) return;

    const tag = el.tagName.toLowerCase();

    if (tag === "input" || tag === "textarea") {
      el.placeholder = dict[key];
    } else {
      el.textContent = dict[key];
    }
  });

  const profileOtherInput = document.getElementById("profile-other-input");
  if (profileOtherInput) {
    profileOtherInput.placeholder = dict["profile.other_specify"] || "Please specify";
  }

  const needsOtherInput = document.getElementById("needs-other-input");
  if (needsOtherInput) {
    needsOtherInput.placeholder = dict["needs.other_specify"] || "Please specify";
  }

  const situationNotes = document.querySelector('textarea[name="situation_notes"]');
  if (situationNotes) {
    situationNotes.placeholder =
      lang === "fr"
        ? "Expliquez ce que vous recherchez, ce qui vous bloque ou le type d’aide dont vous avez besoin."
        : lang === "es"
        ? "Cuéntanos qué estás buscando, qué te está costando o qué tipo de ayuda necesitas."
        : lang === "pt"
        ? "Conte o que você procura, o que está dificultando sua mudança ou que tipo de ajuda você precisa."
        : "Tell us what you're looking for, what you're struggling with, or what kind of help you need.";
  }
}

window.applyLanguage = applyLanguage;
window.translations = translations;

document.addEventListener("DOMContentLoaded", () => {
  const supportedLangs = ["en", "fr", "es", "pt"];
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get("lang");

  if (supportedLangs.includes(urlLang)) {
    window.currentLang = urlLang;
  }

  applyLanguage(window.currentLang);
});
