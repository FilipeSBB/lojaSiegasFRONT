import React from 'react';

const Titulo = ({ text1, text2 }) => {
    return (
        <div outfit="true" className='inline-flex gap-2 items-center mb-3'>
            <p className='text-gray-500 font-medium'>{text1} <span className='text-gray-500'>{text2}</span></p>
        </div>
    );
}

export default Titulo;
