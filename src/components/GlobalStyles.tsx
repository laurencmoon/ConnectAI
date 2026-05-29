import React from 'react';

export const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Extended|Google+Material+Icons|Google+Material+Icons+Filled|Google+Symbols|Google+Symbols:wght,GRAD@300,-25;400,0;700,200|Roboto:400,500,700,400italic|Google+Sans+Text:400,500,700,400italic|Google+Sans:400,500,700|Redacted|Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');
    
    body {
      font-family: 'Google Sans Text', sans-serif;
      -webkit-font-smoothing: antialiased;
      background-color: #f1f3f4;
      margin: 0;
    }
    
    .font-brand {
      font-family: 'Google Sans Text', sans-serif;
    }
    
    .citation-highlight {
      transition: all 0.2s ease-in-out;
      border-bottom: 2px solid transparent;
      border-radius: 2px;
    }
    .citation-highlight.active {
      background-color: rgba(26, 115, 232, 0.08);
      border-bottom-color: rgba(26, 115, 232, 0.4);
      padding-left: 2px;
      padding-right: 2px;
    }

    :root {
        /* Custom Variables */
        --bg-color: #f4f6f8;
        --card-bg: #ffffff;
        --text-color: #202124;
        --text-sub: #5f6368;
        --primary-blue: #1a73e8;
        --border-color: #dadce0;
        --color-white: #fff;
        --color-black: #000;
    }

    /* Left Navigation */
    .left-nav {
        width: 72px;
        background-color: #fff;
        border-right: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
    }

    .nav-header {
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-sub);
    }

    .nav-items {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
        width: 100%;
    }

    .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        color: var(--text-sub);
        font-size: 0.7rem;
        width: 100%;
        padding: 5px 0;
    }

    .nav-item.active {
        color: var(--primary-blue);
        background-color: #e8f0fe;
        border-radius: 4px;
        width: 80%;
    }

    .nav-icon {
        font-size: 1.5rem;
        margin-bottom: 4px;
    }

    .nav-label {
        text-align: center;
    }

    .sparkle-btn {
        color: #1a73e8;
    }

    .nav-bottom-group {
        background-color: #fff;
        border-radius: 24px;
        padding: 10px 5px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        align-items: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        margin-bottom: 20px;
    }

    .nav-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: #5f6368;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
    }

    .nav-btn:hover {
        background-color: rgba(32,33,36,0.08);
    }

    .sparkle-container {
        width: 32px;
        height: 32px;
        background-color: #e8f0fe;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #1a73e8;
    }

    /* Top Navigation */
    .top-nav {
        height: 64px;
        background-color: #fff;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
    }

    .logo-icon {
        font-size: 1.5rem;
        margin-right: 10px;
    }

    .logo-text {
        font-weight: 500;
        font-size: 1.2rem;
    }

    .nav-right {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .nav-icon {
        cursor: pointer;
        color: var(--text-sub);
        font-size: 1.2rem;
        position: relative;
    }

    .notification-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background-color: #d93025;
        color: white;
        border-radius: 50%;
        padding: 2px 5px;
        font-size: 0.6rem;
    }

    .user-selector {
        font-size: 0.9rem;
        color: var(--text-sub);
    }

    .user-avatar {
        width: 32px;
        height: 32px;
        background-color: #e8eaed;
        border-radius: 50%;
        background-size: cover;
    }

  `}</style>
);
