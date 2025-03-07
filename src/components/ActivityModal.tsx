"use client";
import {
  Box,
  // Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect, useState } from "react";
import SuccessBridgeModal from "./SuccessBridge/SuccessBridgeModal";
import { BridgeStepProps, ModalProps } from "@/types";
import { formatTime, truncateAddress } from "@/utils/functions";
import { useAccount } from "wagmi";
import { networkItems, tokenItems } from "@/config";
import { t } from "i18next";
import { get_history } from "@/api";

interface BootstrapDialogTitleProps {
  children: React.ReactNode;
  onClose?: () => void;
}

function BootstrapDialogTitle(props: BootstrapDialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{
        m: 0,
        fontSize: "1.2rem",
        textAlign: "center",
        p: 2,
        // borderBottom: "2px solid rgba(255, 255, 255, 0.22)",
        fontWeight: "600",
      }}
      {...other}
    >
      {children}
      {onClose && (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 6,
            top: 6,
            color: "var(--foreground)",
            background: "var(--common)",
            "&:hover": {
              background: "var(--common)",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: "1.2rem" }} />
        </IconButton>
      )}
    </DialogTitle>
  );
}

export default function ActivityModal({ isDialogOpen, setIsDialogOpen, stepProps }: ModalProps) {
  const account = useAccount();
  if (!account) {
    return <></>;
  }

  const [bridgeHistory, setBridgeHistory] = useState([]);
  const [selectHist, setSelectHist] = useState({} as BridgeStepProps);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchHist(address: string) {
      const hist = await get_history(address)
      console.log("history: ", hist);
      setBridgeHistory(hist);
    }
    if (account && account.address) {
      fetchHist(account.address)
    }
  }, [account]);

  const onSelectHist = (selectNum: number) => {
    setIsModalOpen(true);
    const bridgeItem: any = bridgeHistory[selectNum]
    const hist: BridgeStepProps = {
      amount: Number(bridgeItem.depositAmount),
      from: bridgeItem.sourceChainId,
      to: bridgeItem.targetChainId,
      estimatedGas: stepProps.estimatedGas,
      estimatedTime: formatTime(bridgeItem.delay),
      symbol: tokenItems[bridgeItem.sourceChainId].find((item) => item.address == bridgeItem.depositToken)?.symbol ?? "USDC",
      fee: bridgeItem.fee
    }
    setSelectHist(hist);
  }

  return (
    <Dialog
      onClose={() => setIsDialogOpen(true)}
      disableScrollLock
      aria-labelledby="customized-dialog-title"
      open={isDialogOpen}
      sx={{
        "& .MuiDialogContent-root": {
          p: "0",
        },
        "& .MuiDialogActions-root": {
          padding: "1rem",
        },
        "& .MuiDialog-container": {
          backdropFilter: "blur(42px)",
          background: `var(--background)`,
          opacity: "0.4",
          //   marginTop: "-10rem",
        },
        "& .MuiPaper-root": {
          maxWidth: "100%",
          height: "100%",
          m: "10px",
          borderRadius: "20px",
          background: `none`,
          backdropFilter: "blur(32.5px)",
          color: `var(--foreground)`,
          width: { md: "100% !important", xs: "440px !important" },
          boxShadow: "none",
          //   boxShadow: "inset 0px 0px 15px rgba(255, 255, 255, 0.4)",
        },
        "& p,div,a,button": {
          // fontFamily: Inter_font.style.fontFamily,
          // fontSize:"15px"
        },
      }}
    >
      <BootstrapDialogTitle onClose={() => setIsDialogOpen(false)}>
        <Typography />
      </BootstrapDialogTitle>
      <DialogContent
        sx={{
          width: { sm: "440px", xs: "100%" },
          m: "0 auto",
          // textAlign:"center"
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignSelf: "center",
            my: "2rem"
          }}
        >
          <Typography
            sx={{
              background: `var(--box_bg)`,
              borderRadius: "13px",
              p: "0.5rem 1rem",
              fontWeight: "600",
              fontSize: "20px",
            }}
          >
            {" "}
            {("ACTIVITY")}{" "}
            <Typography
              className="foreground_text"
              sx={{ opacity: "0.6" }}
              component={"span"}
            >
              {truncateAddress(account.address)}
            </Typography>
          </Typography>
        </Box>
        {bridgeHistory.map((bridgeItem: any, key) => (
          <Box
            key={key}
            sx={{
              background: `var(--box_bg)`,
              borderRadius: "13px",
              p: "1rem",
              cursor: "pointer",
              mb: "1rem", // Add margin between elements
            }}
            onClick={() => onSelectHist(key)}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
                //   alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <Typography component={"img"} src={networkItems.find((item) => item.chainId == bridgeItem.sourceChainId)?.icon} width={32} height={32} />
                <Box>
                  <Typography
                    className="light_dark_text"
                    sx={{
                      fontSize: "13px !important",
                    }}
                  >
                    {formatTime(Date.now() / 1000 - bridgeItem.timestamp)} {t("ago")}
                  </Typography>
                  <Typography
                    className="foreground_text"
                    sx={{ fontSize: "20px !important" }}
                  >
                    {bridgeItem.depositAmount} {tokenItems[bridgeItem.sourceChainId].find((item) => item.address == bridgeItem.depositToken)?.symbol}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                m: "1rem auto 0",
                width: "88%",
                display: "flex",
                gap: "5px",
                alignItems: "center",
              }}
            >
              <CheckCircleIcon />
              <Typography className="foreground_text">
                {t("Bridge successfull")}
              </Typography>
            </Box>
          </Box>
        ))}
      </DialogContent>
      <SuccessBridgeModal
        isDialogOpen={isModalOpen}
        setIsDialogOpen={setIsModalOpen}
        stepProps={selectHist}
      />
    </Dialog>
  );
}
