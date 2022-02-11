import styled from "styled-components";

export const Styles = styled.div`

    padding-top: 10px;
    background-color: #202332;
    min-height: 500px !important;

    // display: flex;
    // justify-content: center;
    // align-items: center;

    .filter-net {
        font-size: 0.6rem !important;
    }

    .dropdown button {
        background-color: transparent !important;
        color: #bcbcbf;
        border: none;
        font-size: 15px !important;
    }

    .dropdown button:hover {
        background-color: transparent !important;
        color: #fff;
    }

    .show>.btn-primary.dropdown-toggle:focus {
        box-shadow: none;
    }

    .dropdown-menu {
        background-color: #202332 !important;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .dropdown-menu:hover {
        background-color: #202332 !important;
    }

    .dropdown-menu .dropdown-item:hover {
        background-color: rgba(0,0,0,.6);
    }

    .btn-primary {
        background-color: #0d6efd !important;
        border-color: #0d6efd !important;
        border-radius: 0 !important; 
    }

    .btn-primary:hover {
        background-color: #0b5ed7 !important;
    }

    .btn-primary:focus {
        box-shadow: none !important;
    }

    .btn:focus {
        box-shadow: none !important;
    }

    .toggle-btn {
        display: none !important;
        border-color: rgba(255,255,255,.1);
    }

    .toggle-btn:focus {
        box-shadow: none !important;
    }

    .form-check-input {
        background-color: #2c2d2e;
        border-color: #818181;
    }

    .paginator {
        bottom: 2rem !important;
    }

    .nft-cards {
        min-height: 600px;
        max-height: 950px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .mobile-filters {
        display: none;
    }

    @media (max-width: 991px) {
        .toggle-btn {
            display: flex !important;
            border-color: rgba(255, 255, 255, .4);
        }
        .mobile-filters {
            display: flex !important;
            background-color: #000;
            opacity: 0.9;
            position: absolute;
            right: 0;
            top: 0;
            height: 100% !important;
            min-height: 700px;
            animation: slide-x .5s;
        }
    }

`;