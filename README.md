# MindPhysics - AI Mental Health Therapy Platform

MindPhysics is an innovative mental health platform that combines principles of physics and psychology to provide a unique therapeutic experience. The application features an AI therapist, interactive physics-based relaxation games, and comprehensive progress tracking.

![MindPhysics Platform](https://placeholder.svg?height=400&width=800)

## Features

### AI Therapy
- Chat with an AI therapist trained in physics-based mental health approaches
- Personalized therapeutic conversations
- Session history tracking and insights

### Relaxation Games
- **Pendulum Meditation**: Focus on the rhythmic motion of a pendulum for mindfulness
- **Particle Flow**: Watch and interact with particles that create calming patterns
- **Wave Harmony**: Synchronize your breathing with wave oscillations

### Progress Tracking
- Mood tracking before and after therapy sessions and games
- Visualize your mental health journey with detailed analytics
- Receive personalized insights and recommendations

### Custom Model Training
- Train the AI model with your own data
- Customize the therapeutic approach to your specific needs
- Deploy personalized models for enhanced therapy sessions

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes, Server Actions
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Visualization**: Recharts
- **Animation**: Canvas API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/mindphysics.git
   cd mindphysics
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   \`\`\`

4. Set up the database:
   Run the SQL scripts in the `database` directory to create the necessary tables and policies.

5. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following database tables:

### user_profiles
Extends Supabase auth.users with additional user information.
- `id`: UUID (Primary Key, references auth.users)
- `full_name`: TEXT
- `avatar_url`: TEXT
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### therapy_sessions
Tracks therapy chat sessions.
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `started_at`: TIMESTAMP
- `ended_at`: TIMESTAMP
- `summary`: TEXT
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### messages
Stores chat messages between users and the AI.
- `id`: UUID (Primary Key)
- `session_id`: UUID (Foreign Key to therapy_sessions)
- `role`: TEXT ('user' or 'assistant')
- `content`: TEXT
- `created_at`: TIMESTAMP

### mood_entries
Tracks user mood over time.
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `mood_score`: INTEGER (1-10)
- `notes`: TEXT
- `created_at`: TIMESTAMP

### game_sessions
Records user interactions with relaxation games.
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `game_type`: TEXT ('pendulum', 'particles', or 'waves')
- `duration_seconds`: INTEGER
- `pre_game_mood`: INTEGER (1-10)
- `post_game_mood`: INTEGER (1-10)
- `created_at`: TIMESTAMP

## Usage

### Authentication
1. Create an account using the Sign Up page
2. Log in with your credentials
3. Your session will be maintained across visits

### Therapy Chat
1. Navigate to the Chat page
2. Type your message in the input field
3. Receive responses from the AI therapist
4. End the session to save your progress

### Relaxation Games
1. Navigate to the Games page
2. Select a game type (Pendulum, Particles, or Waves)
3. Rate your mood before starting
4. Interact with the game using the controls
5. Rate your mood after playing to track effectiveness

### Dashboard
1. Navigate to the Dashboard page
2. View your mood trends over time
3. See a breakdown of your activity
4. Read personalized insights and recommendations

### Model Training
1. Navigate to the Model Training page
2. Upload training data or use sample data
3. Configure training parameters
4. Start the training process
5. Deploy your custom model

## Project Structure

\`\`\`
mindphysics/
├── app/                    # Next.js App Router
│   ├── chat/               # Therapy chat interface
│   ├── dashboard/          # Progress tracking dashboard
│   ├── games/              # Relaxation games
│   ├── login/              # Authentication pages
│   ├── model-training/     # Custom model training
│   ├── signup/             # User registration
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # Reusable React components
│   ├── games/              # Game components
│   ├── ui/                 # UI components (shadcn/ui)
│   ├── auth-check.tsx      # Authentication wrapper
│   └── supabase-provider.tsx # Supabase context provider
├── hooks/                  # Custom React hooks
│   ├── use-chat.ts         # Chat functionality
│   └── use-toast.ts        # Toast notifications
├── lib/                    # Utility functions
│   ├── game-service.ts     # Game data services
│   ├── supabase.ts         # Supabase client
│   └── utils.ts            # Helper functions
├── public/                 # Static assets
└── database/               # Database scripts
\`\`\`

## Future Enhancements

- Integration with OpenAI for more advanced AI therapy
- Additional physics-based relaxation games
- Mobile application with notifications
- Group therapy sessions
- Integration with wearable devices for biometric feedback
- Export and sharing of progress reports

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Physics principles adapted from various academic sources
- Therapeutic approaches based on evidence-based practices
- Special thanks to all contributors and testers
\`\`\`

This README provides a comprehensive overview of your MindPhysics project, including its features, setup instructions, and usage guidelines. It's designed to help users and developers understand the project without any references to the AI assistant that helped create it.
\`\`\`
