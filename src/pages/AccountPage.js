import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import AccountGeneral from "../features/user/AccountGeneral";
import AccountSocialLink from "../features/user/AccountSocialLink";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ShareIcon from "@mui/icons-material/Share";
import { capitalCase } from "change-case";

function AccountPage() {
  const [currentTab, setCurrentTab] = useState("general");

  const handleChangeTab = (newValue) => {
    setCurrentTab(newValue);
  };

  const ACCOUNT_TABS = [
    {
      value: "general",
      icon: <AccountBoxIcon sx={{ fontSize: 30 }} />,
      component: <AccountGeneral />,
    },
    {
      value: "social_link",
      icon: <ShareIcon sx={{ fontSize: 30 }} />,
      component: <AccountSocialLink />,
    },
  ];

  return (
    <Container>
      <Typography>Account Page</Typography>

      <Tabs
        value={currentTab}
        onChange={(e, value) => handleChangeTab(value)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
      >
        {ACCOUNT_TABS.map((tab) => (
          <Tab
            disableRipple
            key={tab.value}
            value={tab.value}
            icon={tab.icon}
            label={capitalCase(tab.value)}
          />
        ))}
      </Tabs>

      {ACCOUNT_TABS.map((tab) => {
        const isMatch = tab.value === currentTab;
        return isMatch && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </Container>
  );
}

export default AccountPage;
