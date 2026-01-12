import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleAction = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-cyan-500 p-1.5 rounded-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />            </svg>
          </div>
          <span className="text-2xl font-semibold text-gray-800">
              Quiz<span className="text-cyan-500">Hub</span>
            </span>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={handleAction} className="text-slate-600 font-medium hover:text-cyan-600">Login</button>
          <button onClick={handleAction} className="bg-cyan-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-cyan-600 transition">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-br from-slate-800 via-slate-700 to-cyan-900  text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-slate-800 border border-slate-700 rounded-full px-4 py-1 mb-6 text-sm text-cyan-400">
            Next-Gen Quizzing for Modern Classrooms
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Quizzes That Think <br />
            <span className="text-cyan-400"> Systems That Scale</span>
          </h1>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            A scalable, reliable platform for conducting online assessments across multiple servers. 
            Experience high availability, real-time synchronization, and fault-tolerant quiz delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleAction}
              className="bg-cyan-500 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-cyan-600 transition flex items-center justify-center gap-2"
            >
              Get Started <span>→</span>
            </button>
            <button 
              onClick={handleAction}
              className="bg-slate-200 text-slate-800 px-8 py-3 rounded-lg font-bold text-lg hover:bg-white transition"
            >
              Login to Portal
            </button>
          </div>
        </div>
      </header>

      {/* System Capabilities Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">System <span className="text-cyan-500">Capabilities</span></h2>
          <p className="text-slate-500">Built with distributed systems principles to ensure reliable and secure online assessments.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <CapabilityCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-cyan-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6.119c0 3.891 1.456 7.447 3.848 10.126a11.954 11.954 0 0 0 13.106 0c2.392-2.679 3.848-6.137 3.848-10.126A11.959 11.959 0 0 1 12 2.714Z" /></svg>}
            title="High Availability"
            desc="Multiple quiz servers ensure uninterrupted access. If one fails, traffic seamlessly redirects to backups."
          />
          <CapabilityCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-cyan-500"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>}
            title="Reliability"
            desc="Instant failure notifications and server-side detection prevent blocked resources and data loss."
          />
          <CapabilityCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-cyan-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>}
            title="Concurrency"
            desc="Advanced synchronization ensures consistent quiz content and fair scoring for all participants."
          />
        </div>
      </section>

      {/* System Architecture Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">System <span className="text-cyan-500">Architecture</span></h2>
            <p className="text-slate-500">A robust four-component architecture for the distributed environment.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ArchitectureStep number="1" title="Quiz Servers" desc="Host questions and manage sessions" 
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v3.75a3 3 0 0 1-3 3m-13.5 0a3 3 0 0 0-3 3v3.75a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3V17.25a3 3 0 0 0-3-3m-13.5 0h13.5" /></svg>} />
            <ArchitectureStep number="2" title="Student Clients" desc="Web interfaces for quiz attempts" 
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" /></svg>} />
            <ArchitectureStep number="3" title="Central Aggregator" desc="Collects results and generates scores" 
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>} />
            <ArchitectureStep number="4" title="Admin Module" desc="Quiz creation and reporting" 
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-9.75 0h9.75" /></svg>} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-500 text-sm">© 2026 QuizHub. Distributed Systems & Cloud Computing Project.</p>
        </div>
      </footer>
    </div>
  );
};

// Helper components
const CapabilityCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const ArchitectureStep = ({ number, title, desc, icon }) => (
  <div className="bg-white border border-gray-200 p-6 rounded-xl relative">
    <div className="bg-cyan-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4 text-sm">
      {number}
    </div>
    <div className="text-cyan-500 mb-2">{icon}</div>
    <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 text-xs">{desc}</p>
  </div>
);

export default Home;