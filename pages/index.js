import { useState } from "react";
import Head from "next/head";
import { Container, Box, Text, VStack } from "@chakra-ui/react";
import SearchForm from "/components/SearchForm";

export default function Home() {
  const [nftsData, setNftsData] = useState([]);

  return (
    <Container py="8" px="6" bg="white" minH="100vh" maxW="container.lg">
      <Head>
        <title>Road to Web3 - NFT Gallery</title>
        <meta name="description" content="NFT gallery to search and display NFTs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box as="main">
        <VStack spacing="3">
          <Text fontSize="4xl" fontWeight="bold" color="brand">
            NFT Gallery
          </Text>
          <SearchForm setNftsData={setNftsData} />
        </VStack>
      </Box>
    </Container>
  );
}
