# Agil App

A modern web application designed to streamline and automate the agile development process by managing and generating essential agile artifacts such as Definition of Ready (DoR), Definition of Done (DoD), and Acceptance Criteria.

## Features

- 🔐 **Secure Authentication**: Built with Clerk for robust user authentication and authorization
- 📝 **Agile Definitions Management**: 
  - Generate Definition of Ready (DoR)
  - Generate Definition of Done (DoD)
  - Create Acceptance Criteria
- 🔄 **Real-time Updates**: Automatic synchronization with Supabase for instant data updates
- 📊 **Story Management**: Track and manage user stories with unique story codes
- 🤖 **AI-Powered Generation**: Automated generation of agile artifacts based on application scope
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- 📱 **Responsive Design**: Works seamlessly across all devices

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Automation**: [n8n](https://n8n.io/)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Supabase account
- Clerk account
- n8n account

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# n8n Webhook
NEXT_PUBLIC_N8N_WEBHOOK_PATH=your_webhook_path
NEXT_PUBLIC_N8N_WEBHOOK_KEY=your_webhook_key
NEXT_PUBLIC_NODE_ENV=development
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/agil-app.git
cd agil-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
agil-app/
├── src/
│   ├── app/
│   │   ├── (authenticated)/    # Protected routes
│   │   ├── (auth)/            # Authentication routes
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── ui/               # UI components
│   │   └── custom/           # Custom components
│   └── lib/                  # Utility functions
├── public/                   # Static assets
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@agil-app.com or join our Slack channel.
