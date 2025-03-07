"use client";
import React, { useContext, useState, useEffect } from "react";
import { Box, Button, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import usdc from "../../assets/usdc.png";
import usdt from "../../assets/usdt.svg";
import watch from "../../assets/watch.svg";
import fuel from "../../assets/fuel.svg";
import via from "../../assets/via.svg";
import HelpIcon from "@mui/icons-material/Help";
import add_from from "../../assets/from.svg";
import add_to from "../../assets/to.svg";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { BridgeStepProps } from "@/types";
import { networkItems, tokenItems } from "@/config";
import { useAccount, WagmiContext } from "wagmi";
import { truncateAddress } from "@/utils/functions";
import { writeContract, waitForTransactionReceipt, simulateContract, getBlock, getGasPrice } from "@wagmi/core";
import { erc20ABI, bridgeABI } from "@/services/abi";
import { parseEther, getAddress } from "viem";
import { bridging } from "@/api";
import { t } from "i18next";
import { AppContext } from "@/context/AppContext";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box p={"0.5rem 0"}>{children}</Box>}
    </div>
  );
};

const ThirdStep = (stepProps: BridgeStepProps) => {
  const account = useAccount();
  const config = useContext(WagmiContext);
  if (!config) {
    console.error("WagmiContext is not available");
    return <></>;
  }

  const { withdrawStatus, depositTx } = useContext(AppContext);

  const [tabIndex, setTabIndex] = useState<number>(0);
  const [text, setText] = useState(false)
  const [loading, setLoading] = useState(false)
  const [check_1, setCheck_1] = useState(false)
  const [check_2, setCheck_2] = useState(false)
  const [check_3, setCheck_3] = useState(false)
  const [depositTransaction, setDepositTransaction] = useState('');

  const handleStart = async () => {
    setText(true)
    setLoading(true);
    setCheck_1(true);
    const tokenAddress = tokenItems[stepProps.from].find((item) => item.symbol == stepProps.symbol)?.address;
    if (!tokenAddress) return;
    const formattedTokentAddress = getAddress(tokenAddress);

    const bridgeAddress = networkItems.find((item) => item.chainId == stepProps.from)?.bridge;
    if (!bridgeAddress) return;
    const formattedBridgeAddress = getAddress(bridgeAddress);

    const withdrawToken = tokenItems[stepProps.to].find((item) => item.symbol == stepProps.symbol)?.address;
    if (!withdrawToken) return;

    let amountWei;
    if (stepProps.from == 1) {
      amountWei = BigInt(stepProps.amount * 1_000_000);
    } else {
      amountWei = parseEther(stepProps.amount.toString());
    }

    const startBlock = await getBlock(config, {
      chainId: stepProps.from
    });

    let tx;
    if (stepProps.from == 1) {
      const gasPrice = await getGasPrice(config, {
        chainId: stepProps.from,
      })
      const applyingGasPrice = Math.ceil(Number(gasPrice.toString()) * 1.5);
      const approveTx = await writeContract(config, {
        abi: erc20ABI,
        address: formattedTokentAddress,
        functionName: "approve",
        args: [formattedBridgeAddress, amountWei],
        gasPrice: BigInt(applyingGasPrice),
        chainId: stepProps.from
      });
      const reciptApprove = await waitForTransactionReceipt(config, { hash: approveTx });
      const { request } = await simulateContract(config, {
        abi: bridgeABI,
        address: formattedBridgeAddress,
        functionName: "depositToken",
        args: [
          formattedTokentAddress,
          amountWei.toString(),
          account.address,
          stepProps.to.toString()
        ],
        gasPrice: BigInt(applyingGasPrice),
        chainId: stepProps.from
      });
      tx = await writeContract(config, request);
    }    
    else {
      const approveTx = await writeContract(config, {
        abi: erc20ABI,
        address: formattedTokentAddress,
        functionName: "approve",
        args: [formattedBridgeAddress, amountWei],
        chainId: stepProps.from
      });
      const reciptApprove = await waitForTransactionReceipt(config, { hash: approveTx });
      const { request } = await simulateContract(config, {
        abi: bridgeABI,
        address: formattedBridgeAddress,
        functionName: "depositToken",
        args: [
          formattedTokentAddress,
          amountWei.toString(),
          account.address,
          stepProps.to.toString()
        ],
        chainId: stepProps.from
      });
      tx = await writeContract(config, request);
    }    

    const recipt = await waitForTransactionReceipt(config, { hash: tx });
    const endBlock = await getBlock(config, {
      blockNumber: recipt.logs[0].blockNumber,
      chainId: stepProps.from
    });
    setLoading(false);
    setDepositTransaction(tx);
    
    const delay = endBlock.timestamp - startBlock.timestamp;
    bridging(account.address || "0x",
      stepProps.amount.toString(),
      formattedTokentAddress,
      tx,
      stepProps.from,
      account.address || "0x",
      stepProps.fee,
      stepProps.to,
      withdrawToken,
      Number(delay.toString()));
  };

  useEffect(() => {
    if (withdrawStatus == 1 && depositTransaction == depositTx)
      setCheck_2(true);
    else if (withdrawStatus == 2 && depositTransaction == depositTx)
      setCheck_3(true)
  }, [withdrawStatus]);

  const handleChange = (_event: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  return (
    <Box
      textAlign={"center"}
      mt={"1rem"}
      sx={{
        "& .box": {
          background: `var(--box_bg)`,
          borderRadius: "10px",
          p: "0.5rem 1rem",
          textAlign: "start",
        },
      }}
    >
      <Typography
        component={"img"}
        src={stepProps.symbol == "USDT" ? usdt.src : usdc.src}
        sx={{ width: "67px", height: "67px" }}
      />
      <Typography
        sx={{
          pt: "0.5rem",
          fontSize: "20px",
          fontWeight: "600",
        }}
      >
        {t("Bridge")} {stepProps.amount} {stepProps.symbol}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: "1rem",
          "& .MuiButtonBase-root": {
            color: "var(--foreground) !important",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            border: "none",
            gap: "5px",
            p: "10px 15px",
            fontSize: "13px !important",
            fontWeight: "600 !important",
            textTransform: "capitalize",
            minHeight: "auto",
          },
          "& .MuiTabs-indicator": {
            display: "none"
          },
          "& .MuiTabs-flexContainer": {
            overflow: "auto",
            justifyContent: "center",
            background: "#8A898E",
            borderRadius: "21px",
          },
          "& .MuiTab-root.Mui-selected": {
            background: "var(--light_dark)",
            borderRadius: "20px",
            // border: "none"
          },
          "& .MuiTouchRipple-root": {
            display: "none",
          },
        }}
      >
        <Tabs value={tabIndex} onChange={handleChange} sx={{ lineHeight: "0" }}>
          <Tab label={t("Steps")} />
          <Tab label={t("Bridge Info")} />
        </Tabs>
      </Box>
      <TabPanel value={tabIndex} index={0}>
        {/* steps  */}
        <Box>
          <Box
            className="box"
            sx={{
              mt: "0.5rem",
              py: "0.8rem !important",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <Typography component={"img"} src={networkItems.find((item) => item.chainId == stepProps.from)?.icon} width={26} height={26} />
              <Box>
                <Typography className="text_">{t("Start on")} {networkItems.find((item) => item.chainId == stepProps.from)?.label}</Typography>
                <Typography
                  className="light_dark_text"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px !important",
                  }}
                >
                  <Typography component={"img"} src={fuel.src} /> {stepProps.estimatedGas} {networkItems.find((item) => item.chainId == stepProps.from)?.symbol}
                </Typography>
              </Box>
            </Box>
            {loading ?
              <CircularProgress
                sx={{
                  width: "20px !important",
                  height: "20px !important",
                  marginRight: "5px",
                  color: "var(--foreground)",
                }}
              />
              :
              check_1 ? <CheckBoxIcon sx={{ fontSize: "1.8rem" }} />
                :
                <Button
                  className="common_btn"
                  sx={{
                    width: "auto !important",
                    height: "30px !important",
                  }}
                  onClick={handleStart}
                >
                  {text ? `${t("Bridging")}..` : t("Start")}
                </Button>
            }
          </Box>
          <Box
            className="box flex"
            sx={{
              my: "0.5rem",
              py: "1rem !important",
            }}
          >
            <Typography
              className="text_"
              sx={{
                fontSize: "13px !important",
              }}
            >
              <Typography
                component={"img"}
                src={watch.src}
                width={26}
                sx={{ verticalAlign: "middle" }}
              />{" "}
              {t("Wait")} {stepProps.estimatedTime}
            </Typography>
            {check_2 && <CheckBoxIcon sx={{ fontSize: "1.8rem" }} />}
            {!loading && check_1 && !check_2 && <CircularProgress
                sx={{
                  width: "20px !important",
                  height: "20px !important",
                  marginRight: "5px",
                  color: "var(--foreground)",
                }}
              />}
          </Box>
          <Box
            className="box flex"
            sx={{
              py: "1rem !important",
            }}
          >
            <Typography
              className="text_"
              sx={{
                fontSize: "13px !important",
              }}
            >
              <Typography
                component={"img"}
                src={networkItems.find((item) => item.chainId == stepProps.to)?.icon}
                width={26}
                height={26}
                sx={{ verticalAlign: "middle" }}
              />{" "}
              {t("Get")} {stepProps.amount} {stepProps.symbol} on {networkItems.find((item) => item.chainId == stepProps.to)?.label}
            </Typography>
            {check_3 && <CheckBoxIcon sx={{ fontSize: "1.8rem" }} />}
            {!loading && check_1 && check_2 && !check_3 && <CircularProgress
                sx={{
                  width: "20px !important",
                  height: "20px !important",
                  marginRight: "5px",
                  color: "var(--foreground)",
                }}
              />}
          </Box>
        </Box>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        {/* bridge info  */}
        <Box
          sx={{
            mt: "0.5rem",
            borderRadius: "20px",
            border: "1px solid var(--light_dark)",
            p: "1rem",
            "& img": {
              verticalAlign: "middle",
            },
          }}
        >
          <Box className="flex" mb={"1rem"}>
            <Typography className="text_">
              <Typography
                component={"img"}
                src={networkItems.find((item) => item.chainId == stepProps.from)?.icon}
                width={28}
                height={28}
                sx={{ width: "18px", height: "18px" }}
              />{" "}
              {t("From")} {networkItems.find((item) => item.chainId == stepProps.from)?.label}
            </Typography>
            <Typography className="text_">
              {stepProps.amount} {stepProps.symbol}{" "}
              <Typography
                component={"img"}
                src={tokenItems[stepProps.from].find((item) => item.symbol == stepProps.symbol)?.icon}
                width={28}
                height={28}
                sx={{ verticalAlign: "middle" }}
              />
            </Typography>
          </Box>
          <Box className="flex" mb={"1rem"}>
            <Typography className="text_">
              <Typography
                component={"img"}
                src={networkItems.find((item) => item.chainId == stepProps.to)?.icon}
                width={28}
                height={28}
                sx={{ width: "18px", height: "18px", borderRadius: "5px" }}
              />{" "}
              {t(" To")} {networkItems.find((item) => item.chainId == stepProps.to)?.label}
            </Typography>
            <Typography className="text_">
              {stepProps.amount} {stepProps.symbol}{" "}
              <Typography
                component={"img"}
                src={tokenItems[stepProps.to].find((item) => item.symbol == stepProps.symbol)?.icon}
                width={28}
                height={28}
                sx={{ verticalAlign: "middle" }}
              />
            </Typography>
          </Box>
          <Box className="flex" mb={"1rem"}>
            <Typography className="text_">
              <Typography component={"img"} sx={{ width: "24px" }} src={add_from.src} /> {t("From")} {t("Address")}
            </Typography>
            <a href={networkItems.find((item) => item.chainId === stepProps.from)?.scanUrl + "/address/" + account.address} target="_blank" >
              <Typography className="text_">{truncateAddress(account.address)}</Typography>
            </a>
          </Box>
          <Box className="flex" mb={"1rem"}>
            <Typography className="text_">
              <Typography component={"img"} sx={{ width: "24px" }} src={add_to.src} /> {t("To")} {t("Address")}
            </Typography>
            <a href={networkItems.find((item) => item.chainId === stepProps.to)?.scanUrl + "/address/" + account.address} target="_blank" >
              <Typography className="text_">{truncateAddress(account.address)}</Typography>
            </a>
          </Box>
          <Box className="flex">
            <Typography className="text_">
              <Typography component={"img"} sx={{ width: "24px" }} src={watch.src} /> {t("Transfer Time")}
            </Typography>
            <Typography className="text_">~{stepProps.estimatedTime}</Typography>
          </Box>
        </Box>
      </TabPanel>
      <a href="https://docs.omax.app/omaxbridge/omax-bridge/help" target="_blank">
        <Button
          className="btn"
          sx={{
            mt: "2rem",
            px: "20px",
            fontSize: "12px !important",
            background: "var(--light_dark_bg) !important",
          }}
        >
          {t("Need help? View FAQs")} <HelpIcon sx={{ fontSize: "1rem", ml: "5px" }} />
        </Button>
      </a>
    </Box>
  );
};

export default ThirdStep;
