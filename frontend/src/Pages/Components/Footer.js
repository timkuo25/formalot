import '../../css/Footer.css'
import React, { useState } from 'react';


const Footer = () => {
    return(
        <footer className="footer">
            <div className='copyright'>© 2022 Formalot</div>
            <div className='footer-link'>
                <a href='instruction'>會員須知</a>
                <a href='#'>幫助</a>
                <a href='register'>註冊</a>
                <a href='#'>了解更多</a>
            </div>
            <div></div>
        </footer>
    )
}

export { Footer };