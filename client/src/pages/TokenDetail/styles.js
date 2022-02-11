import styled from "styled-components";

export const Styles = styled.div`

    background-color: #202332;
    min-height: 500px;

    .token-content {
        width: 70%;
        margin: auto;
    }

    .token-img {
        width: 100%;
    }

    table th, table td {
        color: #bcbcbf;
    }

    .btn-buy, .btn-order {
        padding: 0.4rem 0.5rem !important;
        font-size: 14px !important;
    }

    // .btn-link {
    //     color: #0d6efd !important;
    //     padding: 0 !important;
    // }

    table {
        display: flex;
        flex-flow: column;
        width: 100%;
    }

    thead {
        flex: 0 0 auto;
    }

    tbody {
        flex: 1 1 auto;
        display: block;
        overflow-y: auto;
        overflow-x: hidden;
        max-height: 400px;
        overflow-y: auto !important;
    }

    tr {
        width: 100%;
        display: table;
        table-layout: fixed;
    }

    @media screen and (max-width: 991px) {
        .token-content {
            width: 100%;
            margin: auto;
        }
    
        .token-img {
            width: 50%;
        }
    }

    @media screen and (max-width: 576px) {
        .token-content {
            width: 100%;
            margin: auto;
        }
        
        .token-img {
            width: 50%;
        }
    }

`