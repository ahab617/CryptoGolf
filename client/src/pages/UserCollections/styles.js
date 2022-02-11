import styled from "styled-components";

export const Styles = styled.div`

    min-height: 500px;
    margin-top: 10px !important;
    background-color: #202332;

    .title-text h2 span {
        color: #42a369;
    }

    select option {
        background-color: transparent !important;
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

    .dropdown-menu:focus-visible {
        border: none !important;
    }

    .dropdown-menu .dropdown-item:hover {
        background-color: rgba(0,0,0,.6);
    }

    .btn:focus {
        box-shadow: none !important;
    }

`