import React from 'react';

const AdminSidebar = ({ isOpen, sections, currentSection, onSectionChange }) => {
  if (!isOpen) return null;

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-emerald-200 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              currentSection === section.id
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                : 'text-gray-700 hover:bg-emerald-50'
            }`}
          >
            <span className="text-xl">{section.icon}</span>
            <span className="font-medium">{section.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
