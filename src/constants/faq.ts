export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Comment déclencher une Alerte Violence sans toucher mon téléphone ?",
    answer:
      "Poussez un cri discret : le microphone le reconnaît et déclenche automatiquement l'alerte, la sirène et l'envoi de votre position à vos 3 contacts d'urgence. Vous pouvez aussi appuyer sur le bouton d'alerte manuelle si vous ne pouvez pas crier.",
  },
  {
    question: "Mes contacts d'urgence entendent-ils la sirène chez moi aussi ?",
    answer:
      "Non. La sirène ne sonne que sur les téléphones de vos contacts d'urgence, jamais sur le vôtre, afin de ne pas vous mettre davantage en danger.",
  },
  {
    question: "Comment un contact peut-il arrêter la sirène ?",
    answer:
      "Dès qu'une alerte arrive, un écran plein écran « SOS » s'affiche chez le contact avec un bouton pour couper la sirène et un bouton d'appel direct vers la personne en danger.",
  },
  {
    question: "Qui peut retrouver ma position dans Alerte Enlèvement ?",
    answer:
      "Uniquement les 3 numéros de confiance que vous avez enregistrés. Toute recherche depuis un autre numéro est automatiquement refusée et ne renvoie aucune position.",
  },
  {
    question: "Que se passe-t-il après les 30 jours d'essai Akwaba ?",
    answer:
      "Vous devez souscrire au forfait Premium (3 000 F CFA / an) via Orange Money, MTN Money, Moov Money ou Wave pour continuer à utiliser les rubriques Alerte Violence et Alerte Enlèvement.",
  },
  {
    question: "Puis-je changer mes contacts à tout moment ?",
    answer:
      "Oui, depuis chaque rubrique vous pouvez ajouter, modifier ou retirer vos contacts d'urgence et vos numéros de confiance librement.",
  },
  {
    question: "L'application remplace-t-elle la Police ou les secours ?",
    answer:
      "Non. En cas de danger immédiat, appelez toujours en priorité la Police (110/111), la Gendarmerie (170) ou les Sapeurs-Pompiers (180). L'application est un outil complémentaire.",
  },
];
