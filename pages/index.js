import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { Container, Flex, Heading, Grid, Center, Spinner } from "@chakra-ui/react";
import SearchForm, { TAB_TYPE } from "/components/SearchForm";
import NftCard from "../components/NftCard";

export default function Home() {
  const [nftsData, setNftsData] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [collectionAddressForWallet, setCollectionAddressForWallet] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");
  const [shouldFetchForCollections, setShouldFetchForCollections] = useState(false);

  function shouldDisableButton(tabType) {
    if (tabType === TAB_TYPE.OWNER) {
      return (
        (!shouldFetchForCollections && !walletAddress) ||
        (shouldFetchForCollections && (!walletAddress || !collectionAddressForWallet))
      );
    } else {
      return !collectionAddress;
    }
  }

  async function getchNftsForOwner() {
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTs?owner=${walletAddress}`;
    const queryParam =
      shouldFetchForCollections && collectionAddressForWallet
        ? `&contractAddresses[]=${collectionAddressForWallet}`
        : "";
    const url = baseURL + queryParam;

    const data = await fetch(url).then((res) => res.json());
    setNftsData(data?.ownedNfts || []);
  }

  async function getchNftsOfCollection() {
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTsForCollection?contractAddress=${collectionAddress}&withMetadata=true`;

    const data = await fetch(baseURL).then((res) => res.json());
    setNftsData(data?.nfts || []);
  }

  const { refetch: fetchNftsForOwner, isFetching: isFetchingNfts } = useQuery(
    ["Owners NFTs", walletAddress, collectionAddressForWallet],
    getchNftsForOwner,
    {
      enabled: false,
    }
  );
  const { refetch: fetchNftsOfCollection, isFetching: isFetchingCollection } = useQuery(
    ["Collection NFTs", collectionAddress],
    getchNftsOfCollection,
    {
      enabled: false,
    }
  );

  const isLoading = isFetchingNfts || isFetchingCollection;

  return (
    <Container py="8" px="6" bg="white" minH="100vh" maxW="container.xl">
      <Head>
        <title>Road to Web3 - NFT Gallery</title>
        <meta name="description" content="NFT gallery to search and display NFTs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex direction="column" align="center">
        <Heading as="h1" fontSize="4xl" fontWeight="bold" mb="6" color="brand">
          NFT Gallery
        </Heading>
        <SearchForm
          setWalletAddress={setWalletAddress}
          setCollectionAddressForWallet={setCollectionAddressForWallet}
          setCollectionAddress={setCollectionAddress}
          shouldFetchForCollections={shouldFetchForCollections}
          setShouldFetchForCollections={setShouldFetchForCollections}
          fetchNftsForOwner={fetchNftsForOwner}
          fetchNftsOfCollection={fetchNftsOfCollection}
          shouldDisableButton={shouldDisableButton}
        />
        {isLoading ? (
          <Center>
            <Spinner size="xl" />
          </Center>
        ) : (
          <Grid
            templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
            gap="10"
            mt="10"
          >
            {nftsData.map((data) => (
              <NftCard nft={data} key={data?.tokenUri?.gateway} />
            ))}
          </Grid>
        )}
      </Flex>
    </Container>
  );
}
