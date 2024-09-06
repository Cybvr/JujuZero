JujuAGI Dashboard

Welcome to the JujuAGI Dashboard, built with Next.js 13+. This project offers a suite of file conversion and editing tools, tailored for seamless file management and manipulation.

Getting Started

To get started with the development server:

1. **Clone the Repository:**
    
    ```
    Shell Script
    Copy
    
    git clone <url-to-your-repository>
    cd juju-dashboard
    
    ```
    
2. **Install Dependencies:**Ensure Node.js (v14 or later) and npm are installed.
    
    ```
    Shell Script
    Copy
    
    npm install
    
    ```
    
3. **Start the Development Server:**
    
    ```
    Shell Script
    Copy
    
    npm run dev
    
    ```
    
4. **Access the Application:**Visit [http://localhost:3000](http://localhost:3000/) in your browser.

You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file.

Project Structure

Here is the summarised directory structure of the project:

```
Copy

.
├── app
│   ├── components
│   │   ├── dashboard
│   │   │   ├── AccountCreation.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── MainContent.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ui
│   ├── lib
│   ├── utils
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public
├── node_modules
├── package.json
├── tailwind.config.ts
├── next.config.js
└── README.md

```

Deployment

JujuAGI is deployed using Vercel. The deployment process is as follows:

1. **Push Changes to GitHub:**Push your changes to the main branch.
2. **Automatic Deployment:**Vercel automatically detects the push, builds, and deploys the updated version.
3. **Access the Deployed Application:**Your application is accessible at the assigned Vercel URL or custom domain.

For manual deployments or custom deployment pipelines, refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

Learn More

To learn more about Next.js and its features:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

For detailed technical specifics about JujuAGI’s tools and functionalities, refer to the [TechSpec.md](https://replit.com/@jide2/TaskDash).

Licensing Information

Content created in this public Repl is automatically subject to an MIT license.

```
Copy

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software
is furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

```

For more details about version control and development setup, refer to [TechSpec.md](https://replit.com/@jide2/TaskDash).

Contributing

We welcome contributions! Please follow these steps for contributing:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

Support

For any issues or queries, feel free to reach out:

- Email: [info@visual.ng](https://replit.com/@jide2/TaskDash)
- Visit our Help Center for FAQs and troubleshooting guides
- Live chat support available during business hours.

Thank you for using JujuAGI! We’re excited to help you streamline your file management tasks.