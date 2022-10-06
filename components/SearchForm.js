import { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  HStack,
  Center,
  Button,
} from "@chakra-ui/react";

export default function SearchForm({ setNftsData }) {
  const [walletAddress, setWalletAddress] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");
  const [fetchForCollections, setFetchForCollections] = useState(false);

  return (
    <form>
      <VStack spacing="4" w="lg">
        <FormControl>
          <FormLabel>Wallet address</FormLabel>
          <Input
            type="text"
            borderColor="gray.300"
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Collection address</FormLabel>
          <Input
            type="text"
            borderColor="gray.300"
            onChange={(e) => setCollectionAddress(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Center>
            <HStack>
              <Checkbox
                borderColor="gray.300"
                onChange={(e) => setFetchForCollections(e.target.checked)}
              />
              <FormLabel>Fetch NFTs for collection owned by wallet address</FormLabel>
            </HStack>
          </Center>
        </FormControl>
        <Button
          w="full"
          bg="brand"
          textColor="white"
          _hover={{ bg: "white", textColor: "brand", border: "1px", borderColor: "brand" }}
        >
          Fetch NFTs
        </Button>
      </VStack>
    </form>
  );
}
