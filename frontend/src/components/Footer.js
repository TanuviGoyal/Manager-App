import React from 'react';

const Footer = () => {
    const footerStyle = {
        backgroundColor: '#f8f9fa',
        textAlign: 'center',
        padding: '10px 0',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    };

    const linkStyle = {
        color: '#007bff',
        textDecoration: 'none',
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        justifyContent: 'flex-end',
    };

    return (
        <div style={containerStyle}>
            <footer style={footerStyle}>
                <div>
                    © 2024 Docker Manager. All Rights Reserved.
                    <br />
                    <a style={linkStyle} href="/privacy-policy">Privacy Policy</a>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
