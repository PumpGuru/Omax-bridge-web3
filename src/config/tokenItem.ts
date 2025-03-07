import { TokenInfo } from "@/types";
import usdc_omax from "../assets/usdc_omax-01.svg";
import usdt_omax from "../assets/usdt_omax-01.svg";
import usdc_eth from "../assets/usdc_eth-01.svg";
import usdt_eth from "../assets/usdt_eth-01.svg";
import usdt_bnb from "../assets/usdt_bnb-01.svg";
import usdc_bnb from "../assets/usdc_bnb-01.svg";

export const tokenItems: Record<number, TokenInfo[]> = {
    [1]: [
        // {
        //     name: 'Eth',
        //     symbol: 'ETH',
        //     decimals: 18,
        //     address: '0x0000000000000000000000000000000000000000',
        //     isNative: true,
        //     fee: 0.0,
        //     chainId: 56,
        //     icon: usdt_eth.src
        // },
        {
            name: 'USD Coin',
            symbol: 'USDC',
            decimals: 6,
            address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            isNative: false,
            fee: 0.0,
            chainId: 1,
            icon: usdc_eth.src
        },
        {
            name: 'Tether USD',
            symbol: 'USDT',
            decimals: 6,
            address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            isNative: false,
            fee: 0.0,
            chainId: 1,
            icon: usdt_eth.src
        },
    ],
    [56]: [
        // {
        //     name: 'BNB',
        //     symbol: 'BNB',
        //     decimals: 18,
        //     address: '0x0000000000000000000000000000000000000000',
        //     isNative: true,
        //     fee: 0.0,
        //     chainId: 56,
        //     icon: usdt_bnb.src
        // },
        {
            name: 'USD Coin',
            symbol: 'USDC',
            decimals: 18,
            address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
            isNative: false,
            fee: 0.0,
            chainId: 56,
            icon: usdc_bnb.src
        },
        {
            name: 'Tether USD',
            symbol: 'USDT',
            decimals: 18,
            address: '0x55d398326f99059fF775485246999027B3197955',
            isNative: false,
            fee: 0.0,
            chainId: 56,
            icon: usdt_bnb.src
        },
    ],
    [97]: [
        // {
        //     name: 'tBNB',
        //     symbol: 'tBNB',
        //     decimals: 18,
        //     address: '0x0000000000000000000000000000000000000000',
        //     isNative: true,
        //     fee: 0,
        //     chainId: 97,
        //     icon: usdt_bnb.src
        // },
        {
            name: 'USD Coin',
            symbol: 'USDC',
            decimals: 18,
            address: '0x0A12Dcf0ed4c06924307980E300ff5Ce83F6502A',
            isNative: false,
            fee: 0,
            chainId: 97,
            icon: usdc_bnb.src
        },
        {
            name: 'Tether USD',
            symbol: 'USDT',
            decimals: 18,
            address: '0x3A017ef40Eb8B9508ECA3Dec992A574fA18Eba3d',
            isNative: false,
            fee: 0.0,
            chainId: 97,
            icon: usdt_bnb.src
        },
    ],
    [311]: [
        // {
        //     name: 'OMAX',
        //     symbol: 'OMAX',
        //     decimals: 18,
        //     address: '0x0000000000000000000000000000000000000000',
        //     isNative: true,
        //     fee: 0.0,
        //     chainId: 311,
        //     icon: usdt_omax.src
        // },
        {
            name: 'USD Coin',
            symbol: 'USDC',
            decimals: 18,
            address: '0xAC95Ab5d7921E2bE4ea4e84dfB7Af05a0832DD9e',
            isNative: false,
            fee: 0.0,
            chainId: 311,
            icon: usdc_omax.src
        },
        {
            name: 'Tether USD',
            symbol: 'USDT',
            decimals: 18,
            address: '0x70917BAcB19CF648662F1FDe224e46228F435B67',
            isNative: false,
            fee: 0.0,
            chainId: 311,
            icon: usdt_omax.src
        },
    ],
    [332]: [
        // {
        //     name: 'OMAXT',
        //     symbol: 'OMAXT',
        //     decimals: 18,
        //     address: '0x0000000000000000000000000000000000000000',
        //     isNative: true,
        //     fee: 0,
        //     chainId: 332,
        //     icon: usdt_omax.src
        // },
        {
            name: 'USD Coin',
            symbol: 'USDC',
            decimals: 18,
            address: '0x457f64Af9E3b9dea59Ab5FEc362d140CE95969ab',
            isNative: false,
            fee: 0,
            chainId: 332,
            icon: usdc_omax.src
        },
        {
            name: 'Tether USD',
            symbol: 'USDT',
            decimals: 18,
            address: '0xA81fEE7a186A486B28f5e841E3002F468A763DAB',
            isNative: false,
            fee: 0.0,
            chainId: 332,
            icon: usdt_omax.src
        },
    ],
};
