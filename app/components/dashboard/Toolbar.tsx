import React from 'react';
import { Text, Image, Square, Type } from 'lucide-react';

export function Toolbar() {
  return (
    <div className="flex flex-col items-center space-y-4 py-4">
      <button className="p-2 hover:bg-gray-200 rounded">
        <Text size={24} />
      </button>
      <button className="p-2 hover:bg-gray-200 rounded">
        <Image size={24} />
      </button>
      <button className="p-2 hover:bg-gray-200 rounded">
        <Square size={24} />
      </button>
      <button className="p-2 hover:bg-gray-200 rounded">
        <Type size={24} />
      </button>
    </div>
  );
}