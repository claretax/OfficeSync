import React from 'react';

function ListDetailsPane({ leftContent, rightContent }) {
  return (
    <div className='flex h-full'>
        {/* Lists section */}
        <div className='w-1/3 border-r bg-white overflow-y-auto'>
            {leftContent}
        </div>
        {/* Details section */}
        <div className='flex-1 bg-gray-50 overflow-y-auto p-4'>
            {rightContent}
        </div>
    </div>
  );
}

export default ListDetailsPane;