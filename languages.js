// ---------------------------------------------------------
// LANGUAGES / I18N
// ---------------------------------------------------------

window.currentLang = window.currentLang || "en";

const translations = {
  en: {
    "lang.title": "Choose your language",
    "nav.how": "How it works",
    "nav.services": "Services",
    "nav.start": "Start your request",
    "nav.cta": "Get relocation help",
    "trust.personal.title": "Personalized guidance",
    "trust.personal.text": "Support based on your situation",
    "trust.languages.title": "4 languages",
    "trust.languages.text": "English, French, Spanish and Portuguese",
    "trust.response.title": "Reply within 24h",
    "trust.response.text": "Clear next steps after your request",
    "meta.title": "Relocation Services Luxembourg | LuxLanding for Expats & Families",
    "meta.description": "Relocation services in Luxembourg for expats and families. Get help with housing, paperwork, banking, schools and moving support.",
    "hero.badge": "Luxembourg relocation support",
    "hero.title": "Relocation Services in Luxembourg for Expats, Families & Professionals",
    "hero.text": "Get expert relocation help in Luxembourg for housing, paperwork, banking, schools and moving support tailored to your situation.",
    "hero.cta": "Get relocation help",
    "hero.secondary": "See how it works",
    "hero.proof": "Support tailored to expats, families, students and professionals",
    "hero.urgency": "Quick request • Clear next steps • Reply within 24h",

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

    "seo.eyebrow": "Why LuxLanding",
    "seo.title": "Relocation services in Luxembourg for expats",
    "seo.p1": "Moving to Luxembourg can be complex, especially for expats and international professionals. LuxLanding helps you relocate smoothly by connecting you with trusted experts for housing, administrative paperwork, banking, schools, and relocation support tailored to your situation.",
    "seo.p2": "Whether you are moving for work, with your family, or planning a new life abroad, our platform simplifies the process and helps you avoid common mistakes. Get matched with the right support and move to Luxembourg with confidence.",
    "seo.tag.schools": "Schools",
    "seo.tag.moving": "Moving",

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
    "contact.phone.help": "Choose your country and enter the number without the international prefix.",
    "contact.name.required": "Your name (required)",
    "contact.email.required": "Your email (required)",
    "contact.phone.optional": "Your phone (optional)",
    "contact.method.required": "How should we contact you? (required)",
    "contact.method.whatsapp": "WhatsApp",
    "contact.method.email": "Email",
    "contact.method.phone": "Phone call",
    "contact.time.optional": "Best time to contact you (optional)",
    "contact.time.any": "Any time",
    "contact.time.morning": "Morning",
    "contact.time.afternoon": "Afternoon",
    "contact.time.evening": "Evening",
    "form.requirements": "Fields marked required must be completed. All other fields are optional.",
    "form.review": "Review request",
    "review.kicker": "Final check",
    "review.title": "Review your request",
    "review.help": "Confirm that the details below are correct before sending.",
    "review.edit": "Edit details",
    "review.confirm": "Confirm and send",

    "form.submit": "Send",
    "form.assurance.private": "🔒 Your information is protected",
    "form.assurance.reply": "✓ Reply within 24 hours",
    "form.assurance.commitment": "✓ No commitment",

    "privacy.consent": "I agree to be contacted about my request and, when relevant, to have it shared with selected service partners as described in the privacy notice.",
    "privacy.link": "Privacy notice",
    "privacy.title": "Privacy notice",
    "privacy.p1": "LuxLanding collects the information you submit through this form so we can review your relocation request and contact you with relevant support.",
    "privacy.p2": "We may store your name, email, phone number, selected needs and message in our internal systems, including Supabase and email notifications. We do not sell your personal information.",
    "privacy.p3": "You can request access, correction or deletion of your information by contacting LuxLanding directly.",
    "privacy.notice.title": "Privacy notice",
    "privacy.notice.updated": "Last updated",
    "privacy.notice.p1": "LuxLanding is the controller for the information submitted through this form. We use it to assess your relocation request, respond to you and, where appropriate, connect you with a relevant service partner. Processing is based on your consent and on taking steps at your request before a possible service agreement.",
    "privacy.notice.p2": "We process the contact details, relocation profile, selected needs, message and limited campaign/referrer information you provide. Authorized LuxLanding administrators, hosting and email providers such as Supabase and Resend, and only the service partners selected for your request may receive the necessary information. We do not sell personal information.",
    "privacy.notice.p3": "We retain information only while it is needed to handle your request, follow up on the service and meet applicable legal or dispute-resolution obligations. Records are reviewed and deleted or anonymized when those purposes no longer require identification.",
    "privacy.notice.p4": "You may request access, correction, deletion, restriction or portability of your information, object where applicable, and withdraw consent at any time without affecting processing already carried out.",
    "privacy.notice.p5": "Some providers may process data outside the European Economic Area under applicable contractual and legal safeguards. You may ask us for information about those safeguards.",
    "privacy.notice.p6": "Contact us at contact@luxlanding.eu to exercise your rights. You may also lodge a complaint with Luxembourg’s National Commission for Data Protection (CNPD).",
    "privacy.notice.contact": "Click here to contact us",

    "thank.title": "Thank you!",
    "thank.text": "We’ve received your information and will get back to you shortly.",
    "thank.reference": "Request reference:",
    "thank.next.title": "What happens next?",
    "thank.next.review": "We review your situation and selected needs.",
    "thank.next.match": "We identify the most relevant next step or specialist.",
    "thank.next.contact": "You receive a reply by email, usually within 24 hours.",
    "thank.email_note": "If you do not see our reply, please check your spam folder.",

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
    "common.select": "Please select",

    "faq.toggle": "Frequently asked questions",
    "faq.eyebrow": "FAQ",
    "faq.title": "Frequently asked questions",
    "faq.q1": "What relocation services does LuxLanding help with?",
    "faq.a1": "LuxLanding helps with housing, administrative paperwork, banking, schools, childcare, language courses and moving services for people relocating to Luxembourg.",
    "faq.q2": "Who can use LuxLanding?",
    "faq.a2": "LuxLanding is built for expats, families, students, freelancers and professionals moving to Luxembourg or already settling in the country.",
    "faq.q3": "How quickly can I get help?",
    "faq.a3": "After you submit your request, LuxLanding reviews your situation and aims to reply with clear next steps within 24 hours.",

    "footer.tagline": "Relocation support for expats, families and professionals moving to Luxembourg.",
    "footer.faq": "FAQ",
    "footer.privacy": "Privacy notice",
    "footer.contact": "Contact us",
    "footer.rights": "All rights reserved."
  },

  fr: {
    "lang.title": "Choisissez votre langue",
    "nav.how": "Comment ça marche",
    "nav.services": "Services",
    "nav.start": "Commencer ma demande",
    "nav.cta": "Obtenir de l’aide",
    "trust.personal.title": "Accompagnement personnalisé",
    "trust.personal.text": "Un soutien adapté à votre situation",
    "trust.languages.title": "4 langues",
    "trust.languages.text": "Anglais, français, espagnol et portugais",
    "trust.response.title": "Réponse sous 24h",
    "trust.response.text": "Des prochaines étapes claires après votre demande",
    "meta.title": "Services de relocation au Luxembourg | LuxLanding",
    "meta.description": "Accompagnement relocation au Luxembourg pour expatriés et familles : logement, démarches, banque, écoles et installation.",
    "hero.badge": "Accompagnement relocation Luxembourg",
    "hero.title": "Installez-vous au Luxembourg avec le bon accompagnement dès le départ",
    "hero.text": "Trouvez les bons experts pour le logement, les démarches, la banque, les écoles et votre installation — selon votre situation exacte.",
    "hero.cta": "Trouver mon accompagnement",
    "hero.secondary": "Voir comment ça marche",
    "hero.proof": "Un accompagnement adapté aux expatriés, familles, étudiants et professionnels",
    "hero.urgency": "Demande rapide • Étapes claires • Réponse sous 24h",

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

    "seo.eyebrow": "Pourquoi LuxLanding",
    "seo.title": "Services de relocation au Luxembourg pour expatriés",
    "seo.p1": "S’installer au Luxembourg peut être complexe, surtout pour les expatriés et les professionnels internationaux. LuxLanding vous aide à vous installer plus facilement en vous mettant en relation avec des experts de confiance pour le logement, les démarches administratives, la banque, les écoles et un accompagnement relocation adapté à votre situation.",
    "seo.p2": "Que vous déménagiez pour le travail, avec votre famille ou pour commencer une nouvelle vie à l’étranger, notre plateforme simplifie le processus et vous aide à éviter les erreurs courantes. Trouvez le bon accompagnement et installez-vous au Luxembourg en toute confiance.",
    "seo.tag.schools": "Écoles",
    "seo.tag.moving": "Déménagement",

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
    "contact.phone.help": "Choisissez votre pays et saisissez le numéro sans l’indicatif international.",
    "contact.name.required": "Votre nom (obligatoire)",
    "contact.email.required": "Votre e-mail (obligatoire)",
    "contact.phone.optional": "Votre téléphone (facultatif)",
    "contact.method.required": "Comment devons-nous vous contacter ? (obligatoire)",
    "contact.method.whatsapp": "WhatsApp",
    "contact.method.email": "E-mail",
    "contact.method.phone": "Appel téléphonique",
    "contact.time.optional": "Meilleur moment pour vous contacter (facultatif)",
    "contact.time.any": "N’importe quand",
    "contact.time.morning": "Matin",
    "contact.time.afternoon": "Après-midi",
    "contact.time.evening": "Soir",
    "form.requirements": "Les champs marqués obligatoires doivent être remplis. Les autres sont facultatifs.",
    "form.review": "Vérifier la demande",
    "review.kicker": "Vérification finale",
    "review.title": "Vérifiez votre demande",
    "review.help": "Confirmez que les informations ci-dessous sont correctes avant l’envoi.",
    "review.edit": "Modifier",
    "review.confirm": "Confirmer et envoyer",

    "form.submit": "Envoyer",
    "form.assurance.private": "🔒 Vos informations sont protégées",
    "form.assurance.reply": "✓ Réponse sous 24 heures",
    "form.assurance.commitment": "✓ Sans engagement",

    "privacy.consent": "J’accepte d’être contacté(e) au sujet de ma demande et, si nécessaire, que celle-ci soit transmise à des partenaires de services sélectionnés comme décrit dans la notice de confidentialité.",
    "privacy.link": "Notice de confidentialité",
    "privacy.title": "Notice de confidentialité",
    "privacy.p1": "LuxLanding collecte les informations envoyées via ce formulaire afin d’analyser votre demande de relocation et de vous contacter avec un accompagnement adapté.",
    "privacy.p2": "Nous pouvons conserver votre nom, e-mail, téléphone, besoins sélectionnés et message dans nos systèmes internes, y compris Supabase et les notifications par e-mail. Nous ne vendons pas vos informations personnelles.",
    "privacy.p3": "Vous pouvez demander l’accès, la correction ou la suppression de vos informations en contactant directement LuxLanding.",
    "privacy.notice.title": "Notice de confidentialité",
    "privacy.notice.updated": "Dernière mise à jour",
    "privacy.notice.p1": "LuxLanding est responsable du traitement des informations envoyées via ce formulaire. Nous les utilisons pour évaluer votre demande de relocation, vous répondre et, le cas échéant, vous mettre en relation avec un partenaire de services pertinent. Le traitement repose sur votre consentement et sur les démarches effectuées à votre demande avant un éventuel accord de service.",
    "privacy.notice.p2": "Nous traitons les coordonnées, le profil de relocation, les besoins sélectionnés, le message et des informations limitées de campagne ou de provenance. Les administrateurs autorisés de LuxLanding, les prestataires d’hébergement et d’e-mail tels que Supabase et Resend, ainsi que les seuls partenaires sélectionnés pour votre demande, peuvent recevoir les informations nécessaires. Nous ne vendons pas les données personnelles.",
    "privacy.notice.p3": "Nous conservons les informations uniquement pendant la durée nécessaire au traitement de votre demande, au suivi du service et au respect des obligations légales ou liées aux litiges. Elles sont examinées puis supprimées ou anonymisées lorsque ces finalités ne nécessitent plus votre identification.",
    "privacy.notice.p4": "Vous pouvez demander l’accès, la rectification, l’effacement, la limitation ou la portabilité de vos informations, vous opposer au traitement lorsque ce droit s’applique et retirer votre consentement à tout moment sans affecter les traitements déjà réalisés.",
    "privacy.notice.p5": "Certains prestataires peuvent traiter des données hors de l’Espace économique européen avec les garanties contractuelles et légales applicables. Vous pouvez nous demander des informations sur ces garanties.",
    "privacy.notice.p6": "Contactez-nous à contact@luxlanding.eu pour exercer vos droits. Vous pouvez également introduire une réclamation auprès de la Commission nationale pour la protection des données (CNPD) du Luxembourg.",
    "privacy.notice.contact": "Cliquez ici pour nous contacter",

    "thank.title": "Merci !",
    "thank.text": "Nous avons bien reçu vos informations et reviendrons vers vous rapidement.",
    "thank.reference": "Référence de la demande :",
    "thank.next.title": "Que se passe-t-il ensuite ?",
    "thank.next.review": "Nous examinons votre situation et les besoins sélectionnés.",
    "thank.next.match": "Nous identifions la prochaine étape ou le spécialiste le plus pertinent.",
    "thank.next.contact": "Vous recevez une réponse par e-mail, généralement sous 24 heures.",
    "thank.email_note": "Si vous ne voyez pas notre réponse, vérifiez votre dossier de courriers indésirables.",

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
    "common.select": "Veuillez sélectionner",

    "faq.toggle": "Questions fréquentes",
    "faq.eyebrow": "FAQ",
    "faq.title": "Questions fréquentes",
    "faq.q1": "Avec quels services de relocation LuxLanding peut-il m’aider ?",
    "faq.a1": "LuxLanding aide pour le logement, les démarches administratives, la banque, les écoles, la garde d’enfants, les cours de langue et les services de déménagement pour les personnes qui s’installent au Luxembourg.",
    "faq.q2": "Qui peut utiliser LuxLanding ?",
    "faq.a2": "LuxLanding est conçu pour les expatriés, les familles, les étudiants, les freelances et les professionnels qui s’installent au Luxembourg ou y vivent déjà.",
    "faq.q3": "À quelle vitesse puis-je obtenir de l’aide ?",
    "faq.a3": "Après l’envoi de votre demande, LuxLanding analyse votre situation et s’efforce de répondre avec des étapes claires sous 24 heures.",

    "footer.tagline": "Accompagnement relocation pour les expatriés, familles et professionnels qui s’installent au Luxembourg.",
    "footer.faq": "FAQ",
    "footer.privacy": "Notice de confidentialité",
    "footer.contact": "Nous contacter",
    "footer.rights": "Tous droits réservés."
  },

  es: {
    "lang.title": "Elige tu idioma",
    "nav.how": "Cómo funciona",
    "nav.services": "Servicios",
    "nav.start": "Iniciar solicitud",
    "nav.cta": "Quiero ayuda",
    "trust.personal.title": "Orientación personalizada",
    "trust.personal.text": "Apoyo adaptado a tu situación",
    "trust.languages.title": "4 idiomas",
    "trust.languages.text": "Inglés, francés, español y portugués",
    "trust.response.title": "Respuesta en 24h",
    "trust.response.text": "Próximos pasos claros después de tu solicitud",
    "meta.title": "Servicios de relocation en Luxemburgo | LuxLanding",
    "meta.description": "Apoyo para mudarte a Luxemburgo: vivienda, trámites, banca, escuelas y servicios personalizados para expatriados y familias.",
    "hero.badge": "Apoyo relocation en Luxemburgo",
    "hero.title": "Múdate a Luxemburgo con la ayuda correcta desde el primer día",
    "hero.text": "Te conectamos con expertos de confianza en vivienda, trámites, banca, escuelas y relocation — según tu situación exacta.",
    "hero.cta": "Quiero ayuda ahora",
    "hero.secondary": "Ver cómo funciona",
    "hero.proof": "Apoyo personalizado para expatriados, familias, estudiantes y profesionales",
    "hero.urgency": "Solicitud rápida • Pasos claros • Respuesta en 24h",

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

    "seo.eyebrow": "Por qué LuxLanding",
    "seo.title": "Servicios de relocation en Luxemburgo para expatriados",
    "seo.p1": "Mudarse a Luxemburgo puede ser complejo, especialmente para expatriados y profesionales internacionales. LuxLanding te ayuda a instalarte con más tranquilidad conectándote con expertos de confianza en vivienda, trámites administrativos, banca, escuelas y apoyo de relocation adaptado a tu situación.",
    "seo.p2": "Ya sea que te mudes por trabajo, con tu familia o para empezar una nueva vida en el extranjero, nuestra plataforma simplifica el proceso y te ayuda a evitar errores comunes. Encuentra el apoyo adecuado y múdate a Luxemburgo con confianza.",
    "seo.tag.schools": "Escuelas",
    "seo.tag.moving": "Mudanza",

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
    "contact.phone.help": "Elige tu país e introduce el número sin el prefijo internacional.",
    "contact.name.required": "Tu nombre (obligatorio)",
    "contact.email.required": "Tu correo electrónico (obligatorio)",
    "contact.phone.optional": "Tu teléfono (opcional)",
    "contact.method.required": "¿Cómo debemos contactarte? (obligatorio)",
    "contact.method.whatsapp": "WhatsApp",
    "contact.method.email": "Correo electrónico",
    "contact.method.phone": "Llamada telefónica",
    "contact.time.optional": "Mejor horario para contactarte (opcional)",
    "contact.time.any": "Cualquier hora",
    "contact.time.morning": "Mañana",
    "contact.time.afternoon": "Tarde",
    "contact.time.evening": "Noche",
    "form.requirements": "Los campos marcados como obligatorios deben completarse. Los demás son opcionales.",
    "form.review": "Revisar solicitud",
    "review.kicker": "Comprobación final",
    "review.title": "Revisa tu solicitud",
    "review.help": "Confirma que los datos son correctos antes de enviarlos.",
    "review.edit": "Editar datos",
    "review.confirm": "Confirmar y enviar",

    "form.submit": "Enviar",
    "form.assurance.private": "🔒 Tu información está protegida",
    "form.assurance.reply": "✓ Respuesta en 24 horas",
    "form.assurance.commitment": "✓ Sin compromiso",

    "privacy.consent": "Acepto que me contacten sobre mi solicitud y, cuando corresponda, que se comparta con proveedores de servicios seleccionados según el aviso de privacidad.",
    "privacy.link": "Aviso de privacidad",
    "privacy.title": "Aviso de privacidad",
    "privacy.p1": "LuxLanding recopila la información que envías en este formulario para revisar tu solicitud de relocation y contactarte con apoyo relevante.",
    "privacy.p2": "Podemos guardar tu nombre, email, teléfono, necesidades seleccionadas y mensaje en nuestros sistemas internos, incluyendo Supabase y notificaciones por correo. No vendemos tu información personal.",
    "privacy.p3": "Puedes solicitar acceso, corrección o eliminación de tu información contactando directamente a LuxLanding.",
    "privacy.notice.title": "Aviso de privacidad",
    "privacy.notice.updated": "Última actualización",
    "privacy.notice.p1": "LuxLanding es el responsable del tratamiento de la información enviada mediante este formulario. La utilizamos para evaluar tu solicitud de relocation, responderte y, cuando proceda, ponerte en contacto con un proveedor de servicios adecuado. El tratamiento se basa en tu consentimiento y en las gestiones solicitadas antes de un posible acuerdo de servicio.",
    "privacy.notice.p2": "Tratamos los datos de contacto, el perfil de relocation, las necesidades seleccionadas, el mensaje y datos limitados de campaña o procedencia. Pueden recibir la información necesaria los administradores autorizados de LuxLanding, proveedores de alojamiento y correo como Supabase y Resend, y únicamente los proveedores seleccionados para tu solicitud. No vendemos datos personales.",
    "privacy.notice.p3": "Conservamos la información solo mientras sea necesaria para gestionar tu solicitud, dar seguimiento al servicio y cumplir obligaciones legales o relacionadas con disputas. Los registros se revisan y se eliminan o anonimizan cuando esas finalidades ya no requieren identificarte.",
    "privacy.notice.p4": "Puedes solicitar acceso, rectificación, eliminación, limitación o portabilidad, oponerte cuando corresponda y retirar tu consentimiento en cualquier momento sin afectar el tratamiento ya realizado.",
    "privacy.notice.p5": "Algunos proveedores pueden tratar datos fuera del Espacio Económico Europeo bajo las garantías contractuales y legales aplicables. Puedes pedirnos información sobre dichas garantías.",
    "privacy.notice.p6": "Escríbenos a contact@luxlanding.eu para ejercer tus derechos. También puedes presentar una reclamación ante la Comisión Nacional de Protección de Datos de Luxemburgo (CNPD).",
    "privacy.notice.contact": "Haz clic aquí para contactarnos",

    "thank.title": "¡Gracias!",
    "thank.text": "Hemos recibido tu información y te contactaremos pronto.",
    "thank.reference": "Referencia de la solicitud:",
    "thank.next.title": "¿Qué ocurre ahora?",
    "thank.next.review": "Revisamos tu situación y las necesidades seleccionadas.",
    "thank.next.match": "Identificamos el siguiente paso o especialista más relevante.",
    "thank.next.contact": "Recibes una respuesta por correo, normalmente en menos de 24 horas.",
    "thank.email_note": "Si no ves nuestra respuesta, revisa la carpeta de correo no deseado.",

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
    "common.select": "Por favor selecciona",

    "faq.toggle": "Preguntas frecuentes",
    "faq.eyebrow": "FAQ",
    "faq.title": "Preguntas frecuentes",
    "faq.q1": "¿Con qué servicios de relocation ayuda LuxLanding?",
    "faq.a1": "LuxLanding ayuda con vivienda, trámites administrativos, banca, escuelas, cuidado infantil, cursos de idiomas y servicios de mudanza para personas que se relocan a Luxemburgo.",
    "faq.q2": "¿Quién puede usar LuxLanding?",
    "faq.a2": "LuxLanding está pensado para expatriados, familias, estudiantes, freelancers y profesionales que se mudan a Luxemburgo o que ya están instalándose en el país.",
    "faq.q3": "¿Qué tan rápido puedo recibir ayuda?",
    "faq.a3": "Después de enviar tu solicitud, LuxLanding revisa tu situación y procura responder con próximos pasos claros dentro de 24 horas.",

    "footer.tagline": "Apoyo de relocation para expatriados, familias y profesionales que se mudan a Luxemburgo.",
    "footer.faq": "FAQ",
    "footer.privacy": "Aviso de privacidad",
    "footer.contact": "Contáctanos",
    "footer.rights": "Todos los derechos reservados."
  },

  pt: {
    "lang.title": "Escolha seu idioma",
    "nav.how": "Como funciona",
    "nav.services": "Serviços",
    "nav.start": "Iniciar pedido",
    "nav.cta": "Quero ajuda",
    "trust.personal.title": "Orientação personalizada",
    "trust.personal.text": "Suporte adaptado à sua situação",
    "trust.languages.title": "4 idiomas",
    "trust.languages.text": "Inglês, francês, espanhol e português",
    "trust.response.title": "Resposta em 24h",
    "trust.response.text": "Próximos passos claros após o seu pedido",
    "meta.title": "Serviços de relocation no Luxemburgo | LuxLanding",
    "meta.description": "Apoio para mudar para o Luxemburgo: moradia, documentação, banco, escolas e serviços personalizados para expatriados e famílias.",
    "hero.badge": "Suporte relocation no Luxemburgo",
    "hero.title": "Mude para o Luxemburgo com a ajuda certa desde o primeiro dia",
    "hero.text": "Conectamos você com especialistas de confiança em moradia, documentação, banco, escolas e relocation — de acordo com sua situação.",
    "hero.cta": "Quero ajuda agora",
    "hero.secondary": "Ver como funciona",
    "hero.proof": "Suporte personalizado para expatriados, famílias, estudantes e profissionais",
    "hero.urgency": "Pedido rápido • Próximos passos claros • Resposta em 24h",

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

    "seo.eyebrow": "Por que a LuxLanding",
    "seo.title": "Serviços de relocation no Luxemburgo para expatriados",
    "seo.p1": "Mudar-se para o Luxemburgo pode ser complexo, especialmente para expatriados e profissionais internacionais. A LuxLanding ajuda você a se instalar com mais tranquilidade, conectando você a especialistas de confiança em moradia, documentação, banco, escolas e suporte de relocation adaptado à sua situação.",
    "seo.p2": "Se você está se mudando por trabalho, com a família ou para começar uma nova vida no exterior, nossa plataforma simplifica o processo e ajuda você a evitar erros comuns. Encontre o suporte certo e mude-se para o Luxemburgo com confiança.",
    "seo.tag.schools": "Escolas",
    "seo.tag.moving": "Mudança",

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
    "contact.phone.help": "Escolha o seu país e introduza o número sem o indicativo internacional.",
    "contact.name.required": "Seu nome (obrigatório)",
    "contact.email.required": "Seu e-mail (obrigatório)",
    "contact.phone.optional": "Seu telefone (opcional)",
    "contact.method.required": "Como devemos entrar em contacto? (obrigatório)",
    "contact.method.whatsapp": "WhatsApp",
    "contact.method.email": "E-mail",
    "contact.method.phone": "Chamada telefónica",
    "contact.time.optional": "Melhor horário para contacto (opcional)",
    "contact.time.any": "Qualquer horário",
    "contact.time.morning": "Manhã",
    "contact.time.afternoon": "Tarde",
    "contact.time.evening": "Noite",
    "form.requirements": "Os campos marcados como obrigatórios devem ser preenchidos. Os restantes são opcionais.",
    "form.review": "Rever pedido",
    "review.kicker": "Verificação final",
    "review.title": "Reveja o seu pedido",
    "review.help": "Confirme se os dados abaixo estão corretos antes de enviar.",
    "review.edit": "Editar dados",
    "review.confirm": "Confirmar e enviar",

    "form.submit": "Enviar",
    "form.assurance.private": "🔒 As suas informações estão protegidas",
    "form.assurance.reply": "✓ Resposta em 24 horas",
    "form.assurance.commitment": "✓ Sem compromisso",

    "privacy.consent": "Aceito ser contactado sobre o meu pedido e, quando relevante, que ele seja partilhado com prestadores de serviços selecionados conforme descrito no aviso de privacidade.",
    "privacy.link": "Aviso de privacidade",
    "privacy.title": "Aviso de privacidade",
    "privacy.p1": "A LuxLanding coleta as informações enviadas neste formulário para analisar seu pedido de relocation e entrar em contato com suporte relevante.",
    "privacy.p2": "Podemos armazenar seu nome, e-mail, telefone, necessidades selecionadas e mensagem em nossos sistemas internos, incluindo Supabase e notificações por e-mail. Não vendemos suas informações pessoais.",
    "privacy.p3": "Você pode solicitar acesso, correção ou exclusão das suas informações entrando em contato diretamente com a LuxLanding.",
    "privacy.notice.title": "Aviso de privacidade",
    "privacy.notice.updated": "Última atualização",
    "privacy.notice.p1": "A LuxLanding é responsável pelo tratamento das informações enviadas através deste formulário. Utilizamo-las para avaliar o seu pedido de relocation, responder e, quando adequado, colocá-lo em contacto com um prestador de serviços relevante. O tratamento baseia-se no seu consentimento e nas diligências solicitadas antes de um possível acordo de serviço.",
    "privacy.notice.p2": "Tratamos os dados de contacto, o perfil de relocation, as necessidades selecionadas, a mensagem e dados limitados de campanha ou referência. Podem receber as informações necessárias os administradores autorizados da LuxLanding, fornecedores de alojamento e e-mail como Supabase e Resend, e apenas os prestadores selecionados para o seu pedido. Não vendemos dados pessoais.",
    "privacy.notice.p3": "Conservamos as informações apenas durante o período necessário para tratar o pedido, acompanhar o serviço e cumprir obrigações legais ou relacionadas com litígios. Os registos são revistos e eliminados ou anonimizados quando essas finalidades já não exigem identificação.",
    "privacy.notice.p4": "Pode solicitar acesso, retificação, eliminação, limitação ou portabilidade, opor-se quando aplicável e retirar o consentimento a qualquer momento sem afetar o tratamento já realizado.",
    "privacy.notice.p5": "Alguns fornecedores podem tratar dados fora do Espaço Económico Europeu ao abrigo das garantias contratuais e legais aplicáveis. Pode solicitar-nos informações sobre essas garantias.",
    "privacy.notice.p6": "Contacte-nos através de contact@luxlanding.eu para exercer os seus direitos. Também pode apresentar uma reclamação à Comissão Nacional de Proteção de Dados do Luxemburgo (CNPD).",
    "privacy.notice.contact": "Clique aqui para entrar em contato",

    "thank.title": "Obrigado!",
    "thank.text": "Recebemos suas informações e entraremos em contato em breve.",
    "thank.reference": "Referência do pedido:",
    "thank.next.title": "O que acontece agora?",
    "thank.next.review": "Analisamos a sua situação e as necessidades selecionadas.",
    "thank.next.match": "Identificamos o próximo passo ou especialista mais relevante.",
    "thank.next.contact": "Recebe uma resposta por e-mail, normalmente no prazo de 24 horas.",
    "thank.email_note": "Se não vir a nossa resposta, verifique a pasta de spam.",

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
    "common.select": "Por favor selecione",

    "faq.toggle": "Perguntas frequentes",
    "faq.eyebrow": "FAQ",
    "faq.title": "Perguntas frequentes",
    "faq.q1": "Com quais serviços de relocation a LuxLanding ajuda?",
    "faq.a1": "A LuxLanding ajuda com moradia, processos administrativos, banco, escolas, cuidados infantis, cursos de idioma e serviços de mudança para quem está se relocando para o Luxemburgo.",
    "faq.q2": "Quem pode usar a LuxLanding?",
    "faq.a2": "A LuxLanding foi criada para expatriados, famílias, estudantes, freelancers e profissionais que estão se mudando para o Luxemburgo ou já vivem no país.",
    "faq.q3": "Com que rapidez posso receber ajuda?",
    "faq.a3": "Depois de enviar seu pedido, a LuxLanding analisa sua situação e procura responder com próximos passos claros em até 24 horas.",

    "footer.tagline": "Suporte de relocation para expatriados, famílias e profissionais que se mudam para o Luxemburgo.",
    "footer.faq": "FAQ",
    "footer.privacy": "Aviso de privacidade",
    "footer.contact": "Fale connosco",
    "footer.rights": "Todos os direitos reservados."
  }
};

function applyLanguage(lang = window.currentLang || "en") {
  const dict = translations[lang] || translations.en;

  window.currentLang = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll(".lang-switch a[data-lang]").forEach(link => {
    link.classList.toggle("active", link.dataset.lang === lang);
  });

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

  const localizedUrl = lang === "en" ? "https://luxlanding.eu/" : `https://luxlanding.eu/?lang=${lang}`;
  const locale = { en: "en_US", fr: "fr_FR", es: "es_ES", pt: "pt_PT" }[lang] || "en_US";
  document.title = dict["meta.title"] || translations.en["meta.title"];
  document.querySelector('meta[name="language"]')?.setAttribute("content", lang);

  const metadata = [
    ['meta[name="description"]', dict["meta.description"]],
    ['meta[property="og:title"]', dict["meta.title"]],
    ['meta[property="og:description"]', dict["meta.description"]],
    ['meta[property="og:url"]', localizedUrl],
    ['meta[property="og:locale"]', locale],
    ['meta[name="twitter:title"]', dict["meta.title"]],
    ['meta[name="twitter:description"]', dict["meta.description"]]
  ];
  metadata.forEach(([selector, content]) => {
    const element = document.querySelector(selector);
    if (element && content) element.setAttribute("content", content);
  });

  document.querySelector('link[rel="canonical"]')?.setAttribute("href", localizedUrl);

  if (["http:", "https:"].includes(window.location.protocol)) {
    const browserUrl = new URL(window.location.href);
    if (lang === "en") browserUrl.searchParams.delete("lang");
    else browserUrl.searchParams.set("lang", lang);
    window.history.replaceState({ lang }, "", `${browserUrl.pathname}${browserUrl.search}${browserUrl.hash}`);
  }

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
