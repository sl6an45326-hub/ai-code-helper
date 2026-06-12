# 🤖 AI Code Helper

مساعد ذكي لكتابة وتحليل الأكواد باستخدام Node.js + React + Ollama

## ✨ المميزات

- 💬 واجهة دردشة ذكية تفاعلية
- 🧠 دعم نماذج AI مفتوحة المصدر (Ollama)
- 📝 مساعدة في كتابة الأكواد
- 🔍 تحليل وشرح الأكواس
- 🌍 دعم اللغة العربية
- 💾 حفظ المحادثات

## 🛠️ المتطلبات

- Node.js v16+
- npm أو yarn
- Ollama (مثبت ومشغل محليًا)

## 📦 التثبيت

### 1. استنساخ المستودع
```bash
git clone https://github.com/sl6an45326-hub/ai-code-helper.git
cd ai-code-helper
```

### 2. تثبيت Ollama
```bash
# من https://ollama.ai
ollama pull llama2
ollama serve  # شغل الخادم
```

### 3. تثبيت الحزم
```bash
# تثبيت خادم Node.js
cd backend
npm install

# تثبيت واجهة React
cd ../frontend
npm install
```

## 🚀 البدء

### تشغيل الخادم (Node.js)
```bash
cd backend
npm start
# سيعمل على http://localhost:3001
```

### تشغيل الواجهة (React)
```bash
cd frontend
npm start
# سيعمل على http://localhost:3000
```

## 📁 هيكل المشروع

```
ai-code-helper/
├── backend/          # خادم Node.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/         # تطبيق React
│   ├── src/
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md
```

## 🔧 المتغيرات البيئية

أنشئ ملف `.env` في مجلد `backend`:

```env
PORT=3001
OLLAMA_API=http://localhost:11434
MODEL=llama2
CORS_ORIGIN=http://localhost:3000
```

## 📚 الاستخدام

1. افتح http://localhost:3000
2. اكتب سؤالك أو طلبك
3. سيرد عليك المساعد الذكي

## 🎯 أمثلة الأسئلة

- "اكتب لي كود JavaScript لحساب مجموع الأرقام"
- "اشرح لي ماذا يفعل هذا الكود"
- "ساعدني في إصلاح هذا الخطأ"
- "كيف أستخدم React Hooks؟"

## 🤝 المساهمة

نرحب بمساهماتك! يرجى فتح Pull Request.

## 📄 الترخيص

MIT License

## 📧 التواصل

إذا كان لديك أسئلة، فتح Issue في المستودع.
