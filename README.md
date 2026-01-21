
```text
██╗     ██╗   ██╗███╗   ███╗██╗███╗   ██╗ █████╗ 
██║     ██║   ██║████╗ ████║██║████╗  ██║██╔══██╗
██║     ██║   ██║██╔████╔██║██║██╔██╗ ██║███████║
██║     ██║   ██║██║╚██╔╝██║██║██║╚██╗██║██╔══██║
███████╗╚██████╔╝██║ ╚═╝ ██║██║██║ ╚████║██║  ██║
╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝
                                                 
      ✨ THE AI IMAGE VIRTUAL TRY-ON ✨
```

<div align="center">

![Next.js 16](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181817?style=for-the-badge&logo=supabase&logoColor=3ECF8E)
![Gemini AI](https://img.shields.io/badge/Gemini_3_Pro-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)

</div>

---

# 🛍️ Lumina Try-On AI

**Experience the next generation of e-commerce.** Lumina Try-On allows users to virtually wear any outfit instantly with physics-accurate fabric adaptation, powered by Google's **Gemini 3 Pro** multimodal models.


---

## 🌟 Key Features

### 🧠 **Dual-Mode AI Engine**
We prioritize reliability. Our system features a robust **Dual-Mode Architecture**:
-   **Primary Mode (Gemini 3 Pro):** High-fidelity, generative AI try-on using the latest multimodal vision capabilities.
-   **Intelligent Fallback (Demo Mode):** If API quotas are hit or services are unreachable, the system gracefully switches to a pre-computed demo mode, ensuring users *always* get a result.

### 💳 **Smart Credit System**
-   **Tokenized Economy:** Users purchase credits to generate try-ons.
-   **Transaction-First Logic:** Credits are deducted *before* generation to prevent abuse and race conditions.
-   **Secure Payments:** Integrated with **Razorpay** for seamless credit top-ups.

### 🎨 **Advanced Visuals**
-   **Physics-Accurate Simulation:** Neural rendering that understands fabric draping and material properties.
-   **Fluid UI/UX:** Built with **Tailwind CSS** ***Aceternity UI** **Framer Motion** and **WebGL** splash cursors for a premium feel.
-   **Responsive Design:** Fully optimized for mobile, tablet, and desktop.

### 🔒 **Enterprise-Grade Security**
-   **Supabase Auth:** Secure authentication and user management.
-   **Row Level Security (RLS):** Data protection at the database level.
-   **Edge Functions:** Serverless scalability for critical operations.

---

## 🛠️ Technology Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | ![Next.js](https://img.shields.io/badge/-Next.js_16-black?logo=next.js) | The latest stable release with React Server Components. |
| **Language** | ![TypeScript](https://img.shields.io/badge/-TypeScript-blue?logo=typescript) | For type-safe, maintainable code. |
| **Styling** | ![Tailwind](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?logo=tailwind-css) | Utility-first CSS for rapid UI development. |
| **Database** | ![Supabase](https://img.shields.io/badge/-Supabase-green?logo=supabase) | Postgres database, Auth, and Realtime. |
| **AI Model** | ![Gemini](https://img.shields.io/badge/-Gemini_3_Pro-purple?logo=google) | Google's state-of-the-art multimodal AI. |
| **Payments** | ![Razorpay](https://img.shields.io/badge/-Razorpay-blue?logo=razorpay) | Secure payment gateway integration. |
| **UI Libs** | `Aceternity UI`,`lucide-react`, `framer-motion`, `radix-ui` | For beautiful, accessible, and animated components. |

---

## 🚀 Getting Started

Follow these steps to set up the project locally:

### 1. **Clone the Repository**
```bash
git clone https://github.com/Bala0o8o0/lumina-tryon.git
cd lumina-tryon
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Configure Environment**
Create a `.env.local` file in the root directory and add your keys:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
GOOGLE_GEMINI_API_KEY=your_gemini_key
# ... add other keys as needed
```

### 4. **Run Development Server**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app!

---

## 📂 Project Structure

```bash
lumina-tryon/
├── 📂 app/                 # Next.js App Router pages
│   ├── 📂 api/             # API Routes (Generate, Payment, etc.)
│   ├── 📂 auth/            # Authentication handlers
│   └── page.tsx            # Landing Page
├── 📂 components/          # Reusable UI components
├── 📂 lib/                 # Utility functions & Supabase clients
├── 📂 public/              # Static assets & Demo Results
│   └── 📂 demo-results/    # Fallback images for Demo Mode
└── 📂 supabase/            # SQL constraints & schema
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](GEMINI.md) for details.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

<div align="center">

**Built with ❤️ and 🤖**

---

[Report Bug](https://github.com/Bala0o8o0/lumina-tryon/issues) · [Request Feature](https://github.com/Bala0o8o0/lumina-tryon/issues)

</div>
