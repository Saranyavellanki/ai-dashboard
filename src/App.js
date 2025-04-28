import React, { useState, useEffect } from 'react';
import AvatarCard from './components/AvatarCard';
import CreateAvatarModal from './components/CreateAvatarModal';
import { useMousePosition } from './useMousePosition';

function App() {
  const [avatars, setAvatars] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState(null);
  const [userName, setUserName] = useState('User');
  const [loading, setLoading] = useState(true);
  const { x, y } = useMousePosition(); // Get mouse position

  // Function to generate human-like animated avatars
  const generateAnimatedAvatar = (seed) => {
    return `https://api.dicebear.com/6.x/avataaars/svg?seed=${seed}`;
  };

  // Calculate parallax effect values based on mouse position
  const getParallaxStyle = (index) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const moveX = (x - centerX) / 50;
    const moveY = (y - centerY) / 50;
    
    // Stagger the effect based on card index
    return {
      transform: `translate(${moveX * (index % 2 === 0 ? 1 : -1)}px, ${moveY * (index % 3 === 0 ? 0.5 : 1)}px)`,
      transition: 'transform 0.3s ease-out'
    };
  };

  useEffect(() => {
    const setupAvatars = () => {
      try {
        setLoading(true);
        const initialAvatars = [
          {
            id: 1,
            first_name: 'Emma',
            last_name: 'Wong',
            email: 'emma.wong@example.com',
            avatar: generateAnimatedAvatar('SAD')
          },
          {
            id: 2,
            first_name: 'Michael',
            last_name: 'Lawson',
            email: 'michael.lawson@example.com',
            avatar: generateAnimatedAvatar('SAMEER')
          },
          {
            id: 3,
            first_name: 'Lindsay',
            last_name: 'Ferguson',
            email: 'lindsay.ferguson@example.com',
            avatar: generateAnimatedAvatar('JACKK')
          }
        ];
        setAvatars(initialAvatars);
      } catch (error) {
        console.error('Error setting up avatars:', error);
      } finally {
        setLoading(false);
      }
    };

    setupAvatars();
    setUserName(localStorage.getItem('dashboardUserName') || 'User');
  }, []);

  const handleCreateAvatar = () => {
    setEditingAvatar(null);
    setIsModalOpen(true);
  };

  const handleEditAvatar = (avatar) => {
    setEditingAvatar(avatar);
    setIsModalOpen(true);
  };

  const handleSaveAvatar = (avatarData) => {
    if (editingAvatar) {
      setAvatars(avatars.map(avatar =>
        avatar.id === editingAvatar.id
          ? {
              ...avatar,
              ...avatarData,
              avatar: avatarData.avatar || generateAnimatedAvatar(`${avatarData.first_name}${avatarData.last_name}`)
            }
          : avatar
      ));
    } else {
      const maxId = avatars.length > 0 ? Math.max(...avatars.map(a => a.id)) : 0;
      const newAvatar = {
        id: maxId + 1,
        ...avatarData,
        avatar: avatarData.avatar || generateAnimatedAvatar(`${avatarData.first_name}${avatarData.last_name}`)
      };
      setAvatars([...avatars, newAvatar]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteAvatar = (id) => {
    setAvatars(avatars.filter(avatar => avatar.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <header className="mb-10 text-center relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/4 -right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            <div className="absolute bottom-10 left-1/4 w-60 h-60 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          </div>

          {/* Main header content */}
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 mb-4 animate-fade-in-up">
              Welcome to Your Avatar Dashboard
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 animate-fade-in-up animation-delay-300">
              Glad to have you back, <span className="font-semibold text-indigo-600 animate-pulse">{userName}</span>!
            </p>
            
            {/* Decorative elements */}
            <div className="mt-6 flex justify-center space-x-4">
              <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-scale-x"></div>
              <div className="w-8 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-scale-x animation-delay-200"></div>
              <div className="w-4 h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-scale-x animation-delay-400"></div>
            </div>
          </div>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Your Human Avatars</h2>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              <span className="ml-3">Loading avatars...</span>
            </div>
          ) : (
            <>
              {avatars.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No avatars found. Create your first avatar!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {avatars.map((avatar, index) => (
                    <div 
                      key={avatar.id}
                      style={getParallaxStyle(index)} // Apply parallax effect
                    >
                      <AvatarCard
                        avatar={avatar}
                        onEdit={() => handleEditAvatar(avatar)}
                        onDelete={() => handleDeleteAvatar(avatar.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        <button
          onClick={handleCreateAvatar}
          className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          aria-label="Create new avatar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </main>

      {isModalOpen && (
        <CreateAvatarModal
          avatar={editingAvatar}
          onSave={handleSaveAvatar}
          onClose={() => setIsModalOpen(false)}
          generateAnimatedAvatar={generateAnimatedAvatar}
        />
      )}
    </div>
  );
}

export default App;