"use client";
import * as React from "react";

import { AuthContext } from "@/src/context/AuthContext";
import LoadingPage from "@/src/presentation/templates/LoadingPage";
import {
  Box,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { redirect } from "next/navigation";
import HappyBirthday from "@/src/presentation/templates/HappyBirthday";
import Memories from "@/src/presentation/templates/Memories";

export default function Home() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const { authState, authDispatch } = React.useContext(AuthContext);
  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  React.useEffect(() => {
    authDispatch({ type: "initialize" });
  }, [authDispatch]);

  React.useEffect(() => {
    if (!authState.initialized) {
      return;
    }
    if (!authState.isLogin) {
      redirect("/sign-in");
    }
    setLoading(false);
  }, [authState.initialized, authState.isLogin]);

  if (!authState.initialized || loading) {
    return <LoadingPage />;
  }

  return (
    <main>
      <Box width="100vw" height="100vh" position="relative">
        <Tabs
          defaultIndex={activeIndex}
          onChange={(index) => setActiveIndex(index)}
        >
          <TabList display="flex" alignItems="center" justifyContent="center">
            <Tab>Happy birthday 🎉🎉🎉</Tab>
            <Tab>Memories 🥰🥰🥰</Tab>
          </TabList>
          <TabPanels minH="calc(100vh - 52px)">
            <TabPanel>
              <HappyBirthday  active={activeIndex===0}/>
            </TabPanel>
            <TabPanel>
              <Memories active={activeIndex===1}/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </main>
  );
}
