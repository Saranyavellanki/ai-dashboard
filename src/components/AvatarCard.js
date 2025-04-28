import React, { useRef } from 'react';

const AvatarCard = ({ avatar, onEdit, onDelete }) => {
  const cardRef = useRef();

  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const angleX = (y - centerY) / 20;
      const angleY = (centerX - x) / 20;
      
      cardRef.current.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.02)`;
      cardRef.current.style.setProperty('--x', `${x}px`);
      cardRef.current.style.setProperty('--y', `${y}px`);
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    }
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg group"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 p-0.5">
        <div className="absolute inset-0 bg-white rounded-lg"></div>
      </div>

      {/* Card Content */}
      <div className="relative z-10">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={avatar.avatar}
            alt={`${avatar.first_name} ${avatar.last_name}`}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          />
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
            {avatar.first_name} {avatar.last_name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-800 transition-colors duration-300">
            {avatar.email}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="flex-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-2 px-4 rounded transition-all duration-300 hover:shadow-sm"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded transition-all duration-300 hover:shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarCard;