import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYSTEM_INSTRUCTION = `You are "Abhith Help", the intelligent, courteous, and context-aware in-app support assistant for the "Typing World" educational web application.

CORE PRINCIPLES & REQUIRED AI BEHAVIOUR:
1. UNDERSTAND THE USER'S EXACT MESSAGE, QUESTION, AND INTENT:
   - Always first read and understand the user's exact message, question, and intent.
   - Do NOT give the same fixed or repeated answer for different questions.
   - Never show one predefined response for every message.
   - Give a natural, relevant, tailored answer based on what the user actually asked.
   - Different questions about the same feature must receive different answers according to the exact question.
   - Pay close attention to previous messages in the conversation history so follow-up questions (e.g. "why?", "how do I do that?", "what next?", "can you explain simpler?") receive contextually correct, continuous answers.

2. LANGUAGE DETECTION & ACCURATE RESPONSE MATCHING:
   - Detect the language used by the user and reply in the EXACT SAME language:
     * English → reply in clean, natural English.
     * Telugu (తెలుగు) → reply in natural, fluent Telugu.
     * Hindi (हिंदी) → reply in natural, fluent Hindi.
     * Mixed Telugu-English (Tenglish, e.g. "Level 2 ela unlock cheyali?", "Typing test ela start cheyali?") → naturally use the same mixed Tenglish style.
     * Mixed Hindi-English (Hinglish, e.g. "Level 2 kaise unlock karein?") → naturally use the same mixed Hinglish style.
     * Other languages (Tamil, Kannada, Marathi, Spanish, etc.) → reply in that same language.

3. CASUAL vs. APP-RELATED vs. UNRELATED QUESTIONS:
   - Casual / Greetings (e.g., "hi", "hello", "who are you", "how are you", "thanks", "good morning", "super"):
     * Respond naturally, warmly, and respectfully (e.g., "Hello! I am Abhith Help. How can I help you in Typing World today?").
     * Do NOT dump long menus, long guides, or walls of text on a simple greeting.
   - App-Related Questions:
     * Answer specifically about that exact app feature.
     * Keep answers simple, clear, respectful, and natural.
     * Avoid unnecessary long explanations.
     * Provide clear numbered steps whenever the user needs instructions or guidance.
     * If the user asks for a simpler explanation, explain again in simpler words with easy steps as many times as necessary.
   - Unrelated Questions (e.g., general politics, cricket scores, recipes, external news, random homework):
     * Politely say that it is outside the app's support scope instead of giving an unrelated answer, and invite them to ask about Typing World.

4. SCREENSHOT / IMAGE HELP:
   - When the user uploads/attaches a screenshot:
     * Analyze the visible image carefully: examine buttons, locked levels, active typing practice, error messages, user stats, or settings.
     * Explain why the issue is happening based on the actual rules and state of Typing World.
     * Give clear, actionable step-by-step instructions to solve or understand the issue.
     * If the screenshot does not have enough information to determine the cause, clearly state what information is missing and guide the user on what to check next. Never invent an error.

ABOUT THE TYPING WORLD APP (AUTHORITATIVE KNOWLEDGE):
- Brand & Creator: "Typing World", created by Abhi ("Abhi Presents · Designed by Abhi").
- Dashboard Features (2-column icon grid):
  1. Levels: Sequential typing curriculum starting from Level 1 (Keyboard Basics) to Level 2 (Home Row Practice), Top Row, Bottom Row, Numbers, Symbols, Words, and Paragraphs.
     * Unlocking Rule: Levels are strictly sequential. Level 2 unlocks only after completing Level 1 (Keyboard Basics).
  2. Achievements: Badges and medals earned for typing velocity (30+ WPM, 45+ WPM, 60+ WPM, 80+ WPM), 100% accuracy, and milestone completions.
  3. Practice: Free typing drills and keyboard practice without time pressure.
  4. Typing Test: Real-time 60-second typing test measuring Words Per Minute (WPM) and accuracy.
  5. Leaderboard: Global rankings showing top typists, WPM, accuracy, and permanent Serial Numbers.
  6. Daily Challenge: Daily typing exercises and target milestones (e.g. 35+ WPM) to build typing habits.
  7. Abhith Help: In-app support chat with screenshot analysis (this assistant).
- User Profile & Identity:
  * Permanent Serial Number: Each user is assigned an immutable, permanent serial number (e.g., M22-01). It never changes.
  * Profile Photo: Users can upload a custom photo from their device gallery.
  * Display Name: Users can edit and update their display name anytime.
- Authentication & Security:
  * Login with Email/Username and password.
  * Instant Sign-In with Google.
  * Forgot Password recovery: verifies Date of Birth (DOB) and Village Name to reset password safely.
- IMPORTANT RULE ON COINS:
  * There are NO COINS or virtual currency anywhere in the application. All features and levels unlock through direct skill and practice.`;

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  // Support payload for base64 screenshots
  app.use(express.json({ limit: '20mb' }));

  // Initialize shared Gemini client
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Abhith Help Assistant Endpoint
  app.post('/api/help', async (req, res) => {
    const { message, image, mimeType, history } = req.body;

    if (!message && !image) {
      return res.status(400).json({ error: 'Message or image is required.' });
    }

    const userText = (message || '').trim();

    // If no API key configured, use our intelligent contextual responder
    if (!apiKey) {
      const fallbackReply = generateSmartContextualReply(userText, !!image, history);
      return res.json({ reply: fallbackReply });
    }

    try {
      // Build structured multi-turn conversation
      const contents: any[] = [];

      if (history && Array.isArray(history)) {
        for (const item of history) {
          if (!item.text) continue;
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }],
          });
        }
      }

      const currentParts: any[] = [];

      // Add attached screenshot if provided
      if (image) {
        let cleanBase64 = image;
        let detectedMime = mimeType || 'image/jpeg';

        if (image.includes(';base64,')) {
          const split = image.split(';base64,');
          detectedMime = split[0].replace('data:', '') || detectedMime;
          cleanBase64 = split[1];
        }

        currentParts.push({
          inlineData: {
            data: cleanBase64,
            mimeType: detectedMime,
          },
        });
      }

      currentParts.push({
        text: userText || (image ? 'Please analyze this screenshot from Typing World and give me step-by-step guidance.' : 'Hello'),
      });

      contents.push({
        role: 'user',
        parts: currentParts,
      });

      // Primary model: gemini-3.1-flash-lite (fast, multimodal, multilingual)
      let reply = '';
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.6,
          },
        });
        reply = response.text || '';
      } catch (primaryErr: any) {
        console.warn('gemini-3.1-flash-lite attempt failed, trying gemini-3.8-flash:', primaryErr?.message);
        try {
          const backupResponse = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.6,
            },
          });
          reply = backupResponse.text || '';
        } catch (backupErr: any) {
          console.error('All Gemini API calls failed, using smart contextual generator:', backupErr?.message);
          reply = generateSmartContextualReply(userText, !!image, history);
        }
      }

      if (!reply) {
        reply = generateSmartContextualReply(userText, !!image, history);
      }

      return res.json({ reply });
    } catch (err: any) {
      console.error('Error generating Help response:', err);
      const fallbackReply = generateSmartContextualReply(userText, !!image, history);
      return res.json({ reply: fallbackReply });
    }
  });

  // Dynamic, context-aware responder matching language, intent, and follow-ups
  function generateSmartContextualReply(query: string, hasImage: boolean, history?: any[]): string {
    const q = query.toLowerCase().trim();

    // Check language
    const isTeluguScript = /[\u0C00-\u0C7F]/.test(query);
    const isHindiScript = /[\u0900-\u097F]/.test(query);
    const isTenglish = /\b(ela|cheyali|cheyyali|undi|unnadi|kavali|cheyandi|cheppandi|enduku|chudandi|naku|meeru|appulo)\b/i.test(query);
    const isHinglish = /\b(kaise|karein|karna|hai|nahi|kya|batao|samjhao|kariye|mujhe|aap)\b/i.test(query);

    // 1. CASUAL GREETINGS
    const isGreeting = /^(hi|hello|hey|namaste|vanakkam|good\s*(morning|afternoon|evening)|who\s*are\s*you|how\s*are\s*you|sup|yo)[!.\s]*$/i.test(q);
    if (isGreeting) {
      if (isTeluguScript) {
        return 'నమస్కారం! నేను అభిత్ హెల్ప్ (Abhith Help). Typing World యాప్‌లో మీకు ఏ విషయంలో సహాయం కావాలి?';
      }
      if (isTenglish) {
        return 'Namaskaram! Nenu Abhith Help. Typing World lo meeku elanti help kavali?';
      }
      if (isHindiScript) {
        return 'नमस्ते! मैं अभिथ हेल्प (Abhith Help) हूँ। Typing World ऐप में मैं आपकी क्या सहायता कर सकता हूँ?';
      }
      if (isHinglish) {
        return 'Namaste! Main Abhith Help hoon. Typing World mein aapki kya help kar sakta hoon?';
      }
      return "Hello! I am Abhith Help. How can I assist you with the Typing World app today?";
    }

    // 2. GRATITUDE / CASUAL CLOSING
    if (/^(thanks|thank you|dhanyavadalu|shukriya|super|cool|awesome|bye|ok|okay)[!.\s]*$/i.test(q)) {
      if (isTeluguScript) {
        return 'సంతోషం! మీకు ఎప్పుడైనా సహాయం కావాలంటే ఇక్కడ అడగవచ్చు. ఆల్ ది బెస్ట్!';
      }
      if (isTenglish) {
        return 'Chala thanks! Meekeyppudaina help kavali ante ikkade adagandi. All the best!';
      }
      if (isHindiScript) {
        return 'आपका स्वागत है! यदि आपको किसी भी फीचर में सहायता चाहिए, तो कभी भी पूछें।';
      }
      return "You're very welcome! If you need any more help with Typing World, just ask anytime.";
    }

    // 3. UNRELATED QUESTIONS
    const isUnrelated = /\b(weather|cricket|ipl|score|recipe|biryani|movie|cinema|modi|biden|politics|stock|bitcoin|crypto|song|dance)\b/i.test(q) &&
      !q.includes('typing') && !q.includes('level') && !q.includes('test') && !q.includes('keyboard');
    if (isUnrelated) {
      if (isTeluguScript) {
        return 'క్షమించండి, ఇది కేవలం Typing World యాప్ సహాయానికి సంబంధించిన అసిస్టెంట్. టైపింగ్ ప్రాక్టీస్, లెవెల్స్ లేదా ఇతర ఫీచర్ల గురించి ఏదైనా ఉంటే అడగండి, సంతోషంగా వివరిస్తాను!';
      }
      if (isTenglish) {
        return 'Sorry, idhi kevalam Typing World app support kosam matrame. Typing practice, levels leda test gurinchi emaina doubts unte adagandi!';
      }
      if (isHindiScript) {
        return 'क्षमा करें, यह सहायता केंद्र केवल Typing World ऐप से जुड़े सवालों के लिए है। ऐप के किसी भी फीचर या टाइपिंग प्रैक्टिस के बारे में आप पूछ सकते हैं।';
      }
      return "I apologize, but that is outside the support scope for Typing World. I am here to help you with typing lessons, levels, tests, achievements, and app troubleshooting!";
    }

    // 4. SCREENSHOT ATTACHMENT
    if (hasImage) {
      if (isTeluguScript) {
        return `మీరు పంపిన స్క్రీన్‌షాట్‌ను పరిశీలించాను.
Typing World నిబంధనల ప్రకారం:
1. **లాక్ ఉన్న లెవెల్స్ (🔒 ఐకాన్)**: లెవెల్స్ అన్నీ వరుస క్రమంలో ఉంటాయి. ఉదాహరణకు Level 2 తెరవడానికి, ముందుగా Level 1 పూర్తి చేయాలి.
2. **లాగిన్ సమస్యలు**: మీ ఈమెయిల్ మరియు పాస్‌వర్డ్ సరిగ్గా ఉన్నాయో లేదో చూసుకోండి, లేదా "Continue with Google" ఎంచుకోండి.
3. మరింత సమాచారం లేదా స్టెప్స్ కావాలంటే అడగండి!`;
      }
      if (isTenglish) {
        return `Meeru pampina screenshot ni chusanu:
1. **Level locked unte**: Levels sequential ga unnai. Level 2 open cheyadaniki mundhu Level 1 finish cheyali.
2. **Password issue unte**: Login lo "Forgot Password?" click chesi DOB & Village Name enter cheyandi.
Meeku inka specific ga emaina kavala?`;
      }
      return `I have reviewed your screenshot:
1. **If a Level shows a Lock (🔒)**: All lessons in Typing World unlock in sequence. Complete Level 1 (Keyboard Basics) to 100% to immediately unlock Level 2.
2. **If Login/Auth Error**: Ensure your credentials match, or use "Continue with Google" for one-tap access.
3. **If You Forgot Your Password**: Click "Forgot Password?" below the login form and enter your Date of Birth and Village Name.
Let me know if you would like me to explain any step in simpler terms!`;
    }

    // 5. LEVEL 2 / UNLOCKING INQUIRIES
    if (q.includes('level') || q.includes('lock') || q.includes('unlock') || q.includes('లేవెల్') || q.includes('అన్‌లాక్')) {
      if (isTeluguScript) {
        return `Typing World లో లెవెల్ 2 అన్‌లాక్ చేయడానికి స్టెప్-బై-స్టెప్ విధానం:
1. హోమ్ పేజీలో **Levels** బటన్ పై క్లిక్ చేయండి.
2. **Level 1 (Keyboard Basics)** ని ఎంచుకుని ప్రాక్టీస్ పూర్తి చేయండి.
3. చివరలో **Complete Level 1 ✓** బటన్ నొక్కండి.
4. వెంటనే Level 2 (Home Row Practice) ఆటోమేటిక్‌గా అన్‌లాక్ అవుతుంది!`;
      }
      if (isTenglish) {
        return `Level 2 unlock cheyadaniki simple steps:
1. Home page lo **Levels** click cheyandi.
2. **Level 1 (Keyboard Basics)** open chesi practice complete cheyandi.
3. "Complete Level 1 ✓" button click cheyandi.
4. Ventane Level 2 automatic ga unlock aipothundi!`;
      }
      if (isHindiScript) {
        return `लेवल 2 अनलॉक करने के लिए आसान स्टेप्स:
1. होम डैशबोर्ड पर **Levels** बटन पर क्लिक करें।
2. **Level 1 (Keyboard Basics)** शुरू करें और अभ्यास पूरा करें।
3. अंत में **Complete Level 1 ✓** पर क्लिक करें।
4. इसके बाद Level 2 तुरंत अनलॉक हो जाएगा!`;
      }
      return `Here are the exact steps to unlock Level 2:
1. Click **Levels** on the home dashboard.
2. Open **Level 1 (Keyboard Basics)** and complete the practice text.
3. Click the green **Complete Level 1 ✓** button.
4. Level 2 (Home Row Practice) will instantly unlock and remain unlocked in your account!`;
    }

    // 6. TYPING TEST INQUIRIES
    if (q.includes('test') || q.includes('speed') || q.includes('wpm') || q.includes('టెస్ట్') || q.includes('टेस्ट')) {
      if (isTeluguScript) {
        return `Typing Test ఎలా ప్రారంభించాలి:
1. హోమ్ పేజీలోని **Typing Test** ఐకాన్ పై క్లిక్ చేయండి.
2. అక్కడ 60 సెకన్ల టైమర్ మరియు ప్రాక్టీస్ పారాగ్రాఫ్ కనిపిస్తుంది.
3. మీరు టైప్ చేయడం ప్రారంభించగానే టైమర్ ఆటోమేటిక్‌గా మొదలవుతుంది.
4. 60 సెకన్లు పూర్తయిన తర్వాత మీ వేగం (WPM) మరియు ఖచ్చితత్వం (Accuracy %) వెంటనే స్క్రీన్‌పై కనిపిస్తాయి!`;
      }
      if (isTenglish) {
        return `Typing Test ela start cheyali:
1. Home dashboard lo **Typing Test** icon click cheyandi.
2. 60-seconds timer tho paragraph kanipistundi.
3. Type cheyadam start cheyagane timer run avvadam modalavtundi.
4. Complete ayyaka mee WPM speed & Accuracy report chusukovachu!`;
      }
      return `How to take the Typing Test:
1. Click the **Typing Test** icon on your home dashboard.
2. A 60-second real-time test window will appear with sample text.
3. Start typing as soon as you are ready; the timer starts automatically with your first keystroke.
4. When time expires, your Words Per Minute (WPM) and accuracy score will be displayed!`;
    }

    // 7. PROFILE & SERIAL NUMBER
    if (q.includes('profile') || q.includes('serial') || q.includes('photo') || q.includes('name') || q.includes('ఫోటో') || q.includes('పేరు')) {
      if (isTeluguScript) {
        return `ప్రొఫైల్ వివరాలు:
1. **శాశ్వత సీరియల్ నంబర్ (Serial Number)**: మీ ప్రొఫైల్ లేదా హోమ్ పేజీ క్రింద ఉండే సీరియల్ నంబర్ (ఉదా: M22-01) శాశ్వతమైనది, ఇది మారదు.
2. **ఫోటో మార్చడం**: పైనున్న Profile పై క్లిక్ చేసి, "Upload Photo" ద్వారా మీ గ్యాలరీ నుండి ఫోటో పెట్టుకోవచ్చు.
3. **పేరు మార్చడం**: మీ పేరు పక్కన ఉన్న Edit బటన్ నొక్కి కొత్త పేరు సేవ్ చేసుకోవచ్చు.`;
      }
      return `Profile & Serial Number details:
1. **Permanent Serial Number**: Displayed at the bottom of the home page and in your Profile (e.g., M22-01). This is permanent and uniquely assigned to your account.
2. **Change Photo**: Go to Profile, click "Upload Photo", and choose any picture from your device.
3. **Change Name**: Click "Edit" next to your display name, type your preferred name, and save!`;
    }

    // 8. PRACTICE DRILLS
    if (q.includes('practice') || q.includes('ప్రాక్టీస్') || q.includes('अभ्यास')) {
      if (isTeluguScript) {
        return `ప్రాక్టీస్ (Practice) ఫీచర్:
1. హోమ్ పేజీలోని **Practice** ఐకాన్ పై క్లిక్ చేయండి.
2. సమయ పరిమితి (Time limit) లేకుండా ప్రశాంతంగా కీబోర్డ్ కీలు టైప్ చేయడం ప్రాక్టీస్ చేయవచ్చు.
3. ఇది మీ కీబోర్డ్ వేలి స్థానాలను (Finger placement) అలవాటు చేసుకోవడానికి చాలా ఉపయోగపడుతుంది.`;
      }
      return `About Practice mode:
1. Click the **Practice** icon on the dashboard.
2. Practice exercises allow you to type without any countdown timer or pressure.
3. It helps build finger muscle memory for the Home Row, Top Row, and Bottom Row keys!`;
    }

    // 9. DEFAULT HELPFUL RESPONSE
    if (isTeluguScript) {
      return `నమస్కారం! నేను అభిత్ హెల్ప్ (Abhith Help).
మీరు అడిగిన ప్రశ్నకు సంబంధించి Typing World లో ఎలా సహాయం కావాలో చెప్పండి:
- లెవెల్స్ అన్‌లాక్ చేయడం గురించి
- 60-సెకన్ల టైపింగ్ టెస్ట్ గురించి
- మీ సీరియల్ నంబర్ లేదా ప్రొఫైల్ గురించి
మీ ప్రశ్నను వివరంగా అడిగితే సరిగ్గా సమాధానం ఇస్తాను!`;
    }
    if (isTenglish) {
      return `Hi! Nenu Abhith Help. Typing World app lo meeku elanti help kavali? Levels, Typing Test, Leaderboard, leda Profile gurinchi specific ga adagandi, ventane chepthanu!`;
    }
    return `Hello! I am Abhith Help.
Could you please share a bit more detail about what you need assistance with in Typing World?
For example, you can ask:
- "How do I unlock Level 2?"
- "How does the Typing Test work?"
- "What is my permanent Serial Number?"
- Or upload a screenshot of your screen anytime using the camera button!`;
  }

  // Mount Vite in development or serve static in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Typing World server running on http://0.0.0.0:${port}`);
  });
}

startServer();
