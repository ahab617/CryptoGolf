import styled from 'styled-components';

export const Styles = styled.div`

    .header {
        text-align: center;
        font-size: 20px;
        text-transform: uppercase;
        font-weight: 700;
        line-height: 0;
        background: rgba(#f3f3f3,1);
    }

    .navbar-nav {
        display: flex;
        flex-direction: row;
        padding-left: 0;
        margin-bottom: 0;
        list-style: none;
    }

    .navbar-toggleable-md {
        flex-wrap: nowrap;
        align-items: center;
    }

    .navbar-brand {
        display: inline-block;
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
        margin-right: 1rem;
        font-size: 1.25rem;
        line-height: inherit;
        white-space: nowrap;
    }

    .logo-img {
        width: 4rem;
        left: 0.6rem;
        top: -0.9rem;
    }

    .logo-text {
        font-weight: 500;
        line-height: 1;
        color: #fff;
        letter-spacing: 0;
        font-size: 2rem;
        padding-top: 2rem;
    }

    .header-text {
        font-size: 0.7rem;
        color: #fff !important;
        font-weight: 500;
        letter-spacing: 3px;
        padding: 0 0.3rem !important;
    }

    .wallet-lock {
        width: 0.8rem;
    }

    .header-menu {
        display: flex;
        list-style-type: none;
    }

    .header-menu > li {
        float: left !important;
        font-size: 0.7rem;
        color: #fff !important;
        font-weight: 500;
        letter-spacing: 3px;
        padding: 0 0.5rem !important;
        cursor: pointer;
    }

    .header-menu > li:hover {
        opacity: 0.7;
    }

    .connect-btn {
        width: 160px;
        height: 35px;
        font-size: 20px !important;
    }

    .btn-login-wallet {
        color: #000;
        box-shadow: 0 4px 0 0 #2f9e5b;
        background-color: #52cc83;
        outline: none;
        border: none;
        cursor: pointer;
        opacity: 1;
    }

    .btn-login-wallet:hover {
        opacity: 0.8;
    }

    .social-icon {
        color: #2080e0;
        font-size: 20px;
    }

    .sticky {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1;
        animation: slide .5s;
        background-color: rgba(0,0,0,.6);
    }

    .toggle-btn {
        display: none !important;
        border-color: rgba(255,255,255,.1);
    }

    .toggle-btn:focus {
        box-shadow: none !important;
    }

    .header-menu-item {
        z-index: 2;
    }

    .narrowLinks, .wallet-status-show {
        text-align: center;
        position: absolute;
        animation: slide .3s;
        z-index: 1;
    }

    .narrowLinks {
        background-color: rgba(0,0,0,.6);
        width: 100%;
    }

    .narrowLinks a {
        text-decoration: none;
        display: block;
        clear: left;
        padding: .5em 0;
        color: #fff;
        font-weight: 500;
        font-size: 1.1rem;
    }

    .narrowLinks a:hover {
        background-color: rgba(34,35,36,.5647058823529412);
    }

    .toggle-menu-item {
        font-size: 18px !important;
        font-weight: 400 !important;
    }

    @media (max-width: 991px) {
        .header-menu {
            display: none;
        }

        .toggle-btn {
            display: flex !important;
            border-color: rgba(255, 255, 255, .4);
        }
    }

    @media (max-width: 576px) {
        .connect-btn {
            width: 110px;
            height: 25px;
            font-size: 14px !important;
        }
    }

`;