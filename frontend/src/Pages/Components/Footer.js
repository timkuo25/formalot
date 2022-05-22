import '../../css/Footer.css'
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";


const Footer = () => {
    const { t, i18n } = useTranslation();
    return(
        <footer className="footer">
            <div className='copyright'>© 2022 Formalot</div>
            <div className='footer-link'>
                <a href='instruction'>{t("會員須知")}</a>
                <a href='#'>{t("幫助")}</a>
                <a href='register'>{t("註冊")}</a>
                <a href='#'>{t("了解更多")}</a>
            </div>
            <div></div>
        </footer>
    )
}

export { Footer };