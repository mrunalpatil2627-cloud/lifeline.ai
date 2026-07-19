// LifeLine AI — Emergency Data (multi-language: English, Hindi, Marathi)
// These steps render INSTANTLY and work OFFLINE (cached by the service worker).
// Standard, publicly-taught first-aid guidance — not a diagnosis, never a replacement
// for calling emergency services or getting professional medical help.

const EMERGENCY_ORDER = [
  "burns", "choking", "snakebite", "stroke",
  "road_accident", "poisoning", "bleeding", "heart_attack", "drowning",
];

const EMERGENCY_DATA = {
  en: {
    burns: {
      label: "Burns", icon: "flame",
      severity: "Call 108 if burn is larger than palm size, on face/hands/genitals, or victim is a child/elderly.",
      immediate: ["Move away from the heat source", "Remove jewellery/tight clothing near the burn before it swells"],
      do: ["Run cool (not ice-cold) water over the burn for 15–20 minutes", "Cover loosely with a clean, dry cloth or cling film", "Give sips of water if the person is conscious and calm"],
      dont: ["Don't apply toothpaste, oil, butter or ice — they trap heat and cause infection", "Don't pop any blisters", "Don't pull off clothing stuck to the burn"],
      questions: [
        { id: "q1", text: "Is the person conscious and breathing normally?", type: "yesno", options: ["Yes", "No"], next: { yes: "q2", no: "CALL_NOW" } },
        { id: "q2", text: "How large is the burn area?", type: "choice", options: ["Smaller than a palm", "Larger than a palm", "Not sure"], next: { "*": "q3" } },
        { id: "q3", text: "Where is the burn located?", type: "choice", options: ["Arm / Leg", "Face / Neck", "Hands / Feet / Genitals", "Torso"], next: { "*": "DONE" } },
      ],
    },
    choking: {
      label: "Choking", icon: "wind",
      severity: "If the person cannot cough, speak, or breathe — act immediately, don't wait.",
      immediate: ["Ask loudly: \"Are you choking?\" — if they can cough or speak, encourage coughing", "If they cannot breathe/speak/cough: stand behind them, lean them forward"],
      do: ["Give 5 sharp back blows between the shoulder blades with the heel of your hand", "If that fails, give 5 abdominal thrusts (Heimlich): fist above navel, quick inward-upward pulls", "Alternate 5 back blows + 5 abdominal thrusts until object is out or help arrives", "If they become unconscious, lower them down gently and start CPR, call 108 immediately"],
      dont: ["Don't give water or food to a choking person", "Don't blindly sweep fingers in the mouth — you may push the object deeper", "Don't slap a child upside down or shake them"],
      questions: [
        { id: "q1", text: "Can the person cough, speak, or make sound?", type: "yesno", options: ["Yes", "No"], next: { yes: "q2", no: "DONE" } },
        { id: "q2", text: "Encourage them to keep coughing. Did the object come out?", type: "yesno", options: ["Yes", "No"], next: { "*": "DONE" } },
      ],
    },
    snakebite: {
      label: "Snakebite", icon: "activity",
      severity: "Treat every snakebite as venomous until proven otherwise. Call 108 immediately.",
      immediate: ["Keep the person as still and calm as possible — movement spreads venom faster", "Remove rings/watches near the bite before swelling starts", "Note the time of the bite"],
      do: ["Keep the bitten limb below heart level, loosely immobilised (like a splint)", "Get to a hospital with anti-venom as fast as possible", "If possible, safely note the snake's colour/pattern from a distance — don't chase or kill it"],
      dont: ["Don't cut the wound or try to suck out venom — it poisons the rescuer and doesn't help", "Don't apply a tight tourniquet — it can cause limb damage", "Don't apply ice or any herbal/traditional remedy to the bite", "Don't give the person alcohol or caffeine"],
      questions: [
        { id: "q1", text: "Is the person conscious?", type: "yesno", options: ["Yes", "No"], next: { "*": "q2" } },
        { id: "q2", text: "Can you identify the snake?", type: "yesno", options: ["Yes", "No"], next: { "*": "q3" } },
        { id: "q3", text: "Where was the bite?", type: "choice", options: ["Arm", "Leg", "Torso / Neck / Face"], next: { "*": "q4" } },
        { id: "q4", text: "Any symptoms appearing?", type: "choice", options: ["Swelling/pain only", "Difficulty breathing", "Vomiting/dizziness", "None yet"], next: { "*": "DONE" } },
      ],
    },
    stroke: {
      label: "Stroke", icon: "brain",
      severity: "FAST test positive = call 108 immediately. Every minute untreated costs brain cells.",
      immediate: ["Do the FAST test: Face drooping? Arm weakness? Speech slurred? Time to call 108", "Note the exact time symptoms started — this decides treatment options at the hospital"],
      do: ["Keep the person lying down with head/shoulders slightly raised", "Loosen tight clothing", "Stay with them, keep them calm, monitor breathing", "If unconscious but breathing, place in the recovery position (on their side)"],
      dont: ["Don't give any food, water, or medicine (including aspirin) — swallowing may be impaired", "Don't let them drive themselves anywhere", "Don't wait to \"see if it passes\" — every minute matters"],
      questions: [
        { id: "q1", text: "Is one side of the face drooping?", type: "yesno", options: ["Yes", "No"], next: { "*": "q2" } },
        { id: "q2", text: "Is one arm weak or drifting down when raised?", type: "yesno", options: ["Yes", "No"], next: { "*": "q3" } },
        { id: "q3", text: "Is their speech slurred or strange?", type: "yesno", options: ["Yes", "No"], next: { "*": "DONE" } },
      ],
    },
    road_accident: {
      label: "Road Accident", icon: "car",
      severity: "Check the scene is safe before approaching. Call 108 first if anyone is seriously hurt.",
      immediate: ["Check for danger first — oncoming traffic, fire, fuel leaks — before approaching", "Turn on hazard lights / place a warning triangle if you have one", "Call 108 and give exact location"],
      do: ["If the person is breathing, leave them in the position found unless in immediate danger", "Apply firm pressure to any severe bleeding with a clean cloth", "Keep them warm and still, talk to them calmly to keep them conscious", "If not breathing, start CPR"],
      dont: ["Don't move the person unless there's fire, traffic danger, or they need CPR", "Don't remove a motorcycle helmet unless they're not breathing", "Don't give food or water"],
      questions: [
        { id: "q1", text: "Is the scene safe to approach (no traffic/fire risk)?", type: "yesno", options: ["Yes", "No"], next: { yes: "q2", no: "DONE" } },
        { id: "q2", text: "Is the person conscious and breathing?", type: "yesno", options: ["Yes", "No"], next: { "*": "q3" } },
        { id: "q3", text: "Is there visible severe bleeding?", type: "yesno", options: ["Yes", "No"], next: { "*": "DONE" } },
      ],
    },
    poisoning: {
      label: "Poisoning", icon: "flask",
      severity: "Call 108 or Poison Control immediately. Keep the container/substance to show doctors.",
      immediate: ["Try to identify what was swallowed/inhaled/touched — keep the container or a sample", "Move the person to fresh air if it's a gas/fumes exposure"],
      do: ["Call 108 or a poison control helpline right away and describe the substance", "If it's on skin/eyes, rinse with running water for 15–20 minutes", "If they vomit, turn them on their side and keep the sample of vomit for doctors", "Keep them calm and monitor breathing until help arrives"],
      dont: ["Don't induce vomiting unless a medical professional specifically tells you to", "Don't give milk, salt water, or any \"home remedy\" — some worsen the poisoning", "Don't give anything by mouth if the person is drowsy or unconscious"],
      questions: [
        { id: "q1", text: "Is the person conscious?", type: "yesno", options: ["Yes", "No"], next: { "*": "q2" } },
        { id: "q2", text: "How was it taken in?", type: "choice", options: ["Swallowed", "Inhaled (gas/fumes)", "On skin or in eyes"], next: { "*": "q3" } },
        { id: "q3", text: "Do you know what the substance was?", type: "yesno", options: ["Yes", "No"], next: { "*": "DONE" } },
      ],
    },
    bleeding: {
      label: "Bleeding", icon: "droplet",
      severity: "Bleeding that won't stop after 10 minutes of firm pressure needs emergency care now.",
      immediate: ["Apply firm, direct pressure on the wound with a clean cloth or your hand", "Have the person lie down if possible"],
      do: ["Keep steady pressure for at least 10 minutes without peeking", "Once bleeding slows, bandage firmly (not so tight it cuts circulation)", "Raise the injured limb above heart level if no fracture is suspected", "Add more cloth on top if it soaks through — don't remove the first layer"],
      dont: ["Don't remove any object stuck in the wound — stabilise it and go to hospital", "Don't apply a tourniquet unless bleeding is life-threatening and pressure isn't working", "Don't keep checking/lifting the cloth to see if it's stopped — it restarts clotting"],
      questions: [
        { id: "q1", text: "Is the bleeding heavy or spurting?", type: "yesno", options: ["Yes", "No"], next: { "*": "q2" } },
        { id: "q2", text: "Is there an object embedded in the wound?", type: "yesno", options: ["Yes", "No"], next: { "*": "q3" } },
        { id: "q3", text: "Where is the wound?", type: "choice", options: ["Limb", "Torso", "Head / Neck"], next: { "*": "DONE" } },
      ],
    },
    heart_attack: {
      label: "Heart Attack", icon: "heart",
      severity: "Chest pain lasting more than a few minutes = call 108 immediately, don't drive yourself.",
      immediate: ["Call 108 immediately — don't wait to see if it passes", "Help the person sit down and rest in a comfortable position, loosen tight clothing"],
      do: ["If they have prescribed heart medication (like nitroglycerin), help them take it", "If they're not allergic and it's available, chewing an aspirin can help — but this is optional and not a substitute for calling 108", "If they become unconscious and stop breathing normally, start CPR right away"],
      dont: ["Don't let them convince you it's \"just gas\" and wait it out", "Don't let them drive themselves to the hospital", "Don't give food or water"],
      questions: [
        { id: "q1", text: "Is the person conscious and breathing?", type: "yesno", options: ["Yes", "No"], next: { yes: "q2", no: "DONE" } },
        { id: "q2", text: "Do they have chest pain, pressure, or pain spreading to arm/jaw?", type: "yesno", options: ["Yes", "No"], next: { "*": "q3" } },
        { id: "q3", text: "Do they have known heart medication with them?", type: "yesno", options: ["Yes", "No"], next: { "*": "DONE" } },
      ],
    },
    drowning: {
      label: "Drowning", icon: "waves",
      severity: "Every drowning victim needs medical evaluation, even if they seem fine afterward.",
      immediate: ["Get the person out of the water safely — use a stick/rope if you can't swim, don't jump in untrained", "Call 108 immediately, even if they seem okay"],
      do: ["Check if they're breathing — if not, start CPR immediately, before worrying about water in the lungs", "If breathing, lay them on their side, keep them warm with a blanket/dry clothes", "Keep monitoring — secondary drowning symptoms can appear hours later"],
      dont: ["Don't waste time trying to \"drain water\" from the lungs before starting CPR", "Don't let them go home without medical check, even if they seem fully recovered", "Don't attempt a rescue swim if you're not trained — throw or extend something instead"],
      questions: [
        { id: "q1", text: "Is the person out of the water now?", type: "yesno", options: ["Yes", "No"], next: { yes: "q2", no: "DONE" } },
        { id: "q2", text: "Are they breathing?", type: "yesno", options: ["Yes", "No"], next: { "*": "DONE" } },
      ],
    },
  },

  hi: {
    burns: {
      label: "जलना", icon: "flame",
      severity: "अगर जलन हथेली से बड़ी है, चेहरे/हाथ/गुप्तांगों पर है, या पीड़ित बच्चा/बुज़ुर्ग है, तो तुरंत 108 पर कॉल करें।",
      immediate: ["गर्मी के स्रोत से दूर हटें", "सूजन से पहले जलन के पास के गहने/तंग कपड़े हटा दें"],
      do: ["जलन पर 15-20 मिनट तक ठंडा (बर्फ जैसा नहीं) पानी डालें", "साफ, सूखे कपड़े या क्लिंग फिल्म से हल्के से ढकें", "अगर व्यक्ति होश में और शांत है तो थोड़ा पानी दें"],
      dont: ["टूथपेस्ट, तेल, मक्खन या बर्फ न लगाएं — ये गर्मी रोकते हैं और संक्रमण फैलाते हैं", "किसी भी छाले को न फोड़ें", "जलन से चिपके कपड़े को न खींचें"],
      questions: [
        { id: "q1", text: "क्या व्यक्ति होश में है और सामान्य रूप से सांस ले रहा है?", type: "yesno", options: ["हाँ", "नहीं"], next: { "हाँ": "q2", "नहीं": "CALL_NOW" } },
        { id: "q2", text: "जलन का क्षेत्र कितना बड़ा है?", type: "choice", options: ["हथेली से छोटा", "हथेली से बड़ा", "पता नहीं"], next: { "*": "q3" } },
        { id: "q3", text: "जलन कहाँ है?", type: "choice", options: ["हाथ / पैर", "चेहरा / गर्दन", "हाथ / पैर के तलवे / गुप्तांग", "धड़"], next: { "*": "DONE" } },
      ],
    },
    choking: {
      label: "दम घुटना", icon: "wind",
      severity: "अगर व्यक्ति खांस, बोल या सांस नहीं ले पा रहा — तुरंत कार्रवाई करें, इंतज़ार न करें।",
      immediate: ["ज़ोर से पूछें: \"क्या तुम्हारा दम घुट रहा है?\" — अगर वे खांस या बोल सकते हैं, तो खांसने के लिए कहें", "अगर वे सांस/बोल/खांस नहीं पा रहे: उनके पीछे खड़े हों, उन्हें आगे झुकाएं"],
      do: ["कंधे के ब्लेड के बीच हथेली से 5 तेज़ थपकी दें", "अगर असफल हो, तो 5 पेट पर दबाव (हाइमलिक) दें: नाभि के ऊपर मुट्ठी, तेज़ी से अंदर-ऊपर खींचें", "5 पीठ पर थपकी + 5 पेट पर दबाव बारी-बारी से दें जब तक चीज़ बाहर न निकले या मदद न आए", "अगर वे बेहोश हो जाएं, धीरे से लिटाएं और CPR शुरू करें, तुरंत 108 पर कॉल करें"],
      dont: ["दम घुटते व्यक्ति को पानी या खाना न दें", "मुंह में बिना देखे उंगलियां न घुमाएं — इससे चीज़ और अंदर जा सकती है", "बच्चे को उल्टा करके न मारें या हिलाएं नहीं"],
      questions: [
        { id: "q1", text: "क्या व्यक्ति खांस, बोल या आवाज़ निकाल सकता है?", type: "yesno", options: ["हाँ", "नहीं"], next: { "हाँ": "q2", "नहीं": "DONE" } },
        { id: "q2", text: "उन्हें खांसते रहने के लिए प्रोत्साहित करें। क्या चीज़ बाहर निकली?", type: "yesno", options: ["हाँ", "नहीं"], next: { "*": "DONE" } },
      ],
    },
    snakebite: {
      label: "साँप का काटना", icon: "activity",
      severity: "हर साँप के काटने को ज़हरीला मानें जब तक साबित न हो। तुरंत 108 पर कॉल करें।",
      immediate: ["व्यक्ति को जितना हो सके स्थिर और शांत रखें — हिलने से ज़हर तेज़ी से फैलता है", "सूजन शुरू होने से पहले काटने के पास की अंगूठी/घड़ी हटाएं", "काटने का समय नोट करें"],
      do: ["काटे गए अंग को दिल के स्तर से नीचे रखें, हल्के से स्थिर करें (स्प्लिंट की तरह)", "जितनी जल्दी हो सके एंटी-वेनम वाले अस्पताल पहुंचें", "अगर संभव हो, दूर से सुरक्षित रूप से साँप का रंग/पैटर्न नोट करें — उसका पीछा न करें या मारें नहीं"],
      dont: ["घाव को न काटें या ज़हर चूसने की कोशिश न करें — इससे बचाने वाला भी ज़हरीला हो सकता है और यह मदद नहीं करता", "कसकर टूर्निकेट न बांधें — इससे अंग को नुकसान हो सकता है", "काटने पर बर्फ या कोई घरेलू/पारंपरिक उपाय न लगाएं", "व्यक्ति को शराब या कैफीन न दें"],
      questions: [
        { id: "q1", text: "क्या व्यक्ति होश में है?", type: "yesno", options: ["हाँ", "नहीं"], next: { "*": "q2" } },
        { id: "q2", text: "क्या आप साँप को पहचान सकते हैं?", type: "yesno", options: ["हाँ", "नहीं"], next: { "*": "q3" } },
        { id: "q3", text: "काटने की जगह कहाँ है?", type: "choice", options: ["हाथ", "पैर", "धड़ / गर्दन / चेहरा"], next: { "*": "q4" } },
        { id: "q4", text: "क्या कोई लक्षण दिख रहे हैं?", type: "choice", options: ["सिर्फ सूजन/दर्द", "सांस लेने में दिक्कत", "उल्टी/चक्कर", "अभी तक कोई नहीं"], next: { "*": "DONE" } },
      ],
    },
    stroke: {
      label: "लकवा (स्ट्रोक)", icon: "brain",
      severity: "FAST टेस्ट पॉज़िटिव = तुरंत 108 पर कॉल करें। हर मिनट बिना इलाज के दिमाग की कोशिकाओं का नुकसान होता है।",
      immediate: ["FAST टेस्ट करें: चेहरा लटक रहा है? हाथ कमज़ोर है? बोलने में लड़खड़ाहट है? 108 पर कॉल करने का समय", "लक्षण शुरू होने का सही समय नोट करें — यह अस्पताल में इलाज का फैसला करता है"],
      do: ["व्यक्ति को लिटाएं, सिर/कंधे थोड़े ऊपर रखें", "तंग कपड़े ढीले करें", "उनके साथ रहें, शांत रखें, सांस पर नज़र रखें", "अगर बेहोश हैं पर सांस ले रहे हैं, तो उन्हें रिकवरी पोज़िशन में करवट पर लिटाएं"],
      dont: ["कोई भी खाना, पानी या दवा (एस्प्रिन सहित) न दें — निगलने की क्षमता प्रभावित हो सकती है", "उन्हें खुद गाड़ी चलाने न दें", "\"शायद ठीक हो जाएगा\" सोचकर इंतज़ार न करें — हर मिनट कीमती है"],
      questions: [
        { id: "q1", text: "क्या चेहरे का एक हिस्सा लटक रहा है?", type: "yesno", options: ["हाँ", "नहीं"], next: { "*": "q2" } },
        { id: "q2", text: "क्या उठाने पर एक हाथ कमज़ोर है या नीचे गिर रहा है?", type: "yesno", options: ["हाँ", "नहीं"], next: { "*": "q3" } },
        { id: "q3", text: "क्या उनकी बोली लड़खड़ा रही है या अजीब लग रही है?", type: "yesno", options: ["हाँ", "नहीं"], next: { "*": "DONE" } },
      ],
    },
    road_accident: {
      label: "सड़क दुर्घटना", icon: "car",
      severity: "पास जाने से पहले जगह सुरक्षित है यह जांचें। अगर कोई गंभीर रूप से घायल है तो पहले 108 पर कॉल करें।",
      immediate: ["पास जाने से पहले खतरे की जांच करें — आता हुआ ट्रैफिक, आग, ईंधन का रिसाव", "हैज़र्ड लाइट चालू करें / अगर हो तो चेतावनी त्रिकोण रखें", "108 पर कॉल करें और सही जगह बताएं"],
      do: ["अगर व्यक्ति सांस ले रहा है, तो जब तक तुरंत खतरा न हो, उन्हें उसी स्थिति में रहने दें", "किसी भी गंभीर खून बहने पर साफ कपड़े से मज़बूती से दबाव डालें", "उन्हें गर्म और स्थिर रखें, होश में रखने के लिए शांति से बात करें", "अगर सांस नहीं चल रही, CPR शुरू करें"],
      dont: ["व्यक्ति को न हिलाएं जब तक आग, ट्रैफिक का खतरा न हो या CPR की ज़रूरत न हो", "मोटरसाइकिल हेलमेट न हटाएं जब तक वे सांस न ले रहे हों", "खाना या पानी न दें"],
      questions: [
        { id: "q1", text: "क्या पास जाना सुरक्षित है (ट्रैफिक/आग का खतरा नहीं)?", type: "yesno", options: ["हाँ", "नहीं"], next: { "हाँ": "q2", "नहीं": "DONE" } },
        { id: "q2", text: "क्या व्यक्ति होश में है और सांस ले रहा है?", type: "yesno", options: ["हाँ", "नहीं"], next: { "*": "q3" } },
        { id: "q3", text: "क्या गंभीर खून बहता दिख रहा है?", type: "yesno", options: ["हाँ", "नहीं"], next: { "*": "DONE" } },
      ],
    },
    poisoning: {
      label: "ज़हर", icon: "flask",
      severity: "तुरंत 108 या पॉइज़न कंट्रोल पर कॉल करें। डिब्बा/पदार्थ डॉक्टरों को दिखाने के लिए रखें।",
      immediate: ["पता लगाने की कोशिश करें कि क्या निगला/सांस में लिया/छुआ गया — डिब्बा या नमूना रखें", "अगर गैस/धुएं का मामला है तो व्यक्ति को खुली हवा में ले जाएं"],
      do: ["तुरंत 108 या पॉइज़न कंट्रोल हेल्पलाइन पर कॉल करें और पदार्थ के बारे में बताएं", "अगर त्वचा/आंखों पर है, तो 15-20 मिनट तक बहते पानी से धोएं", "अगर उल्टी हो, उन्हें करवट पर लिटाएं और डॉक्टरों के लिए उल्टी का नमूना रखें", "मदद आने तक उन्हें शांत रखें और सांस पर नज़र रखें"],
      dont: ["जब तक डॉक्टर खासतौर पर न कहें, उल्टी न कराएं", "दूध, नमक का पानी, या कोई \"घरेलू उपाय\" न दें — कुछ ज़हर को और बदतर बना सकते हैं", "अगर व्यक्ति नींद में है या बेहोश है तो मुंह से कुछ भी न दें"],
      questions: [
        { id: "q1", text: "क्या व्यक्ति होश में है?", type: "yesno", options: ["हाँ", "नहीं"], next: { "*": "q2" } },
        { id: "q2", text: "यह शरीर में कैसे गया?", type: "choice", options: ["निगला गया", "सांस में लिया (गैस/धुआं)", "त्वचा या आंखों पर"], next: { "*": "q3" } },
        { id: "q3", text: "क्या आपको पता है कि वह पदार्थ क्या था?", type: "yesno", options: ["हाँ", "नहीं"], next: { "*": "DONE" } },
      ],
    },
    bleeding: {
      label: "खून बहना", icon: "droplet",
      severity: "अगर 10 मिनट तक मज़बूत दबाव के बाद भी खून बहना न रुके, तो तुरंत आपातकालीन देखभाल ज़रूरी है।",
      immediate: ["साफ कपड़े या अपने हाथ से घाव पर सीधा, मज़बूत दबाव डालें", "अगर संभव हो तो व्यक्ति को लिटाएं"],
      do: ["बिना देखे कम से कम 10 मिनट तक लगातार दबाव बनाए रखें", "खून बहना धीमा होने पर मज़बूती से पट्टी बांधें (इतनी तंग नहीं कि खून रुक जाए)", "अगर हड्डी टूटने का शक न हो, घायल अंग को दिल के स्तर से ऊपर उठाएं", "अगर कपड़ा भीग जाए तो ऊपर और कपड़ा डालें — पहली परत न हटाएं"],
      dont: ["घाव में फंसी किसी चीज़ को न निकालें — उसे स्थिर करके अस्पताल जाएं", "जब तक खून बहना जानलेवा न हो और दबाव काम न कर रहा हो, टूर्निकेट न लगाएं", "यह देखने के लिए बार-बार कपड़ा न उठाएं कि खून रुका या नहीं — इससे थक्का बनना फिर से शुरू हो जाता है"],
      questions: [
        { id: "q1", text: "क्या खून बहुत तेज़ या फव्वारे जैसा बह रहा है?", type: "yesno", options: ["हाँ", "नहीं"], next: { "*": "q2" } },
        { id: "q2", text: "क्या घाव में कोई चीज़ फंसी है?", type: "yesno", options: ["हाँ", "नहीं"], next: { "*": "q3" } },
        { id: "q3", text: "घाव कहाँ है?", type: "choice", options: ["हाथ / पैर", "धड़", "सिर / गर्दन"], next: { "*": "DONE" } },
      ],
    },
    heart_attack: {
      label: "दिल का दौरा", icon: "heart",
      severity: "कुछ मिनटों से ज़्यादा सीने में दर्द = तुरंत 108 पर कॉल करें, खुद गाड़ी न चलाएं।",
      immediate: ["तुरंत 108 पर कॉल करें — यह देखने के लिए इंतज़ार न करें कि दर्द चला जाएगा या नहीं", "व्यक्ति को आराम से बैठाएं, तंग कपड़े ढीले करें"],
      do: ["अगर उनके पास दिल की तय दवा है (जैसे नाइट्रोग्लिसरीन), उन्हें लेने में मदद करें", "अगर उन्हें एलर्जी नहीं है और उपलब्ध है, तो एस्प्रिन चबाना मदद कर सकता है — लेकिन यह वैकल्पिक है, 108 पर कॉल करने का विकल्प नहीं", "अगर वे बेहोश हो जाएं और सामान्य रूप से सांस लेना बंद कर दें, तुरंत CPR शुरू करें"],
      dont: ["उन्हें यह मनाने न दें कि यह \"सिर्फ गैस\" है और इंतज़ार न करें", "उन्हें खुद अस्पताल गाड़ी चलाकर जाने न दें", "खाना या पानी न दें"],
      questions: [
        { id: "q1", text: "क्या व्यक्ति होश में है और सांस ले रहा है?", type: "yesno", options: ["हाँ", "नहीं"], next: { "हाँ": "q2", "नहीं": "DONE" } },
        { id: "q2", text: "क्या उन्हें सीने में दर्द, दबाव, या हाथ/जबड़े तक फैलता दर्द है?", type: "yesno", options: ["हाँ", "नहीं"], next: { "*": "q3" } },
        { id: "q3", text: "क्या उनके पास दिल की जानी-मानी दवा है?", type: "yesno", options: ["हाँ", "नहीं"], next: { "*": "DONE" } },
      ],
    },
    drowning: {
      label: "डूबना", icon: "waves",
      severity: "हर डूबने वाले व्यक्ति को मेडिकल जांच ज़रूरी है, भले ही वे बाद में ठीक लगें।",
      immediate: ["व्यक्ति को सुरक्षित रूप से पानी से बाहर निकालें — अगर तैरना नहीं आता तो डंडा/रस्सी इस्तेमाल करें, बिना ट्रेनिंग के कूदें नहीं", "तुरंत 108 पर कॉल करें, भले ही वे ठीक लगें"],
      do: ["जांचें कि वे सांस ले रहे हैं या नहीं — अगर नहीं, तो फेफड़ों में पानी की चिंता किए बिना तुरंत CPR शुरू करें", "अगर सांस ले रहे हैं, उन्हें करवट पर लिटाएं, कंबल/सूखे कपड़ों से गर्म रखें", "नज़र रखते रहें — सेकंडरी डूबने के लक्षण घंटों बाद भी दिख सकते हैं"],
      dont: ["CPR शुरू करने से पहले फेफड़ों से \"पानी निकालने\" की कोशिश में समय बर्बाद न करें", "भले ही वे पूरी तरह ठीक लगें, बिना मेडिकल जांच के घर न जाने दें", "अगर ट्रेनिंग नहीं है तो बचाव के लिए खुद तैरने की कोशिश न करें — कुछ फेंकें या बढ़ाएं"],
      questions: [
        { id: "q1", text: "क्या व्यक्ति अब पानी से बाहर है?", type: "yesno", options: ["हाँ", "नहीं"], next: { "हाँ": "q2", "नहीं": "DONE" } },
        { id: "q2", text: "क्या वे सांस ले रहे हैं?", type: "yesno", options: ["हाँ", "नहीं"], next: { "*": "DONE" } },
      ],
    },
  },

  mr: {
    burns: {
      label: "भाजणे", icon: "flame",
      severity: "जळजळ तळहातापेक्षा मोठी असेल, चेहरा/हात/जननेंद्रियांवर असेल, किंवा पीडित लहान मूल/वृद्ध असेल, तर लगेच 108 वर कॉल करा.",
      immediate: ["उष्णतेच्या स्रोतापासून दूर व्हा", "सूज येण्यापूर्वी जळजळीजवळचे दागिने/घट्ट कपडे काढा"],
      do: ["जळजळीवर 15-20 मिनिटे थंड (बर्फासारखे नाही) पाणी घाला", "स्वच्छ, कोरड्या कापडाने किंवा क्लिंग फिल्मने सैलसर झाका", "व्यक्ती शुद्धीत आणि शांत असेल तर थोडे पाणी द्या"],
      dont: ["टूथपेस्ट, तेल, लोणी किंवा बर्फ लावू नका — यामुळे उष्णता अडकते आणि संसर्ग होतो", "कोणतेही फोड फोडू नका", "जळजळीला चिकटलेले कपडे ओढू नका"],
      questions: [
        { id: "q1", text: "व्यक्ती शुद्धीत आहे आणि सामान्यपणे श्वास घेत आहे का?", type: "yesno", options: ["होय", "नाही"], next: { "होय": "q2", "नाही": "CALL_NOW" } },
        { id: "q2", text: "जळजळीचा भाग किती मोठा आहे?", type: "choice", options: ["तळहातापेक्षा लहान", "तळहातापेक्षा मोठा", "माहीत नाही"], next: { "*": "q3" } },
        { id: "q3", text: "जळजळ कुठे आहे?", type: "choice", options: ["हात / पाय", "चेहरा / मान", "हात / पायाचे तळवे / जननेंद्रिय", "धड"], next: { "*": "DONE" } },
      ],
    },
    choking: {
      label: "श्वास कोंडणे", icon: "wind",
      severity: "जर व्यक्तीला खोकता, बोलता किंवा श्वास घेता येत नसेल — लगेच कृती करा, थांबू नका.",
      immediate: ["मोठ्याने विचारा: \"तुझा श्वास कोंडतोय का?\" — जर ते खोकू किंवा बोलू शकत असतील, तर खोकण्यास प्रोत्साहन द्या", "जर ते श्वास/बोलू/खोकू शकत नसतील: त्यांच्या मागे उभे राहा, त्यांना पुढे वाकवा"],
      do: ["खांद्याच्या हाडांमध्ये तळहाताने 5 जोरदार थपडा द्या", "ते अयशस्वी झाल्यास, 5 पोटावर दाब (हायम्लिक) द्या: नाभीच्या वर मूठ, वेगाने आत-वर खेचा", "5 पाठीवर थपडा + 5 पोटावर दाब आलटून-पालटून द्या, वस्तू बाहेर येईपर्यंत किंवा मदत येईपर्यंत", "ते बेशुद्ध झाल्यास, हळूवारपणे झोपवा आणि CPR सुरू करा, लगेच 108 वर कॉल करा"],
      dont: ["श्वास कोंडलेल्या व्यक्तीला पाणी किंवा अन्न देऊ नका", "तोंडात न बघता बोटे फिरवू नका — यामुळे वस्तू आणखी आत जाऊ शकते", "मुलाला उलटे धरून मारू नका किंवा हलवू नका"],
      questions: [
        { id: "q1", text: "व्यक्ती खोकू, बोलू किंवा आवाज काढू शकते का?", type: "yesno", options: ["होय", "नाही"], next: { "होय": "q2", "नाही": "DONE" } },
        { id: "q2", text: "त्यांना खोकत राहण्यास प्रोत्साहन द्या. वस्तू बाहेर आली का?", type: "yesno", options: ["होय", "नाही"], next: { "*": "DONE" } },
      ],
    },
    snakebite: {
      label: "सापाचा दंश", icon: "activity",
      severity: "सिद्ध होईपर्यंत प्रत्येक सर्पदंश विषारी समजा. लगेच 108 वर कॉल करा.",
      immediate: ["व्यक्तीला शक्य तितके स्थिर आणि शांत ठेवा — हालचालीमुळे विष वेगाने पसरते", "सूज येण्यापूर्वी दंशाजवळच्या अंगठ्या/घड्याळ काढा", "दंशाची वेळ नोंदवा"],
      do: ["दंश झालेला अवयव हृदयाच्या पातळीच्या खाली ठेवा, सैलसर स्थिर करा (स्प्लिंटसारखे)", "शक्य तितक्या लवकर अँटी-व्हेनम असलेल्या रुग्णालयात पोहोचा", "शक्य असल्यास, दुरून सुरक्षितपणे सापाचा रंग/नमुना लक्षात ठेवा — त्याचा पाठलाग करू नका किंवा मारू नका"],
      dont: ["जखम कापू नका किंवा विष शोषण्याचा प्रयत्न करू नका — यामुळे मदत करणारी व्यक्तीही विषबाधित होते आणि याचा उपयोग होत नाही", "घट्ट टूर्निकेट लावू नका — यामुळे अवयवाला नुकसान होऊ शकते", "दंशावर बर्फ किंवा कोणताही घरगुती/पारंपरिक उपाय लावू नका", "व्यक्तीला दारू किंवा कॅफिन देऊ नका"],
      questions: [
        { id: "q1", text: "व्यक्ती शुद्धीत आहे का?", type: "yesno", options: ["होय", "नाही"], next: { "*": "q2" } },
        { id: "q2", text: "तुम्ही सापाची ओळख पटवू शकता का?", type: "yesno", options: ["होय", "नाही"], next: { "*": "q3" } },
        { id: "q3", text: "दंश कुठे झाला?", type: "choice", options: ["हात", "पाय", "धड / मान / चेहरा"], next: { "*": "q4" } },
        { id: "q4", text: "काही लक्षणे दिसत आहेत का?", type: "choice", options: ["फक्त सूज/वेदना", "श्वास घेण्यास त्रास", "उलटी/चक्कर", "अजून काहीही नाही"], next: { "*": "DONE" } },
      ],
    },
    stroke: {
      label: "पक्षाघात (स्ट्रोक)", icon: "brain",
      severity: "FAST चाचणी पॉझिटिव्ह = लगेच 108 वर कॉल करा. उपचाराशिवाय प्रत्येक मिनिटाला मेंदूच्या पेशी नष्ट होतात.",
      immediate: ["FAST चाचणी करा: चेहरा लटकतोय का? हात कमकुवत आहे का? बोलणे अस्पष्ट आहे का? 108 वर कॉल करण्याची वेळ", "लक्षणे सुरू झाल्याची नेमकी वेळ नोंदवा — यावरून रुग्णालयातील उपचार ठरतो"],
      do: ["व्यक्तीला झोपवा, डोके/खांदे थोडे उंच ठेवा", "घट्ट कपडे सैल करा", "त्यांच्यासोबत रहा, शांत ठेवा, श्वासावर लक्ष ठेवा", "बेशुद्ध पण श्वास घेत असल्यास, त्यांना कुशीवर रिकव्हरी पोझिशनमध्ये झोपवा"],
      dont: ["कोणतेही अन्न, पाणी किंवा औषध (अ‍ॅस्पिरिनसह) देऊ नका — गिळण्याची क्षमता बाधित असू शकते", "त्यांना स्वतः गाडी चालवू देऊ नका", "\"बरं होईल\" असे समजून थांबू नका — प्रत्येक मिनिट महत्त्वाचा आहे"],
      questions: [
        { id: "q1", text: "चेहऱ्याची एक बाजू लटकत आहे का?", type: "yesno", options: ["होय", "नाही"], next: { "*": "q2" } },
        { id: "q2", text: "उचलताना एक हात कमकुवत आहे किंवा खाली पडतोय का?", type: "yesno", options: ["होय", "नाही"], next: { "*": "q3" } },
        { id: "q3", text: "त्यांचे बोलणे अस्पष्ट किंवा विचित्र आहे का?", type: "yesno", options: ["होय", "नाही"], next: { "*": "DONE" } },
      ],
    },
    road_accident: {
      label: "रस्ता अपघात", icon: "car",
      severity: "जवळ जाण्यापूर्वी जागा सुरक्षित आहे का ते तपासा. कोणी गंभीर जखमी असल्यास आधी 108 वर कॉल करा.",
      immediate: ["जवळ जाण्यापूर्वी धोका तपासा — येणारी वाहतूक, आग, इंधन गळती", "हॅझर्ड लाइट्स चालू करा / असल्यास चेतावणी त्रिकोण ठेवा", "108 वर कॉल करा आणि नेमके स्थान सांगा"],
      do: ["व्यक्ती श्वास घेत असल्यास, तात्काळ धोका नसल्यास त्यांना त्याच स्थितीत राहू द्या", "गंभीर रक्तस्रावावर स्वच्छ कापडाने घट्ट दाब द्या", "त्यांना उबदार आणि स्थिर ठेवा, शुद्धीत ठेवण्यासाठी शांतपणे बोला", "श्वास घेत नसल्यास CPR सुरू करा"],
      dont: ["आग, वाहतुकीचा धोका किंवा CPR ची गरज नसल्यास व्यक्तीला हलवू नका", "श्वास घेत नसल्याशिवाय मोटरसायकल हेल्मेट काढू नका", "अन्न किंवा पाणी देऊ नका"],
      questions: [
        { id: "q1", text: "जवळ जाणे सुरक्षित आहे का (वाहतूक/आगीचा धोका नाही)?", type: "yesno", options: ["होय", "नाही"], next: { "होय": "q2", "नाही": "DONE" } },
        { id: "q2", text: "व्यक्ती शुद्धीत आहे आणि श्वास घेत आहे का?", type: "yesno", options: ["होय", "नाही"], next: { "*": "q3" } },
        { id: "q3", text: "गंभीर रक्तस्राव दिसतोय का?", type: "yesno", options: ["होय", "नाही"], next: { "*": "DONE" } },
      ],
    },
    poisoning: {
      label: "विषबाधा", icon: "flask",
      severity: "लगेच 108 किंवा पॉइझन कंट्रोलला कॉल करा. डॉक्टरांना दाखवण्यासाठी डबा/पदार्थ जपून ठेवा.",
      immediate: ["काय गिळले/श्वासात घेतले/स्पर्श केले हे ओळखण्याचा प्रयत्न करा — डबा किंवा नमुना ठेवा", "गॅस/धुराचा संपर्क असल्यास व्यक्तीला मोकळ्या हवेत न्या"],
      do: ["लगेच 108 किंवा पॉइझन कंट्रोल हेल्पलाइनला कॉल करून पदार्थाबद्दल सांगा", "त्वचा/डोळ्यांवर असल्यास, 15-20 मिनिटे वाहत्या पाण्याने धुवा", "उलटी झाल्यास, त्यांना कुशीवर वळवा आणि डॉक्टरांसाठी उलटीचा नमुना ठेवा", "मदत येईपर्यंत त्यांना शांत ठेवा आणि श्वासावर लक्ष ठेवा"],
      dont: ["डॉक्टरांनी विशेषतः सांगितल्याशिवाय उलटी करवू नका", "दूध, मिठाचे पाणी, किंवा कोणताही \"घरगुती उपाय\" देऊ नका — काही विषबाधा आणखी वाढवू शकतात", "व्यक्ती झोपाळू किंवा बेशुद्ध असल्यास तोंडावाटे काहीही देऊ नका"],
      questions: [
        { id: "q1", text: "व्यक्ती शुद्धीत आहे का?", type: "yesno", options: ["होय", "नाही"], next: { "*": "q2" } },
        { id: "q2", text: "हे शरीरात कसे गेले?", type: "choice", options: ["गिळले", "श्वासात घेतले (गॅस/धूर)", "त्वचेवर किंवा डोळ्यांत"], next: { "*": "q3" } },
        { id: "q3", text: "पदार्थ काय होता हे तुम्हाला माहीत आहे का?", type: "yesno", options: ["होय", "नाही"], next: { "*": "DONE" } },
      ],
    },
    bleeding: {
      label: "रक्तस्राव", icon: "droplet",
      severity: "10 मिनिटे घट्ट दाब देऊनही रक्तस्राव थांबत नसेल, तर आता तातडीची वैद्यकीय मदत आवश्यक आहे.",
      immediate: ["स्वच्छ कापडाने किंवा हाताने जखमेवर थेट, घट्ट दाब द्या", "शक्य असल्यास व्यक्तीला झोपवा"],
      do: ["न बघता किमान 10 मिनिटे सतत दाब ठेवा", "रक्तस्राव कमी झाल्यावर घट्ट पट्टी बांधा (रक्तप्रवाह थांबेल इतकी घट्ट नको)", "हाड मोडल्याचा संशय नसल्यास जखमी अवयव हृदयाच्या पातळीपेक्षा वर उचला", "कापड भिजल्यास त्यावर आणखी कापड ठेवा — पहिला थर काढू नका"],
      dont: ["जखमेत अडकलेली कोणतीही वस्तू काढू नका — ती स्थिर करून रुग्णालयात जा", "रक्तस्राव जीवघेणा नसेल आणि दाब काम करत असेल तर टूर्निकेट लावू नका", "थांबले का हे बघण्यासाठी वारंवार कापड उचलू नका — यामुळे गुठळी होण्याची प्रक्रिया पुन्हा सुरू होते"],
      questions: [
        { id: "q1", text: "रक्तस्राव जोरदार किंवा कारंज्यासारखा आहे का?", type: "yesno", options: ["होय", "नाही"], next: { "*": "q2" } },
        { id: "q2", text: "जखमेत काही वस्तू अडकली आहे का?", type: "yesno", options: ["होय", "नाही"], next: { "*": "q3" } },
        { id: "q3", text: "जखम कुठे आहे?", type: "choice", options: ["हात / पाय", "धड", "डोके / मान"], next: { "*": "DONE" } },
      ],
    },
    heart_attack: {
      label: "हृदयविकाराचा झटका", icon: "heart",
      severity: "काही मिनिटांपेक्षा जास्त काळ छातीत दुखणे = लगेच 108 वर कॉल करा, स्वतः गाडी चालवू नका.",
      immediate: ["लगेच 108 वर कॉल करा — दुखणे जाईल का हे बघण्यासाठी थांबू नका", "व्यक्तीला आरामात बसवा, घट्ट कपडे सैल करा"],
      do: ["त्यांच्याकडे हृदयाचे ठरलेले औषध (जसे नायट्रोग्लिसरीन) असल्यास, घेण्यास मदत करा", "अ‍ॅलर्जी नसल्यास आणि उपलब्ध असल्यास, अ‍ॅस्पिरिन चघळणे उपयोगी ठरू शकते — पण हे पर्यायी आहे, 108 वर कॉल करण्याचा पर्याय नाही", "ते बेशुद्ध होऊन सामान्यपणे श्वास घेणे थांबवल्यास लगेच CPR सुरू करा"],
      dont: ["\"फक्त गॅस आहे\" असे त्यांना पटवू देऊ नका आणि थांबू नका", "त्यांना स्वतः रुग्णालयात गाडी चालवू देऊ नका", "अन्न किंवा पाणी देऊ नका"],
      questions: [
        { id: "q1", text: "व्यक्ती शुद्धीत आहे आणि श्वास घेत आहे का?", type: "yesno", options: ["होय", "नाही"], next: { "होय": "q2", "नाही": "DONE" } },
        { id: "q2", text: "त्यांना छातीत दुखणे, दाब, किंवा हात/जबड्यापर्यंत पसरणारी वेदना आहे का?", type: "yesno", options: ["होय", "नाही"], next: { "*": "q3" } },
        { id: "q3", text: "त्यांच्याकडे हृदयाचे ठरलेले औषध आहे का?", type: "yesno", options: ["होय", "नाही"], next: { "*": "DONE" } },
      ],
    },
    drowning: {
      label: "बुडणे", icon: "waves",
      severity: "बुडालेल्या प्रत्येक व्यक्तीला वैद्यकीय तपासणी आवश्यक आहे, नंतर बरे वाटले तरीही.",
      immediate: ["व्यक्तीला सुरक्षितपणे पाण्यातून बाहेर काढा — पोहता येत नसल्यास काठी/दोरी वापरा, प्रशिक्षणाशिवाय उडी मारू नका", "ते ठीक वाटत असले तरी लगेच 108 वर कॉल करा"],
      do: ["ते श्वास घेत आहेत का ते तपासा — नसल्यास, फुफ्फुसातील पाण्याची काळजी न करता लगेच CPR सुरू करा", "श्वास घेत असल्यास, त्यांना कुशीवर झोपवा, ब्लँकेट/कोरड्या कपड्यांनी उबदार ठेवा", "लक्ष ठेवत रहा — दुय्यम बुडण्याची लक्षणे तासांनंतरही दिसू शकतात"],
      dont: ["CPR सुरू करण्यापूर्वी फुफ्फुसातून \"पाणी काढण्याचा\" प्रयत्न करण्यात वेळ वाया घालवू नका", "पूर्णपणे बरे वाटले तरी वैद्यकीय तपासणीशिवाय घरी जाऊ देऊ नका", "प्रशिक्षण नसल्यास स्वतः पोहून वाचवण्याचा प्रयत्न करू नका — काहीतरी फेकून द्या किंवा पुढे करा"],
      questions: [
        { id: "q1", text: "व्यक्ती आता पाण्याबाहेर आहे का?", type: "yesno", options: ["होय", "नाही"], next: { "होय": "q2", "नाही": "DONE" } },
        { id: "q2", text: "ते श्वास घेत आहेत का?", type: "yesno", options: ["होय", "नाही"], next: { "*": "DONE" } },
      ],
    },
  },
};
