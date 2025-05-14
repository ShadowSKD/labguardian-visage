import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 pt-4">
      {/* Hero Section with Glass Panel */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl border border-white/20">
        <div className="text-center mb-12">
          <div className="mb-8"> {/* Extra container for better spacing control */}
            <h1 className="text-5xl md:text-7xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 bg-clip-text text-transparent leading-tight">
              Exam Integrity
            </h1>
            <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-blue-700 to-cyan-600 bg-clip-text text-transparent leading-tight pb-2">
              Reimagined
            </h2>
          </div>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Advanced lab monitoring system that detects and prevents cheating during digital examinations.
          </p>
        </div>

          {/* Glass Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: '👁️',
                title: 'Real-time Monitoring',
                desc: 'Track all student activity during exams'
              },
              {
                icon: '⚠️',
                title: 'Instant Alerts',
                desc: 'Immediate notifications for violations'
              },
              {
                icon: '🔒',
                title: 'Secure Sessions',
                desc: 'Lock down exams with one click'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-white/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Animated Glass Button */}
          <div className="text-center">
            <button
              onClick={() => navigate('/login')}
              className="relative overflow-hidden px-12 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <span className="relative z-10">Educator Login</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section with Glass Background */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-md border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-x-0 md:divide-x divide-white/20">
            <div className="text-center p-4">
              <div className="text-4xl font-bold text-blue-600">100%</div>
              <div className="text-gray-600 mt-2">Real-time</div>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl font-bold text-indigo-600">24/7</div>
              <div className="text-gray-600 mt-2">Monitoring</div>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl font-bold text-purple-600">0</div>
              <div className="text-gray-600 mt-2">False Positives</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}