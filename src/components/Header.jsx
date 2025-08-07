import React from 'react';
import { Github, Linkedin } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gap in My Resume
            <span className="text-blue-600">.dev</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A transparent look at my journey during unemployment - the learning, growth, and projects that filled the gap
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
              <Github className="w-5 h-5" />
              GitHub
            </button>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
              <Linkedin className="w-5 h-5" />
              LinkedIn
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;