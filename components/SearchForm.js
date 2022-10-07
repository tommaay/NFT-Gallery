import { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  HStack,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
} from "@chakra-ui/react";

export const TAB_TYPE = {
  OWNER: "OWNER",
  COLLECTION: "COLLECTION",
};

export default function SearchForm({
  setWalletAddress,
  setCollectionAddressForWallet,
  setCollectionAddress,
  shouldFetchForCollections,
  setShouldFetchForCollections,
  fetchNftsForOwner,
  fetchNftsOfCollection,
  shouldDisableButton,
}) {
  return (
    <Tabs>
      <TabList>
        <Tab>Search by owner</Tab>
        <Tab>Search by collection</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <VStack py="1" spacing="4" w={{ base: "10rem", lg: "lg" }}>
            <FormControl>
              <FormLabel>Owner address</FormLabel>
              <Input
                type="text"
                borderColor="gray.300"
                onChange={(e) => setWalletAddress(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <HStack>
                <Checkbox
                  borderColor="gray.300"
                  onChange={(e) => setShouldFetchForCollections(e.target.checked)}
                />
                <FormLabel>Fetch NFTs owned of a collection</FormLabel>
              </HStack>
            </FormControl>
            {shouldFetchForCollections && (
              <FormControl>
                <FormLabel>Collection address</FormLabel>
                <Input
                  type="text"
                  borderColor="gray.300"
                  onChange={(e) => setCollectionAddressForWallet(e.target.value)}
                />
              </FormControl>
            )}
            <Button
              onClick={fetchNftsForOwner}
              disabled={shouldDisableButton(TAB_TYPE.OWNER)}
              w="full"
              bg="brand"
              textColor="white"
              _hover={{ bg: "white", textColor: "brand", border: "1px", borderColor: "brand" }}
            >
              Fetch NFTs
            </Button>
          </VStack>
        </TabPanel>
        <TabPanel>
          <VStack py="1" spacing="4" w={{ base: "sm", lg: "lg" }}>
            <FormControl>
              <FormLabel>Collection address</FormLabel>
              <Input
                type="text"
                borderColor="gray.300"
                onChange={(e) => setCollectionAddress(e.target.value)}
              />
            </FormControl>
            <Button
              onClick={fetchNftsOfCollection}
              disabled={shouldDisableButton(TAB_TYPE.COLLECTION)}
              w="full"
              bg="brand"
              textColor="white"
              _hover={{ bg: "white", textColor: "brand", border: "1px", borderColor: "brand" }}
            >
              Fetch NFTs
            </Button>
          </VStack>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
