# 📝 Custom Tokenizer (Encode & Decode)

A **TypeScript** tokenizer built from scratch that can:
- Learn vocabulary from text
- Encode text into token IDs
- Decode token IDs back into text
- Handle **special tokens** for flexibility

Built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

---

## 🚀 Features
- 📚 **Vocabulary Learning** – Dynamically generates a vocabulary from input text.
- 🔄 **Encode & Decode** – Reliable bidirectional conversion between text and token IDs.
- 🏷 **Special Tokens Support** – Handles tokens like `<PAD>`, `<UNK>`, `<START>`, `<END>`.
- 🎯 **Lightweight & Easy to Use** – No external heavy NLP libraries.

---

## 🎥 Project demo video

https://github.com/user-attachments/assets/03ce3825-2392-4cb5-b264-7e4c636de2a6

---
## 📷 Project screenshot

<img width="1366" height="768" alt="Image" src="https://github.com/user-attachments/assets/2625f133-3074-42ca-9e03-4c64e27ace1e" />

---

## 🛠 Installation & Setup
```bash
# Clone the repository
git clone https://github.com/shub4am/custom_tokenizer.git
cd custom-tokenizer

# Install dependencies
npm install

# Run development server
npm run dev


Visit http://localhost:3000 to try it out.



📌 Usage

import { Tokenizer } from "@/utils/tokenizer";

const tokenizer = new Tokenizer();

// Learn vocab
tokenizer.learnVocab("Hello world! Hello AI!");

// Encode text
const tokens = tokenizer.encode("Hello world!");
console.log(tokens); // [ 2, 3 ]

// Decode tokens
const text = tokenizer.decode(tokens);
console.log(text); // "Hello world!"
