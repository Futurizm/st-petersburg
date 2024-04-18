import React, { useState } from 'react';
import cl from './MySelector.module.css';

const MySelector = ({ children, onClick, isActive }) => {
    const buttonStyle = {
        background: isActive ? '#FB527B' : 'white',
        color: isActive ? 'white' : 'black',
    };

    return (
        <button onClick={onClick} style={buttonStyle} className={cl.mySelect}>
            {children}
        </button>
    );
};

export default MySelector;